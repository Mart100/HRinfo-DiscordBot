const Discord = require('discord.js')
const database = require('../scripts/database.js')

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

  // get player rank
  let rank = 0
  let Splayers = Object.values(players).sort((a, b) => b.points-a.points)
  for(let i in Splayers) if(player.id == Splayers[i].id) rank = i

  // get player as user from cache
  let playerUser = message.client.users.find((u) => u.id == player.id)

  let info = `
**USER:** ${playerUser.username}
**DIVISION:** ${player.division}
**POINTS:** ${player.points}
**CLAN:** ${clans[player.clan].name}
**RANK:** #${Number(rank)+1}
  `
  let Embed = new Discord.RichEmbed()
    .setAuthor('HRinfo', 'https://i.imgur.com/yUVsTLb.png')
    .addField('Profile:', info)
    .setThumbnail(playerUser.avatarURL)
    .setColor('#42BEAD')
  message.channel.send(Embed)
}