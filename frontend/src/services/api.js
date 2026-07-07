const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.detail || data?.message || 'API request failed');
  return data;
}

export function getApiBase() {
  return API_BASE;
}

export async function getHealth() {
  return request('/health');
}

export async function uploadProofFileToIPFS(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', file.name);
  const response = await fetch(`${API_BASE}/ipfs/upload`, {
    method: 'POST',
    body: formData,
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.detail || 'IPFS upload failed');
  return data;
}
