import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import { getAllBookingsApi } from '../../api/admin.api.js';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]); // ✅ NEW: Client-side filtering
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });

  useEffect(() => {
    fetchBookings();
  }, [pagination.page, statusFilter]);

  // ✅ NEW: Client-side search filtering
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredBookings(bookings);
      return;
    }

    const lowercaseSearch = searchTerm.toLowerCase();
    const filtered = bookings.filter((booking) => {
      const seekerName = booking.seekerId?.name?.toLowerCase() || '';
      const seekerEmail = booking.seekerId?.email?.toLowerCase() || '';
      const providerName = booking.providerId?.businessName?.toLowerCase() || '';
      const bookingId = booking._id.toLowerCase();

      return (
        seekerName.includes(lowercaseSearch) ||
        seekerEmail.includes(lowercaseSearch) ||
        providerName.includes(lowercaseSearch) ||
        bookingId.includes(lowercaseSearch)
      );
    });

    setFilteredBookings(filtered);
  }, [searchTerm, bookings]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getAllBookingsApi({
        page: pagination.page,
        limit: pagination.limit,
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchTerm || undefined
      });
      setBookings(response.data);
      setFilteredBookings(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total,
        pages: response.pagination.pages
      }));
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ REMOVED: handleSearch function (no backend search needed)

  return (
    <AdminLayout title="Bookings Overview">
      {/* Search & Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search bookings (client-side filter)..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            {/* ✅ NEW: Search info tooltip */}
            {searchTerm && (
              <p className="text-xs text-slate-500 mt-1">
                Filtering {filteredBookings.length} of {bookings.length} results on this page
              </p>
            )}
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide">
                  Seeker
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide">
                  Created
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
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-sm text-slate-500">
                    {searchTerm ? `No bookings match "${searchTerm}"` : 'No bookings found'}
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">
                      #{booking._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div>
                        <p className="font-medium">{booking.seekerId?.name || 'N/A'}</p>
                        <p className="text-xs text-slate-500">{booking.seekerId?.email || ''}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {booking.providerId?.businessName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={booking.status} type="booking" />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(booking.createdAt).toLocaleDateString()}
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
              Showing {filteredBookings.length} of {bookings.length} bookings on this page (Total: {pagination.total})
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
    </AdminLayout>
  );
};

export default AdminBookings;
