import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { ShoppingBag, Search, Filter, Loader2, MapPin, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Listing {
  id: string;
  title: string;
  price: number;
  category: string;
  condition: string;
  location: string;
  images: { url: string }[];
  seller: { name: string; profile: { avatar: string } };
  createdAt: string;
}

export const MarketplacePage = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    price: '',
    category: 'ELECTRONICS',
    condition: 'LIKE_NEW',
    location: '',
  });

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);

      const response = await api.get(`/listings?${params.toString()}`);
      setListings(response.data.data.listings);
    } catch (error) {
      console.error('Failed to fetch listings', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchListings();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedCategory]);

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/listings', {
        title: newListing.title,
        description: newListing.description,
        price: Number(newListing.price),
        category: newListing.category,
        condition: newListing.condition,
        location: newListing.location,
      });
      setIsModalOpen(false);
      setNewListing({
        title: '',
        description: '',
        price: '',
        category: 'ELECTRONICS',
        condition: 'LIKE_NEW',
        location: '',
      });
      fetchListings();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to post listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">UniMarket</h1>
            <p className="mt-2 text-white/60">Buy and sell textbooks, electronics, and more with students.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="mt-4 md:mt-0">Post a Listing</Button>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-sm mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input 
              type="text" 
              placeholder="Search items..."
              className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary-500 transition-all text-white placeholder:text-white/40"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-64 relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
            <select 
              className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary-500 appearance-none text-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="BOOKS">Books & Notes</option>
              <option value="ELECTRONICS">Electronics</option>
              <option value="FURNITURE">Furniture</option>
              <option value="CLOTHING">Clothing</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        {/* Listings Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
            <ShoppingBag className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white">No items found</h3>
            <p className="text-white/60 mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <Link to={`/marketplace/${listing.id}`} key={listing.id} className="block group h-full">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-primary-500/50 rounded-xl overflow-hidden hover:shadow-elevated transition-all h-full flex flex-col">
                  
                  {/* Image Placeholder */}
                  <div className="aspect-[4/3] bg-black/30 relative overflow-hidden border-b border-white/10">
                    {listing.images && listing.images.length > 0 ? (
                      <img src={listing.images[0].url} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/40 group-hover:scale-105 transition-transform duration-300 bg-black/20">
                        <ShoppingBag className="w-12 h-12 opacity-50" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-black/50 text-white border border-white/20 shadow-sm backdrop-blur-md">
                        {listing.condition.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h2 className="text-lg font-semibold text-white line-clamp-2 leading-tight group-hover:text-primary-400 transition-colors">
                        {listing.title}
                      </h2>
                    </div>
                    
                    <p className="text-xl font-bold text-primary-400 mb-4">
                      ₹{listing.price.toLocaleString()}
                    </p>

                    <div className="mt-auto space-y-2">
                      <div className="flex items-center text-xs text-white/60">
                        <MapPin className="w-3.5 h-3.5 mr-1" />
                        <span className="truncate">{listing.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                        <div className="w-6 h-6 rounded-full bg-black/40 flex items-center justify-center overflow-hidden shrink-0 border border-white/5">
                          <span className="text-[10px] font-bold text-white/60">{listing.seller.name.charAt(0)}</span>
                        </div>
                        <span className="text-xs text-white/80 truncate">{listing.seller.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Create Listing Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-xl bg-slate-900/90 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6 text-white my-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold font-display">Post an Item for Sale</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateListing} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Item Title *</label>
                  <Input 
                    required 
                    placeholder="e.g. MacBook Pro M1 16GB" 
                    value={newListing.title}
                    onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">Price ($) *</label>
                    <Input 
                      required
                      type="number" 
                      placeholder="450" 
                      value={newListing.price}
                      onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">Category</label>
                    <select
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
                      value={newListing.category}
                      onChange={(e) => setNewListing({ ...newListing, category: e.target.value })}
                    >
                      <option value="ELECTRONICS">Electronics</option>
                      <option value="BOOKS">Books</option>
                      <option value="FURNITURE">Furniture</option>
                      <option value="CLOTHING">Clothing</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">Condition</label>
                    <select
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
                      value={newListing.condition}
                      onChange={(e) => setNewListing({ ...newListing, condition: e.target.value })}
                    >
                      <option value="NEW">Brand New</option>
                      <option value="LIKE_NEW">Like New</option>
                      <option value="GOOD">Good</option>
                      <option value="FAIR">Fair</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Location *</label>
                  <Input 
                    required 
                    placeholder="e.g. North Campus / Student Housing" 
                    value={newListing.location}
                    onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Description *</label>
                  <textarea 
                    required
                    rows={4}
                    className="w-full p-3 bg-black/40 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-primary-500"
                    placeholder="Describe the item condition, specs, reason for selling..."
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
