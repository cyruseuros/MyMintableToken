pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol";

contract MyMintableToken is MintableToken {
  string public constant name = "MyMintableToken";
  string public constant symbol = "MMT";
  uint8 public constant decimals = 18;

  // Arbitrary initial amount to test against

  constructor() public {
    totalSupply_ = INITIAL_SUPPLY;
    // All the tokens go to contract deployer
    // Should default to accounts [0]
    balances[msg.sender] = INITIAL_SUPPLY;
    // Emit transfer from origin/burn pit
    emit Transfer(address(0), msg.sender, INITIAL_SUPPLY);
  }
}
