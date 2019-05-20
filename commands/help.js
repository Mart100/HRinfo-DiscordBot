const Discord = require('discord.js')

module.exports = (message) => {
  let p = process.env.prefix

  let Allcommands = `
**${p}help** - \`Shows this epic message\`
**${p}clan** <tag> - \`Get info about this clan or from other clans\`
**${p}weapon** <weaponName> \`See information about a specific weapon\`
**${p}invite** \`Get an invite link for this bot\`
**${p}site** \` Link to the site connected to this bot!\`
**${p}partners** \` See all the partners of HRinfo\`
**${p}profile** <user> \` See your own profile or that of someone else\`
**${p}register** \` Registers yourself to the database \`
**${p}servers** \` See the current active players in each HR servers \`
  `

  let Admincommands = `
**${p}setpublic** \` Sets this clan public, So that anyone can join! \`
**${p}setprivate** \` Sets this clan private, So that noone can join! \`
**${p}removeclan** - \`Removes this server from the clan list\`
**${p}registerclan** - \`Registers this server as a clan, And puts it on the hrinfo site\`
**${p}setdesc** - \`Sets the description of the clan\`
**${p}tag** - \`Sets the clan tag\`
**${p}setdiscord** - \`Sets the discord invite link. Set it to \`**none**\` to have no invite.\`

  `
  let Embed = new Discord.RichEmbed()
    .setAuthor('HRinfo', 'https://i.imgur.com/yUVsTLb.png')
    .addField('All:', Allcommands)
    .addField('Administrator:', Admincommands)
    .setFooter(`Prefix: ${p}`)
    .setColor('#42BEAD')
  message.channel.send(Embed)
}