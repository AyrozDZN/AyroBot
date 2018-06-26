const Discord = require('discord.js');

const client = new Discord.Client();

var prefix = "!";

client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
    console.log("[AyrozDZN - BOT] Ready");
    client.user.setActivity("[Help: !help]");
});

client.on('message', message => {
    if (message.content === prefix + "help") {
        message.channel.bulkDelete(1)
        var help_embed = new Discord.RichEmbed()
        .setColor("#3E4E6B")
        .setTitle("Commande - HELP:")
        .setDescription("!Voici toute les commandes du bot")
        .addField("!help", "Afficher les commandes")
        .addField("!stats", "Affiche t'est stats en message privé")
        .addField("!info", "Affiche les infos du serveur et du bot")
        .addField("!clear <nombre>", "Supprime un nombre définie de message")
        .addField("!mute <membre>", "mute un membre dans le channel respectif")

        .addField("!kick <membre>", "Kick un membre")
        .addField("!ban <membre>", "ban un membre")
        .setFooter("AyrozDZN - BOT, menu help")
        message.channel.send(help_embed);
    }

    if (message.content === prefix + "reglement") {
        message.channel.bulkDelete(1)
        var regle_embed = new Discord.RichEmbed()
        .setColor("#3E4E6B")
        .setTitle("Reglement")
        .setDescription("!Voici le reglement du serveur")
        .addField("regle 1", "commentaire 1")
        .addField("regle 2", "commentaire 2")
        .addField("regle 3", "commentaire 3")
        .addField("regle 4", "commentaire 4")
        .addField("regle 5", "commentaire 5")
        .addField("regle 6", "commentaire 6")
        .addField("regle 7", "commentaire 7")
        .addField("regle 8", "commentaire 8")
        .addField("regle 9", "commentaire 9")
        .addField("regle 10", "commentaire 10")
        .setFooter("AyrozDZN - BOT, reglement")
        message.channel.send(regle_embed);
    }

    if (message.content === prefix + "info") {
        message.channel.bulkDelete(1)
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
        message.channel.bulkDelete(1)
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
        message.channel.bulkDelete(1)
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
        message.channel.bulkDelete(1)
        if (!message.guild.member(message.author).hasPermission("MANAGE_MESSAGES")) return message.channel.send("```diff\n- Vous n'avez pas la permission de clear des messages dans se channel\n```");

        let args = message.content.split(" ").slice(1);

        if (!args[0]) return message.channel.send("```diff\n- Tu dois préciser un nombre de message a supprimé\n```")
        message.channel.bulkDelete(args[0]).then(() => {
            message.channel.send(`**__${args[0]} message on été supprimés !__**`);
        })
    }
    
    if(message.content.startsWith(prefix + "mute")) {
        message.channel.bulkDelete(1)
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
        var msgId = message.author.id;

        var stats_embed = new Discord.RichEmbed()
        .setColor("#3E4E6B")
        .setTitle("Commande - STATS:")
        .setDescription("Voici la description de ton compte discord")
        .addField('Pseudo : ', `${message.author.username}`)
        .addField("Id : ", msgId, true)
        .addField("Date de création : ", userCreateDate[1] + " " + userCreateDate[2] + " " + userCreateDate[3])
        .setThumbnail(message.author.avatarURL)
        .setFooter("AyrozDZN - BOT, menu stats")
        message.author.send({embed: stats_embed});
        message.reply("Vous avez reçu vos statistiques en message privé !")
        
        break;
    }
});
