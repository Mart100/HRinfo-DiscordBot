const HRIapi = require('../scripts/HRIapi.js')
const utils = require('../scripts/utils.js')

module.exports = async (message) => {
  let p = process.env.prefix
  let clan
  let player = await HRIapi.getPlayer(message.author.id)
  let clans = await HRIapi.getClans()
  let args = message.content.toLowerCase().split(' ')

  if(player.clan != 'none') return message.channel.send(`You are already in a clan! use \`${p}leaveclan\` to leave.`)

  if(args[1] != undefined) {
    clan = utils.getClanByText(args[1], clans)
  } else {
    if(await HRIapi.isClan(message.guild.id)) clan = await HRIapi.getClan(message.guild.id)
    else {
      return message.channel.send(`This server is not yet registered as a clan. Register with \`${p}registerclan\``)
    }
  }

  if(clan == undefined) return message.channel.send('Clan not found')

  if(clan.public != true) return message.channel.send('This clan is not public, Ask one of the moderators to join.')

  HRIapi.updatePlayer(message.author.id, 'clan', clan.id)

  message.channel.send(`Successfully joined ${clan.name}`)
}