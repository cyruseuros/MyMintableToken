var MyMintableToken = artifacts.require("MyMintableToken.sol");

contract('Transaction test', async function(accounts) {
    it('should initialize 1000000 tokens to msg.sender', async function() {
        let instance = await MyMintableToken.deployed();
        let balance = await instance.balanceOf.call(accounts[0]);
        assert.equal(balance.toNumber(), 1000000,
            'contract improperly initialized');
    });

    it('should be able to transfer funds', async function() {
        let instance = await MyMintableToken.deployed();
        let fromAccount = accounts[2];
        let toAccount = accounts[3];
        let spendingAccount = accounts[4];

        // Transfer some funds to fromAccount
        // Still don't get how the extra parameters work. What data do they modify?
        await instance.transfer(fromAccount, 100, {
            from: accounts[0]
        });
        let balanceFromAccount = await instance.balanceOf.call(fromAccount);
        assert.equal(balanceFromAccount, 100, 'regular transfer failed');

        // Approve spendingAccount
        // Could I place any account that isn't msg.sender inside {from: foo}?
        await instance.approve(spendingAccount, 10, {
            from: accounts[0]
        });

        // Transfer excessive amount
        // This is a bad test passes even if it fails. How do I fix it?
        try {
            await instance.transferFrom(fromAccount, toAccount, 20, {from: spendingAccount});
        } catch (error) {
            assert(error.message.indexOf('revert') >= 0, 'cannot transfer unapproved ammount');
        }
    });
});
