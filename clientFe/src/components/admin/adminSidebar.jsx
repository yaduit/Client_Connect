import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, Calendar, FolderTree, LogOut } from 'lucide-react';

const AdminSidebar = ({ onLogout }) => {
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
    <aside className="w-64 bg-green-800 text-white flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-green-700">
        <h1 className="text-xl font-bold tracking-tight">CLIENT CONNECT</h1>
        <p className="text-xs text-green-200 mt-1 uppercase tracking-widest">Admin Panel</p>
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                active
                  ? 'bg-green-700 text-white'
                  : 'text-green-100 hover:bg-green-700 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-green-700">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium text-green-100 hover:bg-green-700 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;