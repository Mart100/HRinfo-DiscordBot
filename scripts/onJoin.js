const utils = require('./utils.js')
const database = require('./database.js')
const prefix = process.env.prefix

module.exports = async (guild) => {
  let general = utils.getGeneralChannel(guild)
  let guildID = guild.id

  general.send(onJoinText)

  database.addClan(guildID)

  await utils.sleep(5000)

  database.updateClan(guildID, {memberCount: guild.memberCount})
  database.updateClan(guildID, {name: guild.name})
  database.updateClan(guildID, {image: guild.iconURL})
  database.updateClan(guildID, {desc: 'No description yet...'})

  // create invite and add to database
  general.createInvite({maxAge: 0, unique: true}).then(invite => database.updateClan(guildID, {invite: invite.code}))
}

let onJoinText = `
Thanks for inviting me to your HelmetRoyale clan!
This clan should be added to https://hrinfo.xyz/clans/ in ~1 minute
Type \`${prefix}help\` For more commands of the bot. Such as settings a clan description that will be displayed on the site.
If you have any questions, Feel free to DM the developer (Marto_0#1978)
`