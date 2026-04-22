require('dotenv').config();
const { startBot } = require('./src/bot');
const { startServer } = require('./src/server');

console.log(`
╔══════════════════════════════════════╗
║        👑  KingFarhan MD  👑         ║
║   WhatsApp Multi-Device Bot v1.0.0   ║
╚══════════════════════════════════════╝
`);

startServer();
startBot();
