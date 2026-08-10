import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Loader2, Flag, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Report {
  id: string;
  itemType: string;
  itemId: string;
  reason: string;
  description: string | null;
  status: string;
  createdAt: string;
  reporter: { name: string; email: string };
  reportedUser?: { name: string; email: string };
}

export const AdminReportsPage = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await api.get('/admin/reports');
      setReports(res.data.data);
    } catch (err) {
      console.error('Failed to fetch reports', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: 'REVIEWED' | 'RESOLVED' | 'DISMISSED') => {
    try {
      await api.put(`/admin/reports/${id}/status`, { status });
      setReports(reports.map(r => r.id === id ? { ...r, status } : r));
    } catch (err) {
      console.error('Failed to change report status', err);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-surface-50">Content Reports</h1>
        <p className="text-surface-400 mt-1">Review and moderate user-reported content.</p>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-surface-900 border border-surface-800 rounded-2xl p-12 text-center text-surface-500">
            <Flag className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No reports found. The community is peaceful!</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="bg-surface-900 border border-surface-800 rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0 mt-1">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-800 text-surface-300">
                        {report.itemType}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400">
                        {report.reason}
                      </span>
                      <span className="text-xs text-surface-500">
                        {format(new Date(report.createdAt), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm text-surface-300 mt-2">{report.description || 'No additional description provided.'}</p>
                    
                    <div className="mt-4 text-xs text-surface-400 flex flex-wrap gap-x-6 gap-y-2">
                      <p><strong>Reporter:</strong> {report.reporter.name} ({report.reporter.email})</p>
                      {report.reportedUser && (
                        <p><strong>Reported User:</strong> {report.reportedUser.name} ({report.reportedUser.email})</p>
                      )}
                      <p><strong>Item ID:</strong> <span className="font-mono">{report.itemId}</span></p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                    report.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                    report.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-500' :
                    report.status === 'DISMISSED' ? 'bg-surface-800 text-surface-400' :
                    'bg-blue-500/10 text-blue-500'
                  }`}>
                    {report.status}
                  </span>

                  {report.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleStatusChange(report.id, 'RESOLVED')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-lg text-xs font-medium transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Resolve
                      </button>
                      <button 
                        onClick={() => handleStatusChange(report.id, 'DISMISSED')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-800 hover:bg-surface-700 text-surface-300 rounded-lg text-xs font-medium transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Dismiss
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
