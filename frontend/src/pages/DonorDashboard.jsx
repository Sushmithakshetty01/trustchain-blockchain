import { HeartHandshake, ReceiptText, Wallet } from 'lucide-react';
import Toast from '../components/Toast.jsx';
import ReceiptCard from '../components/ReceiptCard.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function DonorDashboard() {
  const { donations, wallet, connectWallet, currentUser } = useApp();
  return (
    <><Toast /><section className="container page-head narrow"><p className="eyebrow">Donor dashboard</p><h1>Track your donations and receipts.</h1><p>Welcome {currentUser?.name || 'Donor'}. Every donation receipt contains a transaction hash and QR verification link.</p></section><section className="container stats-grid"><article className="stat-card"><HeartHandshake size={22} /><div><small>Total donations</small><strong>{donations.length}</strong></div></article><article className="stat-card"><ReceiptText size={22} /><div><small>Receipts</small><strong>{donations.length}</strong></div></article><article className="stat-card"><Wallet size={22} /><div><small>Wallet balance</small><strong>{Number(wallet.balance || 0).toFixed(3)} ETH</strong></div></article></section><section className="container section-sm">{!wallet.connected && <button className="btn btn-primary btn-large" onClick={connectWallet}>Connect MetaMask</button>}<div className="receipt-grid-list">{donations.map((donation) => <ReceiptCard donation={donation} key={donation.id} />)}</div></section></>
  );
}
