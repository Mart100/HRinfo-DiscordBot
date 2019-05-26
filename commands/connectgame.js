const database = require('../scripts/database.js')
const HRapi = require('../scripts/HRapi.js')

module.exports = async (message) => {

  let args = message.content.split(' ')
  let p = process.env.prefix
  let userID = args[1]
  let stats = await HRapi.getUserStats(userID)
  
  if(stats == undefined) return message.channel.send(`ID undefined, Example: \`${p}connectgame Google_115855350808462018005\``)

  message.channel.send(`Successfully connected as \`${stats.name}\``)
}