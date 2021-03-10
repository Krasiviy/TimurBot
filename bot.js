const Discord = require('discord.js')
const config = require('./config.json')
const axios = require('axios');
const weather = `api.openweathermap.org/data/2.5/weather?q=Astana&appid=4a3cb282c11a035ca85a313fe8afdf01&lang=ru&units=metric`
const ytdl = require('ytdl-core')
const client = new Discord.Client()

client.on("ready" , () => {
    console.log("Я готов!");
    client.user.setStatus("online"); // Устанавливаекм статус, один из: dnd (красный), idle (оранжевывй) , online (зеленый) , invisible (нивидимка)
    client.user.setActivity("Арсен лох",{type:"STREAMING",url:"https://www.twitch.tv/destroyteamproject"}) // вместо Minecraft - пишем во что играет / слушает / смотрит / стримит бот ; вместо STREAMING можно записать WATCHING (смотрит) / LISTENING (слушает) / PLAYING (играет); Если бот стримит - тогда нужно вписать url *TWITCH* стрима , если нет - убрать этот параметр вместе с запятой перед ним
});
//Переменные для музыкальной части
let connection;
let dispatcher;
let playlist = [];

const prefix = '!'
client.on('message', async message => {
    if(message.author.bot) return;
    if(!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length)
    const args = commandBody.split(' ')
    const command = args.shift().toLowerCase()

    if(command === 'ping') {
        const timeTaken = Date.now() - message.createdTimestamp;

        message.reply(`Время отправки ответа - ${timeTaken}`)
    }

    else if (command === 'sum') {
        const newArgs = args.map(arg => parseFloat(arg))
        const sum = newArgs.reduce((a,b) => a + b)
        message.reply(`Я вычислил сумму. Сумма равна - ${sum}. Ебать я математик!`)
    }

    else if(command === 'weather') {
        const data = await getDataWeather()
            .then(res => res)
        message.reply(`Текущая погода: 
        Город: ${data.name},
        Температура: ${data.main.temp},
        Облачность: ${data.clouds.all}%,
        Скорость ветра: ${data.wind.speed},
        Регион: ${data.sys.country},
        ID города: ${data.id}
        `)
    }

    else if (command === 'play') {
        if (message.member.voice.channel) {
            playlist.push(args[0])
            connection = await message.member.voice.channel.join();
            playlist.forEach(track => {
                dispatcher = connection.play(ytdl(track, { filter: 'audioonly' }));
                dispatcher.setVolume(0.5);
                dispatcher.on('finish', () => {
                    console.log('Finished playing!');
                    dispatcher.destroy();
                });
            })
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }

    else if (command === 'stop') {
        dispatcher.pause();
    }

    else if(command === 'resume') {
        dispatcher.resume();
    }

})

async function getDataWeather() {
    return await axios.get(`https://${weather}`)
        .then(response => response.data)
}
client.on('message', function(message) {
    if (message.content === "+timur") {
        var interval = setInterval (function () {
            message.channel.send(`<@${"501411344571039754"}> здравствуй уважаемый тимур! Как дела?`)
                .catch(console.error);
        }, 1 * 1000);
    }
});
client.on('message', function(message) {
    if (message.content === "+arsen") {
        var interval = setInterval (function () {
            message.channel.send(`<@${"382930217703833600"}> Саламчик Арсенчик! Как дела?`)
                .catch(console.error);
        }, 1 * 1000);
    }
});
client.on("message", (message) =>{
    if (message.content.startsWith("приветик")){
        message.channel.send("ку-ку "+ message.author.username)
    }

    if (message.content === "help pls"){
        message.member.send("здраствуй")
    }

    if (message.content === "hi"){
        if (message.author.bot) return
        message.reply("qq")
    }

    if(message.content.endsWith("embed")) {
        var embed = new Discord.MessageEmbed()
            .setTitle("Timur Bot")
            .setAuthor("Timur Bot","https://cdn.discordapp.com/attachments/605693464151064577/607822241505214474/giphy_9.gif")
            .setURL("https://discord.gg/xEc3GJpXcC")
            .setDescription(`[Timur Bot](https://discord.gg/xEc3GJpXcC) Timur Bot`)
            .setColor("#ff0000")

            .addField( "кравать"   ,"колонка")
            .addField( "я апельсин"   ,"клавиатура")
            .addField( "я апельсин"   ,"клавиатура")

            .setFooter(message.author.tag , message.author.avatarURL)
            .setThumbnail("https://cdn.discordapp.com/attachments/605693464151064577/607822241505214474/giphy_9.gif")
            .setImage("https://cdn.discordapp.com/attachments/605693464151064577/607822361055592452/Minecraft-slime-600x398_1541817_3917463_lrg.jpg")
        message.channel.send(embed) // отправление сообщения
    }

    if(message.content == "другой канал"){
        client.channels.cache.get("774181241893158916").send("сообщение отправленно в другой канал.")
    }

    if(message.content.startsWith("setChannel 123")){
        var channelMention = message.mentions.channels.first();
        var msgArray = message.content.split(" ")
        var channel = msgArray[3-1] //
        var channelObj = channel?client.channels.cache.find(ch=> ch.name==channel):false;
        if(channel && channelObj){
            message.channel.send("Установлен "+channel+" канал");
            settedChannel = channelObj.id;
        } else if(channelMention){
            message.channel.send("Установлен "+channelMention+" канал (по упомянанию)");
            settedChannel = channelMention.id;
        } else {
            message.channel.send("Вы не указали существующий канал!")
        }
    }

    if(message.content == "send to channel"){
        client.channels.cache.find(e=>e.id == settedChannel).send("сообщение отправленно в другой канал!")
    }
    //new-channel

    if(message.content.startsWith("setChannel (mention)")){
        var channelMention = message.mentions.channels.first();
        if(channelMention){
            message.channel.send("Установлен "+channelMention+" канал (по упомянанию)");
            settedChannelMention = channelMention.id;
        } else {
            message.channel.send("Вы не указали существующий канал!")
        }
    } // settedChannelMention

    if(message.content.toLowerCase().startsWith("getrole")){
        var msgArray = message.content.split(" ")
        var role = msgArray.slice(1).join(" ") //
        var roleObj = role?message.guild.roles.cache.find(ch=> ch.name==role):false;
        if(roleObj){
            if(roleObj.position < message.member.roles.highest.position){
                if(message.guild.me.roles.highest.position > roleObj.position && message.guild.me.hasPermission("ADMINISTRATOR"))
                    message.member.roles.add(roleObj)
                else message.channel.send("У меня нет прав")
            } else message.channel.send("Вы не имете прав выдать себе эту роль!")
        } else{
            message.channel.send("Вы не указали роль!")
        }
    }
})

client.on("guildMemberAdd",member=>{
    var embed = new Discord.MessageEmbed()
        .setTitle("Новый пользователь!")
        .setDescription(`Привет , ${member}`)
        .setImage(member.user.displayAvatarURL())
    client.channels.cache.get("819165209125584926").send(embed); // "Привет , " + member
    member.send("Спасибо что зашел! :)");
    member.roles.add(member.guild.roles.cache.find(r=>r.name == "welcome start role")); // member.roles.add("734856997631033375")
})

client.on("guildMemberRemove",member=>{
    var embed = new Discord.MessageEmbed()
        .setTitle("Пользователь ушел!")
        .setDescription(`${member.user.tag} покинул нас!`)
        .setImage(member.user.displayAvatarURL())
    client.channels.cache.get("819165209125584926").send(embed); // "Привет , " + member
})

client.on("voiceStateUpdate",(oldState,newState)=>{
    var categoryid = "813805551917727766";
    var channelid = "819164799299747891";

    if(newState.channel?.id == channelid){
        newState.guild.channels.create(`${newState.member.user.username}'s channel`,{
            type:"voice",
            parent:categoryid,
            permissionOverwrites:[{
                id:newState.member.id,
                allow: ["MANAGE_CHANNELS"]
            },{
                id:newState.guild.id,
                deny:["MANAGE_CHANNELS"]
            }]
        }).then(channel=>{
            newState.setChannel(channel)
            channel.createInvite({
                maxAge:0,
                maxUses:0
            }).then(inv=>newState.member.send(inv.toString()))
        })
    }
    if(oldState.channel?.id != channelid && oldState.channel?.parent?.id == categoryid && !oldState.channel?.members.size) oldState.channel.delete();
})

client.login(config.BOT_TOKEN)