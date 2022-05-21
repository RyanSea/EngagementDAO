require("@nomiclabs/hardhat-waffle");

const {polygon, privateKey} = require('./config/config.json') //Alchemy URL and Private Key in config folder

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});




module.exports = {
  solidity: "0.8.9",
  networks: {
    polygon: {
      url: polygon,
      accounts: [privateKey]
    },
    arbitrum: {
      url: "https://rinkeby.arbitrum.io/rpc",
      accounts: [privateKey]
    },
    meter: {
      url: "https://rpctest.meter.io/",
      accounts: [privateKey]
    }
  },
}
