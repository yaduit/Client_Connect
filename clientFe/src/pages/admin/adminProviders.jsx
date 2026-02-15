import { useEffect, useState } from 'react';
import { Search, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import { getAllProvidersApi, updateProviderStatusApi, deleteProviderApi } from '../../api/admin.api.js';

const AdminProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, provider: null });

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const data = await getAllProvidersApi({
        page: pagination.page,
        limit: pagination.limit,
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchTerm || undefined
      });
      setProviders(data.providers);
      setPagination((prev) => ({
        ...prev,
        total: data.pagination.total,
        pages: data.pagination.pages
      }));
    } catch (error) {
      console.error('Failed to fetch providers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [pagination.page, pagination.limit, statusFilter, searchTerm]);

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleStatusToggle = async (providerId, currentIsActive) => {
    try {
      const newStatus = !currentIsActive; // Toggle boolean
      await updateProviderStatusApi(providerId, newStatus);
      fetchProviders();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (providerId) => {
    try {
      await deleteProviderApi(providerId);
      setDeleteDialog({ isOpen: false, provider: null });
      fetchProviders();
    } catch (error) {
      console.error('Failed to delete provider:', error);
      alert(error.response?.data?.message || 'Failed to delete provider');
    }
  };

  return (
    <AdminLayout title="Provider Management">
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
              placeholder="Search by business name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-green-700 text-white rounded-md text-sm font-medium hover:bg-green-800 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Providers Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide">
                  Business Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide">
                  Rating
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-800 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-gray-200 border-t-green-700 rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : providers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-sm text-slate-500">
                    No providers found
                  </td>
                </tr>
              ) : (
                providers.map((provider) => (
                  <tr key={provider._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">
                      {provider.businessName}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {provider.categoryId?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {provider.location?.city}, {provider.location?.state}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={provider.isActive ? 'active' : 'inactive'} type="provider" />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      ⭐ {provider.ratingAverage} ({provider.totalReviews})
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleStatusToggle(provider._id, provider.isActive)}
                          className={`p-2 rounded-md transition-colors ${
                            provider.isActive
                              ? 'text-slate-600 hover:bg-slate-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={provider.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {provider.isActive ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => setDeleteDialog({ isOpen: true, provider })}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete provider"
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
              Showing {providers.length} of {pagination.total} providers
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
        onClose={() => setDeleteDialog({ isOpen: false, provider: null })}
        onConfirm={() => handleDelete(deleteDialog.provider._id)}
        title="Delete Provider"
        message={`Are you sure you want to delete ${deleteDialog.provider?.businessName}? This action cannot be undone.`}
        confirmText="Delete"
        danger
      />
    </AdminLayout>
  );
};

export default AdminProviders;