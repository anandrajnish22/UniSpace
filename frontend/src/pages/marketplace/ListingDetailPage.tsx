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
  
  // Offer modal state
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await api.get(`/listings/${id}`);
        setListing(response.data.data.listing);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load listing details');
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
        amount: Number(offerAmount),
        message: offerMessage,
      });
      setShowOfferModal(false);
      setOfferAmount('');
      setOfferMessage('');
      alert('Offer submitted successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="text-center py-20 text-white">
        <p className="text-danger-400 text-lg mb-4">{error || 'Listing not found'}</p>
        <Button onClick={() => navigate('/marketplace')} variant="outline">Back to Marketplace</Button>
      </div>
    );
  }

  const isOwner = user?.id === listing.sellerId;

  return (
    <div className="min-h-screen bg-transparent py-10 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-5xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/marketplace')}
          className="flex items-center text-white/60 hover:text-white transition-colors mb-6 group text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Marketplace
        </button>

        {/* Main Card */}
        <div className="bg-[#121217]/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0 backdrop-blur-xl">
          
          {/* Image Section */}
          <div className="bg-black/40 aspect-square md:aspect-auto flex items-center justify-center relative p-8 border-b md:border-b-0 md:border-r border-white/10">
            {listing.images && listing.images.length > 0 ? (
              <img
                src={listing.images[0].url}
                alt={listing.title}
                className="w-full h-full max-h-[420px] object-cover rounded-xl border border-white/10 shadow-lg"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/30 py-16">
                <ShoppingBag className="w-24 h-24 mb-3" />
                <span className="text-sm">No images provided</span>
              </div>
            )}
            <span className="absolute top-6 right-6 text-xs font-semibold px-3 py-1 rounded-full bg-black/70 text-white border border-white/20 backdrop-blur-md shadow-md">
              {listing.condition?.replace('_', ' ')}
            </span>
          </div>
          
          {/* Details Section */}
          <div className="p-6 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-primary-500/20 text-primary-400 border border-primary-500/30">
                  {listing.category}
                </span>
                <span className="text-xs text-white/50 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-white/40" /> {listing.location || 'Campus'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-3 leading-snug">
                {listing.title}
              </h1>

              <div className="text-3xl font-bold text-primary-400 mb-6 flex items-baseline gap-2">
                ₹{listing.price?.toLocaleString()}
                {listing.isNegotiable && (
                  <span className="text-xs text-white/50 font-normal">
                    (Negotiable)
                  </span>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-2">
                  Description
                </h3>
                <p className="text-white/80 whitespace-pre-wrap leading-relaxed text-sm sm:text-base bg-white/[0.02] p-4 rounded-xl border border-white/5">
                  {listing.description}
                </p>
              </div>
            </div>

            {/* Seller & Action Footer */}
            <div className="pt-6 border-t border-white/10 mt-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#18181f] border border-white/20 shadow-md flex items-center justify-center overflow-hidden shrink-0">
                    {listing.seller?.profile?.avatar ? (
                      <img src={listing.seller.profile.avatar} alt={listing.seller.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-base font-bold text-primary-400 font-display">
                        {listing.seller?.name?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Seller</p>
                    <p className="font-semibold text-white text-sm">{listing.seller?.name}</p>
                  </div>
                </div>
                <span className="text-xs text-white/40">
                  {new Date(listing.createdAt).toLocaleDateString()}
                </span>
              </div>

              {!isOwner ? (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="w-full h-11 border-white/20 text-white hover:bg-white/10"
                    onClick={() => setShowOfferModal(true)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" /> Make Offer
                  </Button>
                  <Button className="w-full h-11 shadow-glow" onClick={() => setShowOfferModal(true)}>
                    Buy / Inquire
                  </Button>
                </div>
              ) : (
                <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 text-center text-white/60 text-sm font-medium">
                  This is your active listing.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#16161e] border border-white/15 w-full max-w-sm rounded-2xl p-6 shadow-2xl text-white">
            <h2 className="text-xl font-bold font-display text-white mb-4">Make an Offer</h2>
            <form onSubmit={handleOffer} className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-white/70 mb-1.5">
                  Offer Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
                  placeholder={`e.g. ${listing.price}`}
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-white/70 mb-1.5">
                  Message (Optional)
                </label>
                <textarea
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none h-24 text-sm"
                  placeholder="Hi, is this still available for pick up?"
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" type="button" onClick={() => setShowOfferModal(false)} className="border-white/20 text-white hover:bg-white/10">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="shadow-glow">
                  {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  Send Offer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
