const {privateKey, polygon, hermes} = require('../../config/config.json')
const engagement_abi = require('../../config/Engagment.json').abi
const token_abi = require('../../config/Token.json').abi;

const ethers = require('ethers');

const { Client, Intents, MessageEmbed} =  require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES] });

const provider = new ethers.providers.JsonRpcProvider(polygon);
const signer = new ethers.Wallet(privateKey, provider);

const engagement = new ethers.Contract('0x2f338f7C41c6587c3461eA6F548a7c39CF066aE1', engagement_abi, signer)
const token = new ethers.Contract('0x724C291EeCA64582a01FB2f2f686fAa086E77c8A', token_abi, signer)

exports.bot = bot;
exports.engagement = engagement
exports.token = token;
exports.hermes = hermes;