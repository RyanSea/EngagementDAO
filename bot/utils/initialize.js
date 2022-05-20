const {privateKey, polygon, arbitrum, ValuBot} = require('../../config/config.json')
const dao_abi = require('../../config/ValuDAO.json').abi
const token_abi = require('../../config/Token.json').abi;

const {ethers, providers} = require('ethers');
const WalletConnectProvider = require("@walletconnect/web3-provider");

const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton, MessageAttachment} =  require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES] });

/// POLYGON
const provider = new ethers.providers.JsonRpcProvider(polygon);
const signer = new ethers.Wallet(privateKey, provider);
const valu = new ethers.Contract('0x53Bf9c51daa15BC934EBfE48e1e1aBa432F6b777', dao_abi, signer)
const token = new ethers.Contract('0x621e900eF9A39c4D84cDd20E5A847Fe095DC7778', token_abi, signer)

/// ARBITRUM
const arbProvider = new ethers.providers.JsonRpcProvider(arbitrum);
const arbSigner = new ethers.Wallet(privateKey, arbProvider);
const arbValu = new ethers.Contract('0xf2016317bA673B1129C4421e5507356979a62042', dao_abi, arbSigner)

/// NERVOS

/// METER
const meterProvider = new ethers.providers.JsonRpcProvider("https://rpctest.meter.io/");
const meterSigner = new ethers.Wallet(privateKey, meterProvider);
const meterValu = new ethers.Contract('0xddCEf595097Dc130D19A9C59e1290509800fB03A', dao_abi, meterSigner)

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