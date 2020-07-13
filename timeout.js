require('dotenv').config();
var fs = require("fs");
var data = require('./params.json');
const { stringify } = require('querystring');
const { writeFile } = require('fs');
const Discord = require('discord.js');
const { TIMEOUT } = require('dns');
const client = new Discord.Client();
let commandPrefix = data.commandPrefix
const token = process.env.TOKEN;
console.log(token)

client.on('ready', ()=> {
    console.log("Server Connection established, loged in as " + client.user.tag)

    client.user.setActivity("Crunchyroll", {type: "WATCHING"})
    for(let i = 0; i < data.timedOutUsers.length; i++){
        console.log(data.timedOutUsers[i].id + "\n")
     };
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
    
    if(primarycommand === "timeout"){
        timeoutuser(receivedMessage, arguments)
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
    
    saveData(data)
}

function saveData(data)
{
    writeFile('params.json', JSON.stringify(data), (err) => { 
        if (err) throw err; 
    })
}

client.login(token);