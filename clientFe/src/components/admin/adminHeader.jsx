import { Menu } from 'lucide-react';
import { useAuth } from '../../context/auth/useAuth.js';

const AdminHeader = ({ title, onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Mobile menu + Title */}
        <div className="flex items-center gap-4">
          {/* Mobile Hamburger */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors text-slate-700"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page Title */}
          <h2 className="text-2xl font-semibold text-slate-800">
            {title}
          </h2>
        </div>

        {/* Right: User Info */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-slate-800">{user?.name}</p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;