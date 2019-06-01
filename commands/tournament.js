const Discord = require('discord.js')
const database = require('../scripts/database.js')

module.exports = async (message) => {
  let p = process.env.prefix
  let args = message.content.split(' ')
  let tournaments = await database.getTournaments()

  let tournament = Object.values(tournaments).find(t => t.name == args[1])

  if(args[2] == 'join') {
    // check if not already in
    let playerToken = await database.getPlayerToken(message.author.id)
    let response = await database.joinTournament(tournament.id, playerToken)
    if(response == 'SUCCESS') response = `Successfully joined tournament ${tournament.name}`
    message.channel.send(response)
    return
  }

  if(args[2] == 'update') {
    if(!checkADMINperms(message, tournament)) return message.channel.send('No permissions to update tournament')
    let what = args[3]
    let to = args[4]
    let response = database.updateTournament(tournament.id, what, to)
    message.channel.send('Done')
    return
  }

  if(args[2] == 'start') {
    if(!checkADMINperms(message, tournament)) return message.channel.send('No permissions to start tournament')
    database.startTournament(tournament.id)
    return
  }

  if(args[2] == 'create') {
    if(!createTournamentPerms.includes(message.author.id)) return message.channel.send('No permissions to create tournament')

    // new tournament
    let response = await database.newTournament(args[1])
    if(response.errors) return message.channel.send(response.errors.toString())

    // get tournament from db
    tournaments = await database.getTournaments()
    tournament = Object.values(tournaments).find(t => t.name == args[1])

    await database.updateTournament(tournament.id, 'host', message.guild.id)

    
    message.channel.send('Successfully created tournamed: ' + args[1])
    return
  }

  let tournamentField = `
**NAME:** ${tournament.name}
**STATUS:** ${tournament.status}
**REGION:** ${tournament.region}
**HOST:** ${tournament.host}
**PLAYERS:** ${tournament.players.length}
  `


  let Embed = new Discord.RichEmbed()
    .addField('Tournament:', tournamentField)
    .setColor('#42BEAD')
    .setFooter(`Join with ${p}tournament ${tournament.name} join`)
  message.channel.send(Embed)
}

function checkADMINperms(message, tournament) {
  let guild = message.client.guilds.find((g) => g.id == tournament.host)
  let member = guild.members.find((m) => m.id == message.author.id)
  let hasADMIN = member.hasPermission('ADMINISTRATOR')
  return hasADMIN
}

let createTournamentPerms = [
  '235452157166485505',
  '361632963101851660'
]