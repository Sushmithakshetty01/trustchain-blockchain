const hre = require('hardhat');

async function createSeedCampaign(tracker, title, description, goalEth) {
  const { ethers } = hre;
  console.log(`Creating campaign: ${title}`);
  const tx = await tracker.createCampaign(title, description, ethers.parseEther(goalEth));
  await tx.wait();
  console.log(`Created campaign: ${title} | Goal: ${goalEth} ETH`);
}

async function main() {
  const { ethers } = hre;
  const [deployer] = await ethers.getSigners();
  console.log('Deploying TrustChain contract with:', deployer.address);
  const CharityDonationTracker = await ethers.getContractFactory('CharityDonationTracker');
  const tracker = await CharityDonationTracker.deploy();
  await tracker.waitForDeployment();
  const contractAddress = await tracker.getAddress();
  console.log('CharityDonationTracker deployed to:', contractAddress);

  console.log('\nCreating demo campaigns on-chain...');
  await createSeedCampaign(tracker, 'Food for Children', 'Emergency food kit support campaign for underprivileged children.', '10');
  await createSeedCampaign(tracker, 'Medical Aid Support', 'Medical assistance campaign for urgent treatment and medicines.', '8');
  await createSeedCampaign(tracker, 'Education Kit Drive', 'School supplies and learning material support for students.', '6');
  await createSeedCampaign(tracker, 'Women Hygiene Support', 'Sanitary essentials and hygiene support campaign.', '5');
  await createSeedCampaign(tracker, 'Disaster Relief Fund', 'Emergency relief for flood and storm affected families.', '12');
  await createSeedCampaign(tracker, 'Clean Water Mission', 'Clean drinking water filters and water access projects.', '7');

  console.log('\nDeployment completed successfully.');
  console.log('\nCopy this into frontend/.env:');
  console.log(`VITE_CONTRACT_ADDRESS=${contractAddress}`);
  console.log('VITE_CHAIN_ID=31337');
  console.log('\nCampaign IDs: campaign-1 to campaign-6 map to blockchain IDs 1 to 6.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
