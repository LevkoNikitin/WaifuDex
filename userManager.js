var fs = require("fs");
const { stringify } = require('querystring');
const { writeFile } = require('fs');
const { Console } = require("console");

//Bot variables
const Discord = require('discord.js');
const client = new Discord.Client();
const waifu = require('./userManager')

//json files
let params = require('./data/params.json');
let users = require('./data/users.json');


//takes the user ID and checks the user json if the object with the id exists, if not, returns -1
function findUser(userId){
    users = require('./data/users.json');
    
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

//Adds a user to the user json file that allows the user to use all the data tracked commands
function registerWeeb(receivedMessage)
{ 
    users = require('./data/users.json');
    let userIndex = findUser(receivedMessage.author.id)
    if(userIndex >= 0){
        console.log("User already exists in the registry")
        receivedMessage.channel.send(" This user has already been registered")
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
        receivedMessage.channel.send("User has been added to the watch list")
    }
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


function listWaifus(receivedMessage)
{
    users = require('./data/users.json');
    userIndex = findUser(receivedMessage.author.id)
    let waifu
    const userWaifuList = new Discord.MessageEmbed()
        .setColor("#FFC700")
        .setTitle("This is a list of the waifus you own")
    
    if(users[userIndex].ownedWaifus.length > 0){
        for(i = 0; i < users[userIndex].ownedWaifus.length; ){
            waifu.concat(i,": ", users[userIndex].ownedWaifus[i],"\n");
        }
        userWaifuList.addField("Waifus:", waifu, true)
    }else{
        userWaifuList.addField("Waifus:", "You currently have not caught any waifus", true)
    }

    receivedMessage.channel.send(userWaifuList)
}


function saveFile(file, argument)
{   
    if(argument === 'params'){
    writeFile('data/params.json', JSON.stringify(file), (err) => { 
        if (err) throw err; 
    })}

    if(argument === 'users'){
        writeFile('data/users.json', JSON.stringify(file), (err) => { 
            if (err) throw err; 
    })}

    if(argument === 'waifus'){
        writeFile('data/waifus.json', JSON.stringify(file), (err) => { 
            if (err) throw err; 
    })}
}

exports.findUser = findUser;
exports.registerWeeb = registerWeeb;
exports.userProfile = userProfile;
exports.listWaifus = listWaifus;