let admin
let db
let clanList = {}
let weaponList = {}
let playerList = {}

const utils = require('./utils.js')
const serviceAccount = require("../databaseCredentials.json")

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
  async updateClan(id, update) {
    if(!await this.isClan(id)) return
    db.collection('clans').doc(id).update(update)

    await utils.sleep(2000)
    clanList[id] = await this.getClan(id)

  },
  addClan(id) {
    db.collection('clans').doc(id).set({id: id})
    clanList[id] = {id: id}
  },
  removeClan(id) {
    db.collection('clans').doc(id).delete()
  },
  async updatePlayer(id, update) {
    if(!await this.isPlayer(id)) return
    db.collection('players').doc(id).update(update)

    await utils.sleep(2000)
    playerList[id] = await this.getPlayer(id)
  },
  addPlayer(user) {
    let id = user.id
    let obj = {
      id: id,
      clan: "none",
      points: 0,
      
    }
    db.collection('players').doc(id).set(obj)
    playerList[id] = obj
  },
  getWeapons() {
    return new Promise((resolve, reject) => {
      if(Object.keys(weaponList) > 0) return new Promise((resolve, reject) => { resolve(weaponList) })

      db.collection("weapons").get().then((querySnapshot) => {
        let weapons = {}
        querySnapshot.forEach((doc) => {
          let data = doc.data() 
          weapons[data.name] = data
        })
        weaponList = weapons
        resolve(weapons)
      })
    })
  },
  async isPlayer(id) {
    let players = await this.getPlayers()
    if(players[id] == undefined) return false
    else return true
  },
  async isClan(id) {
    let clans = await this.getClans()
    if(clans[id] == undefined) return false
    else return true
  },
  getPlayer(id) {
    return new Promise((resolve, reject) => {
      db.collection('players').doc(id).get().then((snapshot) => {
        let data = snapshot.data()
        resolve(data)
      }).catch(err => console.log('err: ', err))
    })
  },
  getPlayers() {
    return new Promise((resolve, reject) => {
      if(Object.keys(playerList) > 0) resolve(playerList)

      db.collection("players").get().then((querySnapshot) => {
        let players = {}
        querySnapshot.forEach((doc) => {
          let data = doc.data() 
          players[data.id] = data
        })
        playerList = players
        resolve(players)
      })
    })
  },
  getClans() {
    return new Promise((resolve, reject) => {
      if(Object.keys(clanList) > 0) resolve(clanList)

      db.collection("clans").get().then((querySnapshot) => {
        let clans = {}
        querySnapshot.forEach((doc) => {
          let data = doc.data() 
          clans[data.id] = data
        })
        clanList = clans
        resolve(clans)
      })
    })
  },
  getClan(id) {
    return new Promise((resolve, reject) => {
      db.collection('clans').doc(id).get().then((snapshot) => {
        let data = snapshot.data()
        resolve(data)
      }).catch(err => console.log('err: ', err))
    })
  }
}
