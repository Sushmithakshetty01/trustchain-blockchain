import { ExternalLink, FileCheck2, UploadCloud } from 'lucide-react';
import { useState } from 'react';
import ProofTimeline from '../components/ProofTimeline.jsx';
import Toast from '../components/Toast.jsx';
import { useApp } from '../context/AppContext.jsx';
import { uploadProofFileToIPFS } from '../services/api.js';

export default function ProofUploadPage() {
  const { campaigns, proofs, addProof } = useApp();
  const [form, setForm] = useState({ campaignId: campaigns[0]?.id || '', amountUsed: '0.25', purpose: '', ipfsHash: '' });
  const [proofFile, setProofFile] = useState(null);
  const [gatewayUrl, setGatewayUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  function update(k, v) { setForm((prev) => ({ ...prev, [k]: v })); }
  async function uploadFile() {
    if (!proofFile) return alert('Please select a bill/photo first.');
    setUploading(true);
    try { const result = await uploadProofFileToIPFS(proofFile); update('ipfsHash', result.cid); setGatewayUrl(result.gateway_url); alert('File uploaded to Pinata/IPFS successfully. CID generated.'); return result; }
    catch (error) { alert(error.message || 'IPFS upload failed'); return null; }
    finally { setUploading(false); }
  }
  async function submit(e) {
    e.preventDefault();
    let cid = form.ipfsHash; let url = gatewayUrl;
    if (!cid && proofFile) { const res = await uploadFile(); cid = res?.cid; url = res?.gateway_url; }
    if (!cid) return alert('Please upload a file or enter an IPFS CID.');
    await addProof({ ...form, ipfsHash: cid, gatewayUrl: url });
    setForm({ campaignId: campaigns[0]?.id || '', amountUsed: '0.25', purpose: '', ipfsHash: '' }); setProofFile(null); setGatewayUrl('');
  }
  return <><Toast /><section className="container page-head narrow"><p className="eyebrow">IPFS proof center</p><h1>Upload fund usage proof.</h1><p>Upload a real bill/photo to Pinata. Pinata stores it on IPFS and returns a genuine CID, which is then stored as proof.</p></section><section className="container form-layout"><form className="card big-form" onSubmit={submit}><label>Campaign<select value={form.campaignId} onChange={(e) => update('campaignId', e.target.value)}>{campaigns.map((c) => <option value={c.id} key={c.id}>{c.title}</option>)}</select></label><label>Amount used ETH<input type="number" min="0.001" step="0.001" value={form.amountUsed} onChange={(e) => update('amountUsed', e.target.value)} required /></label><label>Purpose<textarea rows="5" value={form.purpose} onChange={(e) => update('purpose', e.target.value)} placeholder="Example: Purchased 100 food kits and uploaded vendor invoice." required /></label><label>Select bill/photo proof<input type="file" accept="image/*,.pdf" onChange={(e) => setProofFile(e.target.files?.[0] || null)} /></label>{proofFile && <div className="ipfs-selected-file">Selected file: <strong>{proofFile.name}</strong></div>}<button type="button" className="btn btn-glass full" onClick={uploadFile} disabled={uploading || !proofFile}><FileCheck2 size={18} /> {uploading ? 'Uploading to Pinata/IPFS...' : 'Upload to Pinata/IPFS'}</button><label>Real IPFS CID<input value={form.ipfsHash} onChange={(e) => update('ipfsHash', e.target.value)} placeholder="CID will appear here after upload" /></label>{gatewayUrl && <a className="btn btn-glass full" href={gatewayUrl} target="_blank" rel="noreferrer">View uploaded proof <ExternalLink size={16} /></a>}<button className="btn btn-primary btn-large"><UploadCloud size={18} /> Store proof hash</button></form><aside className="card chain-info-panel"><h3>Production IPFS flow</h3><ol className="number-list"><li>Upload bill/photo to Pinata</li><li>Receive real IPFS CID</li><li>Call smart contract addExpenseProof()</li><li>Show CID in public ledger</li></ol></aside></section><section className="container section-sm"><div className="section-heading compact"><p className="eyebrow">Existing proofs</p><h2>Proof audit trail</h2></div><ProofTimeline proofs={proofs} /></section></>;
}
