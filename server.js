'use strict';

const express = require('express');
const path    = require('path');
const session = require('./session');

function startServer() {
  const app  = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());
  app.use(express.static(path.join(__dirname, '../public')));

  // ── POST /api/pair — request a pairing code ───────────────────────────────
  app.post('/api/pair', async (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.json({ success: false, error: 'Phone number is required.' });

    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 10) return res.json({ success: false, error: 'Invalid phone number.' });

    const sock = session.socket;
    if (!sock) return res.json({ success: false, error: 'Bot is starting up, please wait 10 seconds and try again.' });
    if (session.paired) return res.json({ success: false, error: 'Bot is already paired. Logout first.' });

    try {
      const code = await sock.requestPairingCode(cleaned);
      session.pairingCode  = code;
      session.phoneNumber  = cleaned;
      return res.json({ success: true, code });
    } catch (err) {
      console.error('Pairing error:', err.message);
      return res.json({ success: false, error: err.message || 'Failed to generate pairing code.' });
    }
  });

  // ── GET /api/status — check bot status ───────────────────────────────────
  app.get('/api/status', (req, res) => {
    res.json({
      paired:      session.paired,
      code:        session.pairingCode,
      phone:       session.phoneNumber,
      botReady:    !!session.socket,
    });
  });

  // ── POST /api/logout ───────────────────────────────────────────────────────
  app.post('/api/logout', async (req, res) => {
    try {
      if (session.socket) await session.socket.logout();
      res.json({ success: true });
    } catch (err) {
      res.json({ success: false, error: err.message });
    }
  });

  // ── catch-all → index.html ────────────────────────────────────────────────
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  app.listen(PORT, () => {
    console.log(`🌐 KingFarhan MD Pairing Site → http://localhost:${PORT}`);
  });
}

module.exports = { startServer };
