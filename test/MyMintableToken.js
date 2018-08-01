var MyMintableToken = artifacts.require("MyMintableToken.sol");

contract('Transaction test', async function (accounts) {
    it('should initialize 1000000 tokens to msg.sender', async function() {
        let instance = await MyMintableToken.deployed();
        let balance = await instance.balanceOf(accounts[0]);
        assert.equal(balance.toNumber(), 1000000);
    });

    it('should be able to transfer funds', async function() {
        let instance = await MyMintableToken.deployed();
        let sendingAccount = accounts[0];
        let receivingAccount = accounts[1];


    });
});
