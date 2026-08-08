import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { Briefcase, MapPin, DollarSign, Calendar, Clock, Loader2, ArrowLeft, Send } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

export const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/jobs/${id}`);
        setJob(response.data.data.job);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load job details');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchJob();
  }, [id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplying(true);
    try {
      await api.post(`/jobs/${id}/apply`, { coverLetter });
      setShowApplyModal(false);
      alert('Application submitted successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to apply');
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;
  if (error || !job) return <div className="text-center mt-20 text-danger-500">{error}</div>;

  return (
    <div className="min-h-screen bg-surface-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <button onClick={() => navigate('/jobs')} className="flex items-center text-surface-500 hover:text-surface-900 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to jobs
        </button>

        <div className="glass rounded-2xl overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-primary-600 to-accent-600 opacity-90"></div>
          
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end -mt-12 mb-6">
              <div className="flex items-end gap-6">
                <div className="w-24 h-24 rounded-2xl bg-white shadow-md border-4 border-white flex items-center justify-center overflow-hidden z-10">
                  {job.company.logo ? (
                    <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-bold text-surface-300">{job.company.name.charAt(0)}</span>
                  )}
                </div>
                <div className="mb-1">
                  <h1 className="text-2xl font-bold text-surface-900">{job.title}</h1>
                  <p className="text-lg text-surface-600 font-medium">{job.company.name}</p>
                </div>
              </div>
              
              <div className="mt-6 md:mt-0">
                {user?.role === 'STUDENT' && (
                  <Button onClick={() => setShowApplyModal(true)} className="w-full md:w-auto">
                    Apply Now
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-b border-surface-200">
              <div className="flex items-center gap-2 text-surface-600">
                <MapPin className="w-5 h-5 text-surface-400" />
                <div>
                  <p className="text-sm font-medium text-surface-900">{job.location}</p>
                  <p className="text-xs">{job.workMode}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-surface-600">
                <Briefcase className="w-5 h-5 text-surface-400" />
                <div>
                  <p className="text-sm font-medium text-surface-900">{job.type.replace('_', ' ')}</p>
                  <p className="text-xs">{job.experience || 'Any experience'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-surface-600">
                <DollarSign className="w-5 h-5 text-surface-400" />
                <div>
                  <p className="text-sm font-medium text-surface-900">
                    {job.salaryMin ? `$${job.salaryMin}` : 'Not disclosed'}
                  </p>
                  <p className="text-xs">Salary</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-surface-600">
                <Calendar className="w-5 h-5 text-surface-400" />
                <div>
                  <p className="text-sm font-medium text-surface-900">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs">Posted Date</p>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Job Description</h3>
                <div className="prose prose-surface max-w-none text-surface-700 whitespace-pre-wrap">
                  {job.description}
                </div>
              </div>

              {job.skills?.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((s: any, idx: number) => (
                      <Badge key={idx} variant="secondary">{s.skill.name}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-900/50 backdrop-blur-sm p-4">
          <div className="glass w-full max-w-lg rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Apply for {job.title}</h2>
            <form onSubmit={handleApply}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-surface-700 mb-2">Cover Letter (Optional)</label>
                <textarea
                  className="w-full px-4 py-2 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary-500 h-32 resize-none"
                  placeholder="Why are you a great fit for this role?"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" type="button" onClick={() => setShowApplyModal(false)}>Cancel</Button>
                <Button type="submit" disabled={isApplying}>
                  {isApplying ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  Submit Application
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
