const Discord = require('discord.js')
const database = require('../scripts/database.js')

module.exports = async (message) => {
  let p = process.env.prefix

  database.removeClan(message.guild.id)

  message.channel.send('Successfully removed the clan, If you want to add it back use \`-registerclan\`')
}

