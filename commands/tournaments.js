const Discord = require('discord.js')
const database = require('../scripts/database.js')

module.exports = async (message) => {
  let p = process.env.prefix
  let args = message.content.toLowerCase().split(' ')
  let tournaments = await database.getTournaments()
  console.log(tournaments)
  let tournamentsField = ``

  for(let tournamentID in tournaments) {
    let tournament = tournaments[tournamentID]
    tournamentsField += `**${tournament.name}**\n`
  }

  let Embed = new Discord.RichEmbed()
    .addField('Tournaments:', tournamentsField)
    .setColor('#42BEAD')

  message.channel.send(Embed)
}