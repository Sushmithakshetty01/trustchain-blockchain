import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import Toast from '../components/Toast.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function CreateCampaignPage() {
  const navigate = useNavigate();
  const { createCampaign } = useApp();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'Relief', goal: '2', image: '' });
  function update(k, v) { setForm((prev) => ({ ...prev, [k]: v })); }
  async function submit(e) { e.preventDefault(); try { setSaving(true); await createCampaign(form); navigate('/campaigns'); } finally { setSaving(false); } }
  return <><Toast /><section className="container page-head narrow"><p className="eyebrow">Charity campaign</p><h1>Create a blockchain campaign.</h1><p>This can create a campaign on the smart contract and then add it to the frontend ledger.</p></section><section className="container form-layout single"><form className="card big-form" onSubmit={submit}><label>Title<input value={form.title} onChange={(e) => update('title', e.target.value)} required /></label><label>Description<textarea rows="5" value={form.description} onChange={(e) => update('description', e.target.value)} required /></label><label>Category<input value={form.category} onChange={(e) => update('category', e.target.value)} /></label><label>Goal ETH<input type="number" step="0.001" min="0.001" value={form.goal} onChange={(e) => update('goal', e.target.value)} required /></label><label>Image URL<input value={form.image} onChange={(e) => update('image', e.target.value)} placeholder="Optional Unsplash/photo URL" /></label><button className="btn btn-primary btn-large" disabled={saving}><PlusCircle size={18} /> {saving ? 'Creating...' : 'Create Campaign'}</button></form></section></>;
}
