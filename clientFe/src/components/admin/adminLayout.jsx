import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth/useAuth.js';
import { LogoutApi } from '../../api/auth.api.js';
import AdminSidebar from './adminSidebar.jsx';
import AdminHeader from './adminHeader.jsx';

const AdminLayout = ({ children, title }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await LogoutApi();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 admin-layout">
      <AdminSidebar onLogout={handleLogout} />
      
      <div className="flex-1 ml-64 flex flex-col">
        <AdminHeader title={title} />
        
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;