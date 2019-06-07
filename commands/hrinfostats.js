const Discord = require('discord.js')
const HRIapi = require('../scripts/HRIapi.js')
const utils = require('../scripts/utils.js')

module.exports = async (message) => {
  let p = process.env.prefix
  let clan
  let players = await HRIapi.getPlayers()
  let clans = await HRIapi.getClans()
  let playingCount = await HRIapi.getPlayingCount()
  let getHRaccounts = await HRIapi.getHRaccounts()
  let tournaments = await HRIapi.getTournaments()

  let args = message.content.toLowerCase().split(' ')

  let totalHRpoints = 0
  let totalGameConnectedAccounts = 0
  for(let id in players) {
    let player = players[id]
    totalHRpoints += player.points
    if(player.gameID && player.gameID != 'none') totalGameConnectedAccounts++
  }


  let stats = `
**Users:** ${Object.keys(players).length}
**Users with game connected:** ${totalGameConnectedAccounts}
**Anonymous HR accounts Stored: **${Object.keys(getHRaccounts).length}
**Clans:** ${Object.keys(clans).length}
**Tournaments:** ${Object.keys(tournaments).length}
**PlayingCount recorded:** ${Object.keys(playingCount).length}
**Total HC Points:** ${totalHRpoints}
  `

  let Embed = new Discord.RichEmbed()
    .setAuthor('HRinfo', 'https://i.imgur.com/yUVsTLb.png')
    .addField('Stats:', stats)
    .setColor('#42BEAD')
  message.channel.send(Embed)
}