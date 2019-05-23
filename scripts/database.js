let admin
let db
let clanList = {}
let weaponList = {}
let playerList = {}

const utils = require('./utils.js')
const { URLSearchParams } = require('url')
const fetch = require('node-fetch')
const serviceAccount = require("../databaseCredentials.json")
let HRapiTOKEN = 'aB9gHcoyQkVdCAPnr7xCtl52JXY5rpPY'

module.exports = {
  initialize() {

    let firebaseAdmin = require("firebase-admin")

    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(serviceAccount),
      databaseURL: "https://helmetroyaleinfo.firebaseio.com"
    })

    db = firebaseAdmin.firestore()

    db.settings({timestampsInSnapshots: true})
    console.log('Database Initialized')

  },
  /*=======================*/
  /*========WEAPONS========*/
  /*=======================*/
  getWeapons() {
    return new Promise((resolve, reject) => {
      fetch('https://hrinfo-api.herokuapp.com/weapons', { method: 'GET'})
        .then(res => res.json()).then(resolve)
    })
  },

  /*=======================*/
  /*========PLAYERS========*/
  /*=======================*/
  getPlayers() {
    return new Promise((resolve, reject) => {
      fetch('https://hrinfo-api.herokuapp.com/players', { method: 'GET'})
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
      let body = JSON.stringify({token: HRapiTOKEN, id: id})
      let headers = { 'Content-Type': 'application/json' }
      fetch('https://hrinfo-api.herokuapp.com/playertoken', { method: 'POST', body: body, headers: headers })
        .then(res => res.json()).then(resolve)
    })
  },
  updatePlayer(id, what, to) {
    return new Promise((resolve, reject) => {
      let body = JSON.stringify({token: HRapiTOKEN, id: id, what: what, to: to})
      let headers = { 'Content-Type': 'application/json' }
      fetch('https://hrinfo-api.herokuapp.com/updateplayer', { method: 'POST', body: body, headers: headers })
    })
  },
  newPlayer(user) {
    return new Promise((resolve, reject) => {
      let body = JSON.stringify({token: HRapiTOKEN, id: user.id, username: user.username})
      let headers = { 'Content-Type': 'application/json' }
      fetch('https://hrinfo-api.herokuapp.com/newplayer', { method: 'POST', body: body, headers: headers })
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
      fetch('https://hrinfo-api.herokuapp.com/clans', { method: 'GET'})
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
      let body = JSON.stringify({token: HRapiTOKEN, id: id, what: what, to: to})
      let headers = { 'Content-Type': 'application/json' }
      fetch('https://hrinfo-api.herokuapp.com/updateclan', { method: 'POST', body: body, headers: headers })
    })
  },
  newClan(id) {
    return new Promise((resolve, reject) => {
      let body = JSON.stringify({token: HRapiTOKEN, id: id})
      let headers = { 'Content-Type': 'application/json' }
      fetch('https://hrinfo-api.herokuapp.com/newclan', { method: 'POST', body: body, headers: headers })
    })
  },
  deleteClan(id) {
    return new Promise((resolve, reject) => {
      let body = JSON.stringify({token: HRapiTOKEN, id: id})
      let headers = { 'Content-Type': 'application/json' }
      fetch('https://hrinfo-api.herokuapp.com/deleteclan', { method: 'POST', body: body, headers: headers })
    })
  },
  isClan(id) {
    return new Promise(async (resolve, reject) => {
      let clans = await this.getClans()
      if(clans[id] == undefined) resolve(false)
      else resolve(true)
    })
  }
}
