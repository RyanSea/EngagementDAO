//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

//import {ERC20} from "@rari-capital/solmate/src/tokens/ERC20.sol";
import {EngagementToken} from "./EngagementToken.sol";
import {VALU} from "./VALU.sol";

import {ISphere} from "./Interfaces/ISphere.sol";
import {ISphereFactory} from "./Interfaces/ISphereFactory.sol";

/*///////////////////////////////////////////////////////////////
            UNUSED CONTRACT MEANT FOR FUTURE DEV
//////////////////////////////////////////////////////////////*/


/// @title ValuDAO
/// TODO Add auth (Gnosis Safe)
/// TODO Add Uniswap integration + ?? (earn from treasury)
contract ValuDAO {

    /*///////////////////////////////////////////////////////////////
                                CONSTRUCT
    //////////////////////////////////////////////////////////////*/

    ISphereFactory public immutable factory;

    VALU public immutable valu;

    constructor (
        ISphereFactory _factory, 
        VALU _valu
    ) {
        valu = _valu;
        factory = _factory;
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
        uint server_id, 
        string calldata token_name, 
        string calldata token_symbol
    ) public  {
        //require(!sphereCreated(server_id), "SPHERE_ALREADY_CREATED");

        // Will revert if already exists
        //bytes32 _symbol = symbolExists(token_symbol);
        
        EngagementToken _token = new EngagementToken(token_name, token_symbol);

        factory.create(server_id, _token, valu);

        ISphere _sphere = ISphere(factory.viewSphere(server_id));

        // Create Engagement Sphere Profile 
        Sphere_Profile memory profile;
        profile.token = _token;
        profile.sphere = _sphere;

        spheres[server_id] = profile;

        valu.mint(address(_sphere), 10000 * 10 ** 18);

        //symbols.push(_symbol);

        emit SphereCreated(server_id, address(_token), address(_sphere), token_symbol);
    }

    /*///////////////////////////////////////////////////////////////
                                CONTROL
    //////////////////////////////////////////////////////////////*/

    function authenticate(
        uint server_id,
        uint discord_id,
        address _address
    ) public {
        spheres[server_id].sphere.authenticate(discord_id, _address);
    }

    function powerUp(
        uint server_id,
        uint discord_id,
        uint amount
    ) public {
        spheres[server_id].sphere.powerUp(discord_id, amount);
    }

    function powerDown(
        uint server_id,
        uint discord_id,
        uint amount
    ) public {
        spheres[server_id].sphere.powerDown(discord_id, amount);
    }

    function exit(
         uint server_id,
        uint discord_id,
        uint amount
    ) public {
        spheres[server_id].sphere.exit(discord_id, amount);
    }

    function engage(
        uint server_id,
        uint engager_id,
        uint engagee_id
    ) public {
        spheres[server_id].sphere.engage(engager_id, engagee_id);
    }  

    /*///////////////////////////////////////////////////////////////
                                REFLECT                     
    //////////////////////////////////////////////////////////////*/

    //// INTERNAL ////

    /// @notice Storage of Engagement Token symbols (as bytes)
    bytes32[] public symbols;

    struct Sphere_Profile {
        // DAO token
        EngagementToken token;
        // Multi-sig 
        address council; // Unused 🥲
        // Engagement Sphere
        ISphere sphere;
    }

    /// @notice Server id => Sphere Profile
    mapping(uint => Sphere_Profile) public spheres;

    /// @notice Returns true if server id has already created a sphere
    function sphereCreated(uint server_id) public view returns (bool exists) {
        exists = address(spheres[server_id].sphere) != address(0);
    }

    /// @notice Reverts if existing Engagement Token has symbol, returns bytes32 version of symbol otherwise
    function symbolExists(string calldata token_symbol) internal view returns (bytes32 _symbol) {
        uint symbolInventory = symbols.length;
        _symbol = keccak256(abi.encodePacked(token_symbol));

        // Iterate through symbols and require non are token_symbol
        for(uint i = 0; i < symbolInventory; i++) {
            require(symbols[i] != _symbol, "USED_SYMBOL");
        }
    }
    
    //// EXTERNAL ////

    function getAddress(uint server_id, uint discord_id) public view returns (address _address) {
        _address = spheres[server_id].sphere.getAddress(discord_id);
    }

}