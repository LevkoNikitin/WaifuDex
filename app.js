require('dotenv').config();

var fs = require("fs");
const { stringify } = require('querystring');
const { writeFile } = require('fs');

//Bot variables
const Discord = require('discord.js');
const client = new Discord.Client();
const waifu = require('./waifuCommands');

//json files
const params = require('./params.json');
const users = require('./users.json');
const waifus = require('./waifus.json');

const { Console } = require("console");

//
let commandPrefix = params.commandPrefix
const token = process.env.TOKEN;

client.on('ready', ()=> {
    console.log("Server Connection established, loged in as " + client.user.tag)

    client.user.setActivity("Crunchyroll", {type: "WATCHING"})

    client.guilds.cache.forEach((guild) => {
        console.log(guild.name);

        //guild.channels.cache.forEach((channel)=>{
        //    console.log(` - ${channel.name} ${channel.type} ${channel.id}`);
        //}) 
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
    if(params.timedOutUsers.length > 0)
    {
        for(let i = 0; i < params.timedOutUsers.length; i++){
            if(params.timedOutUsers[i].id === receivedMessage.author.id.toString()){
                receivedMessage.delete()
                    .then(msg => console.log(`Deleted message from ${msg.author.username}`))
                    .catch(console.error);
            } 
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

    switch(primarycommand){
        case "help" : helpDesk(arguments, receivedMessage)
            break;
        case "setprefix" : setPrefix(arguments, receivedMessage)
            break;
        case "timeout" : {
            timeoutuser(receivedMessage, arguments)
            receivedMessage.channel.send("User: " + arguments + " has been timedout for 10 years")
            break;
        }
        case "registerweeb" || "rw":{
            let value = waifu.registerWeeb(receivedMessage.author.id)
            switch(value){
                case true: receivedMessage.channel.send("This weeb already exists in the registry")
                    break;
                case false: receivedMessage.channel.send(" Weeb("+receivedMessage.author.id+") has been added to the registry of sexual predators")
                    break;
            }
            break;
    }
        case "profile": waifu.userProfile(receivedMessage)
            break;


        
        default: commandError(receivedMessage)
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

function commandError(receivedMessage){
    receivedMessage.channel.send("The command you tried to use does not exist check the help desk by using " +
    "\""+ commandPrefix+"help\" to see a  list of all available commands")
}

function setPrefix(arguments, receivedMessage){
    if(arguments.length === 0){
        receivedMessage.channel.send("No argument provided, pls use " + commandPrefix + "help to see all available commands")
    }
    else{
        console.log(arguments)
        params.commandPrefix = arguments.toString()
        console.log(params.commandPrefix)
        saveFile(params, 'params')
        commandPrefix = params.commandPrefix
        receivedMessage.channel.send("Command prefix changed to: "+ params.commandPrefix)
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
    params.timedOutUsers.push(
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