var fs = require("fs");
var data = require('./params.json')
const { stringify } = require('querystring');
const { writeFile } = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
let commandPrefix = data.commandPrefix

client.on('ready', ()=> {
    console.log("Server Connection established, loged in as " + client.user.tag)

    client.user.setActivity("Crunchyroll", {type: "WATCHING"})

    client.guilds.cache.forEach((guild) => {
        console.log(guild.name);

        guild.channels.cache.forEach((channel)=>{
            console.log(` - ${channel.name} ${channel.type} ${channel.id}`);
        }) 
    })
    
})

client.on('message', (receivedMessage) => {
    if(receivedMessage.author == client.user){
        return
    }
    if(receivedMessage.content.startsWith(commandPrefix)){
        parseCommand(receivedMessage)
    }
    if(receivedMessage.content.startsWith("w.shutdown") && receivedMessage.author.id == receivedMessage.guild.ownerID){
        receivedMessage.channel.send("Good bye")
        process.kill(0)
    }
})

function parseCommand(receivedMessage){
 let fullCommand = receivedMessage.content.substr(commandPrefix.length)
 let splitCommand = fullCommand.split(" ")
 let primarycommand = splitCommand[0]
 let arguments = splitCommand.slice(1)
    
    if(primarycommand === "help"){
        helpDesk(arguments, receivedMessage)
    }
    
    if(primarycommand === "setprefix"){
        setPrefix(arguments, receivedMessage)
    }

    if(primarycommand === "user"){
        console.log(receivedMessage.author)
    }

    if(primarycommand === "setadmin"){
        data.admin.push(receivedMessage.author.id)
        saveData(data)
        receivedMessage.channel.send(data.admin)
    }
}

function helpDesk(arguments, receivedMessage){
    const embed = new Discord.MessageEmbed()
    embed.setTitle("Help")
    embed.setColor(0xFF0059)
    embed.setDescription("Commands:\n\n\tsetprefix [prefix to change to]"
    +"\n\thelp [command] for extened description\n")
    receivedMessage.channel.send(embed)
}


function setPrefix(arguments, receivedMessage){
    if(arguments.length === 0){
        receivedMessage.channel.send("No argument provided, pls use " + commandPrefix + "help to see all available commands")
    }
    else{
        console.log(arguments)
        data.commandPrefix = arguments.toString()
        console.log(data.commandPrefix)
        saveData(data)
        commandPrefix = data.commandPrefix
        receivedMessage.channel.send("Command prefix changed to: "+ data.commandPrefix)
    }
}

function saveData(data)
{
    writeFile('params.json', JSON.stringify(data), (err) => { 
        if (err) throw err; 
    })
}

client.login(data.token);