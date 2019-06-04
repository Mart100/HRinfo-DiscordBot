const { URL, URLSearchParams } = require('url')
const fetch = require('node-fetch')
let apiKEY = 'HHxb5sEy8p13dX0jzjJujYLHQfi6QG1QJEA3YnKJ'

module.exports = {
  getMatches(id) {
    return new Promise((resolve, reject) => {
      let url = new URL(`https://api.challonge.com/v1/tournaments/${id}/matches.json`)
      let params = {
        "api_key": apiKEY,
      }
      url.search = new URLSearchParams(params)
      fetch(url, {method:'GET'}).then(res => res.json()).then(json => resolve(json))
    })
  },
  getCurrentPlayerMatch(tournament, playerID) {
    return new Promise((resolve, reject) => {
      let url = new URL(`https://api.challonge.com/v1/tournaments/${tournament}/matches.json`)
      let params = {
        "api_key": apiKEY,
        'state': 'open',
        'participant_id': playerID
      }
      url.search = new URLSearchParams(params)
      fetch(url, {method:'GET'}).then(res => res.json()).then(json => resolve(json))
    })
  },
  updateMatch(tournament, match, score, winner) {
    return new Promise((resolve, reject) => {
      let url = new URL(`https://api.challonge.com/v1/tournaments/${tournament}/matches/${match}.json`)
      let params = {
        "api_key": apiKEY,
        "match[scores_csv]": score,
        "match[winner_id]": winner
      }
      url.search = new URLSearchParams(params)
      fetch(url, {method:'PUT'}).then(res => res.json()).then(json => resolve(json))
    })
  }
}