const Discord = require('discord.js')

module.exports = (message) => {
  let p = process.env.prefix
  let args = message.content.toLowerCase().split(' ')
  let commandField

  let allCommands = `
**${p}help** \`Shows this epic message\`
**${p}clan** <tag> \`Get info about this clan or from other clans\`
**${p}weapon** <weaponName> \`See information about a specific weapon\`
**${p}profile** <user> \` See your own profile or that of someone else\`
**${p}register** \` Create an account \`
**${p}servers** \` See the current active players in each HR servers \`
**${p}joinclan** <clan tag> \` Join a clan! \`
**${p}leaveclan** \` Leaves your current clan! \`
**${p}leaderboard** \` See the HC leaderboard, Or the games leaderboard \`
**${p}connectsite** \` Get a link to log into the site! \`
**${p}connectgame** \` Connect your game account, to your HRinfo account \`
**${p}hrinfostats** \` See stats about the HRinfo network \`
**${p}invite** \`Get an invite link for this bot\`
**${p}site** \` Link to the site connected to this bot!\`
**${p}partners** \` See all the partners of HRinfo\`

**${p}help admin** \` For all clan admin commands! \`
  `

  let adminCommands = `
**${p}registerclan** \`Registers this server as a clan, And puts it on the hrinfo site\`
**${p}removeclan** \`Removes this server from the clan list\`
**${p}setclanpublic** \` Sets this clan public, So that anyone can join! \`
**${p}setclanprivate** \` Sets this clan private, So that noone can join! \`
**${p}setclandesc** <desc> \`Sets the description of the clan\`
**${p}setclantag** <tag> \`Sets the clan tag\`
**${p}setclanname** <name> \`Sets the clan name\`
**${p}setclandiscord** <invite code> \`Sets the discord invite link. Set it to \`**none**\` to have no invite.\`
**${p}claninvite** <mention> \`Invite someone to your clan.\`

  `


  if(args[1] == undefined) commandField = allCommands
  if(args[1] == 'admin') commandField = adminCommands
  let Embed = new Discord.RichEmbed()
    .setAuthor('HRinfo', 'https://i.imgur.com/yUVsTLb.png')
    .addField('Commands:', commandField)
    .setFooter(`Prefix: ${p}`)
    .setColor('#42BEAD')
  message.channel.send(Embed)
}