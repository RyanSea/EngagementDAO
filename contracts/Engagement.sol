//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {ERC4626} from  "@rari-capital/solmate/src/mixins/ERC4626.sol";
import {ERC20} from "@rari-capital/solmate/src/tokens/ERC20.sol";

import {Token} from "./Token.sol";

/// @title Engagement
/// @notice Core Engagent Protocol
/// TODO Add auth
/// TODO Fix the temporary approval for staking
contract Engagement is ERC4626 {

    /*///////////////////////////////////////////////////////////////
                                CONSTRUCT
    //////////////////////////////////////////////////////////////*/  

    Token immutable public token;
    // ERC20 immutable public mana;

    constructor(Token _token) 
        ERC4626(
            _token,
            string(abi.encodePacked("Powered Up ", _token.name())),
            string(abi.encodePacked("p", _token.symbol()))
        ) {
            token = _token;

            uint initialPool = 10000000 * 10 ** 18;

            _token.mint(address(this),initialPool);

            rewardPool += initialPool;

            //mana = _mana;
        }

    /*///////////////////////////////////////////////////////////////
                                AUTHENTICATE
    //////////////////////////////////////////////////////////////*/

    struct Profile {
        // User's eoa
        address eoa;
        // User's current Engagement Mana
        uint mana; 
        // Timestamp of user's last engagement
        uint lastEngagement;
    }
    /// @notice Discord id => Profile
    mapping (uint => Profile) public user;

    /// @notice Server id => server owner id (discord)
    // TODO Decentralize Ownership w/ Gnosis Safe
    mapping (uint => uint) public owner;

    /*///////////////////////////////////////////////////////////////
                                LOGIN
    //////////////////////////////////////////////////////////////*/

    /// @notice User authenticated with Ethereum wallet
    event Authenticate(address indexed _address, uint indexed discord_id);

    /// @notice Owner id assigned to server id (discord)
    event OwnerAssigned(uint indexed server_id, uint indexed owner_id);

    /// @notice Assigns address to a user's Profile struct and maps struct to discord id
    function authenticate(uint discord_id, address _address) public returns (bool success) {
        // Create Profile struct 
        Profile memory profile;
        profile.eoa = _address;
        profile.mana = 100;

        // Assign profile to discord id
        user[discord_id] = profile;

        // TEMP 
        _mint(_address, 500 * 10 ** 18);

        success = true;

        emit Authenticate(_address, discord_id);
    }

    function isAuthenticated(uint discord_id) public view returns (bool authenticated) {
        authenticated = user[discord_id].eoa != address(0);
    }

    /// @notice Assigns owner to server which will allow owner limit tokenized engagement privileges (TODO)
    function setServerOwner(uint discord_id, uint server_id) public {
        owner[server_id] = discord_id;

        emit OwnerAssigned(server_id, discord_id);
    }

    /*///////////////////////////////////////////////////////////////
                                STAKE
    //////////////////////////////////////////////////////////////*/

    /// @notice Staking event
    event PowerUp(
        uint indexed discord_id, 
        address indexed _address,
        uint amount
    );

    /// @notice Unstaking event
    event PowerDown(
        uint indexed discord_id,
        address indexed _address,
        uint amount
    );

    /// @notice Stake
    // TODO Implement conventional wallet approval & remove _approve from ERC20.sol
    function powerUp(uint discord_id, uint amount) public returns (bool powered){
        address _address = user[discord_id].eoa;
        require((powered = token.balanceOf(_address) >= amount), "INSUFFICIENT_BALANCE");

        // Approve is temporary
        token.approveFrom(_address, address(this), amount);
        deposit(amount, _address);

        emit PowerUp(discord_id, _address, amount);
    }

    /// @notice Unstake
    function powerDown(uint discord_id, uint amount) public returns (bool depowered) {
        address _address = user[discord_id].eoa;
        require((depowered = balanceOf[_address] >= amount), "INSUFFICIENT_BALANCE");

        withdraw(amount, _address, _address);

        emit PowerDown(discord_id, _address, amount);
    }
    
    /*///////////////////////////////////////////////////////////////
                        CORE ENGAGEMENT PROTOCOL
    //////////////////////////////////////////////////////////////*/

    /// @notice Reward pool that fills with inflation and gets distrubuted as yield 
    uint public rewardPool;

    /// @notice Core team income, to pay for dev work and gas — TBD, unused for now
    uint public core;

    /// @notice Last time inflation was calculated 
    uint public last = block.timestamp;

    /// @notice Compound frequency in seconds | 1800 == 30 mins
    uint public duration = 1800;

    /// @notice Rate of inflation (x 100000) | 7 == 0.00007 | 9.9% /month @ 30 min freq
    uint public rate = 7;

    /// @notice The multiple required to get rate to a full number
    uint public multiple = 100000;

    /// @notice Engagement-Action between users
    event Engaged(
        uint indexed from_discord_id,
        uint indexed to_discord_id,
        uint indexed time,
        uint value
    );

    /// @notice Inflation event
    event Inflation(uint time, uint amount);

    /// @notice The total amount of Powered Up tokens
    function totalAssets() public view override returns (uint total){
        total = totalSupply;
    }

    /// @notice Inflate the rewardPool based on the amount of Powered Up Engagement Tokens
    function inflate() public {
        // Caulculate inflation intervals since last inflation event
        uint current = block.timestamp;
        uint intervals = (current - last) /  duration;
        
        // Calculate new inflation
        uint inflation = totalSupply * rate ** intervals / multiple ** intervals - totalSupply;

        // Mint new inflation
        token.mint(address(this), inflation);

        // Add to reward pool
        rewardPool += inflation;
        
        // Update last to current timestamp
        last = current;

        emit Inflation(last, inflation);
    }

    /// @notice Engagement Mana dictates user engagement power. It can be 1-100 
    /// it decreases by 10 with use and increases by 1 every 36 seconds
    function calculateMana(uint discord_id) private {
        // Add 1 mana for every 36 seconds that past since last engagement
        user[discord_id].mana += (block.timestamp - user[discord_id].lastEngagement) / 36;

        // Cap mana at 100
        if (user[discord_id].mana > 100) user[discord_id].mana = 100;
    }

    /// @notice Core engagement function
    /// TODO Clean this up
    /// TODO Reward server from engagement 
    function engage(
        // All params are discord id's
        uint engager_id, 
        uint engagee_id
    ) public returns (bool engaged){
        // Mint Engagement Tokens to reward pool
        inflate();

        // Caluclate Engager's current Engagement Mana
        calculateMana(engager_id);

        // Assign engager to variable
        Profile storage engager = user[engager_id];

        // Calculate Engagement Value
        uint value = rewardPool / balanceOf[engager.eoa] / 100 * engager.mana;

        // Decimals
        value *= 10 ** 18;

        // Mint Powered Engagement Tokens and distribute to engagee (80%) + engager (20%)
        // The Engagement Tokens minted upon inflate() are now withdrawable
        _mint(engager.eoa, value * 20 / 100); 
        _mint(user[engagee_id].eoa, value * 80 / 100);

        // Remove engagement value from reward pool
        rewardPool -= value;

        // Update engager's profile
        engager.lastEngagement = block.timestamp;

        // Remove 10 Engagement Mana from engager
        engager.mana -= 10;

        engaged = true;

        emit Engaged(engager_id, engagee_id, block.timestamp, value);
    }
}
