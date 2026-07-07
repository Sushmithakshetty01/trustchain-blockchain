import { ArrowRight, BadgeCheck, Blocks, FileCheck2, HeartHandshake, Landmark, ShieldCheck, Sparkles, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import CampaignCard from '../components/CampaignCard.jsx';
import Toast from '../components/Toast.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function LandingPage() {
  const { campaigns } = useApp();
  return (
    <>
      <Toast />
      <section className="home-hero">
        <div className="container home-hero-grid">
          <div className="home-hero-content">
            <p className="eyebrow hero-chip"><Sparkles size={16} /> Transparent charity donations powered by blockchain</p>
            <h1>Donate with trust.<span>Track every rupee with proof.</span></h1>
            <p className="hero-subtitle">TrustChain helps donors verify where their money goes using MetaMask donations, blockchain transaction hashes, public ledgers, and IPFS proof bills uploaded by charities.</p>
            <div className="hero-actions">
              <Link to="/campaigns" className="btn btn-primary btn-large">Explore Campaigns <ArrowRight size={18} /></Link>
              <Link to="/ledger" className="btn btn-glass btn-large">View Public Ledger</Link>
            </div>
            <div className="hero-stats">
              <div><strong>100%</strong><span>Transparent ledger</span></div>
              <div><strong>IPFS</strong><span>Proof storage</span></div>
              <div><strong>MetaMask</strong><span>Real transactions</span></div>
            </div>
          </div>
          <div className="hero-image-board">
            <div className="hero-main-photo">
              <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=90" alt="Children charity campaign" />
              <div className="floating-proof-card"><FileCheck2 size={20} /><div><strong>Proof uploaded</strong><span>Bill stored on IPFS</span></div></div>
            </div>
            <div className="hero-side-photos">
              <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=90" alt="Donation support" />
              <img src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=90" alt="Volunteers helping" />
            </div>
          </div>
        </div>
      </section>
      <section className="container trust-strip">
        <div><ShieldCheck size={24} /><span>Verified charities</span></div>
        <div><Blocks size={24} /><span>Blockchain records</span></div>
        <div><Wallet size={24} /><span>MetaMask donations</span></div>
        <div><BadgeCheck size={24} /><span>Admin proof approval</span></div>
      </section>
      <section className="container section-lg">
        <div className="section-heading"><p className="eyebrow">How TrustChain works</p><h2>Simple, transparent, and verifiable.</h2></div>
        <div className="feature-grid">
          <article className="feature-card"><div className="feature-icon"><HeartHandshake size={24} /></div><h3>Donate to campaigns</h3><p>Donors choose a campaign and donate through MetaMask. Each donation generates a real blockchain transaction hash.</p></article>
          <article className="feature-card"><div className="feature-icon"><FileCheck2 size={24} /></div><h3>Upload proof bills</h3><p>Charities upload receipts, bills, and photos to Pinata/IPFS. The CID is stored as proof of fund usage.</p></article>
          <article className="feature-card"><div className="feature-icon"><Landmark size={24} /></div><h3>Verify public ledger</h3><p>Admins and donors can view donation history, proof hashes, and verification status in a transparent ledger.</p></article>
        </div>
      </section>
      <section className="container section-lg">
        <div className="section-heading campaign-heading-row"><div><p className="eyebrow">Featured campaigns</p><h2>Support causes that matter.</h2></div><Link to="/campaigns" className="btn btn-glass">View all campaigns <ArrowRight size={17} /></Link></div>
        <div className="campaign-grid campaign-grid-home">{campaigns.slice(0, 3).map((campaign) => <CampaignCard campaign={campaign} key={campaign.id} />)}</div>
      </section>
      <section className="container impact-banner"><div><p className="eyebrow">Why blockchain?</p><h2>Because donors deserve proof, not promises.</h2><p>TrustChain connects donation, proof, admin verification, and public audit trail into one transparent charity ecosystem.</p></div><Link to="/verify" className="btn btn-primary btn-large">Verify Receipt <ArrowRight size={18} /></Link></section>
    </>
  );
}
