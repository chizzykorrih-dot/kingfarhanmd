'use strict';

const axios  = require('axios');
const PREFIX = process.env.PREFIX || '.';

const reply = (sock, msg, text) =>
  sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });

const react = (sock, msg, emoji) =>
  sock.sendMessage(msg.key.remoteJid, { react: { text: emoji, key: msg.key } });

const isOwner = (msg) => {
  const owner  = (process.env.OWNER_NUMBER || '').replace(/\D/g, '');
  const sender = (msg.key.participant || msg.key.remoteJid).replace(/\D/g, '');
  return sender === owner;
};

// ─────────────────────────────────────────────────────────────────────────────
const commands = {

  // ── INFO ────────────────────────────────────────────────────────────────────
  menu: async (sock, msg) => {
    await react(sock, msg, '👑');
    await reply(sock, msg, `
╔══════════════════════════╗
║   *KingFarhan MD* 👑     ║
╚══════════════════════════╝
*PREFIX:* ${PREFIX}

╭─── 📋 INFO ───────────────
│ ${PREFIX}menu        - This menu
│ ${PREFIX}ping        - Bot speed
│ ${PREFIX}uptime      - Uptime
│ ${PREFIX}info        - Bot info
│ ${PREFIX}owner       - Owner info
╰───────────────────────────

╭─── 🛠️ TOOLS ──────────────
│ ${PREFIX}calc        - Calculator
│ ${PREFIX}weather     - Get weather
│ ${PREFIX}translate   - Translate text
│ ${PREFIX}shorten     - Shorten URL
│ ${PREFIX}time        - Current time
╰───────────────────────────

╭─── 🎨 FUN ────────────────
│ ${PREFIX}joke        - Random joke
│ ${PREFIX}quote       - Random quote
│ ${PREFIX}fact        - Random fact
│ ${PREFIX}flip        - Coin flip
│ ${PREFIX}dice        - Roll dice
│ ${PREFIX}8ball       - Magic 8-ball
│ ${PREFIX}roast       - Roast someone
│ ${PREFIX}compliment  - Compliment
│ ${PREFIX}dare        - Truth or dare
│ ${PREFIX}pickup      - Pickup line
│ ${PREFIX}riddle      - Random riddle
╰───────────────────────────

╭─── 🤖 AI ─────────────────
│ ${PREFIX}ai          - Ask AI anything
│ ${PREFIX}gpt         - GPT chat
╰───────────────────────────

╭─── 👥 GROUP (admin) ──────
│ ${PREFIX}kick        - Kick member
│ ${PREFIX}add         - Add member
│ ${PREFIX}promote     - Make admin
│ ${PREFIX}demote      - Remove admin
│ ${PREFIX}mute        - Mute group
│ ${PREFIX}unmute      - Unmute group
│ ${PREFIX}groupinfo   - Group info
│ ${PREFIX}tagall      - Tag everyone
│ ${PREFIX}hidetag     - Silent tag all
│ ${PREFIX}setname     - Set group name
│ ${PREFIX}setdesc     - Set description
│ ${PREFIX}link        - Invite link
│ ${PREFIX}resetlink   - Reset link
╰───────────────────────────

╭─── 🔒 OWNER ──────────────
│ ${PREFIX}broadcast   - Broadcast msg
│ ${PREFIX}block       - Block user
│ ${PREFIX}unblock     - Unblock user
│ ${PREFIX}restart     - Restart bot
│ ${PREFIX}shutdown    - Shutdown bot
╰───────────────────────────

_KingFarhan MD © 2025 | Made by KingFarhan_`);
  },

  ping: async (sock, msg) => {
    const start = Date.now();
    await react(sock, msg, '🏓');
    await reply(sock, msg, `🏓 *Pong!*\n⚡ Speed: *${Date.now() - start}ms*`);
  },

  uptime: async (sock, msg) => {
    const s   = Math.floor(process.uptime());
    const h   = Math.floor(s / 3600);
    const m   = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    await reply(sock, msg, `⏱️ *KingFarhan MD Uptime*\n\n${h}h ${m}m ${sec}s`);
  },

  info: async (sock, msg) => {
    await reply(sock, msg, `
╔══════════════════════════╗
║   *KingFarhan MD* 👑     ║
╚══════════════════════════╝
📌 *Name:* KingFarhan MD
🤖 *Platform:* WhatsApp MD
📦 *Version:* 1.0.0
⚙️ *Prefix:* ${PREFIX}
🌐 *Library:* Baileys (Multi-Device)
👑 *Owner:* KingFarhan
📅 *Year:* 2025
\n_Type ${PREFIX}menu for all commands_`);
  },

  owner: async (sock, msg) => {
    await reply(sock, msg, `👑 *KingFarhan MD*\n\nContact the owner for support or custom setup.\n\nType ${PREFIX}menu to see all commands.`);
  },

  // ── TOOLS ───────────────────────────────────────────────────────────────────
  calc: async (sock, msg, args) => {
    if (!args.length) return reply(sock, msg, `Usage: ${PREFIX}calc 2+2`);
    try {
      const expr   = args.join(' ').replace(/[^0-9+\-*/().% ]/g, '');
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict";return(${expr})`)();
      await reply(sock, msg, `🧮 *Calculator*\n\n📥 \`${expr}\`\n📤 *${result}*`);
    } catch {
      await reply(sock, msg, '❌ Invalid expression.');
    }
  },

  weather: async (sock, msg, args) => {
    if (!args.length) return reply(sock, msg, `Usage: ${PREFIX}weather Nairobi`);
    try {
      const res = await axios.get(`https://wttr.in/${encodeURIComponent(args.join(' '))}?format=3`);
      await reply(sock, msg, `🌤️ *Weather*\n\n${res.data}`);
    } catch {
      await reply(sock, msg, '❌ Could not fetch weather.');
    }
  },

  translate: async (sock, msg, args) => {
    if (args.length < 2) return reply(sock, msg, `Usage: ${PREFIX}translate es Hello`);
    const lang = args[0];
    const text = args.slice(1).join(' ');
    try {
      const res = await axios.get(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`
      );
      const out = res.data[0].map((x) => x[0]).join('');
      await reply(sock, msg, `🌐 *Translation*\n\n📥 ${text}\n📤 (${lang}) ${out}`);
    } catch {
      await reply(sock, msg, '❌ Translation failed.');
    }
  },

  shorten: async (sock, msg, args) => {
    if (!args[0]) return reply(sock, msg, `Usage: ${PREFIX}shorten <url>`);
    try {
      const res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(args[0])}`);
      await reply(sock, msg, `🔗 *Shortened URL*\n\n${res.data}`);
    } catch {
      await reply(sock, msg, '❌ Could not shorten URL.');
    }
  },

  time: async (sock, msg) => {
    const now = new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' });
    await reply(sock, msg, `🕐 *Current Time (Nairobi)*\n\n${now}`);
  },

  // ── FUN ─────────────────────────────────────────────────────────────────────
  joke: async (sock, msg) => {
    const jokes = [
      "Why don't scientists trust atoms?\nBecause they make up everything! 😂",
      "Why did the scarecrow win an award?\nHe was outstanding in his field! 🌾",
      "I told my wife she was drawing her eyebrows too high.\nShe looked surprised. 😄",
      "Why can't you give Elsa a balloon?\nBecause she'll let it go! ❄️",
      "What do you call fake spaghetti?\nAn impasta! 🍝",
      "How do you organize a space party?\nYou planet! 🪐",
      "Why did the bicycle fall over?\nIt was two-tired! 🚲",
      "What's a computer's favorite snack?\nMicrochips! 💻",
      "Why do cows wear bells?\nBecause their horns don't work! 🐄",
      "What did the ocean say to the beach?\nNothing, it just waved! 🌊",
    ];
    await react(sock, msg, '😂');
    await reply(sock, msg, `😂 *Joke Time!*\n\n${jokes[Math.floor(Math.random() * jokes.length)]}`);
  },

  quote: async (sock, msg) => {
    try {
      const res = await axios.get('https://api.quotable.io/random');
      await reply(sock, msg, `💬 *Quote*\n\n_"${res.data.content}"_\n\n— *${res.data.author}*`);
    } catch {
      const fallback = [
        { q: 'The only way to do great work is to love what you do.', a: 'Steve Jobs' },
        { q: 'In the middle of difficulty lies opportunity.', a: 'Albert Einstein' },
        { q: 'It does not matter how slowly you go as long as you do not stop.', a: 'Confucius' },
        { q: 'Success is not final, failure is not fatal.', a: 'Winston Churchill' },
      ];
      const r = fallback[Math.floor(Math.random() * fallback.length)];
      await reply(sock, msg, `💬 *Quote*\n\n_"${r.q}"_\n\n— *${r.a}*`);
    }
  },

  fact: async (sock, msg) => {
    try {
      const res = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
      await reply(sock, msg, `🧠 *Random Fact*\n\n${res.data.text}`);
    } catch {
      const facts = [
        "Honey never spoils. Archaeologists found 3000-year-old honey in Egyptian tombs that was still edible!",
        "A day on Venus is longer than a year on Venus.",
        "Octopuses have three hearts and blue blood.",
        "Bananas are berries, but strawberries are not.",
        "The shortest war in history lasted 38–45 minutes.",
      ];
      await reply(sock, msg, `🧠 *Fact*\n\n${facts[Math.floor(Math.random() * facts.length)]}`);
    }
  },

  flip: async (sock, msg) => {
    await react(sock, msg, '🪙');
    await reply(sock, msg, Math.random() < 0.5 ? '🪙 *Heads!*' : '🪙 *Tails!*');
  },

  dice: async (sock, msg, args) => {
    const sides = parseInt(args[0]) || 6;
    await react(sock, msg, '🎲');
    await reply(sock, msg, `🎲 *Dice Roll (d${sides})*\n\nYou rolled: *${Math.floor(Math.random() * sides) + 1}*`);
  },

  '8ball': async (sock, msg, args) => {
    if (!args.length) return reply(sock, msg, `Usage: ${PREFIX}8ball <question>`);
    const answers = [
      '✅ It is certain.','✅ Without a doubt.','✅ Yes, definitely!',
      '✅ Outlook good.','🔮 Signs point to yes.','❓ Reply hazy, try again.',
      '❓ Ask again later.','❓ Cannot predict now.','❌ Don\'t count on it.',
      '❌ My reply is no.','❌ Very doubtful.','❌ Outlook not so good.',
    ];
    await react(sock, msg, '🎱');
    await reply(sock, msg, `🎱 *Magic 8-Ball*\n\n❓ ${args.join(' ')}\n\n${answers[Math.floor(Math.random() * answers.length)]}`);
  },

  roast: async (sock, msg, args) => {
    const roasts = [
      "You're the reason the gene pool needs a lifeguard. 🏊",
      "I'd agree with you but then we'd both be wrong. 😤",
      "You have your whole life to be an idiot. Why not take today off? 😂",
      "I'm not insulting you, I'm describing you. 💅",
      "Some day you'll go far... and I hope you stay there. ✈️",
      "You're like a cloud — when you disappear, it's a beautiful day. ☀️",
    ];
    await reply(sock, msg, `🔥 *Roasting ${args.join(' ') || 'you'}*\n\n${roasts[Math.floor(Math.random() * roasts.length)]}`);
  },

  compliment: async (sock, msg, args) => {
    const list = [
      "You light up every room you walk into! ✨",
      "You have an incredible heart. Keep being you! 💖",
      "Your smile is genuinely contagious. 😊",
      "You're smarter than you give yourself credit for. 🧠",
      "The world is a better place with you in it! 🌍",
      "You make everything look effortless. 👑",
    ];
    await reply(sock, msg, `💌 *Compliment for ${args.join(' ') || 'you'}*\n\n${list[Math.floor(Math.random() * list.length)]}`);
  },

  dare: async (sock, msg, args) => {
    const type = (args[0] || '').toLowerCase();
    const truths = [
      "What's the most embarrassing thing you've ever done?",
      "Who was your first crush?",
      "What's your biggest fear?",
      "Have you ever lied to your best friend?",
      "What's the worst thing you've done and never told anyone?",
    ];
    const dares = [
      "Send a voice note singing your favourite song! 🎤",
      "Change your profile photo for 1 hour. 📸",
      "Text someone you haven't spoken to in months. 📲",
      "Do 20 push-ups right now. 💪",
      "Send a voice note imitating your favourite celebrity.",
    ];
    if (type === 'truth') return reply(sock, msg, `🤔 *Truth:*\n\n${truths[Math.floor(Math.random() * truths.length)]}`);
    if (type === 'dare')  return reply(sock, msg, `😈 *Dare:*\n\n${dares[Math.floor(Math.random() * dares.length)]}`);
    const pick = Math.random() < 0.5;
    await reply(sock, msg, `${pick ? '🤔 *Truth:*' : '😈 *Dare:*'}\n\n${pick ? truths[Math.floor(Math.random() * truths.length)] : dares[Math.floor(Math.random() * dares.length)]}`);
  },

  pickup: async (sock, msg) => {
    const lines = [
      "Are you a magician? Because whenever I look at you, everyone else disappears. 🪄",
      "Do you have a map? I keep getting lost in your eyes. 🗺️",
      "Are you a bank loan? Because you have my interest. 💰",
      "Is your name Google? Because you have everything I've been searching for. 🔍",
      "Do you believe in love at first sight, or should I walk by again? 😏",
    ];
    await reply(sock, msg, `😘 *Pickup Line*\n\n${lines[Math.floor(Math.random() * lines.length)]}`);
  },

  riddle: async (sock, msg) => {
    const riddles = [
      { q: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", a: "An echo!" },
      { q: "The more you take, the more you leave behind. What am I?", a: "Footsteps!" },
      { q: "I have cities, but no houses live there. I have mountains, but no trees grow there. I have water, but no fish swim there. What am I?", a: "A map!" },
      { q: "What has hands but can't clap?", a: "A clock!" },
      { q: "What gets wetter the more it dries?", a: "A towel!" },
    ];
    const r = riddles[Math.floor(Math.random() * riddles.length)];
    await reply(sock, msg, `🧩 *Riddle*\n\n${r.q}\n\n_Reply with your answer, then type_ ${PREFIX}riddleans _to reveal!_\n\n||Answer: ${r.a}||`);
  },

  // ── AI ──────────────────────────────────────────────────────────────────────
  ai: async (sock, msg, args) => {
    if (!args.length) return reply(sock, msg, `Usage: ${PREFIX}ai <question>`);
    await react(sock, msg, '🤖');
    try {
      const res = await axios.get(`https://api.dreaded.site/api/chatgpt?text=${encodeURIComponent(args.join(' '))}`);
      const answer = res.data?.result || res.data?.message || 'No response received.';
      await reply(sock, msg, `🤖 *KingFarhan AI*\n\n❓ ${args.join(' ')}\n\n💬 ${answer}`);
    } catch {
      await reply(sock, msg, '❌ AI service unavailable. Try again later.');
    }
  },

  gpt: async (sock, msg, args) => {
    if (!args.length) return reply(sock, msg, `Usage: ${PREFIX}gpt <message>`);
    await react(sock, msg, '💬');
    try {
      const res = await axios.get(`https://api.dreaded.site/api/chatgpt?text=${encodeURIComponent(args.join(' '))}`);
      const answer = res.data?.result || res.data?.message || 'No response.';
      await reply(sock, msg, `💬 *GPT Response*\n\n${answer}`);
    } catch {
      await reply(sock, msg, '❌ GPT unavailable right now.');
    }
  },

  // ── GROUP ───────────────────────────────────────────────────────────────────
  kick: async (sock, msg, args, ctx) => {
    if (!ctx.isGroup) return reply(sock, msg, '❌ Groups only.');
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (!mentioned.length) return reply(sock, msg, `Usage: ${PREFIX}kick @user`);
    for (const jid of mentioned) await sock.groupParticipantsUpdate(ctx.from, [jid], 'remove');
    await reply(sock, msg, `✅ Kicked ${mentioned.length} member(s).`);
  },

  add: async (sock, msg, args, ctx) => {
    if (!ctx.isGroup) return reply(sock, msg, '❌ Groups only.');
    if (!args[0]) return reply(sock, msg, `Usage: ${PREFIX}add 2547XXXXXXXX`);
    const jid = args[0].replace(/\D/g, '') + '@s.whatsapp.net';
    await sock.groupParticipantsUpdate(ctx.from, [jid], 'add');
    await reply(sock, msg, `✅ Added ${args[0]}.`);
  },

  promote: async (sock, msg, args, ctx) => {
    if (!ctx.isGroup) return reply(sock, msg, '❌ Groups only.');
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (!mentioned.length) return reply(sock, msg, `Usage: ${PREFIX}promote @user`);
    for (const jid of mentioned) await sock.groupParticipantsUpdate(ctx.from, [jid], 'promote');
    await reply(sock, msg, `✅ Promoted ${mentioned.length} member(s) to admin.`);
  },

  demote: async (sock, msg, args, ctx) => {
    if (!ctx.isGroup) return reply(sock, msg, '❌ Groups only.');
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (!mentioned.length) return reply(sock, msg, `Usage: ${PREFIX}demote @user`);
    for (const jid of mentioned) await sock.groupParticipantsUpdate(ctx.from, [jid], 'demote');
    await reply(sock, msg, `✅ Demoted ${mentioned.length} member(s).`);
  },

  mute: async (sock, msg, args, ctx) => {
    if (!ctx.isGroup) return reply(sock, msg, '❌ Groups only.');
    await sock.groupSettingUpdate(ctx.from, 'announcement');
    await reply(sock, msg, '🔇 Group muted. Only admins can send messages.');
  },

  unmute: async (sock, msg, args, ctx) => {
    if (!ctx.isGroup) return reply(sock, msg, '❌ Groups only.');
    await sock.groupSettingUpdate(ctx.from, 'not_announcement');
    await reply(sock, msg, '🔊 Group unmuted. Everyone can send messages.');
  },

  groupinfo: async (sock, msg, args, ctx) => {
    if (!ctx.isGroup) return reply(sock, msg, '❌ Groups only.');
    const meta = await sock.groupMetadata(ctx.from);
    await reply(sock, msg, `
📋 *Group Info*
🏷️ *Name:* ${meta.subject}
🆔 *ID:* ${meta.id}
👤 *Owner:* ${meta.owner || 'Unknown'}
📝 *Desc:* ${meta.desc || 'No description'}
👥 *Members:* ${meta.participants.length}
👑 *Admins:* ${meta.participants.filter(p => p.admin).length}
📅 *Created:* ${new Date(meta.creation * 1000).toLocaleDateString()}`);
  },

  tagall: async (sock, msg, args, ctx) => {
    if (!ctx.isGroup) return reply(sock, msg, '❌ Groups only.');
    const meta     = await sock.groupMetadata(ctx.from);
    const mentions = meta.participants.map(p => p.id);
    const text     = (args.join(' ') || '📢 Attention everyone!') + '\n\n' + mentions.map(m => `@${m.split('@')[0]}`).join(' ');
    await sock.sendMessage(ctx.from, { text, mentions });
  },

  hidetag: async (sock, msg, args, ctx) => {
    if (!ctx.isGroup) return reply(sock, msg, '❌ Groups only.');
    const meta     = await sock.groupMetadata(ctx.from);
    const mentions = meta.participants.map(p => p.id);
    await sock.sendMessage(ctx.from, { text: args.join(' ') || '\u200B', mentions });
  },

  link: async (sock, msg, args, ctx) => {
    if (!ctx.isGroup) return reply(sock, msg, '❌ Groups only.');
    const code = await sock.groupInviteCode(ctx.from);
    await reply(sock, msg, `🔗 *Invite Link*\n\nhttps://chat.whatsapp.com/${code}`);
  },

  resetlink: async (sock, msg, args, ctx) => {
    if (!ctx.isGroup) return reply(sock, msg, '❌ Groups only.');
    await sock.groupRevokeInvite(ctx.from);
    const code = await sock.groupInviteCode(ctx.from);
    await reply(sock, msg, `✅ *New Invite Link*\n\nhttps://chat.whatsapp.com/${code}`);
  },

  setname: async (sock, msg, args, ctx) => {
    if (!ctx.isGroup) return reply(sock, msg, '❌ Groups only.');
    if (!args.length) return reply(sock, msg, `Usage: ${PREFIX}setname <name>`);
    await sock.groupUpdateSubject(ctx.from, args.join(' '));
    await reply(sock, msg, '✅ Group name updated.');
  },

  setdesc: async (sock, msg, args, ctx) => {
    if (!ctx.isGroup) return reply(sock, msg, '❌ Groups only.');
    if (!args.length) return reply(sock, msg, `Usage: ${PREFIX}setdesc <description>`);
    await sock.groupUpdateDescription(ctx.from, args.join(' '));
    await reply(sock, msg, '✅ Group description updated.');
  },

  // ── OWNER ───────────────────────────────────────────────────────────────────
  broadcast: async (sock, msg, args) => {
    if (!isOwner(msg)) return reply(sock, msg, '❌ Owner only.');
    if (!args.length)  return reply(sock, msg, `Usage: ${PREFIX}broadcast <message>`);
    const chats = await sock.groupFetchAllParticipating();
    let sent = 0;
    for (const id of Object.keys(chats)) {
      try { await sock.sendMessage(id, { text: `📢 *Broadcast — KingFarhan MD*\n\n${args.join(' ')}` }); sent++; } catch {}
    }
    await reply(sock, msg, `✅ Broadcast sent to ${sent} group(s).`);
  },

  block: async (sock, msg, args) => {
    if (!isOwner(msg)) return reply(sock, msg, '❌ Owner only.');
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const jid = mentioned[0] || (args[0] ? args[0].replace(/\D/g, '') + '@s.whatsapp.net' : null);
    if (!jid) return reply(sock, msg, `Usage: ${PREFIX}block @user`);
    await sock.updateBlockStatus(jid, 'block');
    await reply(sock, msg, '✅ User blocked.');
  },

  unblock: async (sock, msg, args) => {
    if (!isOwner(msg)) return reply(sock, msg, '❌ Owner only.');
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const jid = mentioned[0] || (args[0] ? args[0].replace(/\D/g, '') + '@s.whatsapp.net' : null);
    if (!jid) return reply(sock, msg, `Usage: ${PREFIX}unblock @user`);
    await sock.updateBlockStatus(jid, 'unblock');
    await reply(sock, msg, '✅ User unblocked.');
  },

  restart: async (sock, msg) => {
    if (!isOwner(msg)) return reply(sock, msg, '❌ Owner only.');
    await reply(sock, msg, '♻️ Restarting KingFarhan MD...');
    setTimeout(() => process.exit(0), 1000);
  },

  shutdown: async (sock, msg) => {
    if (!isOwner(msg)) return reply(sock, msg, '❌ Owner only.');
    await reply(sock, msg, '🛑 Shutting down KingFarhan MD. Goodbye! 👑');
    setTimeout(() => process.exit(1), 1000);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
async function handleCommand(sock, msg, command, args, ctx) {
  const cmd = commands[command];
  if (!cmd) {
    await reply(sock, msg, `❌ Unknown command: *${command}*\nType ${PREFIX}menu for all commands.`);
    return;
  }
  await cmd(sock, msg, args, ctx);
}

module.exports = { handleCommand };
