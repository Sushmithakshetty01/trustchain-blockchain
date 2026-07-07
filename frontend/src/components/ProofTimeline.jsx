import { ExternalLink, FileCheck2 } from 'lucide-react';

const PINATA_GATEWAY = import.meta.env.VITE_PINATA_GATEWAY || 'https://gateway.pinata.cloud';
function gatewayUrl(hash, provided) {
  if (provided) return provided;
  if (!hash) return '#';
  if (hash.startsWith('http')) return hash;
  return `${PINATA_GATEWAY.replace(/\/$/, '')}/ipfs/${hash.replace('ipfs://', '')}`;
}
function short(value) {
  if (!value) return 'N/A';
  return value.length > 24 ? `${value.slice(0, 12)}...${value.slice(-8)}` : value;
}

export default function ProofTimeline({ proofs }) {
  return (
    <div className="proof-timeline">
      {proofs.length === 0 && <p className="muted">No proofs uploaded yet.</p>}
      {proofs.map((proof) => (
        <div className="proof-item" key={proof.id}>
          <div className="proof-icon"><FileCheck2 size={20} /></div>
          <div>
            <h3>{proof.campaignTitle}</h3>
            <p>{proof.purpose}</p>
            <div className="mini-meta">
              <span>Amount used: {proof.amountUsed} ETH</span>
              <span>CID: {short(proof.ipfsHash)}</span>
              {proof.txHash && <span>TX: {short(proof.txHash)}</span>}
            </div>
          </div>
          {proof.ipfsHash && <a className="btn btn-glass" href={gatewayUrl(proof.ipfsHash, proof.gatewayUrl)} target="_blank" rel="noreferrer"><ExternalLink size={16} /> View Bill</a>}
        </div>
      ))}
    </div>
  );
}
