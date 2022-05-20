//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import { ERC20 } from "@rari-capital/solmate/src/tokens/ERC20.sol";

contract EngagementToken is ERC20 {

    constructor(string memory name, string memory symbol)
        ERC20(name, symbol, 18){}


    function mint(address to, uint amount) public {
        _mint(to, amount);
    }

    function burn(address from, uint amount) public {
        _burn(from, amount);
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