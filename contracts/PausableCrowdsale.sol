pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "zeppelin-solidity/contracts/lifecycle/Pausable.sol";

contract PausableCrowdsale is Crowdsale, Pausable {
  constructor(bool _paused) public {
    if (_paused) {
      pause();
    }
  }

  // Add pause logic to Crowdsale.validPurchase
  // Returns true if investors ca buy at the moment
  // As compared to bitclave, only replaced constant with view
  // I think openzeppelin renamed validPurchase
  function _preValidatePurchase(address _beneficiary, uint256 _weiAmount) internal {
    super._preValidatePurchase(_beneficiary, _weiAmount);
    require(!paused);
  }
}
