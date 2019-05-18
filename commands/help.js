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
  `
  let Embed = new Discord.RichEmbed()
    .setAuthor('HRinfo', 'https://i.imgur.com/yUVsTLb.png')
    .addField('commands:', commandsField)
    .setFooter(`Prefix: ${p}`)
    .setColor('#42BEAD')
  message.channel.send(Embed)
}