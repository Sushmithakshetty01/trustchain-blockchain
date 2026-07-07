const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('CharityDonationTracker', function () {
  it('creates campaign and accepts donation', async function () {
    const [owner, donor] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory('CharityDonationTracker');
    const tracker = await Factory.deploy();
    await tracker.waitForDeployment();
    await tracker.createCampaign('Food', 'Food kits', ethers.parseEther('10'));
    await tracker.connect(donor).donateToCampaign(1, { value: ethers.parseEther('1') });
    const campaign = await tracker.campaigns(1);
    expect(campaign.raisedAmount).to.equal(ethers.parseEther('1'));
  });
});
