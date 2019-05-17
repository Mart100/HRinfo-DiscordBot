const Discord = require('discord.js')
const fs = require('fs')
const commandList = JSON.parse(fs.readFileSync('./commandList.json', 'utf8'))
const prefix = process.env.prefix

function onMessage(message) {
  if(message.author.bot) return // No responding to other bots
  if(message.channel.type == 'dm') return // No commands in dm's
  let content = message.content.toLowerCase()
  if(!content.startsWith(prefix)) return // Has to start with prefix
  let commandName = content.split(' ')[0].replace(prefix, '') // get command
  let command = commandList[commandName]
  if(command == undefined) return message.channel.send(`Command does not exist, type ${prefix}help for all commands`)
  // if has permission. Run
  if(checkPermissions(message, commandName)) {
    let script = require(`../commands/${commandName}.js`)
    script(message)
  } else message.channel.send(`You do not have access to this command!`)
}
module.exports = onMessage


function checkPermissions(message, commandName) {
  let command = commandList[commandName]

  if(command.permissions == 'all') return true
  if(message.author.id == '235452157166485505') return true
  if(command.permissions == '') return false
  if(command.permissions == 'ADMINISTRATOR') return message.member.hasPermission('ADMINISTRATOR')
  
  // check if user has role or higher
  let hasHigherPermission = message.guild.roles.find((r) => r.name == command.permissions).comparePositionTo(message.member.highestRole) < 0
  let hasPermission = message.member.roles.has(message.guild.roles.find((r) => r.name == command.permissions).id)
  if(hasPermission || hasHigherPermission) return true

  return false
}