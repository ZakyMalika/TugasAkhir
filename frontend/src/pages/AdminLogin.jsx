import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://rentaljek.com/api/login', formData);
      
      const { user, access_token } = response.data.data;

      // Verify if user is an admin
      if (user.role !== 'admin') {
        setError('Akses ditolak. Akun Anda tidak memiliki hak akses Administrator.');
        return;
      }
      
      // Store token and user data
      localStorage.setItem('admin_token', access_token);
      localStorage.setItem('admin_user', JSON.stringify(user));
      
      // Dispatch event to notify layout
      window.dispatchEvent(new Event('authChange'));

      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.errors && Object.values(err.response.data.errors)[0][0] ||
        'Login gagal. Periksa kembali email dan password Anda.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Background glow specific to admin */}
      <div style={styles.adminGlow} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={styles.card}
      >
        <div style={styles.header}>
          <div style={styles.badge}>ADMIN PANEL</div>
          <h2 style={styles.title}>Rental Jek</h2>
          <p style={styles.subtitle}>Masuk ke dashboard manajemen administrator</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={styles.errorAlert}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Admin Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              style={styles.input}
              placeholder="admin@rentaljek.com"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              style={styles.input}
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={styles.submitBtn}
          >
            {loading ? 'Memvalidasi...' : 'Masuk Dashboard'}
          </button>
        </form>

        <div style={styles.footer}>
          <a href="/" style={styles.backLink}>← Kembali ke Halaman Utama</a>
        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#050505',
    position: 'relative',
    overflow: 'hidden',
  },
  adminGlow: {
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle at center, rgba(239, 68, 68, 0.08) 0%, transparent 60%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  card: {
    background: 'rgba(10, 10, 10, 0.8)',
    backdropFilter: 'blur(30px)',
    border: '1px solid rgba(239, 68, 68, 0.15)', // Subtle reddish border for admin indicator
    borderRadius: '24px',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
    zIndex: 1,
  },
  header: {
    marginBottom: '32px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#ef4444',
    padding: '4px 12px',
    borderRadius: '99px',
    fontSize: '0.7rem',
    fontWeight: '700',
    letterSpacing: '0.1em',
    marginBottom: '16px',
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: '8px',
    letterSpacing: '-0.04em',
  },
  subtitle: {
    color: '#71717a',
    fontSize: '0.88rem',
    lineHeight: '1.4',
  },
  errorAlert: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
    padding: '12px 16px',
    borderRadius: '12px',
    fontSize: '0.85rem',
    marginBottom: '24px',
    lineHeight: '1.4',
    textAlign: 'left',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#71717a',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  input: {
    backgroundColor: '#0a0a0a',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '14px 16px',
    color: '#ffffff',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  submitBtn: {
    backgroundColor: '#ef4444', // Red accent for admin action
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '0.95rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '10px',
    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.2)',
  },
  footer: {
    marginTop: '28px',
    textAlign: 'center',
  },
  backLink: {
    color: '#71717a',
    fontSize: '0.85rem',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  }
};
