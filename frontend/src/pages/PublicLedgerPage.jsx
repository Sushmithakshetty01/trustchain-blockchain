import { ExternalLink, Search } from 'lucide-react';
import Toast from '../components/Toast.jsx';
import { useApp } from '../context/AppContext.jsx';

function short(value) { if (!value) return 'N/A'; return `${value.slice(0, 12)}...${value.slice(-8)}`; }

export default function PublicLedgerPage() {
  const { donations, proofs } = useApp();
  return <><Toast /><section className="container page-head narrow"><p className="eyebrow">Public ledger</p><h1>Every donation and proof is auditable.</h1><p>View real transaction hashes, donation status, and IPFS proof CIDs in one public ledger.</p></section><section className="container ledger-layout"><div className="card"><div className="section-heading compact"><p className="eyebrow">Donations</p><h2>Donation transactions</h2></div><div className="ledger-list">{donations.map((d) => <div className="ledger-row" key={d.id}><div><strong>{d.amount || d.amountEth} ETH</strong><p>{d.campaignTitle}</p></div><div><small>Donor</small><p>{short(d.donorAddress)}</p></div><div><small>Tx hash</small><p>{short(d.txHash)}</p></div><span className="status-chip status-success">{d.status}</span></div>)}</div></div><div className="card"><div className="section-heading compact"><p className="eyebrow">Proofs</p><h2>IPFS proof records</h2></div><div className="ledger-list">{proofs.map((p) => <div className="ledger-row" key={p.id}><div><strong>{p.amountUsed} ETH used</strong><p>{p.campaignTitle}</p></div><div><small>CID</small><p>{short(p.ipfsHash)}</p></div><div><small>Status</small><p>{p.status}</p></div><span className="status-chip status-warning"><Search size={14} /> Audit</span></div>)}</div></div></section></>;
}
