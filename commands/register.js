const utils = require('../scripts/utils.js')
const HRIapi = require('../scripts/HRIapi.js')
const prefix = process.env.prefix

module.exports = async (message) => {
  let guild = message.guild
  let guildID = guild.id

  if(await HRIapi.isPlayer(message.author.id)) return message.channel.send(`You are already registered!`)

  message.channel.send('Successfully registered!')

  // set player in HRIapi
  HRIapi.newPlayer(message.author)

}
