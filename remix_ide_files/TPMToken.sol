pragma solidity ^0.4.24;

import "github.com/OpenZeppelin/zeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
import "github.com/OpenZeppelin/zeppelin-solidity/contracts/token/ERC20/PausableToken.sol";

// Transferable mintability, mintable, pausable token
// Multiple mintmaster capabilities
contract TMPToken is MintableToken, PausableToken{

  // Metadata
  string public constant symbol = "TMPT";
  string public constant name = "TMPToken";
  uint8 public constant decimals = 18;
  mapping (address => bool) public isMintMaster;
  event mintMasterAdded(address indexed newMaster);
  event mintMasterRemoved(address indexed oldMaster);

  modifier onlyMintMasterOrOwner() {
    require(isMintMaster[msg.sender] == true || msg.sender == owner);
    _;
  }

  // Should I still use the second require()?
  // Hopefully it saves the user gas as nothing is written to the blockchain
  function addMintMaster(address newMaster)
    onlyOwner public {
    require(newMaster != address(0));
    require(isMintMaster[newMaster] != true); // still not a mintmaster
    emit mintMasterAdded(newMaster);
    isMintMaster[newMaster] = true;
  }

  function removeMintMaster(address oldMaster)
    onlyOwner public {
    require(isMintMaster[oldMaster] != false); // actually is a mintmaster
    emit mintMasterRemoved(oldMaster);
    isMintMaster[oldMaster] = false;
  }

  // Temporarily switch owners to mint due to super.mint() restrictions
  function mint(address _to, uint256 _amount)
    onlyMintMasterOrOwner canMint public returns (bool) {
    address oldOwner = owner;
    owner = msg.sender;

    bool result = super.mint(_to, _amount);

    owner = oldOwner;
    return result;
  }

  function mintToAddresses(address[] addresses, uint256 amount)
    onlyMintMasterOrOwner canMint public {
      for (uint i = 0; i < addresses.length; i++) {
        require(mint(addresses[i], amount));
      }
  }

  function mintToAddressesAndAmounts(address[] addresses, uint256[] amounts)
    onlyMintMasterOrOwner canMint public {
        require(addresses.length == amounts.length);
        for (uint i = 0; i < addresses.length; i++) {
          require(mint(addresses[i], amounts[i]));
        }
  }

  // Override MintableToken.finishMinting() to add canMint Modifier
  function finishMinting()
    onlyOwner canMint public returns(bool) {
    return super.finishMinting();
  }
}
