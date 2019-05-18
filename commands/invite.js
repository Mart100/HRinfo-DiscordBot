const Discord = require('discord.js')
const database = require('../scripts/database.js')

module.exports = async (message) => {
  message.channel.send('Invite this bot to a server using this link: \nhttps://discordapp.com/oauth2/authorize?client_id=575714224689512448&permissions=67585&scope=bot')
}