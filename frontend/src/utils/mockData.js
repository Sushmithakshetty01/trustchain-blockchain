export const users = [
  {
    id: 'user-admin-1',
    name: 'TrustChain Admin',
    email: 'admin@trustchain.org',
    role: 'admin',
    walletAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  },
  {
    id: 'user-charity-1',
    name: 'Hope Relief Foundation',
    email: 'charity@trustchain.org',
    role: 'charity',
    walletAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  },
  {
    id: 'user-donor-1',
    name: 'Demo Donor',
    email: 'donor@trustchain.org',
    role: 'donor',
    walletAddress: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
  },
];

export const charities = [
  {
    id: 'charity-1',
    userId: 'user-charity-1',
    organizationName: 'Hope Relief Foundation',
    description:
      'A verified charity supporting food, healthcare, education, and emergency relief campaigns.',
    walletAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    verificationStatus: 'verified',
    trustScore: 92,
  },
  {
    id: 'charity-2',
    userId: 'user-charity-2',
    organizationName: 'CareBridge Trust',
    description:
      'A registered charity focused on transparent relief fund distribution.',
    walletAddress: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
    verificationStatus: 'pending',
    trustScore: 64,
  },
];

export const campaigns = [
  {
    id: 'campaign-1',
    blockchainId: 1,
    title: 'Food for Children',
    description:
      'Provide nutritious food kits to children from low-income families. Every donation is tracked through blockchain and proof bills are uploaded to IPFS.',
    image:
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=85',
    category: 'Food Relief',
    goal: 10,
    goalAmount: 10,
    raised: 2.4,
    raisedAmount: 2.4,
    charityId: 'charity-1',
    charityName: 'Hope Relief Foundation',
    status: 'active',
    createdAt: '2026-06-20T10:00:00.000Z',
  },
  {
    id: 'campaign-2',
    blockchainId: 2,
    title: 'Medical Aid Support',
    description:
      'Support urgent treatment, medicines, hospital support, and emergency care for families who cannot afford healthcare expenses.',
    image:
      'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=85',
    category: 'Medical',
    goal: 8,
    goalAmount: 8,
    raised: 1.8,
    raisedAmount: 1.8,
    charityId: 'charity-1',
    charityName: 'Hope Relief Foundation',
    status: 'active',
    createdAt: '2026-06-21T10:00:00.000Z',
  },
  {
    id: 'campaign-3',
    blockchainId: 3,
    title: 'Education Kit Drive',
    description:
      'Donate for school bags, books, uniforms, stationery, and learning kits for students who need support to continue their education.',
    image:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=85',
    category: 'Education',
    goal: 6,
    goalAmount: 6,
    raised: 0.9,
    raisedAmount: 0.9,
    charityId: 'charity-1',
    charityName: 'Hope Relief Foundation',
    status: 'active',
    createdAt: '2026-06-22T10:00:00.000Z',
  },
  {
    id: 'campaign-4',
    blockchainId: 4,
    title: 'Women Hygiene Support',
    description:
      'Help provide sanitary essentials, hygiene kits, awareness materials, and health support for women in underserved areas.',
    image:
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=85',
    category: 'Health',
    goal: 5,
    goalAmount: 5,
    raised: 1.2,
    raisedAmount: 1.2,
    charityId: 'charity-2',
    charityName: 'CareBridge Trust',
    status: 'active',
    createdAt: '2026-06-23T10:00:00.000Z',
  },
  {
    id: 'campaign-5',
    blockchainId: 5,
    title: 'Disaster Relief Fund',
    description:
      'Emergency relief campaign for families affected by floods, storms, and natural disasters with transparent fund tracking.',
    image:
      'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=85',
    category: 'Emergency',
    goal: 12,
    goalAmount: 12,
    raised: 3.1,
    raisedAmount: 3.1,
    charityId: 'charity-2',
    charityName: 'CareBridge Trust',
    status: 'active',
    createdAt: '2026-06-24T10:00:00.000Z',
  },
  {
    id: 'campaign-6',
    blockchainId: 6,
    title: 'Clean Water Mission',
    description:
      'Support clean drinking water filters and water access projects for rural communities through transparent donations.',
    image:
      'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=85',
    category: 'Water',
    goal: 7,
    goalAmount: 7,
    raised: 2.2,
    raisedAmount: 2.2,
    charityId: 'charity-2',
    charityName: 'CareBridge Trust',
    status: 'active',
    createdAt: '2026-06-25T10:00:00.000Z',
  },
];

export const donations = [];

export const proofs = [];

export const withdrawals = [];