

const express = require("express");
const app = express();

app.use(express.static("public"));

app.get("/", (request, response) => {
    console.log("Ping Recevied")
    response.send("DISCORD YT NOTIFIER")
});

const listener = app.listen(procces.env.PORT, () => {
    console.log("Your app is listening on port" + listener.address().port);
});


const Discord = require("discord.js");
const tokenfile = require("./tokenfile.json");
const botconfig = require("./botconfig.json");
const bot = new Discord.Client({disableEveryone: true});

let botname = "Teszt bot"

bot.on("ready", async() => {
    console.log(`${bot.user.username} elindult!`)

    let státuszok = [
        "Prefix: !",
        "Készítő: magyar games",
        "menő :D"
    ]

    setInterval(function() {
        let status = státuszok[Math.floor(Math.random()* státuszok.length)]

        bot.user.setActivity(status, {type: "WATCHING"})
    }, 3000)
})

bot.on("message", async message => {
    let MessageArray = message.content.split(" ");
    let cmd = MessageArray[0];
    let args = MessageArray.slice(1);
    let prefix = botconfig.prefix;

    if(cmd === `${prefix}hello`){
        message.channel.send("Szia");
    }


    if(cmd === `${prefix}teszt`){
        let TesztEmbed = new Discord.MessageEmbed()
        .setColor("#98AA12")
        .setAuthor(message.author.username)
        .setTitle("Teszt Embed!")
        .addField("Irodalom:", "Líra\n Epika\n dráma")
        .setThumbnail(message.author.displayAvatarURL())
        .setImage(message.guild.iconURL())
        .setDescription(`\`${prefix}\``)
        .setFooter(`${botname} | ${message.createdAt}`)

        message.channel.send(TesztEmbed)
    }

    if(cmd === `${prefix}szöveg`){
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
    
        const notifier = new YouTubeNotifier({
        hubCallback: '',
        secret: 'Something',
      });
       
      notifier.on('notified', data => {
        console.log('New Video');
        client.channels.cache.get("SERVER_CHANNEL_ID").send(
            `**{data.channel.name}** Feltöltött egy új videót! - **{data.video.link}**`
        )
        console.log(
          `${data.channel.name} just uploaded a new video titled: ${data.video.title}`
        );
      });
       
      notifier.subscribe('CHANNEL_ID');
      
      app.use("/yt", notifier.listener());

})


})




bot.login(tokenfile.token);
