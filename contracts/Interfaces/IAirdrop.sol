//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IAirdrop {

    function claim(
        address token,
        address receiver,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external;
}