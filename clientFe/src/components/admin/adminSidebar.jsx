import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, Calendar, FolderTree, LogOut, X } from 'lucide-react';

const AdminSidebar = ({ onLogout, isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/providers', icon: Briefcase, label: 'Providers' },
    { path: '/admin/bookings', icon: Calendar, label: 'Bookings' },
    { path: '/admin/categories', icon: FolderTree, label: 'Categories' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          w-64 bg-green-700 text-white flex flex-col
          fixed lg:static inset-y-0 left-0 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-green-600">
          <div>
            <h1 className="text-lg font-bold tracking-tight">CLIENT CONNECT</h1>
            <p className="text-xs text-green-200 mt-0.5 uppercase tracking-widest">
              Admin Panel
            </p>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-green-600 rounded-md transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                  ${
                    active
                      ? 'bg-green-600 text-white'
                      : 'text-green-50 hover:bg-emerald-600 hover:text-white'
                  }
                `}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-green-600">
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium text-green-50 hover:bg-emerald-600 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
