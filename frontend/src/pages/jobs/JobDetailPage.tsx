import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { Briefcase, MapPin, DollarSign, Calendar, Clock, Loader2, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
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
  const [hasApplied, setHasApplied] = useState(false);
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
      setHasApplied(true);
      setShowApplyModal(false);
      alert('Application submitted successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to apply');
    } finally {
      setIsApplying(false);
    }
  };

  const formatSalary = (min?: number, max?: number, currency = 'INR') => {
    const symbol = currency === 'INR' ? '₹' : '$';
    if (!min && !max) return 'Not disclosed';
    if (min && max) return `${symbol}${min.toLocaleString()} - ${symbol}${max.toLocaleString()}`;
    if (min) return `${symbol}${min.toLocaleString()}`;
    return `${symbol}${max?.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="text-center py-20">
        <p className="text-danger-400 text-lg mb-4">{error || 'Job not found'}</p>
        <Button onClick={() => navigate('/jobs')} variant="outline">Back to Jobs</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-10 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Link */}
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center text-white/60 hover:text-white transition-colors mb-6 group text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to jobs
        </button>

        {/* Main Job Card */}
        <div className="bg-[#121217]/95 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
          {/* Header Banner */}
          <div className="h-32 sm:h-36 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600 relative">
            <div className="absolute inset-0 bg-black/10" />
          </div>
          
          <div className="px-6 sm:px-8 pb-8">
            {/* Top row with Logo overlapping banner + Apply Button */}
            <div className="flex justify-between items-end -mt-12 sm:-mt-14 mb-4 relative z-20">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#18181f] shadow-2xl border-4 border-[#121217] flex items-center justify-center overflow-hidden shrink-0">
                {job.company?.logo ? (
                  <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl sm:text-4xl font-bold text-primary-400 font-display">
                    {job.company?.name?.charAt(0) || 'J'}
                  </span>
                )}
              </div>

              <div>
                {user?.role === 'STUDENT' && (
                  hasApplied ? (
                    <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium text-sm">
                      <CheckCircle2 className="w-4 h-4" /> Applied
                    </div>
                  ) : (
                    <Button onClick={() => setShowApplyModal(true)} className="px-6 py-2.5 shadow-glow text-sm font-semibold">
                      Apply Now
                    </Button>
                  )
                )}
              </div>
            </div>

            {/* Title & Company Name Row - completely separate from banner! */}
            <div className="mb-6 pt-1">
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight leading-snug">
                {job.title}
              </h1>
              <p className="text-base sm:text-lg text-primary-400 font-semibold mt-1">
                {job.company?.name}
              </p>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-5 border-y border-white/10 bg-white/[0.02] -mx-6 sm:-mx-8 px-6 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{job.location || 'Remote'}</p>
                  <p className="text-xs text-white/50">{job.workMode || 'Full Time'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5 text-accent-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{job.type?.replace('_', ' ') || 'Internship'}</p>
                  <p className="text-xs text-white/50">{job.experience || 'Entry Level'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                  </p>
                  <p className="text-xs text-white/50">Stipend / Salary</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-white/50">Posted Date</p>
                </div>
              </div>
            </div>

            {/* Description & Details */}
            <div className="mt-8 space-y-8">
              <div>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                  Job Description
                </h3>
                <div className="text-white/80 leading-relaxed text-sm sm:text-base whitespace-pre-wrap bg-white/[0.02] p-5 rounded-xl border border-white/5">
                  {job.description}
                </div>
              </div>

              {job.skills && job.skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent-500"></span>
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((s: any, idx: number) => (
                      <span
                        key={idx}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-white/90 hover:border-primary-500/40 transition-colors"
                      >
                        {s.skill?.name || s.name}
                      </span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#16161e] border border-white/15 w-full max-w-lg rounded-2xl p-6 shadow-2xl text-white">
            <h2 className="text-xl font-bold font-display text-white mb-2">Apply for {job.title}</h2>
            <p className="text-sm text-white/60 mb-6">{job.company?.name}</p>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Cover Letter / Note (Optional)
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-black/40 border border-white/15 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none h-32 resize-none text-sm"
                  placeholder="Share a short note on why you're a good fit for this role..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" type="button" onClick={() => setShowApplyModal(false)} className="border-white/20 text-white hover:bg-white/10">
                  Cancel
                </Button>
                <Button type="submit" disabled={isApplying} className="shadow-glow">
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
