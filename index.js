const Discord = require('discord.js');

const client = new Discord.Client();

var prefix = "!";

const ytdl = require('ytdl-core');

const queue = new Map();

var servers = {};


client.login(process.env.BOT_TOKEN);

function play(connection, message) {
  
    var server = servers[message.guild.id];
  
    server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));
  
    server.queue.shift();
  
    server.dispatcher.on("end", function() { 
    
        if (server.queue[0]) play(connection, message);
  
        else connection.disconnect();
  
    });
}

client.on('ready', () => {
    console.log("[AyrozDZN - BOT] Ready");
    client.user.setActivity(`]|[AyrozDZN : !help]|[`);
});

client.on('guildMemberAdd', member => {
    member.guild.channels.find("name", "accueil").send(`${member}, Bienvenue sur **AƳƦƠƵ**!`)
})

client.on('guildMemberRemove', member => {
    member.guild.channels.find("name", "accueil").send(`**${member.user.username}** à quitté **AƳƦƠƵ**. Au revoir **${member.user.username}**...`)
})
    
client.on('message', async message => {
    
    if (message.content === prefix + "help") {
        var help_embed = new Discord.RichEmbed()
        .setColor("#3E4E6B")
        .setTitle("Commande - HELP:")
        .setDescription("Voici toute les commandes du bot")
        .addField("!help", "Afficher les commandes")
        .addField("!stats", "Affiche t'est stats en message privé")
        .addField("!info", "Affiche les infos du serveur et du bot")
        .addField("!play <lien youtube>", "Lancer une musique youtube")
        .addField("!skip", "Passer à la musique suivante")
        .addField("!stop", "Stopper la musique")
        .addField("!clear <nombre>", "Supprime un nombre définie de message")
        .addField("!mute <membre>", "mute un membre dans le channel respectif")

        .addField("!kick <membre>", "Kick un membre")
        .addField("!ban <membre>", "ban un membre")
        .setFooter("AyrozDZN - BOT, menu help")
        message.channel.send(help_embed);
    }
  
    if (message.content === prefix + "info") {
        var info_embed = new Discord.RichEmbed()
        .setColor("#3E4E6B")
        .setTitle("Commande - INFO:")
        .setDescription("Voici les informations du serveur")
        .addField("BOT :", "Information du bot")
        .addField(":robot:Nom : ", `${client.user.tag}`)
        .addField(":id:Id", `${client.user.id}`)  
        .addField("Developpeur : ", "AyrozDZN")
        .addBlankField()
        .addField("Serveur :", "Information du serveur")
        .addField("Nombre de membres : ", `${message.guild.members.size}`)
        .addField("Nombre de salons et de catégories : ", `${message.guild.channels.size}`)
        .setFooter("AyrozDZN - BOT, menu info")
        message.channel.send(info_embed);
    }

    if (message.content.startsWith(prefix + "kick")) {
        if (!message.guild.member(message.author).hasPermission("KICK_MEMBERS")) return message.channel.send("```diff\n- Vous n'avez pas la permissions de kick des membres de se discord\n```");
    
        if(!message.guild.member(client.user).hasPermission("KICK_MEMBERS")) {
            return message.channel.send("```diff\n- je n'est pas la permission pour kick des membres\n```")
        }

        if (message.mentions.users.size === 0) {
            return message.channel.send("```diff\n- Vous devez mentionnez un membre\n```")
        }
        
        var kick = message.guild.member(message.mentions.users.first());
        if(!kick) {
            return message.channel.send("```diff\n- je ne sais pas si l'utilisateur existe !\n```")
        }

        kick.kick().then(member => {
            message.channel.send(`**__${member.user.username} à été kick par ${message.author.username}__**`);
        });

    }

    if (message.content.startsWith(prefix + "ban")) {
        if (!message.guild.member(message.author).hasPermission("BAN_MEMBERS")) return message.channel.send("```diff\n- Vous n'avez pas la permissions de ban des membres de se discord\n```");
    
        if(!message.guild.member(client.user).hasPermission("BAN_MEMBERS")) {
            return message.channel.send("```diff\n- Je n'est pas la permission pour ban des membres\n```")
        }

        if (message.mentions.users.size === 0) {
            return message.channel.send("```diff\n- Vous devez mentionnez un membre\n```")
        }
        
        var ban = message.guild.member(message.mentions.users.first());
        if(!ban) {
            return message.channel.send("```diff\n- Je ne sais pas si l'utilisateur existe !\n```")
        }

        ban.ban().then(member => {
            message.channel.send(`**__${member.user.username} à été ban par ${message.author.username}__**`);
        });

    }

    if (message.content.startsWith(prefix + "clear")) {
        if (!message.guild.member(message.author).hasPermission("MANAGE_MESSAGES")) return message.channel.send("```diff\n- Vous n'avez pas la permission de clear des messages dans se channel\n```");

        let args = message.content.split(" ").slice(1);

        if (!args[0]) return message.channel.send("```diff\n- Tu dois préciser un nombre de message a supprimé\n```")
        message.channel.bulkDelete(args[0]).then(() => {
            message.channel.send(`**__${args[0]} message on été supprimés !__**`);
            setTimeOut(Temps, 5000);
            function Temps() {
              message.channel.delete()
            }
        })
    }
    
    if(message.content.startsWith(prefix + "mute")) {
        if(!message.guild.member(message.author).hasPermission("MUTE_MEMBERS")) return message.channel.send("```diff\n- Vous n'avez pas la permission de mute un membre\n```");

        if(message.mentions.users.size === 0) {
            return message.channel.send("```diff\n- Vous devez mentionnez un membre\n```");
        }

        var mute = message.guild.member(message.mentions.users.first());
        if(!mute) {
            return message.channel.send("```diff\n- Je ne sais pas si l'utilisateur existe !\n```");
        }

        if(!message.guild.member(client.user).hasPermission("MUTE_MEMBERS")) return message.channel.send("```diff\n- Je n'est pas la permission pour mute des membres\n```");
        message.channel.overwritePermissions(mute, { SEND_MESSAGES: false}).then(member => {
            message.channel.send(`${mute.user.username} est mute !`);
        })
    }

    if(message.content.startsWith(prefix + "unmute")) {
        if(!message.guild.member(message.author).hasPermission("MUTE_MEMBERS")) return message.channel.send("```diff\n- Vous n'avez pas la permission de unmute un membre\n```");

        if(message.mentions.users.size === 0) {
            return message.channel.send("```diff\n- Vous devez mentionnez un membre\n```");
        }

        var mute = message.guild.member(message.mentions.users.first());
        if(!mute) {
            return message.channel.send("```diff\n- Je ne sais pas si l'utilisateur existe !\n```");
        }

        if(!message.guild.member(client.user).hasPermission("MUTE_MEMBERS")) return message.channel.send("```diff\n- Je n'est pas la permission pour unmute des membres\n```");
        message.channel.overwritePermissions(mute, { SEND_MESSAGES: true}).then(member => {
            message.channel.send(`${mute.user.username} n'est plus mute !`);
        })
    }

    if (!message.content.startsWith(prefix)) return;

    var args = message.content.substring(prefix.length).split(" ");

    switch (args[0].toLowerCase()) { 

        case "stats":

        var userCreateDate = message.author.createdAt.toString().split(" ");
        var msgauthor = message.author.id;

        var stats_embed = new Discord.RichEmbed()
        .setColor("#6699FF")
        .setTitle(`Statistiques du joueurs : ${message.author.username}`)
        .addField(`ID du joueurs :id:`, msgauthor, true)
        .addField(`Date d'inscription du joueur :`, userCreateDate[1] + ' ' + userCreateDate[2] + ' ' + userCreateDate[3])
        .setThumbnail(message.author.avatarURL)
        message.reply("Tu peux regarder tes messages privés !")
        message.author.send(stats_embed);

        break;
        
    case "play":

        if (!args[1]) {

        message.channel.send("Tu dois m’indiquer un lien YouTube"); 

        return;

    }

        if(!message.member.voiceChannel) {

        message.channel.send(":x: Tu dois être dans un salon vocal"); 

        return;

    }


        if(!servers[message.guild.id]) servers[message.guild.id] = {

        queue: []

    };


    var server = servers[message.guild.id];


    server.queue.push(args[1]);

    if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {

    play(connection, message) 

    });

    break; 

    case "skip":

        if(!message.member.voiceChannel) {

        message.channel.send(":x: Tu dois être dans un salon vocal"); 

        return;

    
    }   

        var server = servers[message.guild.id];

        if(server.dispatcher) server.dispatcher.end();

        break;

    case "stop":

        if(!message.member.voiceChannel) 
    
        return message.channel.send(":x: Tu dois être dans un salon vocal");

        message.member.voiceChannel.leave();

        break;
  
    }
});
