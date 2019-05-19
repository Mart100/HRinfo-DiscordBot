const Discord = require('discord.js')
const database = require('../scripts/database.js')
const utils = require('../scripts/utils.js')

module.exports = async (message) => {

  let args = message.content.split(' ')
  let tag = args[1]
  let p = process.env.prefix

  // if clan is not in database
  if(!await database.isClan(message.guild.id)) return message.channel.send(`This server is not yet registered as a clan. Register with \`${p}registerclan\``)

  database.updateClan(message.guild.id, {tag: tag})

  message.channel.send('Succesfully edited clan tag')
}