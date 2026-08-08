import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { LogOut } from 'lucide-react';
import { api } from '@/lib/api';

export const DashboardPage = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-surface-900">Dashboard</h1>
            <p className="text-surface-500 mt-1">Welcome back, {user?.name}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </header>

        <div className="glass p-8 rounded-2xl shadow-elevated">
          <h2 className="text-xl font-semibold mb-4">Your Profile Details</h2>
          <div className="space-y-3 text-surface-700">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
            {user?.university && <p><strong>University:</strong> {user.university}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
