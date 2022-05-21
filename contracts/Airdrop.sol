//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import { ISemaphore } from "./Interfaces/ISemaphore.sol";
import { EngagementToken } from "./EngagementToken.sol";
import { ByteHasher } from "./Libraries/ByteHasher.sol";

/// @title Airdrop
/// @notice World ID Powered Airdrop
contract Airdrop {
    using ByteHasher for bytes;

    /*///////////////////////////////////////////////////////////////
                                CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    /// @dev The Semaphore instance that will be used for managing groups and verifying proofs
    ISemaphore internal immutable semaphore;

    /// @dev The Semaphore group ID whose participants can claim this airdrop
    uint256 internal immutable groupId = 1;

    /// @notice The ERC20 token airdropped to participants
    EngagementToken public immutable token;

    /// @notice The amount of tokens that participants will receive upon claiming
    uint256 public immutable airdropAmount = 600 * 10 ** 18;

    constructor(
        ISemaphore _semaphore,
        EngagementToken _token
    ) {
        semaphore = _semaphore;
        token = _token;
        token.mint(address(this), 100000 * 10 ** 18);
    }

    /*///////////////////////////////////////////////////////////////
                                AIRDROP
    //////////////////////////////////////////////////////////////*/

    /// @notice Thrown when attempting to reuse a nullifier
    error InvalidNullifier();

    /// @notice nullifer hash => has been used to claim
    mapping(uint => bool) nullifierHashes;

    /// @notice Claim the airdrop
    /// @param receiver The address that will receive the tokens
    /// @param root The of the Merkle tree
    /// @param nullifierHash The nullifier for this proof, preventing double signaling
    /// @param proof The zero knowledge proof that demostrates the claimer is part of the Semaphore group
    function claim(
        address receiver,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) public {
        // if (nullifierHashes[nullifierHash]) revert InvalidNullifier();

        semaphore.verifyProof(
            root,
            groupId,
            abi.encodePacked(receiver).hashToField(),
            nullifierHash,
            abi.encodePacked(address(this)).hashToField(),
            proof
        );

        // nullifierHashes[nullifierHash] = true;

        token.transfer(receiver, airdropAmount);
    }

    
}