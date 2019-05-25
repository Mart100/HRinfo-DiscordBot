const database = require('../scripts/database.js')
const utils = require('../scripts/utils.js')

module.exports = async (message) => {
  let p = process.env.prefix
  let clan
  let player = await database.getPlayer(message.author.id)
  let clans = await database.getClans()
  let args = message.content.toLowerCase().split(' ')

  if(player.clan != 'none') return message.channel.send(`You are already in a clan! use \`${p}leaveclan\` to leave.`)

  if(args[1] != undefined) {
    clan = utils.getClanByText(args[1], clans)
  } else {
    if(await database.isClan(message.guild.id)) clan = await database.getClan(message.guild.id)
    else {
      return message.channel.send(`This server is not yet registered as a clan. Register with \`${p}registerclan\``)
    }
  }

  if(clan == undefined) return message.channel.send('Clan not found')

  if(clan.public != true) return message.channel.send('This clan is not public, Ask one of the moderators to join.')

  database.updatePlayer(message.author.id, 'clan', clan.id)

  message.channel.send(`Successfully joined ${clan.name}`)
}