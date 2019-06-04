const HRIapi = require('./HRIapi.js')
const challonge = require('./challonge.js')
const _ = require('lodash')
let client


module.exports = (bot) => {
  client = bot
  check()
  setInterval(check, 1000*60)
}

async function check() {
  let currentTime = Math.floor(Date.now()/(1000*60*60*24))
  let timerTime = await HRIapi.getTimers()
  timerTime = timerTime.day

  if(currentTime > timerTime) {
    HRIapi.updateTimers('day', currentTime)
    sendTournamentReminder()
    doCoinFlips()
  }
}


async function sendTournamentReminder() {
  let tournaments = await HRIapi.getTournaments()

  // loop trough tournament
  for(let tournamentID in tournaments) {
    let tournament = tournaments[tournamentID]

    // filter tournaments
    if(tournament.status != 'ongoing') continue


    // loop trough players in tournament
    for(let playerID in tournament.players) {
      let chollID = tournament.players[playerID]
      let match = await challonge.getCurrentPlayerMatch(tournament.name, chollID)
      match = match[0].match
      let playerUser = client.users.find((u) => u.id == playerID)

      let ms = Date.now() - tournament.startDate
      let daysLeft = (tournament.roundMaxTime*match.round) - Math.floor(ms/(1000*60*60*24))

      // get opponent
      let opponentUserID
      if(chollID == match.player1_id) opponentUserID = (_.invert(tournament.players))[match.player2_id]
      if(chollID == match.player2_id) opponentUserID = (_.invert(tournament.players))[match.player1_id]
      let opponentUser = client.users.find((u) => u.id == opponentUserID)

      let text = `
You have an open match against **${opponentUser.username+'#'+opponentUser.discriminator}**. In tournament: **${tournament.name}**
If you do not play your match, The match will automatically be coinflipped in **${daysLeft}** days!
Brackets: https://challonge.com/${tournament.name}
      `

      playerUser.send(text)
    }
  }
}

async function doCoinFlips() {

  let tournaments = await HRIapi.getTournaments()


  // loop trough tournament
  for(let tournamentID in tournaments) {
    let tournament = tournaments[tournamentID]
    let matches = await challonge.getMatches(tournament.name)
    
    // loop trough matches
    for(let match of matches) {
      match = match.match
      if(match.state != 'open') continue

      let between = Date.now() - tournament.startDate
      let daysLeft = (tournament.roundMaxTime*match.round) - Math.floor(between/(1000*60*60*24))

      // do the coinflip
      if(daysLeft <= 0) {
        let random = Math.random()
        let score = []
        let winner
        if(random > 0.5) { score = [1, 0]; winner = match.player1_id; }
        if(random < 0.5) { score = [0, 1]; winner = match.player2_id; }

        await challonge.updateMatch(tournament.name, match.id, `${score[0]}-${score[1]}`, winner)

        // send DM
        let player1User = client.users.find((u) => u.id == (_.invert(tournament.players))[match.player1_id])
        let player2User = client.users.find((u) => u.id == (_.invert(tournament.players))[match.player2_id])
        let winnerUser = client.users.find((u) => u.id == (_.invert(tournament.players))[winner])

        let textplayer1 = `
Your match against **${player2User.username+'#'+player2User.discriminator}**. In tournament: **${tournament.name}**
Has expired! So the match has been coinflipped.
Results: **${winnerUser.username+'#'+winnerUser.discriminator}** Has won the coinflip!
`       
        player1User.send(textplayer1)

        let textplayer2 = `
Your match against **${player1User.username+'#'+player1User.discriminator}**. In tournament: **${tournament.name}**
Has expired! So the match has been coinflipped.
Results: **${winnerUser.username+'#'+winnerUser.discriminator}** Has won the coinflip!
`
        player2User.send(textplayer2)

      }

    }
  }
}