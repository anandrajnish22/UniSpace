import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
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
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/jobs', label: 'UniJobs', icon: Briefcase },
  { to: '/marketplace', label: 'UniMarket', icon: ShoppingBag },
  { to: '/events', label: 'UniEvents', icon: Calendar },
  { to: '/communities', label: 'UniHub', icon: Users },
  { to: '/study', label: 'UniStudy', icon: BookOpen },
  { to: '/roommates', label: 'UniFind', icon: Home },
];

export const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface-50 flex">
      
      {/* ── Sidebar (Desktop) ───────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-surface-200 fixed top-0 left-0 h-full z-30 shadow-sm">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-surface-100">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center shadow-sm">
              <Zap className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-surface-900 tracking-tight">UniSpace</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="space-y-0.5">
            {navItems.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary-600' : 'text-surface-400'}`} />
                  {label}
                  {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />}
                </Link>
              );
            })}
          </div>

          <div className="mt-8 pt-4 border-t border-surface-100 space-y-0.5">
            <Link
              to="/messages"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-surface-600 hover:bg-surface-100 hover:text-surface-900 text-sm font-medium transition-all"
            >
              <MessageSquare className="w-5 h-5 shrink-0 text-surface-400" />
              Messages
            </Link>
            <Link
              to="/notifications"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-surface-600 hover:bg-surface-100 hover:text-surface-900 text-sm font-medium transition-all"
            >
              <Bell className="w-5 h-5 shrink-0 text-surface-400" />
              Notifications
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-surface-600 hover:bg-surface-100 hover:text-surface-900 text-sm font-medium transition-all"
            >
              <Settings className="w-5 h-5 shrink-0 text-surface-400" />
              Settings
            </Link>
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="px-3 py-4 border-t border-surface-100">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-surface-50 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-sm font-semibold text-surface-900 truncate">{user?.name}</p>
              <p className="text-xs text-surface-500 truncate">{user?.role}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-surface-400 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileMenuOpen && (
            <div className="mt-1 py-1 bg-white border border-surface-200 rounded-xl shadow-lg overflow-hidden">
              <Link
                to={`/profile/${user?.id}`}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-50 transition-colors"
                onClick={() => setProfileMenuOpen(false)}
              >
                <User className="w-4 h-4 text-surface-400" /> View Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-danger-600 hover:bg-danger-50 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── Mobile Topbar ───────────────────────────── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-surface-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-surface-900">UniSpace</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-surface-600 hover:text-surface-900 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-surface-900/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="pt-20 px-3 pb-6 overflow-y-auto h-full">
              <nav className="space-y-0.5">
                {navItems.map(({ to, label, icon: Icon }) => {
                  const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
                  return (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        isActive ? 'bg-primary-50 text-primary-700' : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-surface-400'}`} />
                      {label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-6 pt-4 border-t border-surface-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-danger-600 hover:bg-danger-50 text-sm font-medium transition-all"
                >
                  <LogOut className="w-5 h-5" /> Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Page Content ────────────────────────────── */}
      <main className="flex-1 lg:pl-64 pt-0 lg:pt-0">
        <div className="pt-14 lg:pt-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
