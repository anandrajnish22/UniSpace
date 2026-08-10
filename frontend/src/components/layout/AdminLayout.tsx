import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  ShieldAlert,
  Users,
  Flag,
  BarChart,
  LogOut,
  Zap,
} from 'lucide-react';

const adminNavItems = [
  { to: '/admin', label: 'Dashboard', icon: BarChart },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/reports', label: 'Reports', icon: Flag },
];

export const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0a]">
      {/* ── Admin Sidebar ────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 fixed top-0 left-0 h-full z-30 bg-surface-900 border-r border-surface-800">
        <div className="px-5 py-4 border-b border-surface-800 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg font-display text-red-500">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {adminNavItems.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                  isActive
                    ? 'bg-red-500/10 text-red-400'
                    : 'text-surface-400 hover:bg-surface-800 hover:text-surface-50'
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-surface-800">
          <Link 
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-surface-400 hover:bg-surface-800 hover:text-surface-50 mb-2 transition-colors"
          >
            <Zap className="w-4.5 h-4.5" />
            Exit Admin Panel
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4.5 h-4.5" />
            Log Out
          </button>
        </div>
      </aside>

      {/* ── Page Content ─────────────────────────── */}
      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <header className="h-16 border-b border-surface-800 bg-surface-900/50 backdrop-blur sticky top-0 z-20 px-8 flex items-center justify-end">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-surface-400">Logged in as {user?.name}</span>
            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header>
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
