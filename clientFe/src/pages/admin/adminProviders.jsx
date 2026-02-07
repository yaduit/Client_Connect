import { useEffect, useState } from 'react';
import { Search, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import AdminLayout from '../../components/admin/adminLayout.jsx';
import StatusBadge from '../../components/admin/statusBadge.jsx';
import ConfirmDialog from '../../components/admin/confirmDialog.jsx';
import { getAllProvidersApi, updateProviderStatusApi, deleteProviderApi } from '../../api/admin.api.js';

const AdminProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  
  const [statusDialog, setStatusDialog] = useState({ isOpen: false, provider: null, newStatus: null });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, provider: null });

  useEffect(() => {
    fetchProviders();
  }, [pagination.page, statusFilter]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchTerm || undefined
      };

      const data = await getAllProvidersApi(params);
      setProviders(data.providers);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to fetch providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchProviders();
  };

  const handleStatusToggle = async (providerId, newStatus) => {
    try {
      await updateProviderStatusApi(providerId, newStatus);
      setStatusDialog({ isOpen: false, provider: null, newStatus: null });
      fetchProviders();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert(error.message || 'Failed to update provider status');
    }
  };

  const handleDelete = async (providerId) => {
    try {
      await deleteProviderApi(providerId);
      setDeleteDialog({ isOpen: false, provider: null });
      fetchProviders();
    } catch (error) {
      console.error('Failed to delete provider:', error);
      alert(error.message || 'Failed to delete provider');
    }
  };

  return (
    <AdminLayout title="Provider Management">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by business name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-800 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Providers Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-700 rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : providers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No providers found
                  </td>
                </tr>
              ) : (
                providers.map((provider) => (
                  <tr key={provider._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">
                      {provider.businessName}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        <div className="font-medium text-slate-800">{provider.userId?.name}</div>
                        <div className="text-xs">{provider.userId?.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        <div>{provider.categoryId?.name}</div>
                        <div className="text-xs text-gray-500">{provider.subCategorySlug}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {provider.location?.city}, {provider.location?.state}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={provider.isActive} type="provider" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {provider.isActive ? (
                          <button
                            onClick={() => setStatusDialog({ 
                              isOpen: true, 
                              provider, 
                              newStatus: false 
                            })}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Deactivate Provider"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setStatusDialog({ 
                              isOpen: true, 
                              provider, 
                              newStatus: true 
                            })}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                            title="Activate Provider"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteDialog({ isOpen: true, provider })}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete Provider"
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
            <p className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.pages} ({pagination.total} total)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status Change Confirmation */}
      <ConfirmDialog
        isOpen={statusDialog.isOpen}
        onClose={() => setStatusDialog({ isOpen: false, provider: null, newStatus: null })}
        onConfirm={() => handleStatusToggle(statusDialog.provider?._id, statusDialog.newStatus)}
        title={statusDialog.newStatus ? 'Activate Provider' : 'Deactivate Provider'}
        message={`Are you sure you want to ${statusDialog.newStatus ? 'activate' : 'deactivate'} ${statusDialog.provider?.businessName}?`}
        confirmText={statusDialog.newStatus ? 'Activate' : 'Deactivate'}
        danger={!statusDialog.newStatus}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, provider: null })}
        onConfirm={() => handleDelete(deleteDialog.provider?._id)}
        title="Delete Provider"
        message={`Are you sure you want to permanently delete ${deleteDialog.provider?.businessName}? This action cannot be undone.`}
        confirmText="Delete"
        danger
      />
    </AdminLayout>
  );
};

export default AdminProviders;