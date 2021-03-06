//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import { ERC20 } from "@rari-capital/solmate/src/tokens/ERC20.sol";

import { EngagementToken } from "./EngagementToken.sol";
import { VALU } from "./VALU.sol";

contract Sphere is ERC20 {

    /*///////////////////////////////////////////////////////////////
                                CONSTRUCT
    //////////////////////////////////////////////////////////////*/  

    EngagementToken immutable public token;
    VALU immutable public valu;

    constructor(
        EngagementToken _token, 
        VALU _valu
    ) ERC20(
            string(abi.encodePacked(unicode"🤍-", _token.name())),
            string(abi.encodePacked(unicode"🤍", _token.symbol())),
            18
        ) {
            token = _token;
            valu = _valu;
            
            // Set initial reward pool
            rewardPool = 100000 * 10 ** 18;

            last = block.timestamp;

            _mint(address(this),rewardPool);
            token.mint(address(this), rewardPool);
        }

    /*///////////////////////////////////////////////////////////////
                                USER
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
    mapping (uint => uint) public owner;

    /*///////////////////////////////////////////////////////////////
                                LOGIN
    //////////////////////////////////////////////////////////////*/

    /// @notice User authenticated with Ethereum wallet
    event Authenticate(address indexed _address, uint indexed discord_id);

    /// @notice Owner id assigned to server id (discord)
    event OwnerAssigned(uint indexed server_id, uint indexed owner_id);

    /// @notice Assigns address to a user's Profile struct and maps struct to discord id
    function authenticate(
        uint discord_id, 
        address _address
    ) public {

        // Create Profile struct 
        Profile memory profile;
        profile.eoa = _address;

        // Assign profile to discord id
        user[discord_id] = profile;

        _mint(_address, 500 * 10 ** 18);

        emit Authenticate(_address, discord_id);
    }

    function getAddress(uint discord_id) public view returns (address _address) {
        _address = user[discord_id].eoa;
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
    function powerUp(uint discord_id, uint amount) public{
        address _address = user[discord_id].eoa;
        require((token.balanceOf(_address) >= amount), "INSUFFICIENT_BALANCE");

        // TEMP 
        token.approvedTransfer(_address, address(this), amount);
        _mint(_address, amount);

        emit PowerUp(discord_id, _address, amount);
    }

    /// @notice Unstake
    function powerDown(uint discord_id, uint amount) public {
        address _address = user[discord_id].eoa;
        require((balanceOf[_address] >= amount), "INSUFFICIENT_BALANCE");
        
        _burn(_address, amount);

        token.transfer(_address, amount);

        emit PowerDown(discord_id, _address, amount);
    }

    /// @notice burn staked tokens for $VALU
    function exit(uint discord_id, uint amount) public {
        address _address = user[discord_id].eoa;
        uint _amount = token.balanceOf(_address) >= amount ? amount : token.balanceOf(_address);

        uint _exit = valu.balanceOf(address(this)) / totalSupply * _amount;

        _burn(_address, _amount);
        token.burn(address(this), _amount);

        valu.transfer(_address, _exit);
    }


    /*///////////////////////////////////////////////////////////////
                        CORE ENGAGEMENT PROTOCOL
    //////////////////////////////////////////////////////////////*/

    /// @notice Reward pool that fills with inflation and gets distrubuted as yield 
    uint public rewardPool;

    /// @notice Core team income, to pay for dev work and gas — TBD, unused for now
    uint public core;

    /// @notice Last time inflation was calculated 
    uint public last; 

    /// @notice Compound frequency in seconds | 1800 == 30 mins
    uint public duration = 1800;

    /// @notice Rate of inflation (x 100000) | 7 == 0.00007 | 9.9% /month @ 30 min freq
    uint public rate = 7;

    // TEMP
    uint public inflation;

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

    /// @notice Inflate the rewardPool based on the amount of Powered Up Engagement Tokens
    function inflate() public {
        // Caulculate inflation intervals since last inflation event
        uint current = block.timestamp;

        uint intervals = (current - last) /  duration;
        
        inflation = totalSupply;

        // Calculate new inflation
        // TODO Do this in 1 line
        for(uint i; i < intervals; i++){
            inflation += inflation * rate / multiple;
        }
        inflation -= totalSupply;

        if (inflation > 0 ) {
            // Mint new inflation
            token.mint(address(this), inflation);

            // Add to reward pool
            rewardPool += inflation;
            
            // Update last to current timestamp
            last = current;

            emit Inflation(last, inflation);
        }
        
    }

    /// @notice Engagement Mana dictates user engagement power. It can be 1-100 
    /// it decreases by 10 with use and increases by 1 every 36 seconds
    function calculateMana(uint discord_id) private {
        // Add 1 mana for every 36 seconds that past since last engagement
        uint mana = user[discord_id].mana + (block.timestamp - user[discord_id].lastEngagement) / 36;

        // Cap mana at 100
        user[discord_id].mana = mana <= 100 ? mana : 100;
    }

    /// @notice Core engagement function
    /// TODO Clean this up
    /// TODO Reward server from engagement 
    function engage(
        // All params are discord id's
        uint engager_id, 
        uint engagee_id
    ) public {
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

        emit Engaged(engager_id, engagee_id, block.timestamp, value);
    }


}