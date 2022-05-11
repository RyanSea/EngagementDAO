const {bot, engagement, token, hermes} = require('./utils/initialize.js')

// at the top of your file
const { MessageEmbed } = require('discord.js');



bot.on('ready', () => {
    console.log('Hermes is awakened!')
})

bot.on('messageCreate',async  msg => {
    let address, isAuthenticated, id, bal, profile, amount;

    if (msg.content.startsWith('!auth')) {
        id = msg.author.id;
        address = msg.content.split(' ')[1];
        if (!address) {
            msg.reply('Please enter your wallet address after the command e.g.: `!auth 0xaddress`')
        }
        isAuthenticated = await engagement.isAuthenticated(id)
        if(!isAuthenticated) {
            await engagement.authenticate(id, address)
        } else {
            msg.reply('You\'re Already Authenticated!')
        }
    }

    if (msg.content.startsWith('!embed')){
        // inside a command, event listener, etc.
        const exampleEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Some title')
        .setURL('https://discord.js.org/')
        .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
        .setDescription('Some description here')
        .setThumbnail('https://i.imgur.com/AfFp7pu.png')
        .addFields(
            { name: 'Regular field title', value: 'Some value here' },
            { name: '\u200B', value: '\u200B' },
            { name: 'Inline field title', value: 'Some value here', inline: true },
            { name: 'Inline field title', value: 'Some value here', inline: true },
        )
        .addField('Inline field title', 'Some value here', true)
        .setImage('https://i.imgur.com/AfFp7pu.png')
        .setTimestamp()
        .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

        msg.channel.send({ embeds: [exampleEmbed] });
    }

    if (msg.content.startsWith('!power')) {
        amount = msg.content.split(' ')[1]
        if(isNaN(amount)) {
            msg.reply('Enter a valid number after the command e.g.: `!power 500`')
        } else {
            await engagement.powerUp(msg.author.id, ethers.utils.parseEther(amount))
            await msg.reply('Successfully powered up!')
        }
    }

    if (msg.content.startsWith("?bal")) {
        profile = await engagement.user(msg.author.id)
        address = profile.eoa
        bal = Number(await token.balanceOf(address)) / 10 ** 18
        msg.reply(`You have ${String(bal)} tokens`)
    }

    if (msg.content.startsWith("?powered")) {

        if (msg.mentions.members.size == 1) {

        } else {
            profile = await engagement.user(msg.author.id)
            address = profile.eoa
            bal = Number(await engagement.balanceOf(address)) / 10 ** 18
            msg.reply(`You have ${String(bal)} tokens powered up`)
        }

    }

    if (msg.content.startsWith('?pool')) {
        let pool = Number(await engagement.rewardPool()) / 10 ** 18
        msg.reply(String(pool))
    }


    if (msg.content.startsWith('?auth')) {
        id = msg.author.id
        isAuthenticated = await engagement.isAuthenticated(id)
        if (isAuthenticated) {
            await msg.reply("Already Authenticated")
        } else {
            await msg.reply('Not Authenticated')
        }
    }

    if (msg.content.startsWith("?id")) {
        await msg.reply(msg.author.id)
    }

})

bot.on('messageReactionAdd', async (reaction, user) => {

    

    let engager = user.id

    let enagee = reaction.message.author.id;

    isAuthenticated = await engagement.isAuthenticated(engager)
    let isAuthenticated1 = await engagement.isAuthenticated(enagee)

    if(isAuthenticated1 && isAuthenticated) {
        await engagement.engage(engager, enagee)
    }

    
})

bot.login(hermes)