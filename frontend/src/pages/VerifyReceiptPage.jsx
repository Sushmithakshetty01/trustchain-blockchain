import { Search, ShieldCheck } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import Toast from '../components/Toast.jsx';
import { useApp } from '../context/AppContext.jsx';

function short(value) { if (!value) return 'N/A'; return `${value.slice(0, 12)}...${value.slice(-8)}`; }

export default function VerifyReceiptPage() {
  const { txHash } = useParams();
  const { donations } = useApp();
  const [query, setQuery] = useState(txHash || '');
  const result = useMemo(() => donations.find((d) => d.txHash?.toLowerCase() === query.toLowerCase()), [donations, query]);
  return <><Toast /><section className="container tc-verify-page"><div className="tc-verify-head"><p className="eyebrow">Receipt verification</p><h1>Verify a donation receipt.</h1><p>Enter a transaction hash or scan the QR code from a donor receipt.</p></div><div className="card tc-verify-card"><div className="tc-verify-search"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Paste transaction hash" /><button className="btn btn-primary"><Search size={18} /> Verify</button></div>{result ? <div className="tc-verify-result"><div className="tc-verify-result-top"><ShieldCheck size={28} /><div><h2>Receipt verified</h2><p>This donation exists in the TrustChain ledger.</p></div><span className="status-chip status-success">Valid</span></div><div className="tc-verify-grid"><div><small>Campaign</small><strong>{result.campaignTitle}</strong></div><div><small>Amount</small><strong>{result.amount || result.amountEth} ETH</strong></div><div><small>Donor</small><strong>{short(result.donorAddress)}</strong></div><div><small>Tx</small><strong>{short(result.txHash)}</strong></div></div></div> : <div className="tc-verify-empty">No matching donation found yet.</div>}</div></section></>;
}
