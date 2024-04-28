// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { items } = require("../src/items.json");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

async function main() {
  // Setup accounts
  const [deployer, buyer] = await ethers.getSigners();

  // Deploy contract
  const Dappazon = await ethers.getContractFactory("Dappazon");
  const dappazon = await Dappazon.deploy();
  await dappazon.deployed();

  console.log("dappazon deployed at: ", dappazon.address);

  for (let index = 0; index < items.length; index++) {
    const transaction = await dappazon
      .connect(deployer)
      .list(
        items[index].id,
        items[index].name,
        items[index].category,
        items[index].image,
        tokens(items[index].price),
        items[index].rating,
        items[index].stock
      );
    await transaction.wait();
    console.log(`Listed item ${items[index].id}: ${items[index].name}`);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
