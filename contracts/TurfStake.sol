// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TurfStakeAR is Ownable, ReentrancyGuard {
    struct Monument {
        uint256 id;
        address creator;
        string clubName;
        int32 latitude; // Changed to int32
        int32 longitude; // Changed to int32
        string anchorImageHash;
        uint256 totalStaked;
        uint256 level;
        bool active;
    }

    struct Campaign {
        uint256 id;
        uint256 monumentId;
        address sponsor;
        string adContent;
        uint256 budget;
        bool active;
    }

    // NEW: Yield distribution tracking
    struct YieldInfo {
        uint256 rewardPerTokenStored;
        mapping(address => uint256) userRewardPerTokenPaid;
        mapping(address => uint256) rewards;
    }

    uint256 public nextMonumentId = 1;
    uint256 public nextCampaignId = 1;

    // Mapping from club name to fan token address
    mapping(string => address) public clubTokens;
    // Array to track registered clubs
    string[] public registeredClubs;

    // NEW: Track used coordinates to prevent duplicates
    mapping(bytes32 => bool) public usedCoordinates;

    // Dynamic level calculation percentages (of total contract tokens)
    uint256[6] public levelPercentages = [0, 1, 5, 15, 30, 50]; // 0%, 1%, 5%, 15%, 30%, 50%

    // Protocol fee percentage (30% goes to protocol)
    uint256 public protocolFeePercent = 30;

    mapping(uint256 => Monument) public monuments;
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public stakes; // monumentId => user => amount
    mapping(uint256 => address[]) public monumentStakers;

    // NEW: Improved yield tracking
    mapping(uint256 => YieldInfo) private monumentYields;

    event YieldClaimed(
        address indexed user,
        uint256 indexed monumentId,
        uint256 amount
    );
    event RevenueAdded(uint256 indexed monumentId, uint256 amount);
    event MonumentCreated(uint256 indexed monumentId, string clubName);
    event TokensStaked(
        uint256 indexed monumentId,
        address indexed staker,
        uint256 amount
    );
    event TokensUnstaked(
        // NEW: Added missing event
        uint256 indexed monumentId,
        address indexed staker,
        uint256 amount
    );
    event CampaignCreated(
        uint256 indexed campaignId,
        uint256 indexed monumentId
    );
    event ClubRegistered(string clubName, address tokenAddress);
    event MonumentLevelUpdated(uint256 indexed monumentId, uint256 newLevel); // NEW: Added missing event

    constructor() Ownable(msg.sender) {
        // No single fan token needed - each monument has its own
    }

    // Register a club with its fan token address (only owner)
    function registerClub(
        string memory _clubName,
        address _tokenAddress
    ) external onlyOwner {
        require(bytes(_clubName).length > 0, "Club name cannot be empty");
        require(_tokenAddress != address(0), "Invalid token address");
        require(clubTokens[_clubName] == address(0), "Club already registered");

        clubTokens[_clubName] = _tokenAddress;
        registeredClubs.push(_clubName);

        emit ClubRegistered(_clubName, _tokenAddress);
    }

    // Update club token address (only owner)
    function updateClubToken(
        string memory _clubName,
        address _newTokenAddress
    ) external onlyOwner {
        require(bytes(_clubName).length > 0, "Club name cannot be empty");
        require(_newTokenAddress != address(0), "Invalid token address");
        require(clubTokens[_clubName] != address(0), "Club not registered");

        clubTokens[_clubName] = _newTokenAddress;
    }

    function createMonument(
        string memory _clubName,
        int32 _latitude, // Changed to int32
        int32 _longitude, // Changed to int32
        string memory _anchorImageHash
    ) external returns (uint256) {
        require(bytes(_clubName).length > 0, "Club name required");
        require(clubTokens[_clubName] != address(0), "Club not registered");
        require(bytes(_anchorImageHash).length > 0, "Anchor image required");
        require(
            _latitude >= -90000000 && _latitude <= 90000000,
            "Invalid latitude"
        );
        require(
            _longitude >= -180000000 && _longitude <= 180000000,
            "Invalid longitude"
        );

        // NEW: Check for duplicate coordinates
        bytes32 coordinateHash = keccak256(
            abi.encodePacked(_latitude, _longitude)
        );
        require(!usedCoordinates[coordinateHash], "Coordinates already used");
        usedCoordinates[coordinateHash] = true;

        uint256 monumentId = nextMonumentId++;

        monuments[monumentId] = Monument({
            id: monumentId,
            creator: msg.sender,
            clubName: _clubName,
            latitude: _latitude,
            longitude: _longitude,
            anchorImageHash: _anchorImageHash,
            totalStaked: 0,
            level: 1,
            active: true
        });

        emit MonumentCreated(monumentId, _clubName);
        return monumentId;
    }

    // Helper function to get token address for a monument
    function getMonumentTokenAddress(
        uint256 _monumentId
    ) public view returns (address) {
        return clubTokens[monuments[_monumentId].clubName];
    }

    // NEW: Modifier to update rewards before changing stakes
    modifier updateReward(uint256 _monumentId, address _account) {
        YieldInfo storage yieldInfo = monumentYields[_monumentId];
        if (_account != address(0)) {
            yieldInfo.rewards[_account] = earned(_monumentId, _account);
            yieldInfo.userRewardPerTokenPaid[_account] = yieldInfo
                .rewardPerTokenStored;
        }
        _;
    }

    function stakeTokens(
        uint256 _monumentId,
        uint256 _amount
    ) external nonReentrant updateReward(_monumentId, msg.sender) {
        require(monuments[_monumentId].active, "Monument not active");
        require(_amount > 0, "Amount must be greater than 0");

        // Cache monument data to save gas
        Monument storage monument = monuments[_monumentId];
        address tokenAddress = clubTokens[monument.clubName];

        IERC20 monumentToken = IERC20(tokenAddress);
        require(
            monumentToken.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );

        if (stakes[_monumentId][msg.sender] == 0) {
            monumentStakers[_monumentId].push(msg.sender);
        }

        stakes[_monumentId][msg.sender] += _amount;
        monument.totalStaked += _amount;
        _updateMonumentLevel(_monumentId);

        emit TokensStaked(_monumentId, msg.sender, _amount);
    }

    function createCampaign(
        uint256 _monumentId,
        string memory _adContent,
        uint256 _budget
    ) external nonReentrant returns (uint256) {
        require(monuments[_monumentId].active, "Monument not active");
        require(_budget > 0, "Budget must be greater than 0");
        require(bytes(_adContent).length > 0, "Ad content cannot be empty"); // NEW: Check for empty content

        IERC20 monumentToken = IERC20(getMonumentTokenAddress(_monumentId));
        require(
            monumentToken.transferFrom(msg.sender, address(this), _budget),
            "Transfer failed"
        );

        // Add 70% of budget to monument revenue for stakers
        uint256 stakerRevenue = (_budget * (100 - protocolFeePercent)) / 100;
        _addRevenue(_monumentId, stakerRevenue);

        uint256 campaignId = nextCampaignId++;
        campaigns[campaignId] = Campaign({
            id: campaignId,
            monumentId: _monumentId,
            sponsor: msg.sender,
            adContent: _adContent,
            budget: _budget,
            active: true
        });

        emit CampaignCreated(campaignId, _monumentId);
        emit RevenueAdded(_monumentId, stakerRevenue);
        return campaignId;
    }

    // NEW: Internal function to add revenue and update reward per token
    function _addRevenue(uint256 _monumentId, uint256 _amount) internal {
        YieldInfo storage yieldInfo = monumentYields[_monumentId];
        uint256 totalStaked = monuments[_monumentId].totalStaked;

        if (totalStaked > 0) {
            yieldInfo.rewardPerTokenStored += (_amount * 1e18) / totalStaked;
        }
    }

    // NEW: Calculate earned rewards for a user
    function earned(
        uint256 _monumentId,
        address _account
    ) public view returns (uint256) {
        YieldInfo storage yieldInfo = monumentYields[_monumentId];
        uint256 userStake = stakes[_monumentId][_account];

        return
            (userStake *
                (yieldInfo.rewardPerTokenStored -
                    yieldInfo.userRewardPerTokenPaid[_account])) /
            1e18 +
            yieldInfo.rewards[_account];
    }

    function claimYield(
        uint256 _monumentId
    ) external nonReentrant updateReward(_monumentId, msg.sender) {
        require(
            stakes[_monumentId][msg.sender] > 0,
            "No stake in this monument"
        );

        YieldInfo storage yieldInfo = monumentYields[_monumentId];
        uint256 reward = yieldInfo.rewards[msg.sender];
        require(reward > 0, "No rewards to claim");

        yieldInfo.rewards[msg.sender] = 0;

        // Transfer yield to user
        IERC20 monumentToken = IERC20(getMonumentTokenAddress(_monumentId));
        require(monumentToken.transfer(msg.sender, reward), "Transfer failed");

        emit YieldClaimed(msg.sender, _monumentId, reward);
    }

    function _updateMonumentLevel(uint256 _monumentId) internal {
        Monument storage monument = monuments[_monumentId]; // Cache to save gas
        uint256 newLevel = calculateLevel(
            monument.totalStaked,
            clubTokens[monument.clubName] // Use cached club name
        );

        if (newLevel != monument.level) {
            monument.level = newLevel;
            emit MonumentLevelUpdated(_monumentId, newLevel); // NEW: Emit level update event
        }
    }

    function getClaimableYield(
        uint256 _monumentId,
        address _user
    ) external view returns (uint256) {
        return earned(_monumentId, _user);
    }

    function calculateLevel(
        uint256 _totalStaked,
        address _fanTokenAddress
    ) public view returns (uint256) {
        IERC20 monumentToken = IERC20(_fanTokenAddress);
        uint256 totalSupply = monumentToken.totalSupply();
        if (totalSupply == 0) return 1;

        uint256 stakingPercentage = (_totalStaked * 100) / totalSupply;

        // Optimized loop - start from highest level
        for (uint256 i = 5; i > 0; i--) {
            if (stakingPercentage >= levelPercentages[i]) {
                return i;
            }
        }
        return 1;
    }

    function unstakeTokens(
        uint256 _monumentId,
        uint256 _amount
    ) external nonReentrant updateReward(_monumentId, msg.sender) {
        require(
            stakes[_monumentId][msg.sender] >= _amount,
            "Insufficient stake"
        );

        stakes[_monumentId][msg.sender] -= _amount;
        monuments[_monumentId].totalStaked -= _amount;
        _updateMonumentLevel(_monumentId);

        IERC20 monumentToken = IERC20(getMonumentTokenAddress(_monumentId));
        require(monumentToken.transfer(msg.sender, _amount), "Transfer failed");

        emit TokensUnstaked(_monumentId, msg.sender, _amount); // NEW: Added missing event
    }

    // Getter functions for easy frontend implementation
    function getMonument(
        uint256 _monumentId
    ) external view returns (Monument memory) {
        return monuments[_monumentId];
    }

    function getMonumentBasics(
        uint256 _monumentId
    )
        external
        view
        returns (
            string memory clubName,
            address fanTokenAddress,
            int32 latitude, // Changed to int32
            int32 longitude, // Changed to int32
            uint256 totalStaked,
            uint256 level
        )
    {
        Monument memory m = monuments[_monumentId];
        return (
            m.clubName,
            getMonumentTokenAddress(_monumentId),
            m.latitude,
            m.longitude,
            m.totalStaked,
            m.level
        );
    }

    function getUserStake(
        uint256 _monumentId,
        address _user
    ) external view returns (uint256) {
        return stakes[_monumentId][_user];
    }

    function getMonumentStakers(
        uint256 _monumentId
    ) external view returns (address[] memory) {
        return monumentStakers[_monumentId];
    }

    function getStakersCount(
        uint256 _monumentId
    ) external view returns (uint256) {
        return monumentStakers[_monumentId].length;
    }

    function getAllMonuments() external view returns (uint256[] memory) {
        uint256[] memory ids = new uint256[](nextMonumentId - 1);
        for (uint256 i = 1; i < nextMonumentId; i++) {
            ids[i - 1] = i;
        }
        return ids;
    }

    function getCampaign(
        uint256 _campaignId
    ) external view returns (Campaign memory) {
        return campaigns[_campaignId];
    }

    // Get dynamic level thresholds for display
    function getCurrentLevelThresholds(
        address _fanTokenAddress
    ) external view returns (uint256[6] memory) {
        IERC20 monumentToken = IERC20(_fanTokenAddress);
        uint256 totalSupply = monumentToken.totalSupply();
        uint256[6] memory thresholds;

        for (uint256 i = 0; i < 6; i++) {
            thresholds[i] = (totalSupply * levelPercentages[i]) / 100;
        }

        return thresholds;
    }

    function getMonumentLevelProgress(
        uint256 _monumentId
    )
        external
        view
        returns (
            uint256 currentLevel,
            uint256 currentStaked,
            uint256 nextLevelThreshold,
            uint256 progressPercentage
        )
    {
        Monument memory m = monuments[_monumentId];
        address tokenAddress = getMonumentTokenAddress(_monumentId);
        currentLevel = calculateLevel(m.totalStaked, tokenAddress);
        currentStaked = m.totalStaked;

        IERC20 monumentToken = IERC20(tokenAddress);
        uint256 totalSupply = monumentToken.totalSupply();
        if (currentLevel < 5) {
            nextLevelThreshold =
                (totalSupply * levelPercentages[currentLevel + 1]) /
                100;
            if (nextLevelThreshold > 0) {
                progressPercentage = (currentStaked * 100) / nextLevelThreshold;
            }
        } else {
            nextLevelThreshold = currentStaked; // Max level reached
            progressPercentage = 100;
        }
    }

    function getTotalMonuments() external view returns (uint256) {
        return nextMonumentId - 1;
    }

    function getTotalStakedTokens(
        address _fanTokenAddress
    ) external view returns (uint256) {
        IERC20 monumentToken = IERC20(_fanTokenAddress);
        return monumentToken.balanceOf(address(this));
    }

    // Get all registered clubs
    function getRegisteredClubs() external view returns (string[] memory) {
        return registeredClubs;
    }

    // Get club token address by name
    function getClubTokenAddress(
        string memory _clubName
    ) external view returns (address) {
        return clubTokens[_clubName];
    }

    // Check if a club is registered
    function isClubRegistered(
        string memory _clubName
    ) external view returns (bool) {
        return clubTokens[_clubName] != address(0);
    }

    // Function to update protocol fee percentage (only owner)
    function setProtocolFeePercent(uint256 _newPercent) external onlyOwner {
        require(_newPercent <= 100, "Fee cannot exceed 100%");
        protocolFeePercent = _newPercent;
    }

    // NEW: Check if coordinates are already used
    function areCoordinatesUsed(
        int32 _latitude,
        int32 _longitude
    ) external view returns (bool) {
        bytes32 coordinateHash = keccak256(
            abi.encodePacked(_latitude, _longitude)
        );
        return usedCoordinates[coordinateHash];
    }
}
