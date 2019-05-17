const Discord = require('discord.js')

module.exports = (message) => {
  let p = process.env.prefix

  let commandsField = `
  **${p}help** - \`Shows this epic message\`
  **${p}setDesc** - \`Sets the description of the clan\`
  **${p}tag** - \`Sets the clan tag\`
  **${p}clan** <tag> - \`Get info about this clan or from other clans\`
  **${p}removeClan** - \`Removes this server from the clan list\`
  `
  let Embed = new Discord.RichEmbed()
    .setAuthor('HRinfo', 'https://i.imgur.com/yUVsTLb.png')
    .addField('commands:', commandsField)
    .setFooter(`Prefix: ${p}`)
    .setColor('#42BEAD')
  message.channel.send(Embed)
}