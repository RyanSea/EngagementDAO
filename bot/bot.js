const {bot, engagement, token, hermes} = require('./utils/initialize.js')

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
        await engagement.authenticate(id, address)
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
        profile = await engagement.user(msg.author.id)
        address = profile.eoa
        console.log(address)
        bal = Number(await engagement.balanceOf(address)) / 10 ** 18
        msg.reply(`You have ${String(bal)} tokens powered up`)
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

    await engagement.engage(engager, enagee)
})

bot.login(hermes)