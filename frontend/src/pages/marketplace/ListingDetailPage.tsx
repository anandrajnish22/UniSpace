import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { ShoppingBag, MapPin, Loader2, ArrowLeft, Send, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

export const ListingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [listing, setListing] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await api.get(`/listings/${id}`);
        setListing(response.data.data.listing);
        setOfferAmount(response.data.data.listing.price.toString());
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load listing');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchListing();
  }, [id]);

  const handleOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post(`/listings/${id}/offers`, { 
        amount: parseFloat(offerAmount),
        message: offerMessage
      });
      setShowOfferModal(false);
      alert('Offer sent successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to send offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;
  if (error || !listing) return <div className="text-center mt-20 text-danger-500">{error}</div>;

  const isOwner = user?.id === listing.sellerId;

  return (
    <div className="min-h-screen bg-surface-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        <button onClick={() => navigate('/marketplace')} className="flex items-center text-surface-500 hover:text-surface-900 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Marketplace
        </button>

        <div className="bg-white rounded-2xl shadow-elevated overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0 border border-surface-200">
          
          {/* Image Section */}
          <div className="bg-surface-100 aspect-square md:aspect-auto flex items-center justify-center relative p-8">
            {listing.images && listing.images.length > 0 ? (
              <img src={listing.images[0].url} alt={listing.title} className="w-full h-full object-contain mix-blend-multiply" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-surface-400 opacity-50">
                <ShoppingBag className="w-32 h-32 mb-4" />
                <span>No images provided</span>
              </div>
            )}
            <Badge className="absolute top-4 right-4 text-sm px-3 py-1 bg-white/90 text-surface-900 backdrop-blur-md shadow-sm">
              {listing.condition.replace('_', ' ')}
            </Badge>
          </div>
          
          {/* Details Section */}
          <div className="p-8 md:p-10 flex flex-col">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="text-primary-600 border-primary-200 bg-primary-50">
                  {listing.category}
                </Badge>
                <span className="text-sm text-surface-500 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" /> {listing.location}
                </span>
              </div>

              <h1 className="text-3xl font-display font-bold text-surface-900 mb-2 leading-tight">
                {listing.title}
              </h1>
              
              <div className="text-4xl font-bold text-primary-600 mb-8">
                ₹{listing.price.toLocaleString()}
                {listing.isNegotiable && <span className="text-sm text-surface-400 font-normal ml-2">(Negotiable)</span>}
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-surface-600 whitespace-pre-wrap leading-relaxed">
                  {listing.description}
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-surface-100 mt-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-surface-200 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                    <span className="text-lg font-bold text-surface-500">{listing.seller.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm text-surface-500 font-medium">Sold by</p>
                    <p className="font-semibold text-surface-900">{listing.seller.name}</p>
                  </div>
                </div>
                <span className="text-sm text-surface-400">
                  Listed on {new Date(listing.createdAt).toLocaleDateString()}
                </span>
              </div>

              {!isOwner && (
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full h-12" onClick={() => setShowOfferModal(true)}>
                    <MessageSquare className="w-5 h-5 mr-2" /> Make Offer
                  </Button>
                  <Button className="w-full h-12">
                    Buy Now
                  </Button>
                </div>
              )}
              {isOwner && (
                <div className="bg-surface-50 p-4 rounded-xl border border-surface-200 text-center text-surface-600 text-sm">
                  This is your listing.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-900/50 backdrop-blur-sm p-4">
          <div className="glass w-full max-w-sm rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Make an Offer</h2>
            <form onSubmit={handleOffer}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-surface-700 mb-1">Offer Amount (₹)</label>
                <input
                  type="number"
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-surface-700 mb-1">Message (Optional)</label>
                <textarea
                  className="w-full px-4 py-2 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary-500 resize-none h-24"
                  placeholder="Hi, is this still available?"
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" type="button" onClick={() => setShowOfferModal(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  Send
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
