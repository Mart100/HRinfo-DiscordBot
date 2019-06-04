const HRIapi = require('../scripts/HRIapi.js')
const utils = require('../scripts/utils.js')

module.exports = async (message) => {
  let p = process.env.prefix
  let player = await HRIapi.getPlayer(message.author.id)
  let clans = await HRIapi.getClans()
  let oldPlayerClan = player.clan
  let args = message.content.toLowerCase().split(' ')

  if(oldPlayerClan == 'none') return message.channel.send(`You're not even in a clan...`)

  HRIapi.updatePlayer(message.author.id, 'clan', 'none')

  message.channel.send(`Successfully left **${clans[oldPlayerClan].name}**`)
}