require('dotenv').config();
var fs = require("fs");
var data = require('./params.json');
const { stringify } = require('querystring');
const { writeFile } = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
let commandPrefix = data.commandPrefix
const token = process.env.TOKEN;
console.log(token)

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
    for(let i = 0; i < data.timedOutUsers.length; i++){
        if(data.timedOutUsers[i].id === receivedMessage.author.id.toString()){
            receivedMessage.delete()
                .then(msg => console.log(`Deleted message from ${msg.author.username}`))
                .catch(console.error);
        } 
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

    if(primarycommand === "timeout"){
        timeoutuser(receivedMessage, arguments)
        receivedMessage.channel.send("User: " + arguments + " has been timedout for 10 years")
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
        saveFile(params, 'params')
        commandPrefix = data.commandPrefix
        receivedMessage.channel.send("Command prefix changed to: "+ data.commandPrefix)
    }
}

function timeoutuser(receivedMessage, arguments)
{
    console.log(arguments)
    let timeout = arguments.toString().slice(3,-1)
    console.log(timeout)
    if(receivedMessage.author.id == timeout)
    {
        console.log("!!!!!!")
    }
    data.timedOutUsers.push(
        {
            "time" : 10,
            "id" : timeout
        }
    )
    
    saveFile(params, 'params')
}

function saveFile(file, argument)
{   
    if(argument === 'params'){
    writeFile('params.json', JSON.stringify(file), (err) => { 
        if (err) throw err; 
    })}

    if(argument === 'users'){
        writeFile('users.json', JSON.stringify(file), (err) => { 
            if (err) throw err; 
    })}

    if(argument === 'waifus'){
        writeFile('waifus.json', JSON.stringify(file), (err) => { 
            if (err) throw err; 
    })}
}

client.login(token);