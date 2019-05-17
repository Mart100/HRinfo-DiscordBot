const Discord = require('discord.js')
const database = require('../scripts/database.js')
const utils = require('../scripts/utils.js')

module.exports = async (message) => {

  let args = message.content.split(' ')
  args.shift()
  let description = args.join(' ')

  database.updateClan(message.guild.id, {desc: description})

  message.channel.send('Succesfully edited clan description')
}
