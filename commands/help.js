const Discord = require('discord.js')

module.exports = (message) => {
  let p = process.env.prefix

  let commandsField = `
  **${p}help** - \`Shows this epic message\`
  **${p}setdesc** - \`Sets the description of the clan\`
  **${p}tag** - \`Sets the clan tag\`
  **${p}clan** <tag> - \`Get info about this clan or from other clans\`
  **${p}removeclan** - \`Removes this server from the clan list\`
  **${p}registerclan** - \`Registers this server as a clan, And puts it on the hrinfo site\`
  **${p}weapon** <weaponName> \`See information about a specific weapon\`
  **${p}invite** \`Get an invite link for this bot\`
  **${p}site** \` Link to the site connected to this bot!\`
  **${p}partners** \` See all the partners of HRinfo\`
  **${p}profile** <user> \` See your own profile or that of someone else\`
  **${p}givepoints** <user> <amount> \`Give a specified player points\`
  **${p}register** \` Registers yourself to the database \`
  **${p}setpublic** \` Sets this clan public, So that anyone can join! \`
  **${p}setprivate** \` Sets this clan private, So that noone can join! \`
  `
  let Embed = new Discord.RichEmbed()
    .setAuthor('HRinfo', 'https://i.imgur.com/yUVsTLb.png')
    .addField('commands:', commandsField)
    .setFooter(`Prefix: ${p}`)
    .setColor('#42BEAD')
  message.channel.send(Embed)
}