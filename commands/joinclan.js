const database = require('../scripts/database.js')

module.exports = async (message) => {
  let p = process.env.prefix
  let clan
  let clans = await database.getClans()
  let args = message.content.toLowerCase().split(' ')

  if(args[1] != undefined) {
    for(let i in clans) {
      let clanI = clans[i]
      if(i == args[1] || clanI.name.toLowerCase().includes(args[1]) || clanI.tag.toLowerCase() == args[1]) clan = clanI
    }
  } else {
    if(await database.isClan(message.guild.id)) clan = await database.getClan(message.guild.id)
    else {
      return message.channel.send(`This server is not yet registered as a clan. Register with \`${p}registerclan\``)
    }
  }

  if(clan == undefined) return message.channel.send('Clan not found')

  if(clan.public != true) return message.channel.send('This clan is not public, Ask one of the moderators to join.')

  database.updatePlayer(message.author.id, {clan: clan.name})

  message.channel.send(`Successfully joined ${clan.name}`)
}