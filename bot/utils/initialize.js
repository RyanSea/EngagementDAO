const {privateKey, polygon, arbitrum, ValuBot, hermes} = require('../../config/config.json')
const dao_abi = require('../../config/ValuDAO.json').abi
const token_abi = require('../../config/EngagementToken.json').abi;
const airdrop_abi = require('../../config/Airdrop.json').abi

const {ethers, providers} = require('ethers');
const WalletConnectProvider = require("@walletconnect/web3-provider");

const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton, MessageAttachment} =  require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES] });

/// POLYGON
const airdrop_address = '0x186995250F67f9Aa2EFa8B862A573d1c55e135d9'
const provider = new ethers.providers.JsonRpcProvider(polygon);
const signer = new ethers.Wallet(privateKey, provider);
const valu = new ethers.Contract('0xac22d58862eea98A7573DE3AbA56074BdfcEa871', dao_abi, signer)
const token = new ethers.Contract('0x3C67A0b36Cc82dD668baB8BEadC72D27612922ED', token_abi, signer)
const airdrop = new ethers.Contract(airdrop_address, airdrop_abi, signer)


/// ARBITRUM
const arbProvider = new ethers.providers.JsonRpcProvider(arbitrum);
const arbSigner = new ethers.Wallet(privateKey, arbProvider);
const arbValu = new ethers.Contract('0xf2016317bA673B1129C4421e5507356979a62042', dao_abi, arbSigner)

/// NERVOS

/// METER
const meterProvider = new ethers.providers.JsonRpcProvider("https://rpctest.meter.io/");
const meterSigner = new ethers.Wallet(privateKey, meterProvider);
const meterValu = new ethers.Contract('0xbeA719cD63915c6FF6679de2DAd5E7286B6bb80b', dao_abi, meterSigner)

/// ZKSYNC



const wcProvider = new WalletConnectProvider.default({
    rpc: {
        80001: polygon // http:// polygon_mumbai Alchemy url
    },
    qrcode: false
})
const wcSigner = new ethers.providers.Web3Provider(wcProvider);


// const wc_engagement = new ethers.Contract('0x2B73f707689E6CD57DCcEAB781bF8F71689427F2', engagement_abi, wcSigner.getSigner())
// const wc_token = new ethers.Contract('0xEF3a2AB776E7d82ba07Eb594fB3Ce280cfcFb7f6', token_abi, wcSigner.getSigner())


exports.bot = bot;
exports.valu = valu
exports.meterValu = meterValu;
exports.arbValu = arbValu;
exports.token = token;
exports.airdrop = airdrop;
exports.airdrop_address = airdrop_address
exports.hermes = hermes;
// exports.wc_engagement = wc_engagement;
// exports.wc_token = wc_token;
exports.ValuBot = ValuBot;
exports.MessageEmbed = MessageEmbed;
exports.wcSigner = wcSigner;
exports.ethers = ethers;
exports.wcProvider = wcProvider
//exports.abi = engagement_abi;
exports.MessageActionRow = MessageActionRow 
exports.MessageButton = MessageButton
exports.MessageAttachment = MessageAttachment;