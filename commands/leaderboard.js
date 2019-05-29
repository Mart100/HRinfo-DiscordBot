const Discord = require('discord.js')
const database = require('../scripts/database.js')
const HRapi = require('../scripts/HRapi.js')


module.exports = async (message) => {
  let p = process.env.prefix
  let args = message.content.toLowerCase().split(' ')

  if(args[1] == 'comp') leaderboardComp(message)
  else if(args[1] == 'casual') leaderboardCasual(message)

  else {
    let Embed = new Discord.RichEmbed()
      .addField(`${p}leaderboard comp`, `See the competitive leaderboard!`)
      .addField(`${p}leaderboard casual`, `See the casual leaderboard!`)
      .setColor('#42BEAD')
      .addField(`full leaderboard at`, 'https://hrinfo.xyz/leaderboard')
    message.channel.send(Embed)
    return
  }
}


async function leaderboardComp(message) {
  let args = message.content.toLowerCase().split(' ')
  let players = await database.getPlayers()
  let page = 0
  if(args[2] != undefined) page = Number(args[2])-1

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

async function leaderboardCasual(message) {
  let args = message.content.toLowerCase().split(' ')
  let time = 'daily'
  let what = 'mostKills'
  let leaderBoardText = ''
  let page = 0

  if(args[2] != undefined) page = Number(args[2])-1

  let leaderboardIndex = page*10

  let LBdata = await HRapi.getLeaderboard(time, what)

  if(LBdata == undefined) return message.channel.send('Something went wrong :(')
  console.log(LBdata)

  LBdata = LBdata.slice(leaderboardIndex, leaderboardIndex+10)

  // add to text
  for(let i in LBdata) {
    let player = LBdata[i]
    leaderBoardText += `\`#${leaderboardIndex+Number(i)+1}\` **${player.name}:** ${player.score}\n`
  }


  let infoField = `
  **Time:** ${time}
  **What:** ${what}
  `

  // send Embed
  let Embed = new Discord.RichEmbed()
    .addField('Info:', infoField)
    .addField('Leaderboard:', leaderBoardText)
    .setColor('#42BEAD')
    .setFooter(`page ${page+1}`)
  message.channel.send(Embed)
}