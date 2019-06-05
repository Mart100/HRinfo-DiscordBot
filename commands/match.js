module.exports = async (message) => {

  let matchcreator = `**${message.author.username+'#'+message.author.discriminator}**`
  let text = `
  ${matchcreator} Is looking for a match! 
  React with ⚔ to notify them for a match!
  ` 
  let messageSend = await message.channel.send(text)

  messageSend.react('⚔')

  const filter = (reaction, user) => reaction.emoji.name === '⚔' && !user.bot
  const collector = messageSend.createReactionCollector(filter, { max: 1 })
  collector.on('collect', (reaction, reason) => {
    let user = reaction.users.last()
    message.channel.send(`**${user.username+'#'+user.discriminator}** Notified ${matchcreator} that a match is awaiting them!`)
    messageSend.delete()
    message.author.send(`Looks like you found a match in <#${message.channel.id}> . Against **${user.username+'#'+user.discriminator}**`)
  })
}