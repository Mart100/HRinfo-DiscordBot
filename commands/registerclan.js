const utils = require('../scripts/utils.js')
const database = require('../scripts/database.js')
const prefix = process.env.prefix

module.exports = async (message) => {
  let guild = message.guild
  let guildID = guild.id

  if(await database.isClan(guildID)) return message.channel.send(`This server is already registered as a clan.`)

  message.channel.send(text)

  database.addClan(guildID)

  await utils.sleep(5000)

  database.updateClan(guildID, {memberCount: guild.memberCount})
  database.updateClan(guildID, {name: guild.name})
  database.updateClan(guildID, {image: guild.iconURL})

  // create invite and add to database
  message.channel.createInvite({maxAge: 0, unique: true}).then(invite => database.updateClan(guildID, {invite: invite.code}))
}

let text = `
This server is now registered as clan!
This server should be added as clan to https://hrinfo.xyz/clans/ in ~1 minute
Type \`${prefix}help\` For more commands of the bot. Such as setting a clan description that will be displayed on the site.
`
