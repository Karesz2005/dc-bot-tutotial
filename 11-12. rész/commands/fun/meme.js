const Discord = require("discord.js");
const randomPuppy = require('random-puppy');
module.exports = {
    name: "meme",
    catgory: "Fun",
    description: "Lekér egy pacek mémet!",
    run: async (bot, message, args) => {
    const subreddits = ["dankmeme", "meme", "me_irl"]
    const random = subreddits[Math.floor(Math.random() * subreddits.length)]

    const IMG = await randomPuppy(random)
    const MemeEmbed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setImage(IMG)
    .setTitle(`Keresési szöveg: ${random} (KATT IDE!)`)
    .setURL(`https://www.reddit.com/r/${random}`)

    message.channel.send(MemeEmbed)
}
}