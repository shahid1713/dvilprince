require("./database/module")

//GLOBAL PAYMENT
global.storename = "ByyX STR"
global.dana = "082127568219"
global.qris = "-"


// GLOBAL SETTING
global.owner = "923375987957"
global.namabot = "ByxxBotz"
global.nomorbot = "923375987957"
global.namaCreator = "byyxZ"
global.linkyt = "https://youtube.com/@abyyyferrr"
global.autoJoin = false
global.antilink = false
global.versisc = '4.7.0'

// DELAY JPM
global.delayjpm = 5500



//GLOBAL THUMB

global.codeInvite = ""
global.imageurl = 'https://g.top4top.io/p_3194iz70l0.jpg'
global.isLink = 'https://whatsapp.com/channel/0029Val78a7EawdvrnMrxC2B'
global.packname = "byx toxx"
global.author = "AbyyX"
global.jumlah = "5"


let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})
