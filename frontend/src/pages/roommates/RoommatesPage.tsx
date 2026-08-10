import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Home, MapPin, Search, Filter, Loader2, DollarSign, UserCheck, Calendar, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface RoomListingItem {
  id: string;
  type: string;
  location: string;
  rentAmount: number;
  availableFrom: string;
  description: string;
  genderPref: string;
  lister: { name: string; profile: { avatar: string } };
  createdAt: string;
}

export const RoommatesPage = () => {
  const [listings, setListings] = useState<RoomListingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedGender, setSelectedGender] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    location: '',
    rentAmount: '',
    type: 'ROOM_AVAILABLE',
    genderPref: 'ANY',
    availableFrom: '',
  });

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedType) params.append('type', selectedType);
      if (selectedGender) params.append('genderPref', selectedGender);

      const response = await api.get(`/roommates?${params.toString()}`);
      setListings(response.data.data.listings);
    } catch (error) {
      console.error('Failed to fetch room listings', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchListings();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedType, selectedGender]);

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/roommates', {
        title: newListing.title,
        description: newListing.description,
        location: newListing.location,
        rentAmount: Number(newListing.rentAmount),
        type: newListing.type,
        genderPref: newListing.genderPref,
        availableFrom: newListing.availableFrom ? new Date(newListing.availableFrom).toISOString() : new Date().toISOString(),
      });
      setIsModalOpen(false);
      setNewListing({
        title: '',
        description: '',
        location: '',
        rentAmount: '',
        type: 'ROOM_AVAILABLE',
        genderPref: 'ANY',
        availableFrom: '',
      });
      fetchListings();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to post room listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">UniFind Roommates & PGs</h1>
            <p className="mt-2 text-white/60">Find compatible student roommates, PGs, and flats near campus.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="mt-4 md:mt-0">Post Room / Find Roommate</Button>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-sm mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input 
              type="text" 
              placeholder="Search by location, neighborhood, or campus area..."
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
            <option value="">All Accommodation Types</option>
            <option value="ROOMMATE">Roommate Needed</option>
            <option value="PG">Paying Guest (PG)</option>
            <option value="FLAT">Flat / Apartment</option>
            <option value="HOSTEL">Private Hostel</option>
          </select>

          <select 
            className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary-500 text-white"
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
          >
            <option value="">All Gender Preferences</option>
            <option value="MALE">Male Only</option>
            <option value="FEMALE">Female Only</option>
            <option value="ANY">Any / Co-ed</option>
          </select>
        </div>

        {/* Listings Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
            <Home className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white">No housing listings found</h3>
            <p className="text-white/60 mt-1">Try adjusting your filters or location search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((l) => (
              <div key={l.id} className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-primary-500/50 p-6 rounded-2xl hover:shadow-elevated transition-all flex flex-col h-full">
                
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="outline" className="text-primary-400 border-primary-500/30 bg-primary-500/20 font-bold">
                    {l.type}
                  </Badge>
                  <div className="text-right">
                    <span className="text-xl font-bold text-white">₹{l.rentAmount.toLocaleString()}</span>
                    <span className="text-xs text-white/40"> / month</span>
                  </div>
                </div>

                <div className="flex items-center text-sm font-semibold text-white mb-3">
                  <MapPin className="w-4 h-4 mr-1.5 text-primary-500 shrink-0" />
                  <span className="truncate">{l.location}</span>
                </div>

                <p className="text-white/80 text-sm line-clamp-3 mb-6 leading-relaxed">
                  {l.description}
                </p>

                <div className="space-y-2 mb-6 text-xs text-white/60">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-white/40" />
                    <span>Gender Pref: <strong className="text-white">{l.genderPref}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-white/40" />
                    <span>Available From: {new Date(l.availableFrom).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-black/40 border border-white/10 flex items-center justify-center font-bold text-xs text-white/80">
                      {l.lister.name.charAt(0)}
                    </div>
                    <span className="text-xs text-white/80 font-medium">{l.lister.name}</span>
                  </div>

                  <Button size="sm" variant="outline">Contact</Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Roommate Listing Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-xl bg-slate-900/90 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6 text-white my-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold font-display">Post Room or Roommate Requirement</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateListing} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Title *</label>
                  <Input 
                    required 
                    placeholder="e.g. Spacious 2BHK Room near University Gate 2" 
                    value={newListing.title}
                    onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">Listing Type</label>
                    <select
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
                      value={newListing.type}
                      onChange={(e) => setNewListing({ ...newListing, type: e.target.value })}
                    >
                      <option value="ROOM_AVAILABLE">Room Available</option>
                      <option value="NEED_ROOMMATE">Need Roommate</option>
                      <option value="PG">PG / Co-living</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">Monthly Rent ($) *</label>
                    <Input 
                      required
                      type="number" 
                      placeholder="350" 
                      value={newListing.rentAmount}
                      onChange={(e) => setNewListing({ ...newListing, rentAmount: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">Gender Preference</label>
                    <select
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
                      value={newListing.genderPref}
                      onChange={(e) => setNewListing({ ...newListing, genderPref: e.target.value })}
                    >
                      <option value="ANY">Any Gender</option>
                      <option value="MALE_ONLY">Male Only</option>
                      <option value="FEMALE_ONLY">Female Only</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">Location / Address *</label>
                    <Input 
                      required 
                      placeholder="e.g. 5th Avenue, Near Tech Park" 
                      value={newListing.location}
                      onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">Available From</label>
                    <Input 
                      type="date" 
                      value={newListing.availableFrom}
                      onChange={(e) => setNewListing({ ...newListing, availableFrom: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Description *</label>
                  <textarea 
                    required
                    rows={4}
                    className="w-full p-3 bg-black/40 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-primary-500"
                    placeholder="Provide details about amenities, room size, house rules, internet, etc..."
                    value={newListing.description}
                    onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
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
                    Post Listing
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
