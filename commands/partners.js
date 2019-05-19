const Discord = require('discord.js')
const database = require('../scripts/database.js')
const fs = require('fs')
const partners = JSON.parse(fs.readFileSync('./partners.json', 'utf8'))

module.exports = async (message) => {
  let text = ''

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