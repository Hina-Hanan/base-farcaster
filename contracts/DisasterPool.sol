// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IERC20.sol";
import "./libraries/SafeERC20.sol";
import "./PlayerStats.sol";

/**
 * @title DisasterPool
 * @notice Manages a single prize pool for disaster reflex game
 */
contract DisasterPool {
    using SafeERC20 for IERC20;

    struct Participant {
        address player;
        uint256 reactionTime;
        bool hasSubmitted;
        uint256 submittedAt;
    }

    IERC20 public immutable usdcToken;
    PlayerStats public immutable playerStats;
    address public immutable creator;
    uint256 public immutable entryFee;
    uint256 public immutable poolId;
    uint256 public immutable startTime;
    uint256 public immutable endTime;
    uint256 public constant MAX_PARTICIPANTS = 100;

    mapping(address => Participant) public participants;
    address[] public participantAddresses;
    address public winner;
    bool public isClosed;
    bool public isStarted;

    event PoolStarted(uint256 indexed poolId);
    event ParticipantJoined(address indexed player, uint256 indexed poolId);
    event ReactionSubmitted(
        address indexed player,
        uint256 reactionTime,
        uint256 indexed poolId
    );
    event PoolClosed(address indexed winner, uint256 reactionTime, uint256 indexed poolId);

    modifier onlyCreator() {
        require(msg.sender == creator, "Only creator can call this");
        _;
    }

    modifier poolNotClosed() {
        require(!isClosed, "Pool is closed");
        _;
    }

    constructor(
        address _usdcToken,
        address _playerStats,
        address _creator,
        uint256 _entryFee,
        uint256 _poolId,
        uint256 _durationSeconds
    ) {
        usdcToken = IERC20(_usdcToken);
        playerStats = PlayerStats(_playerStats);
        creator = _creator;
        entryFee = _entryFee;
        poolId = _poolId;
        startTime = block.timestamp;
        endTime = block.timestamp + _durationSeconds;
    }

    /**
     * @notice Join the pool by depositing USDC
     */
    function joinPool() external poolNotClosed {
        require(block.timestamp < endTime, "Pool has ended");
        require(participants[msg.sender].player == address(0), "Already joined");
        require(participantAddresses.length < MAX_PARTICIPANTS, "Pool is full");

        // Transfer USDC from player to contract
        usdcToken.safeTransferFrom(msg.sender, address(this), entryFee);

        // Register player in PlayerStats if not already registered
        playerStats.registerPlayer();

        participants[msg.sender] = Participant({
            player: msg.sender,
            reactionTime: type(uint256).max,
            hasSubmitted: false,
            submittedAt: 0
        });
        participantAddresses.push(msg.sender);

        emit ParticipantJoined(msg.sender, poolId);
    }

    /**
     * @notice Start the pool (creator calls this when ready)
     */
    function startPool() external onlyCreator poolNotClosed {
        require(!isStarted, "Pool already started");
        require(participantAddresses.length > 0, "No participants");
        isStarted = true;
        emit PoolStarted(poolId);
    }

    /**
     * @notice Submit reaction time (called after game completion)
     * @param reactionTime Reaction time in milliseconds
     * @param signature Signature to verify authenticity (can be expanded)
     */
    function submitReaction(uint256 reactionTime) external poolNotClosed {
        require(isStarted, "Pool not started yet");
        require(block.timestamp < endTime, "Pool has ended");
        require(participants[msg.sender].player != address(0), "Not a participant");
        require(!participants[msg.sender].hasSubmitted, "Already submitted");
        require(reactionTime > 0 && reactionTime < 10000, "Invalid reaction time");

        participants[msg.sender].reactionTime = reactionTime;
        participants[msg.sender].hasSubmitted = true;
        participants[msg.sender].submittedAt = block.timestamp;

        // Record in PlayerStats
        bool isWin = false; // Will be determined when pool closes
        playerStats.recordReaction(reactionTime, isWin);

        emit ReactionSubmitted(msg.sender, reactionTime, poolId);
    }

    /**
     * @notice Close pool and determine winner
     */
    function closePool() external poolNotClosed {
        require(block.timestamp >= endTime || isStarted, "Pool not ready to close");
        require(participantAddresses.length > 0, "No participants");

        // Find winner (fastest valid reaction)
        address fastestPlayer = address(0);
        uint256 fastestTime = type(uint256).max;

        for (uint256 i = 0; i < participantAddresses.length; i++) {
            Participant memory p = participants[participantAddresses[i]];
            if (p.hasSubmitted && p.reactionTime < fastestTime) {
                fastestTime = p.reactionTime;
                fastestPlayer = p.player;
            }
        }

        require(fastestPlayer != address(0), "No valid submissions");

        winner = fastestPlayer;
        isClosed = true;

        // Update winner's win count
        // Note: We'll need to call recordReaction again with isWin=true
        // For simplicity, we'll handle this in the factory

        // Transfer prize to winner
        uint256 prizeAmount = usdcToken.balanceOf(address(this));
        if (prizeAmount > 0) {
            usdcToken.safeTransfer(winner, prizeAmount);
        }

        emit PoolClosed(winner, fastestTime, poolId);
    }

    /**
     * @notice Get pool status
     */
    function getPoolStatus()
        external
        view
        returns (
            uint256 participantsCount,
            uint256 totalPrize,
            address currentWinner,
            bool closed,
            bool started
        )
    {
        return (
            participantAddresses.length,
            usdcToken.balanceOf(address(this)),
            winner,
            isClosed,
            isStarted
        );
    }

    /**
     * @notice Get all participants
     */
    function getParticipants() external view returns (Participant[] memory) {
        Participant[] memory result = new Participant[](participantAddresses.length);
        for (uint256 i = 0; i < participantAddresses.length; i++) {
            result[i] = participants[participantAddresses[i]];
        }
        return result;
    }
}

