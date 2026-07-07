import { Blocks, HeartHandshake, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-brand"><HeartHandshake size={22} /> <strong>TrustChain</strong></div>
          <p>Transparent charity donations using blockchain, MetaMask, public ledgers, and IPFS proof bills.</p>
        </div>
        <div><ShieldCheck size={20} /><span>Verified charities</span></div>
        <div><Blocks size={20} /><span>Smart contract ledger</span></div>
      </div>
    </footer>
  );
}
