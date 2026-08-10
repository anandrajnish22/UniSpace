import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useSocketStore } from '@/store/useSocketStore';
import { useMessageStore } from '@/store/useMessageStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { GlobalSearch } from '@/components/ui/GlobalSearch';
import {
  LayoutDashboard,
  Briefcase,
  ShoppingBag,
  Calendar,
  Users,
  BookOpen,
  Home,
  MessageSquare,
  Bell,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Zap,
  Search,
  ShieldAlert,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard',   label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/jobs',        label: 'UniJobs',     icon: Briefcase },
  { to: '/marketplace', label: 'UniMarket',   icon: ShoppingBag },
  { to: '/events',      label: 'UniEvents',   icon: Calendar },
  { to: '/communities', label: 'UniHub',      icon: Users },
  { to: '/study',       label: 'UniStudy',    icon: BookOpen },
  { to: '/roommates',   label: 'UniFind',     icon: Home },
];

export const AppLayout = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuthStore();
  const { socket, connect, disconnect } = useSocketStore();
  const { addMessage, updateConversationTimestamp, setTyping } = useMessageStore();
  const { addNotification } = useNotificationStore();
  
  const [mobileMenuOpen,  setMobileMenuOpen]  = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('unispace_token');
    if (token) {
      connect(token);
    }
    return () => disconnect();
  }, [connect, disconnect]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: any) => {
      addMessage(message);
      updateConversationTimestamp(message.conversationId, message);
    };

    const handleNewNotification = (notification: any) => {
      addNotification(notification);
    };

    const handleUserTyping = ({ conversationId, userId }: any) => {
      setTyping(conversationId, userId, true);
    };

    const handleUserStoppedTyping = ({ conversationId, userId }: any) => {
      setTyping(conversationId, userId, false);
    };

    socket.on('new_message', handleNewMessage);
    socket.on('new_notification', handleNewNotification);
    socket.on('user_typing', handleUserTyping);
    socket.on('user_stopped_typing', handleUserStoppedTyping);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('new_notification', handleNewNotification);
      socket.off('user_typing', handleUserTyping);
      socket.off('user_stopped_typing', handleUserStoppedTyping);
    };
  }, [socket, addMessage, updateConversationTimestamp, addNotification, setTyping]);

  const handleLogout = () => {
    logout();
    disconnect();
    navigate('/login');
  };

  const NavItem = ({ to, label, icon: Icon, onClick }: any) => {
    const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
    return (
      <Link
        to={to}
        onClick={onClick}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group relative ${
          isActive
            ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
            : 'text-surface-100 hover:bg-surface-700 hover:text-surface-50 border border-transparent'
        }`}
      >
        <Icon className={`w-4.5 h-4.5 shrink-0 transition-colors ${
          isActive ? 'text-primary-400' : 'text-surface-200 group-hover:text-surface-50'
        }`} />
        <span>{label}</span>
        {isActive && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400 shadow-[0_0_6px_rgba(232,75,58,0.8)]" />
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden text-white bg-[#030014]">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-900/20 via-[#030014] to-[#030014] z-0" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-screen z-0" />
      
      {/* ── Sidebar (Desktop) ─────────────────────── */}
      <aside
        className="hidden lg:flex flex-col w-64 fixed top-0 left-0 h-full z-30"
        style={{
          background: 'rgba(13, 13, 13, 0.95)',
          borderRight: '1px solid rgba(232, 75, 58, 0.1)',
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* Logo */}
        <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(232, 75, 58, 0.08)' }}>
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #e84b3a, #f5a623)' }}
            >
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span
              className="font-bold text-lg tracking-tight"
              style={{ fontFamily: "'Clash Display', sans-serif", color: '#f5f3ef' }}
            >
              Uni<span style={{ color: '#e84b3a' }}>Space</span>
            </span>
          </Link>
        </div>

        {/* Global Search Button */}
        <div className="px-3 pt-4">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-900 border border-surface-800 text-surface-400 hover:text-surface-50 hover:border-primary-500/30 transition-all text-sm group"
          >
            <Search className="w-4 h-4 shrink-0" />
            <span className="flex-1 text-left">Search...</span>
            <div className="flex items-center gap-0.5 opacity-50 group-hover:opacity-100 transition-opacity">
              <kbd className="px-1.5 py-0.5 rounded-md bg-surface-800 text-[10px] font-mono border border-surface-700">⌘</kbd>
              <kbd className="px-1.5 py-0.5 rounded-md bg-surface-800 text-[10px] font-mono border border-surface-700">K</kbd>
            </div>
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}

          <div className="pt-6 mt-4 space-y-0.5" style={{ borderTop: '1px solid rgba(232, 75, 58, 0.08)' }}>
            {[
              { to: '/messages',      label: 'Messages',      icon: MessageSquare, badge: 0 },
              { to: '/notifications', label: 'Notifications', icon: Bell,          badge: useNotificationStore().unreadCount },
              { to: '/settings',      label: 'Settings',      icon: Settings },
            ].map(({ to, label, icon: Icon, badge }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium border border-transparent transition-all duration-200"
                style={{ color: '#6b6b6b' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.color = '#d4d0c8';
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(26,26,26,0.8)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.color = '#6b6b6b';
                  (e.currentTarget as HTMLAnchorElement).style.background = '';
                }}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                <span className="flex-1">{label}</span>
                {!!badge && badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-primary-500 shadow-glow-sm">
                    {badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Profile section */}
        <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(232, 75, 58, 0.08)' }}>
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
            style={{ color: '#d4d0c8' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(26,26,26,0.8)')}
            onMouseLeave={e => (e.currentTarget.style.background = '')}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
              style={{ background: 'linear-gradient(135deg, #e84b3a, #f5a623)' }}
            >
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-sm font-semibold truncate" style={{ color: '#f5f3ef' }}>{user?.name}</p>
              <p className="text-xs truncate" style={{ color: '#6b6b6b' }}>{user?.role}</p>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${profileMenuOpen ? 'rotate-180' : ''}`} style={{ color: '#6b6b6b' }} />
          </button>

          {profileMenuOpen && (
            <div
              className="mt-2 py-1 rounded-xl overflow-hidden shadow-2xl"
              style={{ background: '#141414', border: '1px solid rgba(232,75,58,0.2)' }}
            >
              <Link
                to={`/profile/${user?.id}`}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors duration-200"
                style={{ color: '#d4d0c8' }}
                onClick={() => setProfileMenuOpen(false)}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(26,26,26,0.9)')}
                onMouseLeave={e => (e.currentTarget.style.background = '')}
              >
                <User className="w-4 h-4" style={{ color: '#6b6b6b' }} />
                View Profile
              </Link>
              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors duration-200"
                  style={{ color: '#d4d0c8' }}
                  onClick={() => setProfileMenuOpen(false)}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(26,26,26,0.9)')}
                  onMouseLeave={e => (e.currentTarget.style.background = '')}
                >
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors duration-200"
                style={{ color: '#e84b3a' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(232,75,58,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.background = '')}
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── Mobile Topbar ────────────────────────── */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-40 px-4 py-3 flex items-center justify-between"
        style={{
          background: 'rgba(10, 10, 10, 0.9)',
          borderBottom: '1px solid rgba(232, 75, 58, 0.1)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <Link to="/dashboard" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #e84b3a, #f5a623)' }}
          >
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span
            className="font-bold"
            style={{ fontFamily: "'Clash Display', sans-serif", color: '#f5f3ef' }}
          >
            Uni<span style={{ color: '#e84b3a' }}>Space</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-surface-400 hover:text-surface-50 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
          
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ml-1"
            style={{ background: 'linear-gradient(135deg, #e84b3a, #f5a623)' }}
          >
            {user?.name?.charAt(0) || 'U'}
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 transition-colors duration-200"
            style={{ color: '#d4d0c8' }}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute left-0 top-0 h-full w-72 overflow-y-auto"
            style={{ background: '#0d0d0d', borderRight: '1px solid rgba(232,75,58,0.12)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="pt-20 px-3 pb-6 space-y-0.5">
              {navItems.map((item) => (
                <NavItem key={item.to} {...item} onClick={() => setMobileMenuOpen(false)} />
              ))}

              <div className="pt-6 mt-4 border-t border-surface-800 space-y-0.5">
                {[
                  { to: '/messages',      label: 'Messages',      icon: MessageSquare },
                  { to: '/notifications', label: 'Notifications', icon: Bell },
                  { to: '/settings',      label: 'Settings',      icon: Settings },
                ].map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-surface-400"
                  >
                    <Icon className="w-4.5 h-4.5" />
                    {label}
                  </Link>
                ))}
              </div>

              <div className="pt-6 mt-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{ color: '#e84b3a' }}
                >
                  <LogOut className="w-4.5 h-4.5" />
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Page Content ─────────────────────────── */}
      <main className="flex-1 lg:pl-64 relative z-10">
        <div className="pt-14 lg:pt-0">
          <Outlet />
        </div>
      </main>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};
