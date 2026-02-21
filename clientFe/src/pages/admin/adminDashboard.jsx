import { useEffect, useState } from 'react';
import { Users, Briefcase, Calendar, FolderTree, Clock, CheckCircle } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import StatsCard from '../../components/admin/StatsCard.jsx';
import { getDashboardStatsApi } from '../../api/admin.api.js';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStatsApi();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-green-700 rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="green"
        />
        <StatsCard
          title="Total Providers"
          value={stats.totalProviders}
          icon={Briefcase}
          color="emerald"
        />
        <StatsCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={Calendar}
          color="sky"
        />
        <StatsCard
          title="Categories"
          value={stats.totalCategories}
          icon={FolderTree}
          color="purple"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Pending Bookings"
          value={stats.pendingBookings}
          icon={Clock}
          color="amber"
        />
        <StatsCard
          title="Active Providers"
          value={stats.activeProviders}
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="Inactive Providers"
          value={stats.inactiveProviders}
          icon={Users}
          color="slate"
        />
      </div>

      {/* Recent Users Section */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-slate-800">Recent Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats.recentUsers?.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 capitalize">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
