const Discord = require('discord.js')
const database = require('../scripts/database.js')

module.exports = (message) => {
  try {
    const args = message.content.split(" ").slice(1)
    const code = args.join(" ")
    let evaled = eval(code)
    if (typeof evaled !== "string") evaled = require("util").inspect(evaled)

    message.channel.send(clean(evaled), {code:"xl"})
  } catch (err) {
    message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``)
  }
}

function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else return text
}