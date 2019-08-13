const Web3 = require('web3');
const dotEnv = require('dotenv');
const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');

// setup Env
dotEnv.config();

const getAbi = () => {
    let bytecode = `0x${fs.readFileSync('InclusionCoin_sol_Coin.bin').toString()}`;
    let abi = JSON.parse(
        fs.readFileSync('InclusionCoin_sol_Coin.abi').toString()
    );

    return abi;
}

exports.getContract = () => {

    const provider = new HDWalletProvider(
        process.env.MNEMONIC,
        'https://rinkeby.infura.io',
    )
    let web3 = new Web3(provider);
    const contract = new web3.eth.Contract(getAbi(), process.env.CONTRACT_ADDRESS);

    return contract;
}

exports.sendCoin = (contract, recipient, amount) => {
    contract.methods.send(
        recipient, amount
    ).send({
        from: process.env.WALLET_ADDRESS,
        gas: '0x5B8D80',
        gasPrice: web3.utils.toWei('0.000000000003', 'ether')
    })
    .on('receipt', function(receipt){
        console.log(receipt);
    });
    // send 0x6443541a7974E623AccB21511216248aDb5c6DF3 1
}