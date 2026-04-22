'use strict';

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs   = require('fs');
const { handleCommand } = require('./commands');
const session = require('./session');

const AUTH_DIR = path.join(__dirname, '../auth_info');
const logger   = pino({ level: 'silent' });

async function startBot() {
  if (!fs.existsSync(AUTH_DIR)) fs.mkdirSync(AUTH_DIR, { recursive: true });

  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const { version }          = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: false,
    auth: {
      creds: state.creds,
      keys:  makeCacheableSignalKeyStore(state.keys, logger),
    },
    browser:             ['KingFarhan MD', 'Chrome', '120.0.0'],
    syncFullHistory:     false,
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
  });

  session.socket = sock;

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, pairingCode } = update;

    if (pairingCode) {
      session.pairingCode = pairingCode;
      console.log(`\n📱 Pairing Code: ${pairingCode}\n`);
    }

    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = code !== DisconnectReason.loggedOut;
      console.log('Connection closed, reconnecting:', shouldReconnect);
      if (shouldReconnect) {
        setTimeout(startBot, 4000);
      } else {
        fs.rmSync(AUTH_DIR, { recursive: true, force: true });
        session.paired      = false;
        session.pairingCode = null;
        console.log('Logged out — auth cleared.');
        setTimeout(startBot, 4000);
      }
    } else if (connection === 'open') {
      session.paired      = true;
      session.pairingCode = null;
      console.log(`\n✅ KingFarhan MD connected as: ${sock.user?.name} (${sock.user?.id})\n`);
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const msg of messages) {
      if (!msg.message || msg.key.fromMe) continue;
      const body =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        msg.message?.imageMessage?.caption ||
        msg.message?.videoMessage?.caption || '';

      const PREFIX = process.env.PREFIX || '.';
      if (!body.startsWith(PREFIX)) continue;

      const args    = body.slice(PREFIX.length).trim().split(/\s+/);
      const command = args.shift().toLowerCase();
      const from    = msg.key.remoteJid;
      const isGroup = from.endsWith('@g.us');

      console.log(`[CMD] ${from} » ${PREFIX}${command} ${args.join(' ')}`);

      try {
        await handleCommand(sock, msg, command, args, { from, isGroup, body });
      } catch (err) {
        console.error('Command error:', err.message);
        await sock.sendMessage(from, { text: `❌ Error: ${err.message}` });
      }
    }
  });
}

module.exports = { startBot };
