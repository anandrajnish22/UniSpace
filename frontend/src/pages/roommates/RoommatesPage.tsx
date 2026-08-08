import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Home, MapPin, Search, Filter, Loader2, DollarSign, UserCheck, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

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

  return (
    <div className="min-h-screen bg-surface-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-surface-900">UniFind Roommates & PGs</h1>
            <p className="mt-2 text-surface-500">Find compatible student roommates, PGs, and flats near campus.</p>
          </div>
          <Button className="mt-4 md:mt-0">Post Room / Find Roommate</Button>
        </div>

        {/* Filters */}
        <div className="glass p-4 rounded-xl shadow-sm mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input 
              type="text" 
              placeholder="Search by location, neighborhood, or campus area..."
              className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="w-full px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white"
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
            className="w-full px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white"
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
          <div className="text-center py-20 glass rounded-xl">
            <Home className="w-12 h-12 text-surface-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900">No housing listings found</h3>
            <p className="text-surface-500 mt-1">Try adjusting your filters or location search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((l) => (
              <div key={l.id} className="glass p-6 rounded-2xl bg-white border border-surface-200 hover:shadow-elevated transition-all flex flex-col h-full">
                
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="outline" className="text-primary-600 border-primary-200 bg-primary-50 font-bold">
                    {l.type}
                  </Badge>
                  <div className="text-right">
                    <span className="text-xl font-bold text-surface-900">₹{l.rentAmount.toLocaleString()}</span>
                    <span className="text-xs text-surface-400"> / month</span>
                  </div>
                </div>

                <div className="flex items-center text-sm font-semibold text-surface-800 mb-3">
                  <MapPin className="w-4 h-4 mr-1.5 text-primary-500 shrink-0" />
                  <span className="truncate">{l.location}</span>
                </div>

                <p className="text-surface-600 text-sm line-clamp-3 mb-6 leading-relaxed">
                  {l.description}
                </p>

                <div className="space-y-2 mb-6 text-xs text-surface-500">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-surface-400" />
                    <span>Gender Pref: <strong className="text-surface-700">{l.genderPref}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-surface-400" />
                    <span>Available From: {new Date(l.availableFrom).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-surface-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-surface-200 flex items-center justify-center font-bold text-xs text-surface-600">
                      {l.lister.name.charAt(0)}
                    </div>
                    <span className="text-xs text-surface-600 font-medium">{l.lister.name}</span>
                  </div>

                  <Button size="sm" variant="outline">Contact</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
