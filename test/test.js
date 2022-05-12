const { expect } = require("chai");
const { ethers } = require("hardhat");
//const { time } = require('@openzeppelin/test-helpers');

const toWei = (value) => ethers.utils.parseEther(value.toString());

const fromWei = (value) =>
  ethers.utils.formatEther(
    typeof value === "string" ? value : value.toString()
);

describe("Engagement", function () {

    var token, engagement
    const me = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'

    this.beforeEach(async () => {
        const Token_Contract = await hre.ethers.getContractFactory("Token");
        const Engagement_Contract = await hre.ethers.getContractFactory("Engagement")
      
        token = await Token_Contract.deploy("Engagement Token", "ENGAGE")
        await token.deployed();
      
        engagement = await Engagement_Contract.deploy(token.address);
        await engagement.deployed();
    })

    it("DEPLOYED", async () => {
        expect(await token.symbol()).to.equal("ENGAGE");

        expect(await engagement.symbol()).to.equal("p" + await token.symbol());

        expect(await engagement.totalSupply()).to.equal(toWei('10000000'))

        expect(await token.totalSupply()).to.equal('0')
    })

    it('INFLATED', async () => {

        await engagement.inflate()
        let timeBefore = await engagement.last()

        await engagement

        
        //await time.increase(3720)
        await ethers.provider.send("evm_increaseTime", [372000])


        await engagement.inflate()

        await ethers.provider.send("evm_increaseTime", [372000])

        await engagement.inflate()

        let timeAfter = await engagement.last()

        expect(timeAfter - timeBefore).to.equal(372000 * 2)
    })


//   it("Should return the new greeting once it's changed", async function () {
//     const Greeter = await ethers.getContractFactory("Greeter");
//     const greeter = await Greeter.deploy("Hello, world!");
//     await greeter.deployed();

//     expect(await greeter.greet()).to.equal("Hello, world!");

//     const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

//     // wait until the transaction is mined
//     await setGreetingTx.wait();

//     expect(await greeter.greet()).to.equal("Hola, mundo!");
//   });
});
