const database = require('../scripts/database.js')

module.exports = {
  getGeneralChannel(guild) {
    let channels = guild.channels
    let generalChannel

    generalChannel = channels.find((c) => { return c.name.includes('general')})
    if(generalChannel != undefined) return generalChannel
  },
  sleep(ms) { return new Promise((resolve, reject) => { setTimeout(() => { resolve() }, ms) }) },
  getClanByText(text, clans) {
    let clan
    for(let i in clans) {
      let clanI = clans[i]
      if(i == text) return clanI
      if(clanI.tag.toLowerCase() == text) return clanI
      if(clanI.name.toLowerCase().includes(text)) clan = clanI
    }
    return clan
  }
}