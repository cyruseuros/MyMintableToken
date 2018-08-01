var Migrations = artifacts.require("./MyMintableToken.sol");

module.exports = function(deployer) {
  deployer.deploy(MyMintableToken);
};
