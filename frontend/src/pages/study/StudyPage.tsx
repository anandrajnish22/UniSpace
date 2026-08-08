import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { BookOpen, Download, FileText, Search, Loader2, Users, Plus, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

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

  return (
    <div className="min-h-screen bg-surface-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-surface-900">UniStudy Hub</h1>
            <p className="mt-2 text-surface-500">Access shared notes, previous year papers, and join study groups.</p>
          </div>
          <Button className="mt-4 md:mt-0">
            <Plus className="w-4 h-4 mr-2" /> Upload Resource
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-surface-200 mb-8">
          <button
            className={`pb-4 px-6 font-semibold text-sm transition-all border-b-2 ${
              activeTab === 'resources' 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-surface-500 hover:text-surface-900'
            }`}
            onClick={() => setActiveTab('resources')}
          >
            Study Notes & Resources
          </button>
          <button
            className={`pb-4 px-6 font-semibold text-sm transition-all border-b-2 ${
              activeTab === 'groups' 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-surface-500 hover:text-surface-900'
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
            <div className="glass p-4 rounded-xl shadow-sm mb-8 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input 
                  type="text" 
                  placeholder="Search resources by title, subject, or course..."
                  className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select 
                className="w-full md:w-64 px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white"
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
              <div className="text-center py-20 glass rounded-xl">
                <BookOpen className="w-12 h-12 text-surface-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-surface-900">No resources found</h3>
                <p className="text-surface-500 mt-1">Be the first to share study material!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((r) => (
                  <div key={r.id} className="glass p-6 rounded-2xl bg-white border border-surface-200 hover:shadow-elevated transition-all flex flex-col h-full">
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="outline" className="text-primary-600 bg-primary-50 border-primary-100 font-semibold">
                        {r.type.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-surface-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>

                    <h3 className="text-lg font-bold text-surface-900 mb-2 leading-tight">{r.title}</h3>
                    {r.subject && <p className="text-xs font-medium text-surface-500 mb-3">Subject: {r.subject}</p>}
                    
                    {r.description && (
                      <p className="text-surface-600 text-sm line-clamp-2 mb-6 leading-relaxed">
                        {r.description}
                      </p>
                    )}

                    <div className="mt-auto pt-4 border-t border-surface-100 flex items-center justify-between">
                      <span className="text-xs text-surface-500">By {r.uploader.name}</span>
                      
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
              <div className="text-center py-20 glass rounded-xl">
                <Users className="w-12 h-12 text-surface-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-surface-900">No study groups found</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((g) => (
                  <div key={g.id} className="glass p-6 rounded-2xl bg-white border border-surface-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-surface-900">{g.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        <Users className="w-3 h-3 mr-1" /> {g._count.members}
                      </Badge>
                    </div>

                    {g.subject && <p className="text-xs font-semibold text-primary-600">Subject: {g.subject}</p>}
                    {g.description && <p className="text-surface-600 text-sm">{g.description}</p>}

                    <div className="pt-3 border-t border-surface-100 flex justify-end">
                      <Button size="sm">Join Group</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
