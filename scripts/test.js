const {privateKey, polygon} = require('../config/config.json')
const engagement_abi = require('../artifacts/contracts/Engagement.sol').abi
const token_abi = require('../artifacts/contracts/Token.sol').abi;

const ethers = require('ethers');

const provider = new ethers.providers.WebSocketProvider(polygon);
const signer = new ethers.Wallet(privateKey, provider);

const engagement = new ethers.Contract('0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', engagement_abi, signer)
const token = new ethers.Contract('0x5FbDB2315678afecb367f032d93F642f64180aa3', token_abi, signer)

async function main(){
    console.log(await engagement.totalSupply() / 10 ** 18)
}
main()