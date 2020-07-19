var fs = require("fs");
const { stringify } = require('querystring');
const { writeFile } = require('fs');
const { Console } = require("console");

//Bot variables
const Discord = require('discord.js');
const client = new Discord.Client();
const waifu = require('./waifuCommands')

//json files
const params = require('./params.json');
const users = require('./users.json');


function registerWeeb(userId)
{ 
    
    let userExists = false;
    for(let i = 0; i < users.length; i++)
    {
        if(users[i].id === userId)
        {
            userExists = true;
        }
    }

    if(userExists){
        console.log("User already exists in the registry")
    }   
    else{
        users.push(
            {
                "id": userId.toString(),
                "favWaifu":"", 
                "waifuImg":"",
                "weebCoins":0,
                "weebPoints":0,
                "ownedWaifus":[]
            }
        )
        saveFile(users, 'users')
    }
    return userExists;
}


function userProfile(receivedMessage){
    const prfileEmbed = new Discord.MessageEmbed()

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


exports.registerWeeb = registerWeeb;