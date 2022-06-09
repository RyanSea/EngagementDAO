const {privateKey, polygon, arbitrum, ValuBot, hermes} = require('../../config/config.json')
const dao_abi = require('../../config/ValuDAO.json').abi
const token_abi = require('../../config/EngagementToken.json').abi;
const airdrop_abi = require('../../config/Airdrop.json').abi
const { DefenderRelayProvider, DefenderRelaySigner } = require('defender-relay-client/lib/ethers');
const credentials = require('../../config/relay.json')

const {ethers, providers} = require('ethers');
const WalletConnectProvider = require("@walletconnect/web3-provider");

const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton, MessageAttachment} =  require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES] });

const authURL = "https://discord.com/api/oauth2/authorize?client_id=975536229854638141&redirect_uri=https%3A%2F%2Fmaster.d34tkfwwvb4ywd.amplifyapp.com%2F&response_type=token&scope=identify"

/// CONTRACT INITIALIZATION
const airdrop_address = '0x36Fc97819634Dd930328BDe78f7785069f8bBc8c'

// const provider = new ethers.providers.JsonRpcProvider(polygon);
// const signer = new ethers.Wallet(privateKey, provider);

const provider = new DefenderRelayProvider(credentials);
const signer = new DefenderRelaySigner(credentials, provider, { speed: 'fast' });


const valu = new ethers.Contract('0xFFCa18467Be207898F992Fc9be5197DB2f6bC286', dao_abi, signer)
const token = new ethers.Contract('0x3C67A0b36Cc82dD668baB8BEadC72D27612922ED', token_abi, signer)




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
exports.token = token;
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
exports.authURL = authURL
exports.MessageActionRow = MessageActionRow 
exports.MessageButton = MessageButton
exports.MessageAttachment = MessageAttachment;