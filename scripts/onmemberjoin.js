const HRIapi = require('./scripts/HRIapi.js')
const utils = require('./utils.js')

module.exports = async (member) => {

  // update clan +1 member
  if(await HRIapi.isClan(member.guild.id)) HRIapi.updateClan(member.guild.id, 'discordMemberCount', member.guild.memberCount)

  // set player in database
  if(!await HRIapi.isPlayer(member.user.id)) HRIapi.newPlayer(member.user)
}