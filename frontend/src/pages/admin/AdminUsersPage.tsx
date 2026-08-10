import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Loader2, Search, MoreVertical, Ban, CheckCircle, ShieldOff } from 'lucide-react';
import { format } from 'date-fns';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isSuspended: boolean;
  isBanned: boolean;
  createdAt: string;
  profile?: { university: string | null };
}

export const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (userId: string, action: 'SUSPEND' | 'UNSUSPEND' | 'BAN' | 'UNBAN') => {
    try {
      await api.put(`/admin/users/${userId}/status`, { action });
      setUsers(users.map(u => {
        if (u.id === userId) {
          return {
            ...u,
            isSuspended: action === 'SUSPEND' ? true : action === 'UNSUSPEND' ? false : u.isSuspended,
            isBanned: action === 'BAN' ? true : action === 'UNBAN' ? false : u.isBanned,
          };
        }
        return u;
      }));
    } catch (err) {
      console.error('Failed to change user status', err);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-surface-50">Users</h1>
          <p className="text-surface-400 mt-1">Manage platform users and roles.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input 
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 bg-surface-900 border border-surface-800 rounded-xl pl-10 pr-4 py-2 text-sm text-surface-50 focus:outline-none focus:border-red-500/50"
          />
        </div>
      </div>

      <div className="bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-surface-300">
            <thead className="bg-surface-800/50 text-surface-400 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-red-500 mx-auto" />
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-surface-500">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t border-surface-800 hover:bg-surface-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-surface-50">{user.name}</p>
                      <p className="text-xs text-surface-500">{user.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-surface-800 text-surface-300 px-2.5 py-1 rounded-md text-[10px] font-bold">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.isBanned ? (
                        <span className="flex items-center gap-1.5 text-red-400 text-xs font-medium"><Ban className="w-3.5 h-3.5" /> Banned</span>
                      ) : user.isSuspended ? (
                        <span className="flex items-center gap-1.5 text-yellow-500 text-xs font-medium"><ShieldOff className="w-3.5 h-3.5" /> Suspended</span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-emerald-500 text-xs font-medium"><CheckCircle className="w-3.5 h-3.5" /> Active</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-surface-400 text-xs">
                      {format(new Date(user.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.isSuspended ? (
                          <button onClick={() => handleStatusChange(user.id, 'UNSUSPEND')} className="text-xs text-yellow-500 hover:underline">Unsuspend</button>
                        ) : (
                          <button onClick={() => handleStatusChange(user.id, 'SUSPEND')} className="text-xs text-yellow-500 hover:underline">Suspend</button>
                        )}
                        <span className="text-surface-700">|</span>
                        {user.isBanned ? (
                          <button onClick={() => handleStatusChange(user.id, 'UNBAN')} className="text-xs text-emerald-500 hover:underline">Unban</button>
                        ) : (
                          <button onClick={() => handleStatusChange(user.id, 'BAN')} className="text-xs text-red-500 hover:underline">Ban</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
