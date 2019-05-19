const Discord = require('discord.js')
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

  let info = `
  **TAG:** ${clan.tag}
  **MemberCount:** ${clan.memberCount}
  `
  let Embed = new Discord.RichEmbed()
    .setAuthor('HRinfo', 'https://i.imgur.com/yUVsTLb.png')
    .addField('Description:', clan.desc)
    .addField('Other:', info)
    .setThumbnail(clan.image)
    .setColor('#42BEAD')
    .setFooter('Bot made by Marto_0#1978')
  message.channel.send(Embed)
}