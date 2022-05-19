const {privateKey, polygon, ValuBot} = require('../../config/config.json')
const dao_abi = require('../../config/ValuDAO.json').abi
const token_abi = require('../../config/Token.json').abi;

const {ethers, providers} = require('ethers');
const WalletConnectProvider = require("@walletconnect/web3-provider");

const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton, MessageAttachment} =  require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES] });

const provider = new ethers.providers.JsonRpcProvider(polygon);
const signer = new ethers.Wallet(privateKey, provider);

const wcProvider = new WalletConnectProvider.default({
    rpc: {
        80001: polygon // http:// polygon_mumbai Alchemy url
    },
    qrcode: false
})
const wcSigner = new ethers.providers.Web3Provider(wcProvider);

const engagement = new ethers.Contract('0x080966fFFE70C16E6d3eaD241F8E418A35Efc6ee', dao_abi, signer)
const token = new ethers.Contract('0x621e900eF9A39c4D84cDd20E5A847Fe095DC7778', token_abi, signer)

// const wc_engagement = new ethers.Contract('0x2B73f707689E6CD57DCcEAB781bF8F71689427F2', engagement_abi, wcSigner.getSigner())
// const wc_token = new ethers.Contract('0xEF3a2AB776E7d82ba07Eb594fB3Ce280cfcFb7f6', token_abi, wcSigner.getSigner())


exports.bot = bot;
exports.engagement = engagement
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