import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { BookOpen, Download, FileText, Search, Loader2, Users, Plus, ExternalLink, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Resource {
  id: string;
  title: string;
  description: string;
  subject: string;
  type: string;
  fileUrl: string;
  downloads: number;
  uploader: { name: string };
  createdAt: string;
}

interface Group {
  id: string;
  name: string;
  subject: string;
  description: string;
  _count: { members: number };
}

export const StudyPage = () => {
  const [activeTab, setActiveTab] = useState<'resources' | 'groups'>('resources');
  
  const [resources, setResources] = useState<Resource[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    subject: '',
    type: 'NOTE',
    description: '',
    fileUrl: '',
    semester: '3',
    course: 'B.Tech CSE',
  });

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedType) params.append('type', selectedType);

      const response = await api.get(`/study/resources?${params.toString()}`);
      setResources(response.data.data.resources);
    } catch (error) {
      console.error('Failed to fetch study resources', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/study/groups');
      setGroups(response.data.data.groups);
    } catch (error) {
      console.error('Failed to fetch study groups', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'resources') {
      const delayDebounceFn = setTimeout(() => {
        fetchResources();
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    } else {
      fetchGroups();
    }
  }, [activeTab, searchTerm, selectedType]);

  const handleDownload = async (id: string, fileUrl: string) => {
    try {
      await api.post(`/study/resources/${id}/download`);
      window.open(fileUrl, '_blank');
      fetchResources();
    } catch (error) {
      console.error('Failed to register download', error);
    }
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/study/resources', {
        title: newResource.title,
        subject: newResource.subject,
        type: newResource.type,
        description: newResource.description,
        fileUrl: newResource.fileUrl || 'https://unispace.edu/notes/sample.pdf',
        semester: newResource.semester,
        course: newResource.course,
      });
      setIsModalOpen(false);
      setNewResource({
        title: '',
        subject: '',
        type: 'NOTE',
        description: '',
        fileUrl: '',
        semester: '3',
        course: 'B.Tech CSE',
      });
      fetchResources();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to upload study resource';
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      await api.post(`/study/groups/${groupId}/join`);
      fetchGroups();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to toggle group membership');
    }
  };

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">UniStudy Hub</h1>
            <p className="mt-2 text-white/60">Access shared notes, previous year papers, and join study groups.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="mt-4 md:mt-0">
            <Plus className="w-4 h-4 mr-2" /> Upload Resource
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 mb-8">
          <button
            className={`pb-4 px-6 font-semibold text-sm transition-all border-b-2 ${
              activeTab === 'resources' 
                ? 'border-primary-500 text-primary-400' 
                : 'border-transparent text-white/60 hover:text-white'
            }`}
            onClick={() => setActiveTab('resources')}
          >
            Study Notes & Resources
          </button>
          <button
            className={`pb-4 px-6 font-semibold text-sm transition-all border-b-2 ${
              activeTab === 'groups' 
                ? 'border-primary-500 text-primary-400' 
                : 'border-transparent text-white/60 hover:text-white'
            }`}
            onClick={() => setActiveTab('groups')}
          >
            Study Groups
          </button>
        </div>

        {/* Content based on Tab */}
        {activeTab === 'resources' ? (
          <div>
            {/* Search & Filter */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-sm mb-8 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input 
                  type="text" 
                  placeholder="Search resources by title, subject, or course..."
                  className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary-500 transition-all text-white placeholder:text-white/40"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select 
                className="w-full md:w-64 px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary-500 text-white"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="NOTE">Notes</option>
                <option value="PDF">PDF Books</option>
                <option value="PREVIOUS_PAPER">Previous Papers</option>
                <option value="ROADMAP">Roadmaps</option>
              </select>
            </div>

            {/* Resources List */}
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
              </div>
            ) : resources.length === 0 ? (
              <div className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
                <BookOpen className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white">No resources found</h3>
                <p className="text-white/60 mt-1">Be the first to share study material!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((r) => (
                  <div key={r.id} className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-primary-500/50 p-6 rounded-2xl hover:shadow-elevated transition-all flex flex-col h-full">
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="outline" className="text-primary-400 bg-primary-500/20 border-primary-500/30 font-semibold">
                        {r.type.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-white/40">{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 leading-tight">{r.title}</h3>
                    {r.subject && <p className="text-xs font-medium text-white/60 mb-3">Subject: {r.subject}</p>}
                    
                    {r.description && (
                      <p className="text-white/80 text-sm line-clamp-2 mb-6 leading-relaxed">
                        {r.description}
                      </p>
                    )}

                    <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs text-white/60">By {r.uploader.name}</span>
                      
                      <Button size="sm" onClick={() => handleDownload(r.id, r.fileUrl)}>
                        <Download className="w-4 h-4 mr-1.5" /> ({r.downloads})
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Study Groups Tab */
          <div>
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
              </div>
            ) : groups.length === 0 ? (
              <div className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
                <Users className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white">No study groups found</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((g) => (
                  <div key={g.id} className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white">{g.name}</h3>
                      <Badge variant="secondary" className="text-xs bg-white/10 text-white hover:bg-white/20">
                        <Users className="w-3 h-3 mr-1" /> {g._count.members}
                      </Badge>
                    </div>

                    {g.subject && <p className="text-xs font-semibold text-primary-400">Subject: {g.subject}</p>}
                    {g.description && <p className="text-white/80 text-sm">{g.description}</p>}

                    <div className="pt-3 border-t border-white/10 flex justify-end">
                      <Button size="sm" onClick={() => handleJoinGroup(g.id)}>Toggle Join</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Upload Resource Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-xl bg-slate-900/90 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6 text-white my-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold font-display">Upload Study Resource</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateResource} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Resource Title *</label>
                  <Input 
                    required 
                    placeholder="e.g. Data Structures & Algorithms Hand-written Notes" 
                    value={newResource.title}
                    onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">Subject / Course *</label>
                    <Input 
                      required 
                      placeholder="e.g. Computer Science, DBMS, OS" 
                      value={newResource.subject}
                      onChange={(e) => setNewResource({ ...newResource, subject: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">Resource Type</label>
                    <select
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
                      value={newResource.type}
                      onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                    >
                      <option value="NOTE">Lecture Notes</option>
                      <option value="PDF">E-Book / PDF</option>
                      <option value="PREVIOUS_PAPER">Previous Year Paper (PYQ)</option>
                      <option value="ROADMAP">Study Roadmap</option>
                      <option value="TUTORIAL">Cheatsheet / Tutorial</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Resource / Document URL</label>
                  <Input 
                    placeholder="e.g. https://drive.google.com/... or leave blank for default" 
                    value={newResource.fileUrl}
                    onChange={(e) => setNewResource({ ...newResource, fileUrl: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Description</label>
                  <textarea 
                    rows={3}
                    className="w-full p-3 bg-black/40 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-primary-500"
                    placeholder="Briefly describe what topics, units, or modules this material covers..."
                    value={newResource.description}
                    onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
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
                    Upload Resource
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
