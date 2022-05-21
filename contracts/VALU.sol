//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import { ERC20 } from "@rari-capital/solmate/src/tokens/ERC20.sol";

contract VALU is ERC20 {

    constructor()
        ERC20("Valu Token", "VALU", 18){}


    function mint(address to, uint amount) public {
        _mint(to, amount);
    }
    
}
