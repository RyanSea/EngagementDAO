//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {ERC20} from "@rari-capital/solmate/src/tokens/ERC20.sol";

import {Token} from "./Token.sol";
import {Engagement} from "./Engagement.sol";

/// @title EngagementDAO
/// @notice Factory for the engagement protocol and hub for meta-functionality 
/// TODO Add auth (Gnosis Safe)
/// TODO Add Uniswap integration + ?? (earn from treasury)
contract EngagementDAO {

    /*///////////////////////////////////////////////////////////////
                                CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    ERC20 immutable public mana;

    constructor (ERC20 _mana) {
        mana = _mana;
        symbols.push(keccak256(abi.encodePacked("MANA")));
    }

    /*///////////////////////////////////////////////////////////////
                                FACTORY
    //////////////////////////////////////////////////////////////*/

    event DAOCreated(
        uint indexed serverID,
        address indexed token, 
        string token_symbol
    );

    /// @notice Creates community level protocol
    function initiate(
        uint serverID, 
        string calldata token_name, 
        string calldata token_symbol
    ) public returns (address daoAddress) {
        uint symbolInventory = symbols.length;
        bytes32 _symbol = keccak256(abi.encodePacked(token_symbol));

        // Iterate through symbols and require non are token_symbol
        for(uint i = 0; i < symbolInventory; i++) {
            require(symbols[i] != _symbol, "USED_SYMBOL");
        }

        Token _token = new Token(token_name, token_symbol);

        Engagement _dao = new Engagement(_token, mana);

        DAO_Profile memory profile;

        profile.token = _token;

        dao[serverID] = profile;

        emit DAOCreated(serverID, address(_token), token_symbol);
    }

    /*///////////////////////////////////////////////////////////////
                                INVENTORY
    //////////////////////////////////////////////////////////////*/

    /// @notice Storage of Engagement Token symbols to prevent duplicate
    bytes32[] public symbols;

    struct DAO_Profile {
        // DAO token
        ERC20 token;
        // Multi-sig 
        address council;
    }

    /// @notice Server id => DAO Profile
    mapping(uint => DAO_Profile) public dao;


}