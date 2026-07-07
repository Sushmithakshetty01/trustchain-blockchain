import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  campaigns as mockCampaigns,
  charities as mockCharities,
  donations as mockDonations,
  proofs as mockProofs,
  withdrawals as mockWithdrawals,
  users as mockUsers,
} from '../utils/mockData.js';

import {
  connectWallet as connectWalletOnChain,
  changeWalletAccount as changeWalletAccountOnChain,
  getWalletBalance,
  createCampaignOnChain,
  donateOnChain,
  addExpenseProofOnChain,
  verifyCharityOnChain,
} from '../services/blockchain.js';

const AppContext = createContext(null);

const STORAGE_KEY = 'trustchain-demo-state-v1';

const initialState = {
  currentUser: null,

  wallet: {
    connected: false,
    address: '',
    chainId: null,
    balance: '0',
  },

  users: mockUsers || [],
  charities: mockCharities || [],
  campaigns: mockCampaigns || [],
  donations: mockDonations || [],
  proofs: mockProofs || [],
  withdrawals: mockWithdrawals || [],

  toast: null,
};

function loadInitialState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return initialState;

    const parsed = JSON.parse(saved);

    return {
      ...initialState,
      ...parsed,
      wallet: {
        ...initialState.wallet,
        ...(parsed.wallet || {}),
      },
    };
  } catch {
    return initialState;
  }
}

export function AppProvider({ children }) {
  const [state, setState] = useState(loadInitialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  function showToast(message, type = 'success') {
    setState((prev) => ({
      ...prev,
      toast: {
        id: Date.now(),
        message,
        type,
      },
    }));

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        toast: null,
      }));
    }, 2800);
  }

  function clearToast() {
    setState((prev) => ({
      ...prev,
      toast: null,
    }));
  }

  useEffect(() => {
    if (!window.ethereum) return;

    function handleAccountsChanged(accounts) {
      const address = accounts?.[0] || '';

      if (!address) {
        setState((prev) => ({
          ...prev,
          wallet: {
            connected: false,
            address: '',
            chainId: null,
            balance: '0',
          },
        }));

        return;
      }

      getWalletBalance(address)
        .then((balance) => {
          setState((prev) => ({
            ...prev,
            wallet: {
              ...prev.wallet,
              connected: true,
              address,
              balance,
            },
          }));
        })
        .catch(() => {});
    }

    function handleChainChanged() {
      window.location.reload();
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  function login({ name, email, role, organizationName, description }) {
    const userId = `user-${Date.now()}`;

    const user = {
      id: userId,
      name,
      email,
      role,
      walletAddress:
        state.wallet.address ||
        '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    };

    const newCharity =
      role === 'charity'
        ? {
            id: `charity-${Date.now()}`,
            userId,
            organizationName: organizationName || name,
            description:
              description ||
              'New charity registered on TrustChain and waiting for admin verification.',
            walletAddress:
              state.wallet.address ||
              '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
            verificationStatus: 'pending',
            trustScore: 60,
          }
        : null;

    setState((prev) => ({
      ...prev,
      users: [user, ...prev.users],
      charities: newCharity ? [newCharity, ...prev.charities] : prev.charities,
      currentUser: user,
    }));

    showToast(
      role === 'charity'
        ? 'Charity registered and sent for admin verification'
        : `Welcome, ${name}`
    );
  }

  function logout() {
    setState((prev) => ({
      ...prev,
      currentUser: null,
    }));

    showToast('Logged out successfully');
  }

  async function connectWallet() {
    try {
      const wallet = await connectWalletOnChain();
      const balance = await getWalletBalance(wallet.address);

      setState((prev) => ({
        ...prev,
        wallet: {
          connected: true,
          address: wallet.address,
          chainId: wallet.chainId,
          balance,
        },
      }));

      showToast('MetaMask wallet connected');
      return wallet;
    } catch (error) {
      showToast(error.message || 'Wallet connection failed', 'error');
      throw error;
    }
  }

  async function changeWalletAccount() {
    try {
      const wallet = await changeWalletAccountOnChain();
      const balance = await getWalletBalance(wallet.address);

      setState((prev) => ({
        ...prev,
        wallet: {
          connected: true,
          address: wallet.address,
          chainId: wallet.chainId,
          balance,
        },
      }));

      showToast('MetaMask account changed');
      return wallet;
    } catch (error) {
      showToast(error.message || 'Account change failed', 'error');
      throw error;
    }
  }

  async function donateToCampaign(campaign, amountEth) {
    try {
      if (!campaign) {
        throw new Error('Campaign not found.');
      }

      if (!amountEth || Number(amountEth) <= 0) {
        throw new Error('Enter a valid ETH amount.');
      }

      const blockchainCampaignId = campaign.blockchainId;

      if (!blockchainCampaignId) {
        throw new Error(
          'This campaign is not created on blockchain yet. Please donate to the seeded campaigns only.'
        );
      }

      if (!state.wallet.connected) {
        await connectWallet();
      }

      showToast('Confirm the transaction in MetaMask...');

      const chainResult = await donateOnChain({
        campaignId: blockchainCampaignId,
        amountEth,
      });

      const donation = {
        id: `donation-${Date.now()}`,
        campaignId: campaign.id,
        blockchainId: blockchainCampaignId,
        campaignTitle: campaign.title,
        donorAddress: chainResult.donorAddress,
        amount: Number(amountEth),
        amountEth: String(amountEth),
        txHash: chainResult.txHash,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,

        wallet: {
          ...prev.wallet,
          connected: true,
          address: chainResult.donorAddress,
          balance: chainResult.balance,
        },

        donations: [donation, ...prev.donations],

        campaigns: prev.campaigns.map((item) => {
          if (item.id !== campaign.id) return item;

          const oldRaised = Number(item.raised || item.raisedAmount || 0);
          const newRaised = oldRaised + Number(amountEth);

          return {
            ...item,
            raised: newRaised,
            raisedAmount: newRaised,
          };
        }),
      }));

      showToast('Donation successful. Transaction confirmed.');
      return donation;
    } catch (error) {
      console.error('DONATION ERROR:', error);
      showToast(error.message || 'Donation failed', 'error');
      throw error;
    }
  }

  async function createCampaign(payload) {
    let txHash = '';

    try {
      const chainResult = await createCampaignOnChain({
        title: payload.title,
        description: payload.description,
        goalAmount: payload.goal || payload.goalAmount || 1,
      });

      txHash = chainResult.txHash;
    } catch (error) {
      console.warn('Blockchain campaign creation skipped/failed:', error);
    }

    const campaign = {
      id: `campaign-${Date.now()}`,
      blockchainId: null,
      title: payload.title,
      description: payload.description,
      image:
        payload.image ||
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=85',
      category: payload.category || 'Relief',
      goal: Number(payload.goal || payload.goalAmount || 1),
      goalAmount: Number(payload.goal || payload.goalAmount || 1),
      raised: 0,
      raisedAmount: 0,
      charityId: payload.charityId || state.currentUser?.id || 'charity-demo',
      charityName:
        payload.charityName ||
        payload.organizationName ||
        state.currentUser?.name ||
        'TrustChain Charity',
      status: 'active',
      txHash,
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      campaigns: [campaign, ...prev.campaigns],
    }));

    showToast('Campaign created successfully');
    return campaign;
  }

  async function addProof(payload) {
    const campaign = state.campaigns.find(
      (item) => item.id === payload.campaignId
    );

    let proofTxHash = '';

    try {
      if (campaign?.blockchainId) {
        const chainResult = await addExpenseProofOnChain({
          campaignId: campaign.blockchainId,
          amountUsed: payload.amountUsed,
          purpose: payload.purpose,
          ipfsHash: payload.ipfsHash || payload.cid || payload.ipfsCid,
        });

        proofTxHash = chainResult.txHash;
      }
    } catch (error) {
      console.warn('Blockchain proof transaction skipped/failed:', error);
    }

    const proof = {
      id: `proof-${Date.now()}`,
      campaignId: payload.campaignId,
      blockchainId: campaign?.blockchainId || null,
      campaignTitle: campaign?.title || 'Campaign',
      amountUsed: Number(payload.amountUsed || payload.amount || 0),
      purpose: payload.purpose,
      ipfsHash: payload.ipfsHash || payload.cid || payload.ipfsCid,
      txHash: proofTxHash,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      proofs: [proof, ...prev.proofs],
    }));

    showToast('Proof hash stored. Waiting for admin verification.');
    return proof;
  }

  function verifyProof(proofId) {
    setState((prev) => ({
      ...prev,
      proofs: prev.proofs.map((proof) =>
        proof.id === proofId
          ? {
              ...proof,
              status: 'verified',
              verifiedAt: new Date().toISOString(),
            }
          : proof
      ),
    }));

    showToast('Proof verified successfully');
  }

  async function verifyCharity(charityId) {
    const charity = state.charities.find((item) => item.id === charityId);

    if (!charity) {
      showToast('Charity not found', 'error');
      return;
    }

    try {
      if (charity.walletAddress && charity.walletAddress.startsWith('0x')) {
        try {
          await verifyCharityOnChain(charity.walletAddress);
        } catch (error) {
          console.warn('Blockchain charity verification skipped:', error);
        }
      }

      setState((prev) => ({
        ...prev,
        charities: prev.charities.map((item) =>
          item.id === charityId
            ? {
                ...item,
                verificationStatus: 'verified',
                trustScore: Math.max(item.trustScore || 0, 85),
              }
            : item
        ),
      }));

      showToast('Charity verified successfully');
    } catch (error) {
      showToast(error.message || 'Charity verification failed', 'error');
      throw error;
    }
  }

  function requestWithdrawal(payload) {
    const campaign = state.campaigns.find(
      (item) => item.id === payload.campaignId
    );

    const withdrawal = {
      id: `withdrawal-${Date.now()}`,
      campaignId: payload.campaignId,
      campaignTitle: campaign?.title || 'Campaign',
      amount: Number(payload.amount || 0),
      reason: payload.reason || payload.purpose || 'Fund withdrawal request',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      withdrawals: [withdrawal, ...prev.withdrawals],
    }));

    showToast('Withdrawal request sent to admin');
    return withdrawal;
  }

  function approveWithdrawal(withdrawalId) {
    setState((prev) => ({
      ...prev,
      withdrawals: prev.withdrawals.map((withdrawal) =>
        withdrawal.id === withdrawalId
          ? {
              ...withdrawal,
              status: 'approved',
              approvedAt: new Date().toISOString(),
            }
          : withdrawal
      ),
    }));

    showToast('Withdrawal approved successfully');
  }

  function resetDemoData() {
    localStorage.removeItem(STORAGE_KEY);
    setState(initialState);
    showToast('Demo data reset');
  }

  const value = useMemo(
    () => ({
      ...state,

      showToast,
      clearToast,

      login,
      logout,

      connectWallet,
      changeWalletAccount,

      donateToCampaign,
      donate: donateToCampaign,
      makeDonation: donateToCampaign,

      createCampaign,
      addProof,
      verifyProof,
      verifyCharity,
      requestWithdrawal,
      approveWithdrawal,

      resetDemoData,
    }),
    [state]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useApp must be used inside AppProvider');
  }

  return context;
}