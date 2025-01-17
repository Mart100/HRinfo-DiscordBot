const { URLSearchParams } = require('url')
const fetch = require('node-fetch')

module.exports = {
  getUserStats(userID) {
    return new Promise((resolve, reject) => {
      fetch(`https://api.helmetroyale.io/stats?userId=${userID}`, { method: 'GET', headers: {Origin: 'https://helmetroyale.io'} })
        .then(res => resolve(res.json().catch(err => resolve() )))
    })
  },
  getLeaderboard(time, what) {
    return new Promise((resolve, reject) => {
      fetch(`https://api.helmetroyale.io/lb/${time}/${what}`, { method: 'GET', headers: {Origin: 'https://helmetroyale.io'} })
        .then(res => resolve(res.json().catch(err => resolve() )))
    })
  }
}