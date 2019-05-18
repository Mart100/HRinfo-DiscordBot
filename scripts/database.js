let admin
let db
let clanList = {}
let weaponList = {}

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
    db.collection('clans').doc(id).update(update)

    await utils.sleep(5000)
    clanList[id] = await this.getClan(id)

  },
  addClan(id) {
    db.collection('clans').doc(id).set({id: id})
  },
  removeClan(id) {
    db.collection('clans').doc(id).delete()
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
  getClans() {
    return new Promise((resolve, reject) => {
      if(Object.keys(clanList) > 0) return new Promise((resolve, reject) => { resolve(clanList) })

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
