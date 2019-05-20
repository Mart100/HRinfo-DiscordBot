const Discord = require('discord.js')
const database = require('../scripts/database.js')

module.exports = async (message) => {
  let p = process.env.prefix
  let players = await database.getPlayers()
  let args = message.content.toLowerCase().split(' ')
  let page = 0
  if(args[1] != undefined) page = Number(args[1])-1

  let leaderboardIndex = page*10
  let leaderBoardText = ''


  let Splayers = Object.values(players).sort((a, b) => b.points-a.points)
  Splayers = Splayers.slice(leaderboardIndex, leaderboardIndex+10)

  for(let i in Splayers) {
    let player = Splayers[i]
    let playerUser = message.client.users.find((u) => u.id == player.id)
    if(playerUser == undefined) playerUser = {username: 'undefined'}
    leaderBoardText += `\`#${leaderboardIndex+Number(i)+1}\` **${player.username}:** ${player.points}\n`
  }


  // send Embed
  let Embed = new Discord.RichEmbed()
    .addField('Leaderboard:', leaderBoardText)
    .setColor('#42BEAD')
    .setFooter(`page ${page+1}`)
  message.channel.send(Embed)
}