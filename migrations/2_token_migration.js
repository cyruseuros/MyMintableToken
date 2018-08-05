var TMPToken = artifacts.require("./TMPToken.sol");

module.exports = function(deployer) {
  deployer.deploy(TMPToken);
};
