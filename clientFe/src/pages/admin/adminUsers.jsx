import { useEffect, useState } from 'react';
import { Search, Edit2, Trash2 } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import { getAllUsersApi, updateUserRoleApi, deleteUserApi } from '../../api/admin.api.js';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [editingUser, setEditingUser] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, user: null });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsersApi({
        page: pagination.page,
        limit: pagination.limit,
        role: roleFilter === 'all' ? undefined : roleFilter,
        search: searchTerm || undefined
      });
      setUsers(response.users);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total,
        pages: response.pagination.pages
      }));
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.limit, roleFilter, searchTerm]);

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await updateUserRoleApi(userId, newRole);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Failed to update role:', error);
      alert(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUserApi(userId);
      setDeleteDialog({ isOpen: false, user: null });
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <AdminLayout title="User Management">
      {/* Search & Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="provider">Provider</option>
            <option value="seeker">Seeker</option>
          </select>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-green-700 text-white rounded-md text-sm font-medium hover:bg-green-800 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide">
                  User
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
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-800 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-gray-200 border-t-green-700 rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-sm text-slate-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      {editingUser === user._id ? (
                        <select
                          defaultValue={user.role}
                          onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                          onBlur={() => setEditingUser(null)}
                          className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
                          autoFocus
                        >
                          <option value="admin">Admin</option>
                          <option value="provider">Provider</option>
                          <option value="seeker">Seeker</option>
                        </select>
                      ) : (
                        <StatusBadge status={user.role} type="role" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingUser(user._id)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          title="Edit role"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteDialog({ isOpen: true, user })}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Showing {users.length} of {pagination.total} users
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-slate-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-slate-700">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-slate-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, user: null })}
        onConfirm={() => handleDelete(deleteDialog.user._id)}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteDialog.user?.name}? This action cannot be undone.`}
        confirmText="Delete"
        danger
      />
    </AdminLayout>
  );
};

export default AdminUsers;