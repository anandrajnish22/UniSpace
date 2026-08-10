import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { Briefcase, MapPin, DollarSign, Search, Loader2, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface Job {
  id: string;
  title: string;
  type: string;
  workMode: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  company: {
    name: string;
    logo: string;
  };
  skills: { skill: { name: string } }[];
  createdAt: string;
}

export const JobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedMode, setSelectedMode] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    companyName: '',
    description: '',
    location: '',
    type: 'FULL_TIME',
    workMode: 'REMOTE',
    salaryMin: '',
    salaryMax: '',
  });

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedType) params.append('type', selectedType);
      if (selectedMode) params.append('workMode', selectedMode);

      const response = await api.get(`/jobs?${params.toString()}`);
      setJobs(response.data.data.jobs);
    } catch (error) {
      console.error('Failed to fetch jobs', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchJobs();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedType, selectedMode]);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/jobs', {
        title: newJob.title,
        companyName: newJob.companyName,
        description: newJob.description,
        location: newJob.location,
        type: newJob.type,
        workMode: newJob.workMode,
        salaryMin: newJob.salaryMin ? Number(newJob.salaryMin) : undefined,
        salaryMax: newJob.salaryMax ? Number(newJob.salaryMax) : undefined,
      });
      setIsModalOpen(false);
      setNewJob({
        title: '',
        companyName: '',
        description: '',
        location: '',
        type: 'FULL_TIME',
        workMode: 'REMOTE',
        salaryMin: '',
        salaryMax: '',
      });
      fetchJobs();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to post job');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">UniJobs</h1>
            <p className="mt-2 text-white/60">Discover your next internship or entry-level role.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="mt-4 md:mt-0">Post a Job</Button>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-sm mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input 
              type="text" 
              placeholder="Search jobs or companies..."
              className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary-500 transition-all text-white placeholder:text-white/40"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary-500 text-white"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="INTERNSHIP">Internship</option>
          </select>

          <select 
            className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary-500 text-white"
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
          >
            <option value="">All Modes</option>
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
            <option value="ONSITE">Onsite</option>
          </select>
        </div>

        {/* Job Listings */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
            <Briefcase className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white">No jobs found</h3>
            <p className="text-white/60 mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Link to={`/jobs/${job.id}`} key={job.id} className="block group">
                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-xl hover:shadow-elevated transition-all border border-white/10 hover:border-primary-500/50 flex flex-col md:flex-row gap-6">
                  
                  {/* Company Logo */}
                  <div className="w-16 h-16 rounded-xl bg-black/30 flex items-center justify-center shrink-0 overflow-hidden border border-white/5">
                    {job.company.logo ? (
                      <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-white/40">{job.company.name.charAt(0)}</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-white group-hover:text-primary-400 transition-colors">
                      {job.title}
                    </h2>
                    <p className="text-white/80 font-medium mb-3">{job.company.name}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/60 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {job.location} ({job.workMode})
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" /> {job.type.replace('_', ' ')}
                      </div>
                      {(job.salaryMin || job.salaryMax) && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" /> 
                          {job.salaryMin ? `$${job.salaryMin}` : ''}
                          {job.salaryMin && job.salaryMax ? ' - ' : ''}
                          {job.salaryMax ? `$${job.salaryMax}` : ''}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((s, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {s.skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end shrink-0">
                    <span className="text-xs text-white/40">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                    <Button variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity mt-4 md:mt-0">
                      View Details
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Create Job Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-xl bg-slate-900/90 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6 text-white my-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold font-display">Post a New Job Opportunity</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateJob} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Job Title *</label>
                  <Input 
                    required 
                    placeholder="e.g. Frontend Developer Intern" 
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Company Name *</label>
                  <Input 
                    required 
                    placeholder="e.g. Acme Corp" 
                    value={newJob.companyName}
                    onChange={(e) => setNewJob({ ...newJob, companyName: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">Job Type</label>
                    <select
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
                      value={newJob.type}
                      onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                    >
                      <option value="FULL_TIME">Full Time</option>
                      <option value="PART_TIME">Part Time</option>
                      <option value="INTERNSHIP">Internship</option>
                      <option value="CONTRACT">Contract</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">Work Mode</label>
                    <select
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
                      value={newJob.workMode}
                      onChange={(e) => setNewJob({ ...newJob, workMode: e.target.value })}
                    >
                      <option value="REMOTE">Remote</option>
                      <option value="HYBRID">Hybrid</option>
                      <option value="ONSITE">Onsite</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Location *</label>
                  <Input 
                    required 
                    placeholder="e.g. San Francisco, CA / Remote" 
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">Salary Min ($/yr)</label>
                    <Input 
                      type="number" 
                      placeholder="50000" 
                      value={newJob.salaryMin}
                      onChange={(e) => setNewJob({ ...newJob, salaryMin: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">Salary Max ($/yr)</label>
                    <Input 
                      type="number" 
                      placeholder="80000" 
                      value={newJob.salaryMax}
                      onChange={(e) => setNewJob({ ...newJob, salaryMax: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Job Description *</label>
                  <textarea 
                    required
                    rows={4}
                    className="w-full p-3 bg-black/40 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-primary-500"
                    placeholder="Provide details about the role, expectations, and requirements..."
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Post Job
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
