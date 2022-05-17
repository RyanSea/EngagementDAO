//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import { Token } from "../Token.sol";

interface ISphereFactory {
    function create(uint server_id, Token _token) external;

    function viewSphere(uint server_id) external view returns (address);
}
