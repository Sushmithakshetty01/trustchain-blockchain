import { ArrowLeft, CalendarDays, CheckCircle2, HeartHandshake, ShieldCheck, Target, Wallet } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import Toast from '../components/Toast.jsx';
import { useApp } from '../context/AppContext.jsx';

function formatEth(value) { const number = Number(value || 0); return `${number.toFixed(number % 1 === 0 ? 0 : 3)} ETH`; }
function shortAddress(address) { if (!address) return 'Not connected'; return `${address.slice(0, 6)}...${address.slice(-4)}`; }
function getProgress(raised, goal) { return Math.min(100, Math.round((Number(raised || 0) / Number(goal || 1)) * 100)); }

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const { campaigns, donations, wallet, connectWallet, donateToCampaign } = useApp();
  const [amount, setAmount] = useState('0.01');
  const [donating, setDonating] = useState(false);
  const campaign = useMemo(() => campaigns.find((item) => String(item.id) === String(id)), [campaigns, id]);
  const campaignDonations = useMemo(() => donations.filter((donation) => String(donation.campaignId) === String(id)), [donations, id]);
  if (!campaign) return <section className="container page-head narrow"><p className="eyebrow">Campaign not found</p><h1>This campaign does not exist.</h1><Link to="/campaigns" className="btn btn-primary"><ArrowLeft size={18} /> Back to campaigns</Link></section>;
  const raised = Number(campaign.raised || campaign.raisedAmount || 0);
  const goal = Number(campaign.goal || campaign.goalAmount || 1);
  const progress = getProgress(raised, goal);
  async function handleDonate(event) {
    event.preventDefault();
    if (!amount || Number(amount) <= 0) return alert('Please enter a valid ETH amount.');
    try { setDonating(true); await donateToCampaign(campaign, amount); setAmount('0.01'); }
    catch (error) { alert(error.message || 'Donation failed.'); }
    finally { setDonating(false); }
  }
  return (
    <>
      <Toast />
      <section className="container campaign-detail-layout">
        <div className="campaign-detail-main">
          <Link to="/campaigns" className="back-link"><ArrowLeft size={18} /> Back to campaigns</Link>
          <div className="card campaign-detail-card">
            <div className="campaign-detail-image"><img src={campaign.image} alt={campaign.title} /><span className="category-pill">{campaign.category}</span></div>
            <div className="campaign-detail-content">
              <p className="eyebrow">Verified campaign · Blockchain ID #{campaign.blockchainId || 'local'}</p>
              <h1>{campaign.title}</h1>
              <p className="campaign-detail-description">{campaign.description}</p>
              <div className="campaign-detail-meta"><span><ShieldCheck size={17} /> {campaign.charityName}</span><span><CalendarDays size={17} /> {new Date(campaign.createdAt).toLocaleDateString()}</span></div>
              <div className="progress-block"><div className="fund-row"><div><small>Raised</small><strong>{formatEth(raised)}</strong></div><div><small>Goal</small><strong>{formatEth(goal)}</strong></div></div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div><div className="progress-note"><span>{progress}% funded</span><span>{campaignDonations.length} donations</span></div></div>
              <div className="trust-points"><div><CheckCircle2 size={18} /><span>Real MetaMask transaction</span></div><div><CheckCircle2 size={18} /><span>Blockchain transaction hash saved</span></div><div><CheckCircle2 size={18} /><span>Donation ledger is publicly auditable</span></div></div>
            </div>
          </div>
          <div className="card"><div className="section-heading compact"><p className="eyebrow">Recent donations</p><h2>Campaign donation history</h2></div><div className="ledger-list">{campaignDonations.length === 0 && <p className="muted">No donations yet. Be the first donor for this campaign.</p>}{campaignDonations.map((donation) => <div className="ledger-row" key={donation.id}><div><strong>{formatEth(donation.amount || donation.amountEth)}</strong><p>Donor: {shortAddress(donation.donorAddress)}</p></div><div><small>Transaction</small><p>{shortAddress(donation.txHash)}</p></div><span className="status-chip status-success">{donation.status || 'confirmed'}</span></div>)}</div></div>
        </div>
        <aside className="campaign-donate-sidebar">
          <form className="card donate-box" onSubmit={handleDonate}>
            <div className="donate-icon"><HeartHandshake size={26} /></div><h2>Donate with MetaMask</h2><p>This sends a real transaction from your selected MetaMask account to the deployed TrustChain smart contract.</p>
            <label>Donation amount ETH<input type="number" min="0.001" step="0.001" value={amount} onChange={(e) => setAmount(e.target.value)} required /></label>
            <div className="wallet-mini-card"><div><small>Wallet</small><strong>{shortAddress(wallet.address)}</strong></div><div><small>Balance</small><strong>{Number(wallet.balance || 0).toFixed(4)} ETH</strong></div></div>
            {!wallet.connected ? <button type="button" className="btn btn-glass btn-large" onClick={connectWallet}><Wallet size={18} /> Connect Wallet</button> : <button type="submit" className="btn btn-primary btn-large" disabled={donating}><Wallet size={18} /> {donating ? 'Confirming transaction...' : 'Donate with MetaMask'}</button>}
            <div className="donate-note"><Target size={16} /> Make sure MetaMask is on Hardhat Local network.</div>
          </form>
          <div className="card chain-info-panel"><h3>Real blockchain flow</h3><ol className="number-list"><li>Click Donate with MetaMask</li><li>Confirm transaction in MetaMask</li><li>ETH moves to the smart contract</li><li>Transaction hash is saved in the ledger</li></ol></div>
        </aside>
      </section>
    </>
  );
}
