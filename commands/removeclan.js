const Discord = require('discord.js')
const HRIapi = require('../scripts/HRIapi.js')

module.exports = async (message) => {
  let p = process.env.prefix

  // if clan is not in HRIapi
  if(!await HRIapi.isClan(message.guild.id)) return message.channel.send(`This server is not yet registered as a clan. Register with \`${p}registerclan\``)

  HRIapi.deleteClan(message.guild.id)
  
  message.channel.send(`Successfully removed the clan, If you want to add it back use \`${p}registerclan\``)
}

