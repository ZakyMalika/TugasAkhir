import { Camera, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ 
      background: 'var(--bg-secondary)', 
      padding: '80px 8%', 
      marginTop: '100px',
      borderRadius: '40px 40px 0 0',
      borderTop: '1px solid var(--glass-border)'
    }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1.5fr 1fr 1fr', 
        gap: '60px' 
      }}>
        {/* Col 1 */}
        <div>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '30px', textDecoration: 'none', color: '#fff' }}>
            <div style={{ width: '24px', height: '24px', background: '#fff', borderRadius: '4px' }}></div>
            <span style={{ fontWeight: '800', fontSize: '1rem' }}>RENTAL JEK</span>
          </Link>
          
          <div style={{ color: 'var(--text-gray)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '30px' }}>
            <div style={{ color: '#fff', marginBottom: '10px', fontSize: '0.8rem', fontWeight: '600' }}>Office Address (08 AM — 10 PM)</div>
            8500 Sunset Blvd, Suite 210,<br />
            Los Angeles, CA 90069, USA
          </div>

          <div style={{ color: 'var(--text-gray)', fontSize: '0.9rem', marginBottom: '20px' }}>
            <div style={{ color: '#fff', marginBottom: '5px', fontSize: '0.8rem', fontWeight: '600' }}>Phone</div>
            +1 (323) 555-7842
          </div>

          <div style={{ color: 'var(--text-gray)', fontSize: '0.9rem' }}>
            <div style={{ color: '#fff', marginBottom: '5px', fontSize: '0.8rem', fontWeight: '600' }}>Email</div>
            info@luxedrive.com
          </div>
        </div>

        {/* Col 2 */}
        <div>
          <h4 style={{ fontSize: '0.9rem', marginBottom: '25px', color: 'var(--text-gray)' }}>Company</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '0.95rem' }}>
            <li><Link to="/cars" style={{ color: 'inherit', textDecoration: 'none' }}>Cars</Link></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h4 style={{ fontSize: '0.9rem', marginBottom: '25px', color: 'var(--text-gray)' }}>Help</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '0.95rem' }}>
            <li><Link to="/cars" style={{ color: 'inherit', textDecoration: 'none' }}>Book a Car</Link></li>
          </ul>
        </div>


      </div>

      <div style={{ 
        marginTop: '80px', 
        paddingTop: '30px', 
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-gray)'
      }}>
        <div>© 2026 Rental Jek. All Rights Reserved</div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Camera size={18} />
          <Phone size={18} />
          <Mail size={18} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
