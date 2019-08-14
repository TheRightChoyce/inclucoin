const readline = require('readline-sync');
const {getContract, sendCoin} = require('./lib/contract');
const dotEnv = require('dotenv');
const fs = require('fs');
const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');

const getUserInput = (web3, contract) => {
    // while(loop) {
        
    console.log('');
    let command = readline.question('> ').split(' ');
    let address = '';

    console.log('');

    switch(command[0]) {
        case 'exit':
            // loop = false;
            break;

        case 'mint':
            address = process.env.WALLET_ADDRESS;

            console.log(command);
    
            if (command.length > 1) {
                address = command[1];
            }
            let mintAmount = command.length > 2 ? parseInt(command[2]) : 100;

            process.stdout.write('Minting coins...')

            contract.methods.mint(
                address, mintAmount
            )
            .send({
                from: '0xc50CB4999eee6Ba6337191aa6308DB0E5F0379C1'
            })
            .then(result => {
                process.stdout.write('  success!\n\r');
                console.log(`...txHash -> ${result.transactionHash}`);

                getUserInput(web3, contract);
            });
            break;
        
        case 'balance':
            address = process.env.WALLET_ADDRESS;
    
            if (command.length >= 2) {
                address = command[1];
            }

            contract.methods.balances(address)
                .call()
                .then(result => {
                    console.log(`Balance of: ${result} Inclucoin`);
                    getUserInput(web3, contract);
                });
            break;

        case 'send':
            
            let sending = true; 
            let confirmations = {};
            let reciept = null;
            
            if (command.length < 3) {
                console.log(`send requires 3 parameters: address and amount (only ${command.length} given)`);
            }

            let recipient = command[1];
            let amount = command[2];

            console.log(`Sending ${amount} Inclucoin to ${recipient}`)
            
            contract.methods.send(
                recipient, amount
            ).send({
                from: process.env.WALLET_ADDRESS,
                gas: '0x5B8D80',
                gasPrice: web3.utils.toWei('0.000000000003', 'ether')
            })
            .once('transactionHash', function(hash){ 
                console.log(`... Transaction started!`);
                console.log(`    txHash -> ${hash}`);
            })
            
            .once('receipt', function(_receipt){
                console.log(`... Received receipt!`);
                reciept = _receipt
            })
            
            .once('confirmation', function(confNumber, _receipt){
                console.log(`... Received first confirmation for ${_receipt.blockHash}`);
            })
            
            .on('error', function(error){ 
                console.log(`... Transaction failed!`);
                // console.log(`... Reason: ${error}`);
            })
            
            .then(function(receipt){
                console.log('... Finished! Coins have been sent');
                sending = false;
                getUserInput(web3, contract);
            })

            .catch(error => {
                console.log(`... Transaction failed!`);
                getUserInput(web3, contract);
            });
            
            console.log('... Waiting to start')
    
            break;
        
        default:
            console.log(' ?.?');
            getUserInput(web3, contract);
            break
    }
}

module.exports = () => {

    let loop = true;

    console.log('----------------------');
    console.log('Welcome to Inclucoin!!');
    console.log('----------------------');

    // Connnect to contract
    // let contract = getContract();
    const provider = new HDWalletProvider(
        process.env.MNEMONIC,
        'https://rinkeby.infura.io',
    )
    let web3 = new Web3(provider);
    let bytecode = `0x${fs.readFileSync('./contracts/InclusionCoin_sol_Coin.bin').toString()}`;
    let abi = JSON.parse(
        fs.readFileSync('./contracts/InclusionCoin_sol_Coin.abi').toString()
    );
    const contract = new web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);
    
    getUserInput(web3, contract);
}

// send 0x7BC00fF7364fA09a2f0ABB89455061F047c5FCFA 1000