import { ethers } from 'ethers';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const REQUIRED_CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID || 31337);

const CONTRACT_ABI = [
  'function createCampaign(string memory title, string memory description, uint256 goalAmount) external',
  'function donateToCampaign(uint256 campaignId) external payable',
  'function addExpenseProof(uint256 campaignId, uint256 amountUsed, string memory purpose, string memory ipfsHash) external',
  'function requestWithdrawal(uint256 campaignId, uint256 amount, string memory reason) external',
  'function approveWithdrawal(uint256 withdrawalId) external',
  'function verifyCharity(address charityAddress) external',
];

function ensureMetaMask() {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed.');
  }
}

export function getNumericCampaignId(campaignId) {
  if (campaignId === null || campaignId === undefined) {
    throw new Error('Blockchain campaign ID is missing.');
  }

  if (typeof campaignId === 'number') return campaignId;

  const value = String(campaignId);

  if (/^\d+$/.test(value)) {
    return Number(value);
  }

  const match = value.match(/\d+/);

  if (!match) {
    throw new Error(`Invalid campaign id: ${campaignId}`);
  }

  return Number(match[0]);
}

function getNumericId(value) {
  const match = String(value).match(/\d+/);
  return match ? Number(match[0]) : Number(value);
}

export async function getProvider() {
  ensureMetaMask();
  return new ethers.BrowserProvider(window.ethereum);
}

export async function switchToHardhatNetwork() {
  ensureMetaMask();

  const chainIdHex = `0x${REQUIRED_CHAIN_ID.toString(16)}`;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    });
  } catch (error) {
    if (error.code === 4902 && REQUIRED_CHAIN_ID === 31337) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: chainIdHex,
            chainName: 'Hardhat Local',
            nativeCurrency: {
              name: 'Ethereum',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: ['http://127.0.0.1:8545'],
          },
        ],
      });

      return;
    }

    throw error;
  }
}

export async function connectWallet() {
  ensureMetaMask();

  await switchToHardhatNetwork();

  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });

  if (!accounts?.length) {
    throw new Error('No MetaMask account selected.');
  }

  const provider = await getProvider();
  const network = await provider.getNetwork();

  return {
    address: accounts[0],
    chainId: Number(network.chainId),
  };
}

export async function connectMetaMask() {
  return connectWallet();
}

export async function changeWalletAccount() {
  ensureMetaMask();

  await window.ethereum.request({
    method: 'wallet_requestPermissions',
    params: [{ eth_accounts: {} }],
  });

  return connectWallet();
}

export async function changeMetaMaskAccount() {
  return changeWalletAccount();
}

export async function getWalletBalance(address) {
  if (!address) return '0';

  const provider = await getProvider();
  const balance = await provider.getBalance(address);

  return ethers.formatEther(balance);
}

async function getSignedContract() {
  ensureMetaMask();

  if (!CONTRACT_ADDRESS) {
    throw new Error('VITE_CONTRACT_ADDRESS is missing in frontend .env');
  }

  await switchToHardhatNetwork();

  const provider = await getProvider();
  const signer = await provider.getSigner();

  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

export async function createCampaignOnChain({
  title,
  description,
  goalAmount,
  goal,
}) {
  if (!title) {
    throw new Error('Campaign title is required.');
  }

  const finalGoal = goalAmount || goal || '1';

  if (Number(finalGoal) <= 0) {
    throw new Error('Enter a valid goal amount.');
  }

  const contract = await getSignedContract();

  const tx = await contract.createCampaign(
    title,
    description || '',
    ethers.parseEther(String(finalGoal))
  );

  const receipt = await tx.wait();

  return {
    txHash: tx.hash,
    receipt,
  };
}

export async function donateOnChain({ campaignId, amountEth }) {
  if (!amountEth || Number(amountEth) <= 0) {
    throw new Error('Enter a valid ETH amount.');
  }

  const contract = await getSignedContract();
  const provider = await getProvider();
  const signer = await provider.getSigner();
  const donorAddress = await signer.getAddress();

  const numericCampaignId = getNumericCampaignId(campaignId);

  console.log('Sending real MetaMask donation transaction...');
  console.log('Campaign ID:', numericCampaignId);
  console.log('Amount ETH:', amountEth);

  const tx = await contract.donateToCampaign(numericCampaignId, {
    value: ethers.parseEther(String(amountEth)),
  });

  const receipt = await tx.wait();
  const balance = await getWalletBalance(donorAddress);

  return {
    txHash: tx.hash,
    receipt,
    donorAddress,
    campaignId: numericCampaignId,
    amountEth: String(amountEth),
    balance,
  };
}

export async function donateToCampaignOnChain(payload) {
  return donateOnChain(payload);
}

export async function addExpenseProofOnChain({
  campaignId,
  amountUsed,
  purpose,
  ipfsHash,
}) {
  if (!ipfsHash) {
    throw new Error('IPFS CID is required.');
  }

  if (!purpose) {
    throw new Error('Proof purpose is required.');
  }

  const contract = await getSignedContract();

  const numericCampaignId = getNumericCampaignId(campaignId);
  const amountUsedWei = ethers.parseEther(String(amountUsed || '0'));

  console.log('Sending expense proof transaction...');
  console.log('Campaign ID:', numericCampaignId);
  console.log('Amount used:', amountUsed);
  console.log('IPFS CID:', ipfsHash);

  const tx = await contract.addExpenseProof(
    numericCampaignId,
    amountUsedWei,
    purpose,
    ipfsHash
  );

  const receipt = await tx.wait();

  return {
    txHash: tx.hash,
    receipt,
    campaignId: numericCampaignId,
    amountUsed: String(amountUsed || '0'),
    purpose,
    ipfsHash,
  };
}

export async function requestWithdrawalOnChain({
  campaignId,
  amount,
  reason,
}) {
  const contract = await getSignedContract();

  const numericCampaignId = getNumericCampaignId(campaignId);
  const amountWei = ethers.parseEther(String(amount || '0'));

  const tx = await contract.requestWithdrawal(
    numericCampaignId,
    amountWei,
    reason || 'Withdrawal request'
  );

  const receipt = await tx.wait();

  return {
    txHash: tx.hash,
    receipt,
  };
}

export async function approveWithdrawalOnChain(withdrawalId) {
  const contract = await getSignedContract();

  const numericWithdrawalId = getNumericId(withdrawalId);

  const tx = await contract.approveWithdrawal(numericWithdrawalId);
  const receipt = await tx.wait();

  return {
    txHash: tx.hash,
    receipt,
  };
}

export async function verifyCharityOnChain(charityAddress) {
  if (!charityAddress || !ethers.isAddress(charityAddress)) {
    throw new Error(
      `Invalid charity wallet address: ${charityAddress}. Please use a real 0x wallet address.`
    );
  }

  const contract = await getSignedContract();

  const tx = await contract.verifyCharity(charityAddress);
  const receipt = await tx.wait();

  return {
    txHash: tx.hash,
    receipt,
  };
}