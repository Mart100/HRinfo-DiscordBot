const Discord = require('discord.js')
const bot = new Discord.Client()
const env = require('node-env-file')(__dirname + '/.env', {raise: false})
const token = process.env.token

// require scripts
const commands = require('./scripts/commands.js')
const database = require('./scripts/database.js')
const onJoin = require('./scripts/onJoin.js')

database.initialize()

bot.on('ready', async guild => {
  console.log(bot.user.username + ' is ready!')
  try {
    let link = await bot.generateInvite([67585])
    console.log(link)
  } catch (e) {
    console.log(e.stack)
  }
  bot.user.setActivity('for HR clans', {type: 'WATCHING'})
})

// on new user joined
bot.on('guildMemberAdd', async (member) => { database.updateClan(member.guild.id, {memberCount: member.guild.memberCount }) })

// joined new guild
bot.on('guildCreate', async (guild) => { onJoin(guild) })

// if message
bot.on('message', async (message) => { commands(message) })

bot.login(process.env.BOT_TOKEN)