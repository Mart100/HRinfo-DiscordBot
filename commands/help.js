const Discord = require('discord.js')

module.exports = (message) => {
  let p = process.env.prefix
  let args = message.content.toLowerCase().split(' ')
  let commandField

  let allCommands = `
**${p}help** - \`Shows this epic message\`
**${p}clan** <tag> - \`Get info about this clan or from other clans\`
**${p}weapon** <weaponName> \`See information about a specific weapon\`
**${p}invite** \`Get an invite link for this bot\`
**${p}site** \` Link to the site connected to this bot!\`
**${p}partners** \` See all the partners of HRinfo\`
**${p}profile** <user> \` See your own profile or that of someone else\`
**${p}register** \` Registers yourself to the database \`
**${p}servers** \` See the current active players in each HR servers \`
**${p}joinclan** <clan tag> \` Join a clan! \`
**${p}leaveclan** \` Leaves your current clan! \`
**${p}connectsite** \` Get a link to log into the site! \`

**${p}help admin** \` For all admin commands! \`
  `

  let adminCommands = `
**${p}setpublic** \` Sets this clan public, So that anyone can join! \`
**${p}setprivate** \` Sets this clan private, So that noone can join! \`
**${p}removeclan** - \`Removes this server from the clan list\`
**${p}registerclan** - \`Registers this server as a clan, And puts it on the hrinfo site\`
**${p}setdesc** - \`Sets the description of the clan\`
**${p}tag** - \`Sets the clan tag\`
**${p}setdiscord** - \`Sets the discord invite link. Set it to \`**none**\` to have no invite.\`
**${p}claninvite** <mention> - \`Invite someone to your clan.\`

  `


  if(args[1] == undefined) commandField = allCommands
  if(args[1] == 'admin') commandField = adminCommands
  let Embed = new Discord.RichEmbed()
    .setAuthor('HRinfo', 'https://i.imgur.com/yUVsTLb.png')
    .addField('Commands:', commandField)
    .setFooter(`Prefix: ${p}`)
    .setColor('#42BEAD')
  message.channel.send(Embed)
}