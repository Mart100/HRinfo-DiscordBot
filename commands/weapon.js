const Discord = require('discord.js')
const HRIapi = require('./scripts/HRIapi.js')

module.exports = async (message) => {
  let p = process.env.prefix
  let args = message.content.toLowerCase().split(' ')
  let weapons = await HRIapi.getWeapons()
  let weapon
  let weaponArg = args[1]

  // find gun
  for(let i in weapons) if(weapons[i].name.toLowerCase().includes(weaponArg)) weapon = weapons[i]

  if(weapon == undefined) return message.channel.send(`Gun not found, Use ${p}weapon \`<weaponName>\` `)

  let info = `
    **Name:** ${weapon.name}
    **Damage:** ${weapon.damage}
    **Type:** ${weapon.type}
    **Rarity:** ${weapon.rarity}
    **Magazine** ${weapon.magazine}
  `

  if(weapon.pellets != undefined) info += `**Pellets:** ${weapon.pellets}`

  
  let Embed = new Discord.RichEmbed()
    .setAuthor('HRinfo', 'https://i.imgur.com/yUVsTLb.png')
    .addField('Info:', info)
    .setThumbnail(weapon.image)
    .setColor('#42BEAD')
  message.channel.send(Embed)
}