const utils = require('./utils.js')
const { URLSearchParams } = require('url')
const fetch = require('node-fetch')
let apiKEY = 'aB9gHcoyQkVdCAPnr7xCtl52JXY5rpPY'
let url = process.env.hrinfoAPI

module.exports = {
  /*=======================*/
  /*========WEAPONS========*/
  /*=======================*/
  getWeapons() {
    return new Promise((resolve, reject) => {
      fetch(url+'/weapons', { method: 'GET'})
        .then(res => res.json()).then(resolve)
    })
  },

  /*=======================*/
  /*========PLAYERS========*/
  /*=======================*/
  getPlayers() {
    return new Promise((resolve, reject) => {
      fetch(url+'/players', { method: 'GET'})
        .then(res => res.json()).then(resolve)
    })
  },
  getPlayer(id) {
    return new Promise(async (resolve, reject) => {
      let players = await this.getPlayers()
      let player = players[id]
      resolve(player)
    })
  },
  getPlayerToken(id) {
    return new Promise((resolve, reject) => {
      let headers = { 'Content-Type': 'application/json' }
      fetch(url+`/playertoken?token=${apiKEY}&id=${id}`)
        .then(res => res.text()).then(resolve)
    })
  },
  updatePlayer(id, what, to) {
    return new Promise((resolve, reject) => {
      let body = JSON.stringify({token: apiKEY, id: id, what: what, to: to})
      let headers = { 'Content-Type': 'application/json' }
      fetch(url+'/updateplayer', { method: 'POST', body: body, headers: headers })
    })
  },
  newPlayer(user) {
    return new Promise((resolve, reject) => {
      let body = JSON.stringify({token: apiKEY, id: user.id, username: user.username})
      let headers = { 'Content-Type': 'application/json' }
      fetch(url+'/newplayer', { method: 'POST', body: body, headers: headers })
    })
  },
  isPlayer(id) {
    return new Promise(async (resolve, reject) => {
      let players = await this.getPlayers()
      if(players[id] == undefined) resolve(false)
      else resolve(true)
    })
  },

  /*=======================*/
  /*=========CLANS=========*/
  /*=======================*/
  getClans() {
    return new Promise((resolve, reject) => {
      fetch(url+'/clans', { method: 'GET'})
        .then(res => res.json()).then(resolve)
    })
  },
  getClan(id) {
    return new Promise(async (resolve, reject) => {
      let clans = await this.getClans()
      let clan = clans[id]
      resolve(clan)
    })
  },
  updateClan(id, what, to) {
    return new Promise((resolve, reject) => {
      let body = JSON.stringify({token: apiKEY, id: id, what: what, to: to})
      let headers = { 'Content-Type': 'application/json' }
      fetch(url+'/updateclan', { method: 'POST', body: body, headers: headers })
    })
  },
  newClan(id) {
    return new Promise((resolve, reject) => {
      let body = JSON.stringify({token: apiKEY, id: id})
      let headers = { 'Content-Type': 'application/json' }
      fetch(url+'/newclan', { method: 'POST', body: body, headers: headers })
    })
  },
  deleteClan(id) {
    return new Promise((resolve, reject) => {
      let body = JSON.stringify({token: apiKEY, id: id})
      let headers = { 'Content-Type': 'application/json' }
      fetch(url+'/deleteclan', { method: 'POST', body: body, headers: headers })
    })
  },
  isClan(id) {
    return new Promise(async (resolve, reject) => {
      let clans = await this.getClans()
      if(clans[id] == undefined) resolve(false)
      else resolve(true)
    })
  },

  /*=============================*/
  /*=========TOURNAMENTS=========*/
  /*=============================*/
  getTournaments() {
    return new Promise((resolve, reject) => {
      fetch(url+'/tournaments', { method: 'GET'})
        .then(res => res.json()).then(resolve)
    })
  },
  updateTournament(id, what, to) {
    return new Promise((resolve, reject) => {
      fetch(`${url}/updatetournament?token=${apiKEY}&id=${id}&what=${what}&to=${to}`)
        .then(res => res.text()).then(resolve)
    })
  },
  joinTournament(id, token) {
    return new Promise((resolve, reject) => {
      fetch(`${url}/jointournament?id=${id}&token=${token}`)
        .then(res => res.text()).then(resolve)
    })
  },
  startTournament(id) {
    return new Promise((resolve, reject) => {
      fetch(`${url}/starttournament?id=${id}&token=${apiKEY}`)
        .then(res => res.text()).then(resolve)
    })
  },
  newTournament(name) {
    return new Promise((resolve, reject) => {
      fetch(`${url}/newtournament?name=${name}&token=${apiKEY}`)
        .then(res => res.json()).then(resolve)
    })
  },
  /*==============================*/
  /*============TIMERS============*/
  /*==============================*/
  getTimers() {
    return new Promise((resolve, reject) => {
      fetch(`${url}/timers`)
        .then(res => res.json()).then(resolve)
    })
  },
  updateTimers(what, to) {
    return new Promise((resolve, reject) => {
      fetch(`${url}/updatetimers?token=${apiKEY}&what=${what}&to=${to}`)
        .then(res => res.text()).then(resolve)
    })
  }
}
