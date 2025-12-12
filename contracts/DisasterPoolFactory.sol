// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DisasterPool.sol";
import "./PlayerStats.sol";

/**
 * @title DisasterPoolFactory
 * @notice Factory contract for creating and managing disaster pools
 */
contract DisasterPoolFactory {
    PlayerStats public immutable playerStats;
    address public immutable usdcToken;

    uint256 public poolCount;
    mapping(uint256 => address) public pools;
    mapping(address => uint256[]) public playerPools;

    event PoolCreated(
        uint256 indexed poolId,
        address indexed poolAddress,
        address indexed creator,
        uint256 entryFee
    );

    constructor(address _playerStats, address _usdcToken) {
        playerStats = PlayerStats(_playerStats);
        usdcToken = _usdcToken;
    }

    /**
     * @notice Create a new disaster pool
     * @param entryFee Entry fee in USDC (with decimals)
     * @param durationSeconds Duration of the pool in seconds
     * @return poolId The ID of the created pool
     * @return poolAddress The address of the created pool contract
     */
    function createPool(
        uint256 entryFee,
        uint256 durationSeconds
    ) external returns (uint256 poolId, address poolAddress) {
        require(entryFee > 0, "Entry fee must be greater than 0");
        require(durationSeconds >= 60, "Duration must be at least 60 seconds");

        poolId = poolCount++;
        poolAddress = address(
            new DisasterPool(
                usdcToken,
                address(playerStats),
                msg.sender,
                entryFee,
                poolId,
                durationSeconds
            )
        );

        pools[poolId] = poolAddress;
        playerPools[msg.sender].push(poolId);

        emit PoolCreated(poolId, poolAddress, msg.sender, entryFee);
    }

    /**
     * @notice Get pool address by ID
     */
    function getPool(uint256 poolId) external view returns (address) {
        return pools[poolId];
    }

    /**
     * @notice Get pools created by a player
     */
    function getPlayerPools(address player) external view returns (uint256[] memory) {
        return playerPools[player];
    }

    /**
     * @notice Get active pools (not closed)
     */
    function getActivePools(uint256 limit) external view returns (address[] memory) {
        uint256 activeCount = 0;
        address[] memory activePools = new address[](limit);

        for (uint256 i = 0; i < poolCount && activeCount < limit; i++) {
            address poolAddr = pools[i];
            if (poolAddr != address(0)) {
                DisasterPool pool = DisasterPool(poolAddr);
                (bool closed, bool started) = _getPoolStatus(pool);
                if (!closed) {
                    activePools[activeCount] = poolAddr;
                    activeCount++;
                }
            }
        }

        // Resize array
        address[] memory result = new address[](activeCount);
        for (uint256 i = 0; i < activeCount; i++) {
            result[i] = activePools[i];
        }

        return result;
    }

    /**
     * @notice Helper to get pool status
     */
    function _getPoolStatus(
        DisasterPool pool
    ) internal view returns (bool closed, bool started) {
        try pool.isClosed() returns (bool _closed) {
            closed = _closed;
        } catch {
            closed = true;
        }

        try pool.isStarted() returns (bool _started) {
            started = _started;
        } catch {
            started = false;
        }
    }
}




