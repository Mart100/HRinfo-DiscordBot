const database = require('../scripts/database.js')
const HRapi = require('../scripts/HRapi.js')

module.exports = async (message) => {

  let args = message.content.split(' ')
  let p = process.env.prefix
  let gameID = args[1]

  if(gameID == undefined) return message.channel.send(`https://hrinfo.xyz/howtoconnectgame For more information`)
  let stats = await HRapi.getUserStats(gameID)
  
  if(stats == undefined) return message.channel.send(`ID undefined, \`${p}connectgame\` For more info`)

  database.updatePlayer(message.author.id, 'gameID', gameID)

  message.channel.send(`Successfully connected as \`${stats.name}\``)
}