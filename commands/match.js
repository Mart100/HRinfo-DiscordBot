module.exports = async (message) => {

  let matchcreator = `**${message.author.username+'#'+message.author.discriminator}**`
  let text = `
  ${matchcreator} Is looking for a match! 
  React with ⚔ to notify them for a match!
  ` 

  if(message.guild.id != 579651261054451752) {
    return message.channel.send(`This command is only avaible in Helpmet Competitive! Use \`${}partners\` for invite!`)
  }
  
  let messageSend = await message.guild.channels.find(c => c.id == 586242295091953684).send(text)
  

  messageSend.react('⚔')

  const filter = (reaction, user) => reaction.emoji.name === '⚔' && !user.bot
  const collector = messageSend.createReactionCollector(filter, { max: 1, time: 3600*1000 })
  collector.on('collect', async (reaction, reason) => {
    let user = reaction.users.last()
    messageSend.delete()
    if(user.id == message.author.id) {
      let canceled = await messageSend.channel.send(`${matchcreator} Canceled match searching!`)
      setTimeout(() => { canceled.delete() }, 5000)
      return
    }
    let notified = await messageSend.channel.send(`**${user.username+'#'+user.discriminator}** Notified ${matchcreator} that a match is awaiting them!`)
    message.author.send(`Looks like you found a match in **Helmet Competitive** . Against **${user.username+'#'+user.discriminator}**`)

    setTimeout(() => { notified.delete() }, 5000)
  })
  collector.on('end', async (reaction, reason) => {
    messageSend.delete()
  })
}