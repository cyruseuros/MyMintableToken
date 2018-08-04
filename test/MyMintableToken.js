// import lkTestHelpers from './lk-test-helpers';
// const {
//     advanceBlock,
//     advanceToBlock,
//     assertJump,
//     ether,
//     latestTime,
//     increaseTime,
//     increaseTimeTo,
//     EVMThrow,
//     expectThrow,
//     hashMessage,
//     timer,
//     toPromise,
//     transactionMined
// } = lkTestHelpers(web3);
const MyMintableToken = artifacts.require("MyMintableToken.sol");

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

        async function expectRevert (promise) {
        try {
            await promise;
        } catch (error) {
            assert(error.message.indexOf('revert') >= 0, 'cannot transfer unapproved ammount');
        }
        };

        await expectRevert(instance.transferFrom(fromAccount, toAccount, 20, {
                from: spendingAccount
            }),
            'revert');
    });

    it('should be able to mint', async function() {
        let instance = await MyMintableToken.deployed();
        let minterAccount = accounts[0];

        await instance.mint(minterAccount, 10, {from: minterAccount});
        assert.equal(instance.balanceOf.call(minterAccount), 110, 'supposed to  mint 10 tokens');
    });
});
