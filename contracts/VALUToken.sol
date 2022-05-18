//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import { ERC20 } from "@rari-capital/solmate/src/tokens/ERC20.sol";

contract VALUToken is ERC20 {

    constructor()
        ERC20("Mana", "MANA", 18){}


    function mint(address to, uint amount) public {
        _mint(to, amount);
    }

    function approvedTransfer(
        address owner,
        address spender, 
        uint amount
    ) public {
        _approve(owner, spender, amount);
        transferFrom(owner, spender, amount);
    }
}
