const Discord = require('discord.js')
const database = require('../scripts/database.js')
const utils = require('../scripts/utils.js')

module.exports = async (message) => {
  let p = process.env.prefix
  let clan
  let players = await database.getPlayers()
  let clans = await database.getClans()
  let args = message.content.toLowerCase().split(' ')

  let totalHRpoints = 0
  for(let id in players) totalHRpoints += players[id].points


  let stats = `
**USERS:** ${Object.keys(players).length}
**CLANS:** ${Object.keys(clans).length}
**TOTAL HC POINTS:** ${totalHRpoints}
  `

  let Embed = new Discord.RichEmbed()
    .setAuthor('HRinfo', 'https://i.imgur.com/yUVsTLb.png')
    .addField('Stats:', stats)
    .setColor('#42BEAD')
  message.channel.send(Embed)

  message.channel.send(`Successfully joined ${clan.name}`)
}