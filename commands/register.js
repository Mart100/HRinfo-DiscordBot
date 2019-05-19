const utils = require('../scripts/utils.js')
const database = require('../scripts/database.js')
const prefix = process.env.prefix

module.exports = async (message) => {
  let guild = message.guild
  let guildID = guild.id

  if(await database.isPlayer(message.author.id)) return message.channel.send(`You are already registered!`)

  message.channel.send('Successfully registered!')

  // set player in database
  database.addPlayer(message.author)

}
