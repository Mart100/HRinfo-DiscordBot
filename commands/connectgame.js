const database = require('../scripts/database.js')
const HRapi = require('../scripts/HRapi.js')

module.exports = async (message) => {

  let args = message.content.split(' ')
  let p = process.env.prefix
  let gameID = args[1]
  let stats = await HRapi.getUserStats(gameID)
  
  if(stats == undefined) return message.channel.send(`ID undefined, Example: \`${p}connectgame Google_115855350808462018005\``)

  database.updatePlayer(message.author.id, 'gameID', gameID)

  message.channel.send(`Successfully connected as \`${stats.name}\``)
}