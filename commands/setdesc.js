const Discord = require('discord.js')
const database = require('../scripts/database.js')
const utils = require('../scripts/utils.js')

module.exports = async (message) => {

  let args = message.content.split(' ')
  let p = process.env.prefix
  args.shift()
  let description = args.join(' ')

  // if clan is not in database
  if(!await database.isClan(message.guild.id)) return message.channel.send(`This server is not yet registered as a clan. Register with \`${p}registerclan\``)

  database.updateClan(message.guild.id, {desc: description})

  message.channel.send('Succesfully edited clan description')
}
