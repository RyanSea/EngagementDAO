const semaphore = '0x505Fd4741F00850024FBD3926ebECfB4c675A9fe'

async function main() {

  const Token_Contract = await hre.ethers.getContractFactory("VALU");
  const DAO_Contract = await hre.ethers.getContractFactory("ValuDAO")
  const Factory_Contract = await hre.ethers.getContractFactory('SphereFactory')
  const Airdrop_Contract = await hre.ethers.getContractFactory("Airdrop")

  const token = await Token_Contract.deploy()
  await token.deployed();

  const factory = await Factory_Contract.deploy()
  await factory.deployed()

  const airdrop = await Airdrop_Contract.deploy(semaphore);
  await airdrop.deployed();

  const dao = await DAO_Contract.deploy(factory.address,token.address, airdrop.address);
  await dao.deployed();


  console.log("ValuDAO deployed to:", dao.address);
  console.log("$VALU deployed to:", token.address);
  console.log("Sphere Factory deployed to:", factory.address)
  console.log("Airdrop deployed to:", airdrop.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
