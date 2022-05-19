
const hre = require("hardhat");

async function main() {

    const semaphore = '0x330C8452C879506f313D1565702560435b0fee4C'
    const Token_Contract = await hre.ethers.getContractFactory("EngagementToken");
    const Airdrop_Contract = await hre.ethers.getContractFactory("Airdrop")

    const token = await Token_Contract.deploy("Airdrop Token", "AIR")
    await token.deployed();

    const airdrop = await Airdrop_Contract.deploy(semaphore, token.address);
    await airdrop.deployed();
    


    console.log("Airdrop deployed to:", airdrop.address);
    console.log("Token deployed to:", token.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });