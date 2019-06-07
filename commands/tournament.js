const Discord = require('discord.js')
const challonge = require('../scripts/challonge.js')
const HRIapi = require('../scripts/HRIapi.js')
const _ = require('lodash')
const { URLSearchParams } = require('url')
const fetch = require('node-fetch')

module.exports = async (message) => {
  let p = process.env.prefix
  let args = message.content.split(' ')
  let tournaments = await HRIapi.getTournaments()

  let tournament = Object.values(tournaments).find(t => t.name == args[1])

  if(args[2] == 'join') {
    // check if not already in
    let playerToken = await HRIapi.getPlayerToken(message.author.id)
    let response = await HRIapi.joinTournament(tournament.id, playerToken)
    if(response == 'SUCCESS') response = `Successfully joined tournament ${tournament.name}`
    message.channel.send(response)
  }

  else if(args[2] == 'update') {
    if(!checkADMINperms(message, tournament)) return message.channel.send('No permissions to update tournament')
    if(tournament == undefined) return message.channel.send(`Tournament ${args[1]} is undefined!`)
    let what = args[3]
    let to = args[4]
    let response = HRIapi.updateTournament(tournament.id, what, to)
    message.channel.send('Done')
  }

  else if(args[2] == 'start') {
    if(!checkADMINperms(message, tournament)) return message.channel.send('No permissions to start tournament')
    if(tournament == undefined) return message.channel.send(`Tournament ${args[1]} is undefined!`)
    let response = HRIapi.startTournament(tournament.id)
    message.channel.send(response)
  }

  else if(args[2] == 'create') {
    if(!createTournamentPerms.includes(message.author.id)) return message.channel.send('No permissions to create tournament')

    // new tournament
    let response = await HRIapi.newTournament(args[1])
    if(response.errors) return message.channel.send(response.errors.toString())

    // get tournament from db
    tournaments = await HRIapi.getTournaments()
    tournament = Object.values(tournaments).find(t => t.name == args[1])

    await HRIapi.updateTournament(tournament.id, 'host', message.guild.id)

    
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
  else if(args[2] == 'leave') {
    if(tournament == undefined) return message.channel.send('Tournament undefined!')
    let TMtargetPlayer = tournament.players[message.author.id]
    let response = await HRIapi.leaveTournament(tournament.id, message.author.id)
    if(response == 'TOURNAMENT NOT OPEN') return message.channel.send(`Can't leave an ongoing match. Use \`${p}tournament ${tournament.name} forfeit\` instead`)
    message.channel.send('Successfully left tournament!')
  }

  else if(args[2] == 'bracket' || args[2] == 'brackets') {
    message.channel.send(`Brackets for **${tournament.name}**: https://challonge.com/${tournament.name}`)
  }

  else if(args[2] == 'forfeit') {
    if(tournament == undefined) return message.channel.send('Tournament undefined!')

    // status of tournament
    if(tournament.status == 'open') return message.channel.send(`Tournament has not started yet! use \`${p}tournament ${tournament.name} leave\` instead`)
    if(tournament.status == 'closed') return message.channel.send('Tournament has already finished!')


    let playerChallID = tournament.players[message.author.id].challongeID
    let match = await challonge.getCurrentPlayerMatch(tournament.name, playerChallID)
    if(match[0] == undefined) return message.channel.send('Please wait for a match before you can fortfeit!')
    match = match[0].match
    let userIsPlayer1 = false
    let opponent
    if(playerChallID == match.player1_id) {
      opponent = Object.values(tournament.players).find((p) => p.challongeID == match.player2_id).id
      userIsPlayer1 = true
    }
    if(playerChallID == match.player2_id) {
      opponent = Object.values(tournament.players).find((p) => p.challongeID == match.player1_id).id
      userIsPlayer1 = false
    }

    let score
    if(userIsPlayer1) score = '0-1'
    else score = '1-0'

    let response = await challonge.updateMatch(tournament.name, match.id, score, tournament.players[opponent].challongeID)
    message.channel.send('Successfully forfeited!')
  }

  else if(args[2] == 'shuffle') {
    if(!checkADMINperms(message, tournament)) return message.channel.send('No permissions to empty tournament')
    challonge.shuffleTournament(tournament.shuffle)
    message.channel.send(`Successfully shuffled tournament **${tournament.name}**!`)
  }

  else if(args[2] == 'extendlimit') {
    if(!checkADMINperms(message, tournament)) return message.channel.send('No permissions tournament admin commands')
    let args = message.content.split(' ')
    let tournaments = await zrnAPI.getTournaments()
    let tournament = Object.values(tournaments).find(t => t.name == args[1])
    if(args[3] == undefined) message.channel.send(`**Usage:** ${process.env.prefix}extendlimit <user | all> <amount of days>`)
    if(tournament == undefined) return message.channel.send('Tournament undefined')
    args[3] = args[3].replace('<@', '').replace('>', '')
    let TMtargetPlayer = tournament.players[args[3]]
    if(TMtargetPlayer == undefined) return message.channel.send('Player is not defined or not in tournament.')
    let days = Number(args[4])
    TMtargetPlayer.extendLimit += days
    zrnAPI.updateTournament(tournament.id, 'players', JSON.stringify(tournament.players))
    let targetUser = message.client.users.find(u => u.id == TMtargetPlayer.id)
    let playerNextMatch = await challonge.getCurrentPlayerMatch(tournament.name, TMtargetPlayer.challongeID)
    let daysLeft = ((tournament.roundMaxTime*playerNextMatch[0].match.round) - Math.floor((Date.now() - tournament.startDate)/(1000*60*60*24))) + tournament.players[TMtargetPlayer.id].extendLimit
    let text = `Successfully extended **${targetUser.username+'#'+targetUser.discriminator}** to ${days} more days! They now have **${daysLeft}** days left to finish next match!`
    message.channel.send(text)
  }

  else if(args[2] == 'reactmessage') {
    if(!checkADMINperms(message, tournament)) return message.channel.send('No permissions tournament admin commands')
    let reactMessage = await message.channel.fetchMessage(args[3])
    if(reactMessage == undefined) return message.channel.send(`Usage: ${p}tournament ${tournament.name} reactmessage <message id to bind>`)
    reactMessage.react('✅')
    await zrnAPI.updateTournament(tournament.id, 'reactionCollector', `${reactMessage.guild.id}.${reactMessage.channel.id}.${reactMessage.id}`)
    const filter = (reaction, user) => true
    const collector = reactMessage.createReactionCollector(filter, {})
    collector.on('collect', (reaction) => {
      let user = reaction.users.last()
      if(user.bot) return
      zrnAPI.joinTournament(tournament.id, user)
    })
    message.channel.send('Successfully added reaction joining to the message!')
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
  '361632963101851660',
  '276053074295128074',
  '532333562473611296'
]