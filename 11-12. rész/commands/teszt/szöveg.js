const Discord = require("discord.js");
module.exports = {
    name: "szöveg",
    catgory: "teszt",
    description: "Szöveg kiíratása bottal.",
    run: async (bot, message, args) => {
    let szöveg = args.join(" ");

    if(szöveg) {
        let dumaEmbed = new Discord.MessageEmbed()
    .setColor("#98AA12")
    .setAuthor(message.author.username)
    .addField("Szöveg:", szöveg)
    .setFooter(`${botname} | ${message.createdAt}`)

    message.channel.send(dumaEmbed)
    } else {
        message.reply("írj szöveget!")
    }
}
}