const Discord = require('discord.js')
const database = require('../scripts/database.js')

module.exports = async (message) => {
  let p = process.env.prefix
  let player
  let players = await database.getPlayers()
  let args = message.content.toLowerCase().split(' ')


  // get another players profile
  if(args[1] != undefined) {
    let playerInput = args[1].replace('<@', '').replace('>', '')
    player = players[playerInput]
    console.log(players)
    console.log(playerInput)
  } 
  // own profile
  else {
    if(await database.isPlayer(message.author.id)) player = await database.getPlayer(message.author.id)
    else return message.channel.send(`You're not registered yet! Register with \`${p}register\``)
  }

  if(player == undefined) return message.channel.send('Player not found')

  // get player as user from cache
  let playerUser = message.client.users.find((u) => u.id == player.id)

  let info = `
  **USER:** ${playerUser.username}
  **POINTS:** ${player.points}
  `
  let Embed = new Discord.RichEmbed()
    .setAuthor('HRinfo', 'https://i.imgur.com/yUVsTLb.png')
    .addField('Profile:', info)
    .setThumbnail(playerUser.image)
    .setColor('#42BEAD')
    .setFooter('Bot made by Marto_0#1978')
  message.channel.send(Embed)
}