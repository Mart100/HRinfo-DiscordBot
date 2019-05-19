const database = require('../scripts/database.js')

module.exports = {
  getGeneralChannel(guild) {
    let channels = guild.channels
    let generalChannel

    generalChannel = channels.find((c) => { return c.name.includes('general')})
    if(generalChannel != undefined) return generalChannel
  },
  sleep(ms) { return new Promise((resolve, reject) => { setTimeout(() => { resolve() }, ms) }) }
}