// MUHAMMAD MD - WhatsApp Bot using Baileys // Author: Muhammad-ZaHid-MD26

const { default: makeWASocket, useSingleFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require("@whiskeysockets/baileys") const { Boom } = require("@hapi/boom") const fs = require("fs") const P = require("pino")

// Auth const { state, saveState } = useSingleFileAuthState('./auth_info.json')

// Start Function async function startBot() { const { version } = await fetchLatestBaileysVersion() const sock = makeWASocket({ version, printQRInTerminal: true, auth: state, logger: P({ level: 'silent' }) })

sock.ev.on('creds.update', saveState)

// Connection Closed sock.ev.on('connection.update', ({ connection, lastDisconnect }) => { if (connection === 'close') { const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut if (shouldReconnect) { startBot() } } else if (connection === 'open') { console.log('Muhammad MD Bot is now online!') } })

// Message Receive sock.ev.on('messages.upsert', async ({ messages }) => { const msg = messages[0] if (!msg.message || msg.key.fromMe) return

const from = msg.key.remoteJid
const message = msg.message.conversation || msg.message.extendedTextMessage?.text

if (!message) return

const command = message.toLowerCase()

if (command === '.alive') {
  await sock.sendMessage(from, { text: 'MUHAMMAD MD Bot is alive — full fire mode ON!' })
} else if (command === '.menu') {
  await sock.sendMessage(from, { text: '*Available Commands:*

.alive .menu .owner .about .logo' }) } else if (command === '.owner') { await sock.sendMessage(from, { text: 'Developer: Muhammad-ZaHid-MD26' }) } else if (command === '.about') { await sock.sendMessage(from, { text: 'Bot Name: MUHAMMAD MD\nStyle: Attitude\nBuilt with love by MD' }) } else if (command === '.logo') { const logoPath = './logo.jpg' if (fs.existsSync(logoPath)) { await sock.sendMessage(from, { image: fs.readFileSync(logoPath), caption: 'MUHAMMAD MD Logo' }) } else { await sock.sendMessage(from, { text: 'Logo not found.' }) } } }) }

startBot()

