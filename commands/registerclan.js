const utils = require('../scripts/utils.js')
const HRIapi = require('../scripts/HRIapi.js')
const p = process.env.prefix

module.exports = async (message) => {
  let guild = message.guild
  let guildID = guild.id

  if(await HRIapi.isClan(guildID)) return message.channel.send(`This server is already registered as a clan.`)

  message.channel.send(text)

  HRIapi.newClan(guildID)

  await utils.sleep(5000)

  HRIapi.updateClan(guildID, 'discordMemberCount', guild.memberCount)
  HRIapi.updateClan(guildID, 'name', guild.name)
  HRIapi.updateClan(guildID, 'image', guild.iconURL)

  // create invite and add to HRIapi
  message.channel.createInvite({maxAge: 0, unique: true}).then(invite => HRIapi.updateClan(guildID, 'invite', invite.code))
}

let text = `
This server is now registered as clan!
This server should be added as clan to https://hrinfo.xyz/clans/ in ~1 minute
After any discord administrator has set the clan to public with \`${p}setclanpublic\`. 
Others can join the clan using \`${p}joinclan <clan TAG>\`
Type \`${p}help\` For more commands of the bot. Such as setting a clan description that will be displayed on the site.
`
