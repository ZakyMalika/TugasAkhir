import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Car, FileText, Settings, LogOut, Menu, X } from 'lucide-react';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const user = JSON.parse(localStorage.getItem('admin_user') || 'null');
    if (!token || !user || user.role !== 'admin') {
      navigate('/admin/login');
    }
  }, [navigate]);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Manage Cars', path: '/admin/cars', icon: <Car size={20} /> },
    { name: 'Bookings', path: '/admin/bookings', icon: <FileText size={20} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#050505', color: '#fff' }}>
      {/* Sidebar */}
      <aside style={{
        width: isSidebarOpen ? '260px' : '80px',
        background: '#0a0a0a',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        position: 'fixed',
        height: '100vh',
        zIndex: 1000
      }}>
        {/* Logo Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '50px', paddingLeft: '10px' }}>
          <div style={{ width: '30px', height: '30px', background: '#fff', borderRadius: '6px' }}></div>
          {isSidebarOpen && <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>ADMIN PANEL</span>}
        </div>

        {/* Navigation */}
        <nav style={{ flexGrow: 1 }}>
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                padding: '12px 15px',
                borderRadius: '12px',
                textDecoration: 'none',
                color: location.pathname === item.path ? '#fff' : 'rgba(255,255,255,0.5)',
                background: location.pathname === item.path ? 'rgba(255,255,255,0.05)' : 'transparent',
                marginBottom: '8px',
                transition: 'all 0.2s'
              }}
            >
              {item.icon}
              {isSidebarOpen && <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <button 
          onClick={() => {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            window.dispatchEvent(new Event('authChange'));
            navigate('/');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            padding: '12px 15px',
            borderRadius: '12px',
            textDecoration: 'none',
            color: '#ff4d4d',
            background: 'none',
            border: 'none',
            width: '100%',
            cursor: 'pointer',
            textAlign: 'left',
            marginTop: 'auto'
          }}
        >
          <LogOut size={20} />
          {isSidebarOpen && <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Exit to Web</span>}
        </button>
      </aside>

      {/* Main Content Area */}
      <main style={{
        flexGrow: 1,
        marginLeft: isSidebarOpen ? '260px' : '80px',
        transition: 'all 0.3s ease',
        padding: '40px'
      }}>
        {/* Header Content Area */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Admin Rental Jek</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Super Administrator</div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#333' }}></div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
