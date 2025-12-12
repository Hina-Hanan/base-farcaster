// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ReactionVerifier
 * @notice Verifies reaction time submissions using cryptographic signatures
 * @dev This can be expanded to use EIP-712 signatures for more security
 */
contract ReactionVerifier {
    struct ReactionSubmission {
        address player;
        uint256 reactionTime;
        uint256 timestamp;
        bytes signature;
    }

    mapping(bytes32 => bool) public usedNonces;

    event ReactionVerified(
        address indexed player,
        uint256 reactionTime,
        uint256 timestamp
    );

    /**
     * @notice Verify a reaction submission
     * @param player The player address
     * @param reactionTime The reaction time in milliseconds
     * @param timestamp The timestamp when reaction occurred
     * @param nonce A unique nonce to prevent replay attacks
     * @param signature The signature of the data
     * @return isValid Whether the submission is valid
     */
    function verifyReaction(
        address player,
        uint256 reactionTime,
        uint256 timestamp,
        bytes32 nonce,
        bytes memory signature
    ) external returns (bool isValid) {
        require(!usedNonces[nonce], "Nonce already used");
        require(block.timestamp >= timestamp, "Invalid timestamp");
        require(block.timestamp - timestamp < 300, "Submission too old"); // 5 minutes max

        // Create message hash
        bytes32 messageHash = keccak256(
            abi.encodePacked(player, reactionTime, timestamp, nonce)
        );
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );

        // Recover signer
        address signer = _recoverSigner(ethSignedMessageHash, signature);

        if (signer == player) {
            usedNonces[nonce] = true;
            isValid = true;
            emit ReactionVerified(player, reactionTime, timestamp);
        } else {
            isValid = false;
        }
    }

    /**
     * @notice Recover signer from signature
     */
    function _recoverSigner(
        bytes32 messageHash,
        bytes memory signature
    ) internal pure returns (address) {
        require(signature.length == 65, "Invalid signature length");

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }

        if (v < 27) {
            v += 27;
        }

        require(v == 27 || v == 28, "Invalid signature v value");

        return ecrecover(messageHash, v, r, s);
    }

    /**
     * @notice Check if a nonce has been used
     */
    function isNonceUsed(bytes32 nonce) external view returns (bool) {
        return usedNonces[nonce];
    }
}




