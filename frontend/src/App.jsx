import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import LandingPage from './pages/LandingPage.jsx';
import CampaignsPage from './pages/CampaignsPage.jsx';
import CampaignDetailsPage from './pages/CampaignDetailsPage.jsx';
import DonorDashboard from './pages/DonorDashboard.jsx';
import CharityDashboard from './pages/CharityDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import CreateCampaignPage from './pages/CreateCampaignPage.jsx';
import PublicLedgerPage from './pages/PublicLedgerPage.jsx';
import VerifyReceiptPage from './pages/VerifyReceiptPage.jsx';
import ProofUploadPage from './pages/ProofUploadPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/campaigns/:id" element={<CampaignDetailsPage />} />
          <Route path="/create-campaign" element={<CreateCampaignPage />} />
          <Route path="/dashboard" element={<Navigate to="/dashboard/donor" replace />} />
          <Route path="/dashboard/donor" element={<DonorDashboard />} />
          <Route path="/dashboard/charity" element={<CharityDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/ledger" element={<PublicLedgerPage />} />
          <Route path="/proofs" element={<ProofUploadPage />} />
          <Route path="/verify" element={<VerifyReceiptPage />} />
          <Route path="/verify/:txHash" element={<VerifyReceiptPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
