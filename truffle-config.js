const path = require("path");
require('dotenv').config({path: './.env'});
const HDWalletProvider = require("@truffle/hdwallet-provider");
var Web3 = require('web3');

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  plugins: [
    'truffle-plugin-verify'
  ],
  contracts_build_directory: path.join(__dirname, "/contracts"),
  compilers: {
    solc: {
      version: ">=0.6.0 <0.8.0",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200   // Optimize for how many times you intend to run the code
        }
      }
    }
  },
  networks: {
    develop: {
      port: 8545,
      defaultEtherBalance: 100000,
    },
    rinkeby: {
      provider: () => new HDWalletProvider(process.env.PRIVATE_KEY, "wss://rinkeby.infura.io/ws/v3/ba540ca359744e14a31171bc87df6ea4"),
      network_id: 4,
      skipDryRun: true,
    },
    ganache_local: {
      host: "localhost",
      port: 7545,
      network_id: "5777"
    },
    binance_test: {
      provider: () => new HDWalletProvider(process.env.PRIVATE_KEY, "wss://data-seed-prebsc-1-s1.binance.org:8545" /*"https://data-seed-prebsc-1-s1.binance.org:8545"*/ /*test_bsc_web3Provider*/),
      network_id: 97,
      confirmations: 1,
      timeoutBlocks: 200,
      skipDryRun: true,
      networkCheckTimeout: 1000000,
      gas: 7000000,
      gasPrice: 10000000000 // 6 gwei
    },
binance_main: {
      provider: () => new HDWalletProvider(process.env.PRIVATE_KEY, "wss://old-small-wildflower.bsc.quiknode.pro/83a210b15a3a4d829e3d4415875523251419fbd0/"),
      network_id: 56,
      confirmations: 1,
      timeoutBlocks: 200,
      skipDryRun: true,
      networkCheckTimeout: 1000000,
      gas: 4000000, // 4 million gas
      gasPrice: 5000000000 // 5 gwei
    },
  },
};