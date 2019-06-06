const Discord = require('discord.js')

module.exports = (message) => {
  
  let Embed = new Discord.RichEmbed()
    .setImage(`https://i.imgur.com/PqgkPqb.png`)
  message.channel.send(Embed)
}