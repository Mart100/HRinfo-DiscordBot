const database = require('../scripts/database.js')

module.exports = async (message) => {
  let response = await database.getPlayerToken(message.author.id)
  let token = response.token
  let text = `
Click this link to log into the site:
https://hrinfo.xyz/login?token=${token}

**WARNING: DONT SHARE THIS LINK/TOKEN WITH ANYONE ELSE**
  `
  message.author.send(text)
  message.channel.send('Send you in DM!')
}