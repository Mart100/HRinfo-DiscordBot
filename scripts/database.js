let admin
let db
let userList = {}

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
  updateClan(id, update) {
    db.collection('clans').doc(id).update(update)
  },
  addClan(id) {
    db.collection('clans').doc(id).set({})
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
