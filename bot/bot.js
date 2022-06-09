const {
    bot, 
    valu, 
    token, 
    ethers, 
    hermes, 
    authURL,
    wc_engagement, 
    wc_token, 
    wcSigner, 
    wcProvider,
    MessageActionRow, 
    MessageButton,
    MessageEmbed,
    MessageAttachment,
    //abi,
    ValuBot
} = require('./utils/initialize.js')

const {createSphere, tokenize} = require('./utils/utils')
const express = require('express');
const {defaultAbiCoder} = require('@ethersproject/abi')
const { keccak256 } =  require("@ethersproject/solidity")
var qr = require('qr-image');

const myEoa = '0xf5f0835DE49B6D288a180865014289A35D07c5e5'

var keyHolder = {

}

const mumbaiURL = "https://mumbai.polygonscan.com/token/"
//const arbitrumURL = "https://testnet.arbiscan.io/token/"
const meterURL = "https://scan-warringstakes.meter.io/address/"


var qr_png
wcProvider.connector.on("display_uri", async (err, payload) => {
    //console.log(payload)
    let code = payload.params[0]
    qr_png = qr.image(code, { type: 'png' });
});

wcProvider.connector.on('session_request', async (err, payload) => {
    console.log("Session Request:", payload)
})


bot.on('ready', async () => {
    console.log('Valu Bot Here!')
    
})


bot.on('messageCreate',async  msg => {
    let address, isAuthenticated, id, bal, profile, amount, name, symbol;

    if (msg.content.startsWith('!create')) {

        [name,symbol] = tokenize(msg.content)

        let tx = await valu.create(msg.guildId, name, symbol)
        
        
        let networkChan = msg.guild.channels.cache.find(channel => channel.name === "sphere-address")

        await tx.wait()
        let mumbaiSphere = (await valu.spheres(msg.guildId)).sphere
        await networkChan.send(`Mumbai: <${mumbaiURL + mumbaiSphere}>`) 
    }

    if (msg.content.startsWith('!auth')) {

        address = await valu.getAddress(msg.guildId, msg.author.id)

        //address !== ethers.constants.AddressZero
        if (true){
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('walletconnect')
                        .setLabel('WalletConnect')
                        .setStyle('PRIMARY')
                        .setEmoji('974755262567153675'),
                    new MessageButton()
                        .setCustomId('coinbase')
                        .setLabel('Coinbase')
                        .setStyle('PRIMARY')
                        .setEmoji('974754753475121162')
                );

            await msg.reply({ content: 'Choose wallet provider', components: [row] });
        } else {
            await msg.reply('Already authenticated!')
        }

    }
    if (msg.content.startsWith('!go')) {
        await valu.authenticate(msg.guildId,'794664562871238708', '0x9ecFca6B5dBE01772177F1b4fB660a063D17a7De')
    }

    if (msg.content.startsWith('!connectwallet')) {
        address = msg.content.split(' ')[1]
        console.log(address)

        if (!address) {
            msg.reply("Please enter address, formatted: `!connectwallet <address>`")
        } else {
            await valu.authenticate(msg.guildId, msg.author.id, address)
        }
    }

    if (msg.content.startsWith('!power')) {
        amount = msg.content.split(' ')[1]
        if(isNaN(amount)) {
            msg.reply('Enter a valid number after the command e.g.: `!power 500`')
        } else {
            await valu.powerUp(msg.author.id, ethers.utils.parseEther(amount))
            await msg.reply('Successfully powered up!')
        }
    }

    if (msg.content.startsWith('!unpower')) {
        amount = msg.content.split(' ')[1]
        if(isNaN(amount)) {
            msg.reply('Enter a valid number after the command e.g.: `!power 500`')
        } else {
            amount = ethers.utils.parseEther(amount)

            await valu.powerDown(msg.guildId, msg.author.id, amount, {gasLimit: 10000000})
            await msg.reply('Successfully powered down!')
        }
    }

   

    

})

bot.on('interactionCreate', async interaction => {
	if (!interaction.isButton()) return;
	
    if(interaction.customId === "walletconnect") {
        let id = interaction.member.id;

        await wcProvider.connector.createSession() 
        let qrCode = new MessageAttachment(qr_png)
        let msg = interaction.message;
        interaction.reply({content:"\u200b",files: [qrCode], components: [], ephemeral: true})

        wcProvider.connector.on('connect', async (err, payload) => {
            address = payload.params[0].accounts[0]
            await valu.authenticate(msg.guildId, id, address)
            await msg.edit({content: "Connected!", files: [], components: []})
            await wcProvider.disconnect()
        })
    }

    if(interaction.customId === "coinbase")  {
        let msg = interaction.message;
        msg.edit({content: "Follow Link", components: []})
        interaction.reply({content: authURL, ephemeral: true})
    }
});

bot.on('messageReactionAdd', async (reaction, user) => {

    if(user.bot) return

    let engager = user.id

    let engagee = reaction.message.author.id;
    let msg = reaction.message;

    let engager_auth = await valu.getAddress(msg.guildId,engager)
    let engagee_auth = await valu.getAddress(msg.guildId,engagee)
  
    if(engager_auth !== ethers.constants.AddressZero && ethers.constants.AddressZero !== engagee_auth) {
        await valu.engage(msg.guildId,engager, engagee)
    }
    
})

bot.login(ValuBot)