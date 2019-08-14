const Web3 = require('web3');
const dotEnv = require('dotenv');
const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');

// setup Env
dotEnv.config();

const contractAddress = process.env.CONTRACT_ADDRESS;

const provider = new HDWalletProvider(
    process.env.MNEMONIC,
    'https://rinkeby.infura.io',
)
let web3 = new Web3(provider);

let bytecode = `0x${fs.readFileSync('../contracts/InclusionCoin_sol_Coin.bin').toString()}`;
let abi = JSON.parse(
    fs.readFileSync('../contracts/InclusionCoin_sol_Coin.abi').toString()
);

let deployedContract = new web3.eth.Contract(abi);
deployedContract
    .deploy({ data: bytecode })
    .send({
        from: process.env.WALLET_ADDRESS,
        gas: '0x5B8D80',
        gasPrice: web3.utils.toWei('0.000000000003', 'ether')
    })
    .then((newContractInstance) => {
        deployedContract.options.address = newContractInstance.options.address
        console.log(newContractInstance.options.address);
        return true;
    })
    .catch(err => {
        console.log(err)
        return false;
    });

