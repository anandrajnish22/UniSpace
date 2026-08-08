import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { Calendar, MapPin, Search, Filter, Loader2, Users, Ticket } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

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

  return (
    <div className="min-h-screen bg-surface-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-surface-900">UniEvents</h1>
            <p className="mt-2 text-surface-500">Explore hackathons, workshops, and campus meetups.</p>
          </div>
          <Button className="mt-4 md:mt-0">Create Event</Button>
        </div>

        {/* Filters */}
        <div className="glass p-4 rounded-xl shadow-sm mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input 
              type="text" 
              placeholder="Search events by title or venue..."
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
          <div className="text-center py-20 glass rounded-xl">
            <Calendar className="w-12 h-12 text-surface-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900">No events found</h3>
            <p className="text-surface-500 mt-1">Try adjusting your search or category filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link to={`/events/${event.id}`} key={event.id} className="block group">
                <div className="glass rounded-2xl overflow-hidden hover:shadow-elevated transition-all border border-transparent group-hover:border-primary-200 bg-white flex flex-col h-full">
                  
                  {/* Event Banner */}
                  <div className="h-48 bg-gradient-to-br from-primary-500 to-accent-600 relative overflow-hidden flex items-center justify-center text-white">
                    {event.bannerUrl ? (
                      <img src={event.bannerUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <Calendar className="w-16 h-16 opacity-30 group-hover:scale-110 transition-transform" />
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-surface-900 backdrop-blur-md font-semibold">
                        {event.category}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-surface-900/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-medium text-white flex items-center gap-1">
                      <Ticket className="w-3.5 h-3.5" />
                      {event.ticketPrice === 0 ? 'Free' : `₹${event.ticketPrice}`}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center text-xs font-semibold text-primary-600 mb-2">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>

                    <h2 className="text-xl font-bold text-surface-900 group-hover:text-primary-600 transition-colors mb-3 line-clamp-2">
                      {event.title}
                    </h2>

                    <p className="text-surface-600 text-sm line-clamp-2 mb-6 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-surface-100 flex items-center justify-between text-xs text-surface-500">
                      <div className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-surface-400" />
                        <span className="truncate max-w-[140px]">{event.venue}</span>
                      </div>

                      <div className="flex items-center text-surface-600 font-medium">
                        <Users className="w-3.5 h-3.5 mr-1 text-surface-400" />
                        {event._count.registrations} Attending
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
