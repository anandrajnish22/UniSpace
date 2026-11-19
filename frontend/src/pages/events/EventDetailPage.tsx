import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { Calendar, MapPin, Users, Ticket, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRsvping, setIsRsvping] = useState(false);
  const [isAttending, setIsAttending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data.data.event);
        setIsAttending(response.data.data.isAttending || false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load event details');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchEvent();
  }, [id]);

  const handleRsvp = async () => {
    setIsRsvping(true);
    try {
      const response = await api.post(`/events/${id}/rsvp`);
      setIsAttending(response.data.data.registered);
      const updated = await api.get(`/events/${id}`);
      setEvent(updated.data.data.event);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to toggle RSVP');
    } finally {
      setIsRsvping(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="text-center py-20 text-white">
        <p className="text-danger-400 text-lg mb-4">{error || 'Event not found'}</p>
        <Button onClick={() => navigate('/events')} variant="outline">Back to Events</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-10 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/events')}
          className="flex items-center text-white/60 hover:text-white transition-colors mb-6 group text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Events
        </button>

        {/* Main Event Card */}
        <div className="bg-[#121217]/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
          
          {/* Banner */}
          <div className="h-60 sm:h-72 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600 relative flex items-center justify-center overflow-hidden">
            {event.bannerUrl ? (
              <img src={event.bannerUrl} alt={event.title} className="w-full h-full object-cover" />
            ) : (
              <Calendar className="w-24 h-24 text-white/30" />
            )}
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute top-6 left-6">
              <span className="px-3.5 py-1.5 rounded-full bg-black/70 text-white border border-white/20 text-xs font-semibold backdrop-blur-md shadow-md">
                {event.category}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-8 border-b border-white/10">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-3 leading-tight">
                  {event.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-white/70">
                  <div className="flex items-center gap-2 font-medium text-primary-400">
                    <Calendar className="w-4.5 h-4.5" />
                    {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4.5 h-4.5 text-white/50" />
                    {event.venue}
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto">
                <Button 
                  onClick={handleRsvp} 
                  disabled={isRsvping}
                  className={`w-full md:w-auto h-12 px-8 text-sm sm:text-base font-semibold shadow-glow ${
                    isAttending ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : ''
                  }`}
                >
                  {isRsvping ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isAttending ? (
                    <span className="flex items-center text-emerald-400">
                      <CheckCircle className="w-5 h-5 mr-2" /> Attending (RSVP'd)
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 p-5 rounded-2xl bg-white/[0.03] border border-white/10 mb-8">
              <div>
                <p className="text-xs text-white/50 font-medium uppercase tracking-wider">Ticket Price</p>
                <p className="text-xl font-bold text-white mt-1">
                  {event.ticketPrice === 0 ? 'FREE' : `₹${event.ticketPrice}`}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/50 font-medium uppercase tracking-wider">Total Attendees</p>
                <p className="text-xl font-bold text-white mt-1 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary-400" />
                  {event._count?.registrations || 0} {event.capacity ? `/ ${event.capacity}` : ''}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/50 font-medium uppercase tracking-wider">Status</p>
                <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {event.status || 'PUBLISHED'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                About this Event
              </h3>
              <p className="text-white/80 whitespace-pre-wrap leading-relaxed text-sm sm:text-base bg-white/[0.02] p-5 rounded-xl border border-white/5">
                {event.description}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
