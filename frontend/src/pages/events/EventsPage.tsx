import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { Calendar, MapPin, Search, Filter, Loader2, Users, Ticket, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface EventItem {
  id: string;
  title: string;
  description: string;
  venue: string;
  date: string;
  category: string;
  ticketPrice: number;
  bannerUrl: string;
  _count: { registrations: number };
}

export const EventsPage = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    venue: '',
    date: '',
    category: 'WORKSHOP',
    capacity: '100',
    ticketPrice: '0',
    isOnline: false,
  });

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);

      const response = await api.get(`/events?${params.toString()}`);
      setEvents(response.data.data.events);
    } catch (error) {
      console.error('Failed to fetch events', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchEvents();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedCategory]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/events', {
        title: newEvent.title,
        description: newEvent.description,
        venue: newEvent.venue,
        date: new Date(newEvent.date || Date.now()).toISOString(),
        category: newEvent.category,
        capacity: Number(newEvent.capacity),
        ticketPrice: Number(newEvent.ticketPrice),
        isOnline: newEvent.isOnline,
      });
      setIsModalOpen(false);
      setNewEvent({
        title: '',
        description: '',
        venue: '',
        date: '',
        category: 'WORKSHOP',
        capacity: '100',
        ticketPrice: '0',
        isOnline: false,
      });
      fetchEvents();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">UniEvents</h1>
            <p className="mt-2 text-white/60">Explore hackathons, workshops, and campus meetups.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="mt-4 md:mt-0">Create Event</Button>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-sm mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input 
              type="text" 
              placeholder="Search events by title or venue..."
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
              <option value="HACKATHON">Hackathon</option>
              <option value="WORKSHOP">Workshop</option>
              <option value="SEMINAR">Seminar</option>
              <option value="CULTURAL">Cultural</option>
              <option value="SPORTS">Sports</option>
              <option value="MEETUP">Meetup</option>
            </select>
          </div>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
            <Calendar className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white">No events found</h3>
            <p className="text-white/60 mt-1">Try adjusting your search or category filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link to={`/events/${event.id}`} key={event.id} className="block group">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-primary-500/50 rounded-2xl overflow-hidden hover:shadow-elevated transition-all flex flex-col h-full">
                  
                  {/* Event Banner */}
                  <div className="h-48 bg-black/40 relative overflow-hidden flex items-center justify-center text-white border-b border-white/10">
                    {event.bannerUrl ? (
                      <img src={event.bannerUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <Calendar className="w-16 h-16 text-white/20 group-hover:scale-110 transition-transform" />
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-black/50 text-white border border-white/20 backdrop-blur-md font-semibold">
                        {event.category}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1 rounded-lg text-xs font-medium text-white flex items-center gap-1">
                      <Ticket className="w-3.5 h-3.5" />
                      {event.ticketPrice === 0 ? 'Free' : `₹${event.ticketPrice}`}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center text-xs font-semibold text-primary-400 mb-2">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>

                    <h2 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors mb-3 line-clamp-2">
                      {event.title}
                    </h2>

                    <p className="text-white/80 text-sm line-clamp-2 mb-6 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                      <div className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-white/40" />
                        <span className="truncate max-w-[140px]">{event.venue}</span>
                      </div>

                      <div className="flex items-center text-white/80 font-medium">
                        <Users className="w-3.5 h-3.5 mr-1 text-white/40" />
                        {event._count.registrations} Attending
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Create Event Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-xl bg-slate-900/90 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6 text-white my-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold font-display">Create Campus Event</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Event Title *</label>
                  <Input 
                    required 
                    placeholder="e.g. AI & ML Hackathon 2026" 
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">Category</label>
                    <select
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
                      value={newEvent.category}
                      onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    >
                      <option value="WORKSHOP">Workshop</option>
                      <option value="HACKATHON">Hackathon</option>
                      <option value="SEMINAR">Seminar</option>
                      <option value="CULTURAL">Cultural</option>
                      <option value="SPORTS">Sports</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">Date & Time *</label>
                    <Input 
                      required
                      type="datetime-local" 
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Venue / Location *</label>
                  <Input 
                    required 
                    placeholder="e.g. Auditorium / Zoom Link" 
                    value={newEvent.venue}
                    onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">Capacity</label>
                    <Input 
                      type="number" 
                      placeholder="100" 
                      value={newEvent.capacity}
                      onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">Ticket Price ($)</label>
                    <Input 
                      type="number" 
                      placeholder="0 (Free)" 
                      value={newEvent.ticketPrice}
                      onChange={(e) => setNewEvent({ ...newEvent, ticketPrice: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Description *</label>
                  <textarea 
                    required
                    rows={4}
                    className="w-full p-3 bg-black/40 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-primary-500"
                    placeholder="What is this event about? Schedule, rules, prizes..."
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
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
                    Create Event
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
