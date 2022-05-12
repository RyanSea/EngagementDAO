const {privateKey, polygon, hermes} = require('../../config/config.json')
const engagement_abi = require('../../artifacts/contracts/Engagement.sol/Engagement.json').abi
const token_abi = require('../../artifacts/contracts/Token.sol/Token.json').abi;

const ethers = require('ethers');

const { Client, Intents, MessageEmbed} =  require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES] });

const provider = new ethers.providers.JsonRpcProvider(polygon);
const signer = new ethers.Wallet(privateKey, provider);

const engagement = new ethers.Contract('0x2B73f707689E6CD57DCcEAB781bF8F71689427F2', engagement_abi, signer)
const token = new ethers.Contract('0xEF3a2AB776E7d82ba07Eb594fB3Ce280cfcFb7f6', token_abi, signer)

exports.bot = bot;
exports.engagement = engagement
exports.token = token;
exports.hermes = hermes;