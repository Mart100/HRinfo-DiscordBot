const Discord = require('discord.js')
const HRIapi = require('../scripts/HRIapi.js')
const utils = require('../scripts/utils.js')

module.exports = async (message) => {

  let args = message.content.split(' ')
  let invite = args[1]
  let p = process.env.prefix

  if(invite == undefined) return message.channel.send('Please specify what to set it to \`-setdiscord <invite code>\` `)
  // if clan is not in HRIapi
  if(!await HRIapi.isClan(message.guild.id)) return message.channel.send(`This server is not yet registered as a clan. Register with \`${p}registerclan\``)

  HRIapi.updateClan(message.guild.id, 'invite', invite)

  message.channel.send('Succesfully edited discord link')
}