const Discord = require('discord.js')
const HRIapi = require('../scripts/HRIapi.js')
const utils = require('../scripts/utils.js')

module.exports = async (message) => {
  let p = process.env.prefix
  let clan
  let clans = await HRIapi.getClans()
  let args = message.content.toLowerCase().split(' ')

  if(args[1] != undefined) {
    clan = utils.getClanByText(args[1], clans)
  } else {
    if(await HRIapi.isClan(message.guild.id)) clan = await HRIapi.getClan(message.guild.id)
    else {
      return message.channel.send(`This server is not yet registered as a clan. Register with \`${p}registerclan\``)
    }
  }

  if(clan == undefined) return message.channel.send('Clan not found')

  let info = `
  **TAG:** ${clan.tag}
  **Members:** ${clan.members.length}
  **DiscordMemberCount:** ${clan.discordMemberCount}
  **Discord:** https://discord.gg/${clan.invite}
  `
  let Embed = new Discord.RichEmbed()
    .setAuthor('HRinfo', 'https://i.imgur.com/yUVsTLb.png')
    .addField('Description:', clan.desc)
    .addField('Other:', info)
    .setThumbnail(clan.image)
    .setColor('#42BEAD')
  message.channel.send(Embed)
}