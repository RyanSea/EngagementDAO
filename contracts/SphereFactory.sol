//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {Sphere} from "./Sphere.sol";
import {EngagementToken} from "./EngagementToken.sol";

contract SphereFactory {

    /// @notice server_id to Sphere
    mapping(uint => address) spheres;

    /// @notice Creates community level protocol
    /// TODO Add Gnosis multisig functionality for spheres
    function create(uint server_id, EngagementToken _token) public {
        // Create Engagement Sphere
        Sphere _sphere = new Sphere(_token);

        // Assign Engagement Sphere Profile to Server ID
        spheres[server_id] = address(_sphere);
    }

    function viewSphere(uint server_id) public view returns (address _sphere) {
        _sphere = spheres[server_id];
    }

}