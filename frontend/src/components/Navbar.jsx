import { HeartHandshake, LayoutDashboard, LogOut, Menu, ShieldCheck, Wallet, X } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

function shortAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function Navbar() {
  const navigate = useNavigate();
  const { currentUser, wallet, connectWallet, changeWalletAccount, logout } = useApp();
  const [open, setOpen] = useState(false);
  function closeMenu() { setOpen(false); }
  function dashboardPath() {
    if (!currentUser) return '/auth';
    if (currentUser.role === 'admin') return '/dashboard/admin';
    if (currentUser.role === 'charity') return '/dashboard/charity';
    return '/dashboard/donor';
  }
  function handleLogout() {
    logout();
    closeMenu();
    navigate('/');
  }
  async function handleWalletClick() {
    try {
      if (wallet.connected) await changeWalletAccount();
      else await connectWallet();
    } catch (error) {
      alert(error.message || 'Wallet action failed.');
    }
  }
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand" onClick={closeMenu}>
          <span className="brand-icon"><HeartHandshake size={23} /></span>
          <div><strong>TrustChain</strong><small>Blockchain Charity Ledger</small></div>
        </Link>
        <button className="mobile-menu-btn" type="button" onClick={() => setOpen((prev) => !prev)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav className={`nav-links ${open ? 'open' : ''}`}>
          <NavLink to="/" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/campaigns" onClick={closeMenu}>Campaigns</NavLink>
          <NavLink to="/ledger" onClick={closeMenu}>Public Ledger</NavLink>
          <NavLink to="/verify" onClick={closeMenu}>Verify</NavLink>
          {currentUser && <NavLink to={dashboardPath()} onClick={closeMenu}>Dashboard</NavLink>}
          {currentUser?.role === 'charity' && <NavLink to="/proofs" onClick={closeMenu}>Proof Upload</NavLink>}
        </nav>
        <div className="nav-actions">
          <button type="button" className={wallet.connected ? 'btn btn-wallet' : 'btn btn-primary'} onClick={handleWalletClick} title={wallet.connected ? 'Click to change MetaMask account' : 'Connect MetaMask wallet'}>
            <Wallet size={17} />
            {wallet.connected ? shortAddress(wallet.address) : 'Connect Wallet'}
          </button>
          {currentUser ? (
            <>
              <Link to={dashboardPath()} className="btn btn-glass"><LayoutDashboard size={17} /> {currentUser.role}</Link>
              <button type="button" className="btn btn-ghost" onClick={handleLogout}><LogOut size={17} /> Logout</button>
            </>
          ) : (
            <Link to="/auth" className="btn btn-glass"><ShieldCheck size={17} /> Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}
