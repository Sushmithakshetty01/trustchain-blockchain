import { Link } from 'react-router-dom';
import { FileCheck2, PlusCircle, WalletCards } from 'lucide-react';
import Toast from '../components/Toast.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function CharityDashboard() {
  const { campaigns, proofs, withdrawals, requestWithdrawal } = useApp();
  async function withdraw(campaign) {
    const amount = prompt('Withdrawal amount ETH', '0.1');
    if (!amount) return;
    await requestWithdrawal({ campaignId: campaign.id, amount, reason: `Withdrawal request for ${campaign.title}` });
  }
  return (
    <><Toast /><section className="container page-head narrow"><p className="eyebrow">Charity dashboard</p><h1>Create campaigns, upload proofs, and request withdrawals.</h1><p>Charities can show transparent fund usage by uploading bills to IPFS and storing proof CIDs.</p></section><section className="container charity-actions"><Link to="/create-campaign" className="btn btn-primary btn-large"><PlusCircle size={18} /> Create Campaign</Link><Link to="/proofs" className="btn btn-glass btn-large"><FileCheck2 size={18} /> Upload Proof</Link></section><section className="container charity-dashboard-grid"><div className="card admin-panel"><div className="panel-heading"><div><p className="eyebrow">Campaigns</p><h2>Your active campaigns</h2></div></div><div className="admin-list">{campaigns.map((campaign) => <div className="admin-list-card" key={campaign.id}><div><h3>{campaign.title}</h3><p>{campaign.description}</p><div className="mini-meta"><span>Raised: {campaign.raised || campaign.raisedAmount} ETH</span><span>Blockchain ID: {campaign.blockchainId || 'Local only'}</span></div></div><button className="btn btn-primary" onClick={() => withdraw(campaign)}><WalletCards size={17} /> Request Withdrawal</button></div>)}</div></div><aside className="charity-sidebar"><div className="card withdrawal-status-card"><h3>Proofs uploaded</h3><strong>{proofs.length}</strong><p>Uploaded proof records waiting for admin verification.</p></div><div className="card withdrawal-status-card"><h3>Withdrawals</h3><strong>{withdrawals.length}</strong><p>Fund release requests sent to admin.</p></div></aside></section></>
  );
}
