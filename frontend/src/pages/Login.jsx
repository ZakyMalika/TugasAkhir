import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    password_confirmation: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || '/';

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

    const endpoint = isLogin ? '/api/login' : '/api/register';
    const payload = isLogin 
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const response = await axios.post(`http://127.0.0.1:8000${endpoint}`, payload);
      
      // Store token and user data
      localStorage.setItem('user_token', response.data.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      
      // Dispatch a custom event to update Navbar/UI state
      window.dispatchEvent(new Event('authChange'));

      navigate(redirectPath);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.errors && Object.values(err.response.data.errors)[0][0] ||
        'Terjadi kesalahan. Silakan coba lagi.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={styles.card}
      >
        <div style={styles.header}>
          <h2 style={styles.title}>
            {isLogin ? 'Masuk ke Rental Jek' : 'Daftar Akun Baru'}
          </h2>
          <p style={styles.subtitle}>
            {isLogin 
              ? 'Nikmati perjalanan mewah dengan supercar pilihan Anda.' 
              : 'Daftar sekarang untuk mulai memesan armada premium kami.'}
          </p>
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
          {!isLogin && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nama Lengkap</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                style={styles.input}
                placeholder="Masukkan nama lengkap Anda"
              />
            </div>
          )}

          {!isLogin && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nomor WhatsApp</label>
              <input 
                type="text" 
                name="phone_number" 
                value={formData.phone_number} 
                onChange={handleChange} 
                required 
                style={styles.input}
                placeholder="081234567890"
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Alamat Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              style={styles.input}
              placeholder="nama@email.com"
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

          {!isLogin && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Konfirmasi Password</label>
              <input 
                type="password" 
                name="password_confirmation" 
                value={formData.password_confirmation} 
                onChange={handleChange} 
                required 
                style={styles.input}
                placeholder="••••••••"
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            style={styles.submitBtn}
          >
            {loading ? 'Memproses...' : isLogin ? 'Masuk' : 'Daftar'}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            {isLogin ? 'Belum punya akun?' : 'Sudah memiliki akun?'}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }} 
              style={styles.toggleBtn}
            >
              {isLogin ? 'Daftar di sini' : 'Masuk di sini'}
            </button>
          </p>
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
    padding: '40px 20px',
    backgroundColor: '#060606',
    position: 'relative',
  },
  card: {
    background: 'rgba(15, 15, 15, 0.7)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '32px',
    padding: '40px',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
  },
  header: {
    marginBottom: '32px',
    textAlign: 'center',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: '10px',
    letterSpacing: '-0.04em',
  },
  subtitle: {
    color: '#a1a1aa',
    fontSize: '0.95rem',
    lineHeight: '1.5',
  },
  errorAlert: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
    padding: '12px 16px',
    borderRadius: '16px',
    fontSize: '0.88rem',
    marginBottom: '24px',
    lineHeight: '1.4',
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
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#a1a1aa',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '14px 18px',
    color: '#ffffff',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  submitBtn: {
    backgroundColor: '#ffffff',
    color: '#000000',
    border: 'none',
    borderRadius: '99px',
    padding: '16px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '10px',
  },
  footer: {
    marginTop: '28px',
    textAlign: 'center',
  },
  footerText: {
    color: '#71717a',
    fontSize: '0.9rem',
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: '6px',
    cursor: 'pointer',
    textDecoration: 'underline',
  }
};
