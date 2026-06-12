import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);

  const checkAuth = () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined') {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Error parsing user from localStorage:", err);
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener('authChange', checkAuth);
    return () => window.removeEventListener('authChange', checkAuth);
  }, []);

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'CARS', path: '/cars' },
  ];

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1000,
      padding: '40px 0',
      background: 'transparent'
    }}>
      <div className="container nav-grid">
        {/* Left: Logo */}
        <div>
          <Link to="/" style={{ 
            fontSize: '1.2rem', 
            fontWeight: '800', 
            color: '#fff', 
            textDecoration: 'none',
            letterSpacing: '-0.05em' 
          }}>
            RENTAL JEK<span style={{ opacity: 0.5 }}>.</span>
          </Link>
        </div>

        {/* Center: Menu Items */}
        <div className="nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              style={{
                color: location.pathname === link.path ? '#fff' : 'rgba(255,255,255,0.5)',
                textDecoration: 'none',
                fontSize: '0.75rem',
                fontWeight: '600',
                letterSpacing: '0.15em',
                transition: 'color 0.3s'
              }}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: CTA Button */}
        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '20px' }}>
          {user ? (
            <>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#fff', letterSpacing: '0.1em' }}>
                HI, {((user && user.name) || 'USER').toUpperCase()}
              </span>
              <button 
                onClick={() => {
                  localStorage.removeItem('user_token');
                  localStorage.removeItem('user');
                  setUser(null);
                  window.dispatchEvent(new Event('authChange'));
                }}
                className="btn-primary" 
                style={{ 
                  padding: '12px 24px', 
                  fontSize: '0.8rem', 
                  background: 'transparent', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  color: '#fff',
                  borderRadius: '99px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                LOGOUT
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary" style={{ padding: '12px 28px', fontSize: '0.85rem' }}>
              LOGIN
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
