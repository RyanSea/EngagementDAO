//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {ERC20} from "@rari-capital/solmate/src/tokens/ERC20.sol";

/// @title EngagementDAO
/// @notice Factory for the engagement protocol and hub for meta-functionality 
/// TODO Add auth (Gnosis Safe)
/// TODO Add Uniswap integration + ?? (earn from treasury)
contract Inflection {

    /*///////////////////////////////////////////////////////////////
                                CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    ERC20 immutable public mana;

    constructor (ERC20 _mana) {
        mana = _mana;
        symbols.push(keccak256(abi.encodePacked("MANA")));
    }

    /*///////////////////////////////////////////////////////////////
                                INVENTORY
    //////////////////////////////////////////////////////////////*/

    /// @notice Storage of Engagement Token symbols to prevent duplicate
    bytes32[] public symbols;



}