import QRCode from 'react-qr-code';
import { Download, ExternalLink } from 'lucide-react';

function short(value) {
  if (!value) return 'N/A';
  return `${value.slice(0, 10)}...${value.slice(-8)}`;
}

export default function ReceiptCard({ donation }) {
  const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  const verifyUrl = `${appUrl}/verify/${donation.txHash}`;
  function printReceipt() { window.print(); }
  return (
    <article className="receipt-card trust-receipt-card">
      <div className="receipt-head">
        <div><small>TrustChain receipt</small><h3>{donation.campaignTitle}</h3></div>
        <div className="qr-box"><QRCode value={verifyUrl} size={96} /></div>
      </div>
      <div className="receipt-grid">
        <div><span>Amount</span><strong>{donation.amount || donation.amountEth} ETH</strong></div>
        <div><span>Donor</span><strong>{short(donation.donorAddress)}</strong></div>
        <div><span>Transaction</span><strong>{short(donation.txHash)}</strong></div>
        <div><span>Status</span><strong>{donation.status}</strong></div>
      </div>
      <div className="receipt-actions">
        <a className="btn btn-glass" href={verifyUrl} target="_blank" rel="noreferrer"><ExternalLink size={16} /> Verify</a>
        <button className="btn btn-primary" onClick={printReceipt}><Download size={16} /> Print</button>
      </div>
    </article>
  );
}
