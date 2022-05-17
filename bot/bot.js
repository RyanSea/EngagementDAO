const {
    bot, 
    engagement, 
    token, 
    ethers,  
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

var qr = require('qr-image');

const myEoa = '0x44B269491f4ed800621433cd79bCF62319593C9e'

var qr_png
wcProvider.connector.on("display_uri", async (err, payload) => {
    console.log(payload)
    let code = payload.params[0]
    qr_png = qr.image(code, { type: 'png' });
});

wcProvider.connector.on('session_request', async (err, payload) => {
    console.log("Session Request:", payload)
})

// wcProvider.connector.on('connect', async (err, payload) => {
//     console.log("Connect:", payload)
//     console.log("wallet", payload.params.accounts )
// })

bot.on('ready', async () => {
    console.log('Valu Bot Here!')
    
})

// wcProvider.connector.on("display_uri", async (err, payload) => {
//     //console.log("URI")
//     let code = payload.params[0]
//     //await QRCode.toFile('/Users/god/Desktop/Image/img.png', code)
//     var qr_png = qr.image(code, { type: 'png' });

   
// });



bot.on('messageCreate',async  msg => {
    let address, isAuthenticated, id, bal, profile, amount, name, symbol;

    if (msg.content.startsWith('!create')) {
       name =  msg.content.split(' ')[1]
       symbol = msg.content.split(' ')[2]

       if (!name && !symbol) {
           msg.reply('Please enter the command as `!create tokenName tokenSymbol`')
       } else {
            engagement.create(msg.guildId, name, symbol)
       }
    }

    if (msg.content.startsWith('!auth')) {
        id = msg.author.id;
        address = msg.content.split(' ')[1];
        if (!address) {
            msg.reply('Please enter your wallet address after the command e.g.: `!auth 0xaddress`')
        }
        isAuthenticated = false//await engagement.isAuthenticated(id)
        
        
        if(!isAuthenticated) {
            let tx = await engagement.authenticate(msg.guildId, id, address)
            await tx.wait();
            msg.reply('Done')
        } else {
            msg.reply('You\'re Already Authenticated!')
        }
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

    if (msg.content.startsWith('!unpower')) {
        amount = msg.content.split(' ')[1]
        if(isNaN(amount)) {
            msg.reply('Enter a valid number after the command e.g.: `!power 500`')
        } else {
            amount = ethers.utils.parseEther(amount)

            await engagement.powerDown(msg.author.id, amount)

            await msg.reply('Successfully powered down!')
        }
    }

    if(msg.content.startsWith('!test')) {
        // let message = await msg.reply('Please choose a provider')
        // await message.react('🔥');
        //await wcProvider.enable()
        await wcProvider.connector.createSession() 

        
        
        let qrCode = new MessageAttachment(qr_png)
        let qr = msg.reply({files: [qrCode]})
        wcProvider.connector.on('connect', async (err, payload) => {
            console.log("Connect:", payload)
            console.log("wallet", payload.params.accounts )
            console.log("Peer Meta", payload.params.peerMeta )

            await (await qr).edit({content: "Connected!", files: []})
        })
        // const embed = new MessageEmbed()
        //     .setColor('#0099ff')
        //     .setTitle('THIS WILL BE A WALLETCONNECT QR CODE')
        //     .setImage('/Users/god/Desktop/Image/img.png')

        
        // msg.reply({embeds: [embed]})
        //console.log(accounts)
        // let signer = new ethers.providers.Web3Provider(wcProvider);
        // const eng = new ethers.Contract('0x2B73f707689E6CD57DCcEAB781bF8F71689427F2', abi, signer.getSigner())
        // eng.authenticate('936681494401908756', accounts[0])
        // msg.reply("worked")
        //await wc_engagement.authenticate('814847668706082837', '0x6EE6D1DF5E2DccD784f7a4bf8eCE5Dbc1babBD45')
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

    if (msg.content.startsWith('!wallet')) {
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
    }

    if (msg.content.startsWith("?id")) {
        await msg.reply(msg.author.id)
    }

})

bot.on('interactionCreate', async interaction => {
	if (!interaction.isButton()) return;
	
    if(interaction.customId === "walletconnect") {

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('THIS WILL BE A WALLETCONNECT QR CODE')

             .setImage('https://files.peakd.com/file/peakd-hive/autocrat/23zk5xN4JWXkUqrmMEfTmsoC8wJn33zysKpSoeb32eqpiuCFFEW6BFqALLXE5E5f3v3dV.png')
    

        await interaction.message.edit({ content: '\u200b', components: [], embeds: [embed]})
    }
});

bot.on('messageReactionAdd', async (reaction, user) => {

    if(user.bot) return

    let engager = user.id

    let engagee = reaction.message.author.id;
    let msg = reaction.message;

    let engager_auth = await engagement.isAuthenticated(msg.guildId,engager)
    let engagee_auth = await engagement.isAuthenticated(msg.guildId,engagee)

    if(engager_auth && engagee_auth) {
        await engagement.engage(msg.guildId,engager, engagee)
    }
    
})

bot.login(ValuBot)