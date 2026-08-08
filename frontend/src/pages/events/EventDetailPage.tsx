import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { Calendar, MapPin, Loader2, ArrowLeft, Users, CheckCircle, Ticket } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

export const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRsvping, setIsRsvping] = useState(false);
  const [isAttending, setIsAttending] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        const eventData = response.data.data.event;
        setEvent(eventData);
        
        // Check if user is attending
        if (user && eventData.registrations) {
          const userRsvp = eventData.registrations.some((r: any) => r.user.id === user.id);
          setIsAttending(userRsvp);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load event details');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchEvent();
  }, [id, user]);

  const handleRsvp = async () => {
    setIsRsvping(true);
    try {
      const response = await api.post(`/events/${id}/rsvp`);
      setIsAttending(response.data.data.rsvpStatus);
      // Reload details to get updated counts
      const updated = await api.get(`/events/${id}`);
      setEvent(updated.data.data.event);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to toggle RSVP');
    } finally {
      setIsRsvping(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;
  if (error || !event) return <div className="text-center mt-20 text-danger-500">{error}</div>;

  return (
    <div className="min-h-screen bg-surface-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <button onClick={() => navigate('/events')} className="flex items-center text-surface-500 hover:text-surface-900 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
        </button>

        <div className="glass rounded-3xl overflow-hidden shadow-elevated bg-white">
          
          {/* Banner */}
          <div className="h-64 md:h-80 bg-gradient-to-r from-primary-600 to-accent-600 relative flex items-center justify-center">
            {event.bannerUrl ? (
              <img src={event.bannerUrl} alt={event.title} className="w-full h-full object-cover" />
            ) : (
              <Calendar className="w-24 h-24 text-white/30" />
            )}
            <div className="absolute top-6 left-6">
              <Badge className="bg-white/90 text-surface-900 font-bold text-sm px-4 py-1.5 backdrop-blur-md">
                {event.category}
              </Badge>
            </div>
          </div>

          <div className="p-8 md:p-12">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-8 border-b border-surface-100">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-surface-900 mb-3 leading-tight">
                  {event.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-surface-600">
                  <div className="flex items-center gap-2 font-medium text-primary-600">
                    <Calendar className="w-5 h-5" />
                    {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-surface-400" />
                    {event.venue}
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto">
                <Button 
                  onClick={handleRsvp} 
                  disabled={isRsvping}
                  variant={isAttending ? 'secondary' : 'default'}
                  className="w-full md:w-auto h-12 px-8 text-base"
                >
                  {isRsvping ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isAttending ? (
                    <span className="flex items-center text-success-700 font-semibold">
                      <CheckCircle className="w-5 h-5 mr-2 text-success-500" /> Attending (RSVP'd)
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Ticket className="w-5 h-5 mr-2" /> RSVP / Reserve Ticket
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* Event Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-surface-50 mb-10 border border-surface-100">
              <div>
                <p className="text-xs text-surface-500 font-medium">Ticket Price</p>
                <p className="text-xl font-bold text-surface-900 mt-1">
                  {event.ticketPrice === 0 ? 'FREE' : `₹${event.ticketPrice}`}
                </p>
              </div>
              <div>
                <p className="text-xs text-surface-500 font-medium">Total Attendees</p>
                <p className="text-xl font-bold text-surface-900 mt-1 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary-500" />
                  {event._count?.registrations || 0} {event.capacity ? `/ ${event.capacity}` : ''}
                </p>
              </div>
              <div>
                <p className="text-xs text-surface-500 font-medium">Status</p>
                <Badge variant="outline" className="mt-1 font-medium bg-white">
                  {event.status}
                </Badge>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-surface-900">About this Event</h3>
              <p className="text-surface-700 whitespace-pre-wrap leading-relaxed text-base">
                {event.description}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
