const Discord = require('discord.js')

module.exports = (message) => {
  let p = process.env.prefix

  let commandsField = `
  **setDesc** - \`Sets the description of the clan\`
  **tag** - \`Sets the clan tag\`
  **removeClan** - \`Removes this server from the clan list\`
  `
  let Embed = new Discord.RichEmbed()
    .setAuthor('FlatEarthBot', 'https://i.imgur.com/dCYvK7M.png')
    .addField('commands:', commandsField)
    .setFooter(`Prefix: ${p}`)
    .setColor('#42BEAD')
  message.channel.send(Embed)
}