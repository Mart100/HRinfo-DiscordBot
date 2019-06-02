const Discord = require('discord.js')
const challonge = require('../scripts/challonge.js')
const database = require('../scripts/database.js')
const _ = require('lodash')
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
    if(tournament == undefined) return message.channel.send(`Tournament ${args[1]} is undefined!`)
    let what = args[3]
    let to = args[4]
    let response = database.updateTournament(tournament.id, what, to)
    message.channel.send('Done')
  }

  else if(args[2] == 'start') {
    if(!checkADMINperms(message, tournament)) return message.channel.send('No permissions to start tournament')
    if(tournament == undefined) return message.channel.send(`Tournament ${args[1]} is undefined!`)
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
    if(tournament == undefined) return message.channel.send(`Tournament ${args[1]} is undefined!`)
    fetch(`${process.env.hrinfoAPI}/emptytournament?id=${tournament.id}&token=${process.env.hrinfoAPItoken}`)
      .then(res => res.text()).then((txt) => { 
        message.channel.send(txt)
      })
  }

  else if(args[2] == 'bracket' || args[2] == 'brackets') {
    message.channel.send(`Brackets for **${tournament.name}**: https://challonge.com/${tournament.name}`)
  }

  else if(args[2] == 'results') {
    if(args[3] == undefined) {
      return message.channel.send(`${p}tournament ${tournament.name} results <your score> <opponent score>`)
    }
    if(message.guild.id != tournament.host) {
      let host = message.client.guilds.find(g => g.id == tournament.host).name
      let text = `Please put results in the server the tournament is hosted in: **${host}**`
      return message.channel.send(text)
    }
    if(tournament.status == 'open') return message.channel.send('Tournament has not started yet!')
    if(tournament.status == 'closed') return message.channel.send('Tournament has already finished!')
    let playerChallID = tournament.players[message.author.id]
    let match = await challonge.getCurrentPlayerMatch(tournament.name, playerChallID)
    match = match[0].match
    if(match == undefined) return message.channel.send('Looks like you do not participate in an open match at the moment!')
    let userIsPlayer1 = false
    let opponent
    if(playerChallID == match.player1_id) {
      opponent = (_.invert(tournament.players))[match.player2_id]
      userIsPlayer1 = true
    }
    if(playerChallID == match.player2_id) {
      opponent = (_.invert(tournament.players))[match.player1_id]
      userIsPlayer1 = false
    }

    let opponentPoints = Number(args[4])
    let playerPoints = Number(args[3])

    let winner = []
    let loser = []
    if(opponentPoints > playerPoints) {
      winner = [opponent, opponentPoints]
      loser = [message.author.id, playerPoints]
    } else if(opponentPoints < playerPoints) {
      winner = [message.author.id, playerPoints]
      loser = [opponent, opponentPoints]
    } else {
      message.channel.send('One player must have more points then their opponent. **NO TIE**')
      return
    }

    let text = `<@${winner[0]}> Has beaten <@${loser[0]}> With ${winner[1]}-${loser[1]}\nBoth react with ✅ to confirm`
    let resultsMessage = await message.channel.send(text)
    resultsMessage.react('✅')

    const filter = (reaction, user) => reaction.emoji.name === '✅' && (user.id === winner[0] || user.id === loser[0])
    const collector = resultsMessage.createReactionCollector(filter, { max: 2 })
    collector.on('end', async (collected) => {
      resultsMessage.edit(`<@${winner[0]}> Has beaten <@${loser[0]}> With ${winner[1]}-${loser[1]}  **CONFIRMED**`)
      let player1Score
      let player2Score
      if(userIsPlayer1) {
        player1Score = playerPoints
        player2Score = opponentPoints
      } else {
        player1Score = opponentPoints
        player2Score = playerPoints
      }
      let response = await challonge.updateMatch(tournament.name, match.id, `${player1Score}-${player2Score}`, tournament.players[winner[0]])
      console.log(response)
    })

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
**${p}tournament ${tournament.name} results** \`Set results of match\`
**${p}tournament ${tournament.name} brackets** \`See the brackets\`
**${p}tournament ${tournament.name} help admin** \`Help with admin commands\`
      `
      message.channel.send(text)
    }
  }

  else {

    let host = message.client.guilds.find(g => g.id == tournament.host).name
    let tournamentField = `
**NAME:** ${tournament.name}
**STATUS:** ${tournament.status}
**REGION:** ${tournament.region}
**HOST:** ${host}
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