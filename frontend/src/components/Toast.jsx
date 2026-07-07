import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export default function Toast() {
  const { toast, clearToast } = useApp();
  if (!toast) return null;
  const Icon = toast.type === 'error' ? XCircle : toast.type === 'warning' ? AlertTriangle : CheckCircle2;
  return (
    <div className={`toast toast-${toast.type || 'success'}`} onClick={clearToast}>
      <Icon size={18} />
      <span>{toast.message}</span>
    </div>
  );
}
