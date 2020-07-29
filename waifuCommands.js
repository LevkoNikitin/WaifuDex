var fs = require("fs");
const { stringify } = require('querystring');
const { writeFile } = require('fs');
const { Console } = require("console");

//Bot variables
const Discord = require('discord.js');
const client = new Discord.Client();
const waifu = require('./waifuCommands')

//json files
let params = require('./params.json');
let users = require('./users.json');

//Adds a user to the user json file that allows the user to use all the data tracked commands
function registerWeeb(userId)
{ 
    users = require('./users.json');
    let userIndex = findUser(receivedMessage.author.id)
    if(userIndex >= 0){
        console.log("User already exists in the registry")
    }   
    else{
        users.push(
            {
                "id": userId.toString(),
                "favWaifu":"", 
                "waifuImg":"./waifus/noWaifuSet.jpg",
                "waifuImgAbrv": "noWaifuSet.jpg",
                "weebCoins":0,
                "weebPoints":0,
                "ownedWaifus":[]
            }
        )
        saveFile(users, 'users')
    }
    return userExists;
}

//takes the user ID and checks the user json if the object with the id exists, if not it returns -1
function findUser(userId){
    users = require('./users.json');
    
    let userIndex = -1;
    for(let i = 0; i < users.length; i++)
    {
        if(users[i].id === userId)
        {
            userIndex = i;
        }
    }
    return userIndex;
}

function userProfile(receivedMessage){

    let userIndex = findUser(receivedMessage.author.id)
    if(userIndex === -1)
    {
        return
    }
    const profileEmbed = new Discord.MessageEmbed()
        .setTitle( receivedMessage.author +" Profile")
        .setColor("#FFC700")
        .setAuthor('WifuDex')
        .setDescription('Here is your dirty weeb registry profile')
        .attachFiles([users[userIndex].waifuImg])
        .setImage('attachment://'+ users[userIndex].waifuImgAbrv)
        .addFields(
            { name: 'Owned Waifus:', value: users[userIndex].ownedWaifus.length, inline: true },
            { name: 'Weeb Coins:', value: users[userIndex].weebCoins, inline: true },
            { name: 'Weeb Points:', value: users[userIndex].weebPoints, inline: true },
        )
        .setTimestamp()
    receivedMessage.channel.send(profileEmbed);
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
exports.findUser = findUser;
exports.userProfile = userProfile;