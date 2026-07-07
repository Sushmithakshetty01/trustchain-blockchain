import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login } = useApp();

  function quickLogin(role) {
    const users = {
      donor: {
        name: 'Demo Donor',
        email: 'donor@trustchain.org',
        role: 'donor',
      },
      charity: {
        name: 'Hope Relief Foundation',
        email: 'charity@trustchain.org',
        role: 'charity',
        organizationName: 'Hope Relief Foundation',
        description: 'A verified charity for transparent donation tracking.',
      },
      admin: {
        name: 'TrustChain Admin',
        email: 'admin@trustchain.org',
        role: 'admin',
      },
    };

    login(users[role]);

    if (role === 'admin') navigate('/dashboard/admin');
    else if (role === 'charity') navigate('/dashboard/charity');
    else navigate('/dashboard/donor');
  }

  return (
    <>
      <Toast />

      <section className="container page-head narrow">
        <p className="eyebrow">TrustChain access</p>
        <h1>Login to TrustChain.</h1>
        <p>
          Use quick login for demo. MetaMask can be connected separately from the navbar.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            marginTop: '28px',
          }}
        >
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => quickLogin('donor')}
          >
            Login as Donor
          </button>

          <button
            type="button"
            className="btn btn-glass"
            onClick={() => quickLogin('charity')}
          >
            Login as Charity
          </button>

          <button
            type="button"
            className="btn btn-glass"
            onClick={() => quickLogin('admin')}
          >
            Login as Admin
          </button>
        </div>
      </section>
    </>
  );
}