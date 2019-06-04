const Discord = require('discord.js')
const HRIapi = require('../scripts/HRIapi.js')
const fs = require('fs')
const partners = JSON.parse(fs.readFileSync('./partners.json', 'utf8'))

module.exports = async (message) => {
  let text = ''

  if(message.guild.id == '571876749059686421') return message.channel.send('This command is not avaible in this server!')

  for(let i in partners) {
    let partner = partners[i]
    text += `**${partner.name}:** ${partner.discord}\n`
  }

  let Embed = new Discord.RichEmbed()
    .setAuthor('HRinfo', 'https://i.imgur.com/yUVsTLb.png')
    .addField('Partners:', text)
    .setColor('#42BEAD')
  message.channel.send(Embed)
}