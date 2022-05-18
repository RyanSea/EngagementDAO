//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import { ISemaphore } from "./Interfaces/ISemaphore.sol";
import { Token } from "./Token.sol";

/// @title World ID Airdrop
contract WorldIDAidrop {

    /// @dev The Semaphore instance that will be used for managing groups and verifying proofs
    ISemaphore internal immutable semaphore;

    /// @dev The Semaphore group ID whose participants can claim this airdrop
    uint256 internal immutable groupId;

    /// @notice The ERC20 token airdropped to participants
    Token public immutable token;

    /// @notice The amount of tokens that participants will receive upon claiming
    uint256 public immutable airdropAmount;

    constructor(
        ISemaphore _semaphore,
        uint _groupId,
        Token _token,
        uint _airdropAmount
    ) {
        semaphore = _semaphore;
        groupId = _groupId;
        token = _token;
        airdropAmount = _airdropAmount;
    }




}