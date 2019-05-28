const Discord = require('discord.js')
const database = require('../scripts/database.js')
const HRapi = require('../scripts/HRapi.js')

module.exports = async (message) => {
  let p = process.env.prefix
  let player
  let players = await database.getPlayers()
  let clans = await database.getClans()
  let args = message.content.toLowerCase().split(' ')


  // get another players profile
  if(args[1] != undefined) {
    let playerInput = args[1].replace('<@', '').replace('>', '')
    player = players[playerInput]
  } 
  // own profile
  else {
    if(await database.isPlayer(message.author.id)) player = await database.getPlayer(message.author.id)
    else return message.channel.send(`You're not registered yet! Register with \`${p}register\``)
  }

  if(player == undefined) return message.channel.send('Player not found')

  // get player stats
  if(player.gameID == undefined) return message.channel.send(`**${player.username}** Has not connected his game. Connect with \`${p}connectgame\``)
  let playerStats = await HRapi.getUserStats(player.gameID)

  // get player as user from cache
  let playerUser = message.client.users.find((u) => u.id == player.id)

  let playerClan = clans[player.clan]
  let clanname = 'none'
  if(playerClan != undefined) clanname = playerClan.name

  let statstext = `
**Kills:** ${playerStats.kills}
**Deaths:** ${playerStats.deaths}
**Max Kill:** ${playerStats.maxKill}
**Games Played:** ${playerStats.totalGamesPlayed}
  `
  let Embed = new Discord.RichEmbed()
    .setAuthor(player.username, 'https://i.imgur.com/yUVsTLb.png')
    .addField('Stats:', statstext)
    .setColor('#42BEAD')

  if(playerUser != undefined) Embed.setThumbnail(playerUser.avatarURL)
  message.channel.send(Embed)
}