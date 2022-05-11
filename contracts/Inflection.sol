//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {ERC20} from "@rari-capital/solmate/src/tokens/ERC20.sol";

import {Token} from "./Token.sol";
import {Engagement} from "./Engagement.sol";

/// @title InflectionDAO
/// @notice Creates and controls Engagement Spheres
/// TODO Add auth (Gnosis Safe)
/// TODO Add Uniswap integration + ?? (earn from treasury)
contract Inflection {

    /*///////////////////////////////////////////////////////////////
                                CONSTRUCT
    //////////////////////////////////////////////////////////////*/

    ERC20 immutable public mana;

    constructor (ERC20 _mana) {
        mana = _mana;
        symbols.push(keccak256(abi.encodePacked("MANA")));
    }

    /*///////////////////////////////////////////////////////////////
                                CREATE
    //////////////////////////////////////////////////////////////*/

    event SphereCreated(
        uint indexed serverID,
        address indexed token, 
        address indexed _sphere,
        string token_symbol
    );

    /// @notice Creates community level protocol
    /// TODO Add Gnosis multisig functionality for spheres
    function create(
        uint serverID, 
        string calldata token_name, 
        string calldata token_symbol
    ) public returns (Engagement _sphere) {
        uint symbolInventory = symbols.length;
        bytes32 _symbol = keccak256(abi.encodePacked(token_symbol));

        // Iterate through symbols and require non are token_symbol
        for(uint i = 0; i < symbolInventory; i++) {
            require(symbols[i] != _symbol, "USED_SYMBOL");
        }

        // Create Engagement Token
        Token _token = new Token(token_name, token_symbol);

        // Create Engagement Sphere
        _sphere = new Engagement(_token);

        // Create Engagement Sphere Profile 
        Sphere_Profile memory profile;
        profile.token = _token;
        profile.sphere = _sphere;

        // Assign Engagement Sphere Profile to Server ID
        spheres[serverID] = profile;

        emit SphereCreated(serverID, address(_token), address(_sphere), token_symbol);
    }

    /*///////////////////////////////////////////////////////////////
                                CONTROL
    //////////////////////////////////////////////////////////////*/




    /*///////////////////////////////////////////////////////////////
                                REFLECT
    //////////////////////////////////////////////////////////////*/

    /// @notice Storage of Engagement Token symbols (as bytes)
    bytes32[] public symbols;

    struct Sphere_Profile {
        // DAO token
        ERC20 token;
        // Multi-sig 
        address council;
        // Engagement Sphere
        Engagement sphere;
    }

    /// @notice Server id => Sphere Profile
    mapping(uint => Sphere_Profile) public spheres;


}