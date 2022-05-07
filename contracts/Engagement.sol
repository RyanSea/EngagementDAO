//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {ERC4626} from  "@rari-capital/solmate/src/mixins/ERC4626.sol";
import {ERC20} from "@rari-capital/solmate/src/tokens/ERC20.sol";

/// @title Engagement
/// @notice Core Engagent Protocol
/// TODO Add auth
contract Engagement is ERC4626 {

    /*///////////////////////////////////////////////////////////////
                                CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/  

    ERC20 immutable public token;
    ERC20 immutable public mana;

    constructor(ERC20 _token, ERC20 _mana) 
        ERC4626(
            _token,
            string(abi.encodePacked("Powered Up ", _token.name())),
            string(abi.encodePacked("p", _token.symbol()))
        ) {
            token = _token;
            mana = _mana;
        }
    
}
