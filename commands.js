let deployedContract = new web3.eth.Contract(abi);
deployedContract.deploy({
    data: bytecode
}).send({
    from: '0xc50CB4999eee6Ba6337191aa6308DB0E5F0379C1',
    gas: 1500000,
    gasPrice: web3.utils.toWei('0.00003', 'ether')
}).then((newContractInstance) => {
    deployedContract.options.address = newContractInstance.options.address
    console.log(newContractInstance.options)
});

// This will fail
deployedContract.methods.send(
    '0x7BC00fF7364fA09a2f0ABB89455061F047c5FCFA', 1
).send({
    from: '0xc50CB4999eee6Ba6337191aa6308DB0E5F0379C1'
}).on('receipt', function(receipt){
    console.log(receipt);
});

// Need to mint coins first
deployedContract.methods.mint(
    '0xc50CB4999eee6Ba6337191aa6308DB0E5F0379C1', 100
    ).send({
        from: '0xc50CB4999eee6Ba6337191aa6308DB0E5F0379C1'
    }).then(result => console.log(result));

// check balances
deployedContract.methods.balances('0xc50CB4999eee6Ba6337191aa6308DB0E5F0379C1').call().then(result => console.log(`Balance of: ${result} Inclucoin`));
deployedContract.methods.balances('0x7BC00fF7364fA09a2f0ABB89455061F047c5FCFA').call().then(result => console.log(`Balance of: ${result} Inclucoin`));
result = deployedContract.methods.balances('0xbE8a0714857EE70b6c1f2f1493A8d3aa11ED4aB5').call().then(result => console.log(`Balance of: ${result} Inclucoin`));
