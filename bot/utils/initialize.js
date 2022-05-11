const {privateKey, polygon, hermes} = require('../../config/config.json')
const engagement_abi = require('../../artifacts/contracts/Engagement.sol/Engagement.json').abi;
const token_abi = require('../../artifacts/contracts/Token.sol/Token.json').abi;

const ethers = require('ethers');

const { Client, Intents, MessageEmbed} =  require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES] });

const provider = new ethers.providers.JsonRpcProvider(polygon);
const signer = new ethers.Wallet(privateKey, provider);

const engagement = new ethers.Contract('0x25082c89055B1B01472F61b68fFBd80ABBeb9FD6', engagement_abi, signer)
const token = new ethers.Contract('0xa041DFACfB70cD375fB1B627d2bb2c2C5B35BCC9', token_abi, signer)

exports.bot = bot;
exports.engagement = engagement
exports.token = token;
exports.hermes = hermes;