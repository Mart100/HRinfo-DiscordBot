const utils = require('./utils.js')
const p = process.env.prefix

module.exports = async (guild) => {
  let general = utils.getGeneralChannel(guild)
  let guildID = guild.id

  general.send(onJoinText)

}

let onJoinText = `
Thanks for inviting me!
Type \`${p}help\` For more commands of the bot.
If you want to register this server as a clan on the HRinfo site, use \`${p}registerclan\`
If you have any questions, Feel free to DM the developer (Marto_0#1978)
`