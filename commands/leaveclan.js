const database = require('../scripts/database.js')
const utils = require('../scripts/utils.js')

module.exports = async (message) => {
  let p = process.env.prefix
  let player = await database.getPlayer(message.author.id)
  let clans = await database.getClans()
  let oldPlayerClan = player.clan
  let args = message.content.toLowerCase().split(' ')

  if(oldPlayerClan == 'none') return message.channel.send(`You're not even in a clan...`)

  database.updatePlayer(message.author.id, 'clan', 'none')

  message.channel.send(`Successfully left **${clans[oldPlayerClan].name}**`)
}