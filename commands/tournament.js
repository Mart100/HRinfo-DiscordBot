const Discord = require('discord.js')
const database = require('../scripts/database.js')
const { URLSearchParams } = require('url')
const fetch = require('node-fetch')

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
  }

  else if(args[2] == 'update') {
    if(!checkADMINperms(message, tournament)) return message.channel.send('No permissions to update tournament')
    let what = args[3]
    let to = args[4]
    let response = database.updateTournament(tournament.id, what, to)
    message.channel.send('Done')
  }

  else if(args[2] == 'start') {
    if(!checkADMINperms(message, tournament)) return message.channel.send('No permissions to start tournament')
    database.startTournament(tournament.id)
  }

  else if(args[2] == 'create') {
    if(!createTournamentPerms.includes(message.author.id)) return message.channel.send('No permissions to create tournament')

    // new tournament
    let response = await database.newTournament(args[1])
    if(response.errors) return message.channel.send(response.errors.toString())

    // get tournament from db
    tournaments = await database.getTournaments()
    tournament = Object.values(tournaments).find(t => t.name == args[1])

    await database.updateTournament(tournament.id, 'host', message.guild.id)

    
    message.channel.send('Successfully created tournamed: ' + args[1])
  }

  else if(args[2] == 'empty') {
    if(!checkADMINperms(message, tournament)) return message.channel.send('No permissions to empty tournament')
    fetch(`${process.env.hrinfoAPI}/emptytournament?id=${tournament.id}&token=${process.env.hrinfoAPItoken}`)
      .then(res => res.text()).then((txt) => { 
        message.channel.send(txt)
      })
  }

  else if(args[2] == 'bracket' || args[2] == 'brackets') {
    message.channel.send(`Brackets for **${tournament.name}**: https://challonge.com/${tournament.name}`)
  }

  else if(args[2] == 'help') {
    if(args[3] == 'admin') {
      let text = `
**${p}tournament ${tournament.name} update <what> <to>** \`Update tournament info\`
**${p}tournament ${tournament.name} empty** \`Clear all users from the bracket\`
**${p}tournament ${tournament.name} create** \`Creates a bracket\`
**${p}tournament ${tournament.name} start** \`Starts a bracket\`
      `
      message.channel.send(text)
    } else {
      let text = `
**${p}tournament ${tournament.name} join** \`Join the tournament\`
**${p}tournament ${tournament.name} brackets** \`See the brackets\`
**${p}tournament ${tournament.name} help admin** \`Help with admin commands\`
      `
      message.channel.send(text)
    }
  }

  else {
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
      .setFooter(`${p}tournament ${tournament.name} help`)
    message.channel.send(Embed)
  }

}

function checkADMINperms(message, tournament) {
  if(message.author.id == '235452157166485505') return true
  let guild = message.client.guilds.find((g) => g.id == tournament.host)
  let member = guild.members.find((m) => m.id == message.author.id)
  let hasADMIN = member.hasPermission('ADMINISTRATOR')
  return hasADMIN
}

let createTournamentPerms = [
  '235452157166485505',
  '361632963101851660'
]