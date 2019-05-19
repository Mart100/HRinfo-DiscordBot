const database = require('../scripts/database.js')

module.exports = async (message) => {
  let mai = message.author.id

  if(mai != '361632963101851660' && mai != '235452157166485505') return message.channel.send('No Access')

  let args = message.content.toLowerCase().split(' ')

  let pointAmount = Number(args[2])
  let toID = args[1].replace('<@', '').replace('>', '')

  let toPlayer = await database.getPlayer(toID)

  if(toPlayer == undefined) return message.channel.send('Player not found')

  database.updatePlayer(toID, {points: toPlayer.points+pointAmount})

  message.channel.send(`Successfully gave ${pointAmount} points to <@${toID}>`)

}