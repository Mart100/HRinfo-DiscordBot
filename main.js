const Discord = require('discord.js')
const bot = new Discord.Client()
const env = require('node-env-file')(__dirname + '/.env', {raise: false})
process.env.botperms = Number(process.env.botperms)
// require scripts
const commands = require('./scripts/commands.js')
const HRIapi = require('./scripts/HRIapi.js')
const onJoin = require('./scripts/onJoin.js')
const onmemberjoin = require('./scripts/onmemberjoin.js')

bot.on('ready', async guild => {
  console.log(bot.user.username + ' is ready!')
  try {
    let link = await bot.generateInvite([Number(process.env.botperms)])
    console.log(link)
  } catch (e) {
    console.log(e.stack)
  }
  bot.user.setActivity('for HR clans', {type: 'WATCHING'})
})

// on new user joined
bot.on('guildMemberAdd', async (member) => { onmemberjoin(member) })

// joined new guild
bot.on('guildCreate', async (guild) => { onJoin(guild) })

// if message
bot.on('message', async (message) => { commands(message) })

bot.login(process.env.BOT_TOKEN)