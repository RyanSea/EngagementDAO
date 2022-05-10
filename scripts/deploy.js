
const hre = require("hardhat");

async function main() {

  const Token_Contract = await hre.ethers.getContractFactory("Token");
  const Mana_Contract = await hre.ethers.getContractFactory("Mana");
  const Engagement_Contract = await hre.ethers.getContractFactory("Engagement")

  const token = await Token_Contract.deploy("Cereal Token", "YUM")
  await token.deployed();

  const mana = await Mana_Contract.deploy();
  await mana.deployed();

  const engagement = await Engagement_Contract.deploy(token, mana)


  console.log("Engagement deployed to:", engagement.address);
  console.log("Mana deployed to:", mana.address);
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
