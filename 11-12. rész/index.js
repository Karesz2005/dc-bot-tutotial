const Discord = require("discord.js");
const tokenfile = require("./tokenfile.json");
const botconfig = require("./botconfig.json");
const bot = new Discord.Client({disableEveryone: true});
var weather = require('weather-js');
const superagent = require('superagent');
const randomPuppy = require('random-puppy');

const fs = require("fs");
const ms = require("ms");
const money = require("./money.json");
const { error } = require("console");
const { attachCookies } = require("superagent");


//////////////////////////////////////////////////////////
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

bot.categories = fs.readdirSync("./commands/");

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(bot)
});

bot.on("message", async message => {
    let prefix = botconfig.prefix;

    if(message.author.bot) return;
    if(!message.guild) return;
    if(!message.content.startsWith(prefix)) return;
    if(!message.member) message.member = await message.guild.fetchMember(message)

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if(cmd.length === 0) return;

    let command = bot.commands.get(cmd);
    if(!command) command = bot.commands.get(bot.aliases.get(cmd));

    if(command)
    command.run(bot, message, args);
});

//////////////////////////////////////////////////////////////////////////////////////
 


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

    if(message.author.bot) return;
    if(message.channel.type === "dm") return;





////////////////|| ECONOMY ||/////////////////////

    if(!money[message.author.id]) {
        money[message.author.id] = {
            money: 100,
            user_id: message.author.id

        };
    }
    fs.writeFile("./money.json", JSON.stringify(money), (err) => {
        if(err) console.log(err);
    });
    let selfMoney = money[message.author.id].money;


    if(cmd === `${prefix}freeMoney`){
        message.channel.send("600FT ot kaptál!")

        money[message.author.id] = {
            money: selfMoney + 600,
            user_id: message.author.id
        }
    }

    if(message.guild){
        let drop_money = Math.floor(Math.random()*50 + 1)
        let random_money = Math.floor(Math.random()*900 + 1)

        if(drop_money === 2){
            let üzenetek = ["Kiraboltál egy csövest.", "Elloptál egy biciklit!", "Kiraboltál egy boltot!"]
            let random_üzenet_szam = Math.floor(Math.random()*üzenetek.length)

            let DropMoneyEmbed = new Discord.MessageEmbed()
            .setAuthor(message.author.username)
            .addField("Szerencséd volt!", `${üzenetek[random_üzenet_szam]} Ezért kaptál: ${random_money}FT-ot!`)
            .setColor("RANDOM")
            .setThumbnail(message.author.displayAvatarURL())

            message.channel.send(DropMoneyEmbed);

            money[message.author.id] = {
                money: selfMoney + 600,
                user_id: message.author.id
            }

        }
    }

    if(cmd === `${prefix}shop`){
        let ShopEmbed = new Discord.MessageEmbed()
            .setAuthor(message.author.username)
            .setDescription(`${prefix}vasarol-vip (ÁR: 500FT)`)
            .setColor("RANDOM")
            .setThumbnail(bot.user.displayAvatarURL())

            message.channel.send(ShopEmbed);
    }


    if(cmd === `${prefix}vasarol-vip`){
        let viprang_id = "812622030855077928"

        let price = "500";
        if(message.member.roles.cache.has(viprang_id)) return message.reply("*Ezt a rangot már megvetted!*");
        if(selfMoney < price) return message.reply(`Erre a rangra nincs pénzed! Egyenleged: ${selfMoney}FT.`)

        money[message.author.id] = {
            money: selfMoney - parseInt(price),
            user_id: message.author.id
        }

        message.guild.member(message.author.id).roles.add(viprang_id);

        message.reply("**Köszönöm a vásárlást! További szép napot!**")

    }

    if(cmd === `${prefix}slot`){
        let min_money = 50;
        if(selfMoney < min_money) return message.reply(`Túl kevés pénzed van! (Minimum ${min_money}FT-nak kell lennie a számládon!) Egyenleged: ${selfMoney}.`)

        let tét = Math.round(args[0] *100)/100
        if(isNaN(tét)) return message.reply("Kérlek adj meg egy összeget! (Pl: 5)")
        if(tét > selfMoney) return message.reply("az egyenlegeednél több pénzt nem rakhatsz fel a slotra!")

        let slots = ["🍌", "🍎", "🍍", "🥒", "🍇"]
        let result1 = Math.floor(Math.random() * slots.length)
        let result2 = Math.floor(Math.random() * slots.length)
        let result3 = Math.floor(Math.random() * slots.length)

        if(slots[result1] === slots[result2] && slots[result3]){
            let wEmbed = new Discord.MessageEmbed()
            .setTitle('🎉 Szerencse játék | slot machine 🎉')
            .addField(message.author.username, `Nyertél! Ennyit kaptál: ${tét*1.6}ft.`)
            .addField("Eredmény:", slots[result1] + slots[result2] + slots[result3])
            .setColor("RANDOM")
            .setTimestamp(message.createdAt)
            .setFooter(botname)
            message.channel.send(wEmbed)
            
            money[message.author.id] = {
                money: selfMoney + tét*1.6,
                user_id: message.author.id
            }
        } else {
            let wEmbed = new Discord.MessageEmbed()
            .setTitle('🎉 Szerencse játék | slot machine 🎉')
            .addField(message.author.username, `Vesztettél! Ennyit buktál: ${tét}ft.`)
            .addField("Eredmény:", slots[result1] + slots[result2] + slots[result3])
            .setColor("RANDOM")
            .setTimestamp(message.createdAt)
            .setFooter(botname)
            message.channel.send(wEmbed)
            
            money[message.author.id] = {
                money: selfMoney - tét,
                user_id: message.author.id
            }
        }
    }


    if(cmd === `${prefix}lb`){
        let toplist = Object.entries(money)
        .map(v => `${v[1].money}FT <@${v[1].user_id}>`)
        .sort((a, b) => b.split("FT")[0] - a.split("FT")[0])
        .slice(0, 10)

        let LbEmbed = new Discord.MessageEmbed()
        .setTitle("Leaderboard")
        .setColor("RANDOM")
        .addField("Pénz top lista | TOP10", toplist, true)
        .setTimestamp(message.createdAt)
        .setFooter(botname)

        message.channel.send(LbEmbed)
    }

    if(cmd === `${prefix}pay`){
        let pay_money = Math.round(args[0]*100)/100
        if(isNaN(pay_money)) return message.reply(`A parancs helyes használata: ${prefix}pay <összeg> <@név>`)
        if(pay_money > selfMoney) return message.reply("az egyenlegednél több pénzt nem adhatsz meg!")

        let pay_user = message.mentions.members.first();

        if(args[1] && pay_user){
            if(!money[pay_user.id]) {
                money[pay_user.id] = {
                    money: 100,
                    user_id: pay_user.id
                }
            }

            money[pay_user.id] = {
                money: money[pay_user.id].money + pay_money,
                user_id: pay_user.id
            }

            money[message.author.id] = {
                money: selfMoney - pay_money,
                user_id: message.author.id
        }

        message.channel.send(`Sikeresen átutaltál <@${pay_user.id}> számlájára ${pay_money}FT-ot!`)

        fs.writeFile("./money.json", JSON.stringify(money), (err) => {
            if(err) console.log(err);
        });
    } else {
        message.reply(`A parancs helyes használata: ${prefix}pay <összeg> <@név>`)
    }
}

if(cmd === `${prefix}work`){
    let cd_role_id = "817453982376656996";
    let cooldown_time = "10"; //mp

    if(message.member.roles.cache.has(cd_role_id)) return message.reply(`Ezt a parancsot ${cooldown_time} percenként használhatod!`)

    message.member.roles.add(cd_role_id)

    let üzenetek = ["Jó munkát végeztél!", "A főnököd adott egy kis borravalót!"]
    let random_üzenet_szam = Math.floor(Math.random()*üzenetek.length)

    let random_money = Math.floor(Math.random()*1900 +1)

    let workEmbed = new Discord.MessageEmbed()
    .setTitle("Munka!")
    .addField(`${üzenetek[random_üzenet_szam]}`, `A számládhoz került: ${random_money}FT!`)
    .setColor("RANDOM")
    .setTimestamp(message.createdAt)
    .setFooter(botname)
    message.channel.send(workEmbed)

    money[message.author.id] = {
        money: selfMoney + random_money,
        user_id: message.author.id
}

setTimeout(() => {
    message.member.roles.remove(cd_role_id)
}, 1000 * cooldown_time)
}


    ///////////////////|| ECONOMY ||//////////////////////


    /////////////////////////////////
    //// LOGIKAI OPERÁTOROK TIPP ////
    //////////////////////////////////////////////////////////
    //                                                      //
    //   || vagy , PL: if(X=1 || X=3)                       //
    //                                                      //
    //   && és , PL: if(X=5 && Y=3)                         //
    //                                                      //
    //   = sima egyenlő jel , PL: if(5=5)                   //
    //   ==  egyenlő jel , PL: if(X==5)                     //
    //   >= nagyobb vagy egyenő , PL: if(X >= 3)            //
    //   <= kisebb vagy egyenlő , PL: if(X <= 3)            //
    //   ! tagadás , PL if(X != 2)                          //
    //                                                      //
    //////////////////////////////////////////////////////////

    

})

fs.writeFile("./money.json", JSON.stringify(money), (err) => {
    if(err) console.log(err);
});




bot.login(tokenfile.token);
