import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { ShoppingBag, Search, Filter, Loader2, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

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

  return (
    <div className="min-h-screen bg-surface-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-surface-900">UniMarket</h1>
            <p className="mt-2 text-surface-500">Buy and sell textbooks, electronics, and more with students.</p>
          </div>
          <Button className="mt-4 md:mt-0">Post a Listing</Button>
        </div>

        {/* Filters */}
        <div className="glass p-4 rounded-xl shadow-sm mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input 
              type="text" 
              placeholder="Search items..."
              className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-64 relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 pointer-events-none" />
            <select 
              className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white appearance-none"
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
          <div className="text-center py-20 glass rounded-xl">
            <ShoppingBag className="w-12 h-12 text-surface-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900">No items found</h3>
            <p className="text-surface-500 mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <Link to={`/marketplace/${listing.id}`} key={listing.id} className="block group h-full">
                <div className="glass rounded-xl overflow-hidden hover:shadow-elevated transition-all border border-transparent group-hover:border-primary-200 h-full flex flex-col bg-white">
                  
                  {/* Image Placeholder */}
                  <div className="aspect-[4/3] bg-surface-200 relative overflow-hidden">
                    {listing.images && listing.images.length > 0 ? (
                      <img src={listing.images[0].url} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-surface-400 group-hover:scale-105 transition-transform duration-300 bg-surface-100">
                        <ShoppingBag className="w-12 h-12 opacity-50" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white/90 text-surface-900 shadow-sm backdrop-blur-md">
                        {listing.condition.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h2 className="text-lg font-semibold text-surface-900 line-clamp-2 leading-tight group-hover:text-primary-600 transition-colors">
                        {listing.title}
                      </h2>
                    </div>
                    
                    <p className="text-xl font-bold text-primary-600 mb-4">
                      ₹{listing.price.toLocaleString()}
                    </p>

                    <div className="mt-auto space-y-2">
                      <div className="flex items-center text-xs text-surface-500">
                        <MapPin className="w-3.5 h-3.5 mr-1" />
                        <span className="truncate">{listing.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 pt-3 border-t border-surface-100">
                        <div className="w-6 h-6 rounded-full bg-surface-200 flex items-center justify-center overflow-hidden shrink-0">
                          <span className="text-[10px] font-bold text-surface-500">{listing.seller.name.charAt(0)}</span>
                        </div>
                        <span className="text-xs text-surface-600 truncate">{listing.seller.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
