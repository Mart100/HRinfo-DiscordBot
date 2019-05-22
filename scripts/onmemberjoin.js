const database = require('./database.js')
const utils = require('./utils.js')

module.exports = async (member) => {

  // update clan +1 member
  database.updateClan(member.guild.id, 'discordMemberCount', member.guild.memberCount)

  // set player in database
  if(!await database.isPlayer(member.user.id)) database.newPlayer(member.user)
}