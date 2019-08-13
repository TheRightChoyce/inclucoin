const readline = require('readline-sync');
const {getContract, sendCoin} = require('./lib/contract');
const dotEnv = require('dotenv');
const fs = require('fs');
const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');


module.exports = async () => {

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
    let bytecode = `0x${fs.readFileSync('InclusionCoin_sol_Coin.bin').toString()}`;
    let abi = JSON.parse(
        fs.readFileSync('InclusionCoin_sol_Coin.abi').toString()
    );
    const contract = new web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);

    while(loop) {
        
        let command = readline.question('> ').split(' ');
        let address = '';

        switch(command[0]) {
            case 'exit':
                loop = false; break;

            case 'mint':
                address = process.env.WALLET_ADDRESS;
        
                if (command.length >= 2) {
                    address = command[1];
                }    
                contract.methods.mint(
                    address, 100
                )
                .send({
                    from: '0xc50CB4999eee6Ba6337191aa6308DB0E5F0379C1'
                })
                .then(result => console.log(result));
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
                        return;
                    });
                break;

            case 'send':
                if (command.length < 3) {
                    console.log(`send requires 3 parameters: address and amount (only ${command.length} given)`);
                }

                let recipient = command[1];
                let amount = command[2];

                console.log(`Sending ${amount} Inclucoin to ${recipient}...`)
                
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
                
                
                // sendCoin(
                //     contract,
                //     command[1],
                //     command[2]
                // )
                break;
        }

        if(command === 'exit') {
            loop = false;
        }

        loop = false;
    }
}