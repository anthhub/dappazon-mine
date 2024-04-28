require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  paths: {
    artifacts: "./src/artifacts",
  },
  networks: {
    localhost: {
      chainId: 31337, // We set 1337 to make interacting with MetaMask simpler
    },
  },
};
