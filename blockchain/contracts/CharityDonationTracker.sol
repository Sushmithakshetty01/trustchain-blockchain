// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CharityDonationTracker {
    address public owner;
    uint256 public campaignCount;
    uint256 public donationCount;
    uint256 public proofCount;
    uint256 public withdrawalCount;

    struct Campaign {
        uint256 id;
        string title;
        string description;
        address payable charity;
        uint256 goalAmount;
        uint256 raisedAmount;
        bool active;
    }

    struct Donation {
        uint256 id;
        uint256 campaignId;
        address donor;
        uint256 amount;
        uint256 timestamp;
    }

    struct ExpenseProof {
        uint256 id;
        uint256 campaignId;
        uint256 amountUsed;
        string purpose;
        string ipfsHash;
        address uploadedBy;
        uint256 timestamp;
        bool verified;
    }

    struct Withdrawal {
        uint256 id;
        uint256 campaignId;
        address payable charity;
        uint256 amount;
        string reason;
        bool approved;
        uint256 timestamp;
    }

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => Donation) public donations;
    mapping(uint256 => ExpenseProof) public proofs;
    mapping(uint256 => Withdrawal) public withdrawals;
    mapping(address => bool) public verifiedCharities;

    event CampaignCreated(uint256 indexed campaignId, address indexed charity, string title);
    event DonationReceived(uint256 indexed donationId, uint256 indexed campaignId, address indexed donor, uint256 amount);
    event ExpenseProofAdded(uint256 indexed proofId, uint256 indexed campaignId, string ipfsHash);
    event ProofVerified(uint256 indexed proofId);
    event WithdrawalRequested(uint256 indexed withdrawalId, uint256 indexed campaignId, uint256 amount);
    event WithdrawalApproved(uint256 indexed withdrawalId, uint256 amount);
    event CharityVerified(address indexed charity);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        verifiedCharities[msg.sender] = true;
    }

    function verifyCharity(address charityAddress) external onlyOwner {
        verifiedCharities[charityAddress] = true;
        emit CharityVerified(charityAddress);
    }

    function createCampaign(
        string memory title,
        string memory description,
        uint256 goalAmount
    ) external returns (uint256) {
        require(goalAmount > 0, "Goal must be greater than zero");
        campaignCount++;
        campaigns[campaignCount] = Campaign({
            id: campaignCount,
            title: title,
            description: description,
            charity: payable(msg.sender),
            goalAmount: goalAmount,
            raisedAmount: 0,
            active: true
        });
        emit CampaignCreated(campaignCount, msg.sender, title);
        return campaignCount;
    }

    function donateToCampaign(uint256 campaignId) external payable {
        require(campaignId > 0 && campaignId <= campaignCount, "Campaign not found");
        require(campaigns[campaignId].active, "Campaign inactive");
        require(msg.value > 0, "Donation must be greater than zero");
        campaigns[campaignId].raisedAmount += msg.value;
        donationCount++;
        donations[donationCount] = Donation({
            id: donationCount,
            campaignId: campaignId,
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        });
        emit DonationReceived(donationCount, campaignId, msg.sender, msg.value);
    }

    function addExpenseProof(
        uint256 campaignId,
        uint256 amountUsed,
        string memory purpose,
        string memory ipfsHash
    ) external {
        require(campaignId > 0 && campaignId <= campaignCount, "Campaign not found");
        require(bytes(ipfsHash).length > 0, "IPFS hash required");
        proofCount++;
        proofs[proofCount] = ExpenseProof({
            id: proofCount,
            campaignId: campaignId,
            amountUsed: amountUsed,
            purpose: purpose,
            ipfsHash: ipfsHash,
            uploadedBy: msg.sender,
            timestamp: block.timestamp,
            verified: false
        });
        emit ExpenseProofAdded(proofCount, campaignId, ipfsHash);
    }

    function verifyProof(uint256 proofId) external onlyOwner {
        require(proofId > 0 && proofId <= proofCount, "Proof not found");
        proofs[proofId].verified = true;
        emit ProofVerified(proofId);
    }

    function requestWithdrawal(
        uint256 campaignId,
        uint256 amount,
        string memory reason
    ) external {
        require(campaignId > 0 && campaignId <= campaignCount, "Campaign not found");
        require(msg.sender == campaigns[campaignId].charity, "Only campaign charity");
        require(amount > 0, "Amount required");
        withdrawalCount++;
        withdrawals[withdrawalCount] = Withdrawal({
            id: withdrawalCount,
            campaignId: campaignId,
            charity: campaigns[campaignId].charity,
            amount: amount,
            reason: reason,
            approved: false,
            timestamp: block.timestamp
        });
        emit WithdrawalRequested(withdrawalCount, campaignId, amount);
    }

    function approveWithdrawal(uint256 withdrawalId) external onlyOwner {
        require(withdrawalId > 0 && withdrawalId <= withdrawalCount, "Withdrawal not found");
        Withdrawal storage withdrawal = withdrawals[withdrawalId];
        require(!withdrawal.approved, "Already approved");
        require(address(this).balance >= withdrawal.amount, "Insufficient contract balance");
        withdrawal.approved = true;
        withdrawal.charity.transfer(withdrawal.amount);
        emit WithdrawalApproved(withdrawalId, withdrawal.amount);
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
