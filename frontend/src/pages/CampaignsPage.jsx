import CampaignCard from '../components/CampaignCard.jsx';
import Toast from '../components/Toast.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function CampaignsPage() {
  const { campaigns } = useApp();
  return (
    <>
      <Toast />
      <section className="container page-head narrow">
        <p className="eyebrow">Verified campaigns</p>
        <h1>Choose a cause and verify every step.</h1>
        <p>Each campaign includes a blockchain campaign ID, donation ledger, proof history, and admin verification.</p>
      </section>
      <section className="container campaign-grid campaign-grid-marketplace">
        {campaigns.map((campaign) => <CampaignCard campaign={campaign} key={campaign.id} />)}
      </section>
    </>
  );
}
