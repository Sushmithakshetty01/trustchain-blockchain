import { ArrowRight, BadgeCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

function pct(raised, goal) {
  return Math.min(100, Math.round((Number(raised || 0) / Number(goal || 1)) * 100));
}

export default function CampaignCard({ campaign }) {
  const raised = Number(campaign.raised || campaign.raisedAmount || 0);
  const goal = Number(campaign.goal || campaign.goalAmount || 1);
  const progress = pct(raised, goal);
  return (
    <article className="campaign-card">
      <div className="campaign-img-wrap">
        <img src={campaign.image} alt={campaign.title} />
        <span className="category-pill">{campaign.category}</span>
      </div>
      <div className="campaign-body">
        <div className="verified-line"><BadgeCheck size={16} /> {campaign.charityName}</div>
        <h3>{campaign.title}</h3>
        <p>{campaign.description}</p>
        <div className="fund-row">
          <div><small>Raised</small><strong>{raised.toFixed(raised % 1 === 0 ? 0 : 2)} ETH</strong></div>
          <div><small>Goal</small><strong>{goal} ETH</strong></div>
        </div>
        <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
        <div className="card-actions">
          <span>{progress}% funded</span>
          <Link to={`/campaigns/${campaign.id}`} className="btn btn-primary">Donate <ArrowRight size={16} /></Link>
        </div>
      </div>
    </article>
  );
}
