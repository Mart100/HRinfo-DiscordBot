const Discord = require('discord.js')
const utils = require('../scripts/utils.js')
const fetch = require('node-fetch')

module.exports = async (message) => {

  let usCount = 0
  let euCount = 0
  let saCount = 0
  let asCount = 0

  fetch('https://us-east-match.hrbackend.io:8100/count', { method: 'GET', headers: {Origin: 'https://helmetroyale.io'} })
    .then(res => res.json()).then(json => usCount = json.count)

  fetch('https://sa-east-match.hrbackend.io:8100/count', { method: 'GET', headers: {Origin: 'https://helmetroyale.io'} })
    .then(res => res.json()).then(json => saCount = json.count)

  fetch('https://eu-match.hrbackend.io:8100/count', { method: 'GET', headers: {Origin: 'https://helmetroyale.io'} })
    .then(res => res.json()).then(json => euCount = json.count)

  fetch('https://kor-match.hrbackend.io:8100/count', { method: 'GET', headers: {Origin: 'https://helmetroyale.io'} })
    .then(res => res.json()).then(json => asCount = json.count)

  await utils.sleep(1000)

  message.channel.send(`
**EU:** \`${euCount}\`
**US:** \`${usCount}\`
**South America:** \`${saCount}\`
**Asia:** \`${asCount}\`

**More detailed info:** https://hrinfo.xyz/playingcount/
  `)

    
}
