import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_cars: 0,
    active_rentals: 0,
    pending_bookings: 0,
    total_revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const res = await axios.get('http://127.0.0.1:8000/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = res.data.data;
        setStats({
          total_cars: data.total_cars,
          active_rentals: data.rented_cars,
          pending_bookings: data.pending_bookings,
          total_revenue: data.total_revenue
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div style={{ color: 'rgba(255,255,255,0.5)', padding: '50px 0' }}>Loading dashboard data...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '30px' }}>Dashboard Overview</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {[
          { label: 'Total Cars', value: stats.total_cars, color: '#4a9eff' },
          { label: 'Active Rentals', value: stats.active_rentals, color: '#4caf50' },
          { label: 'Pending Bookings', value: stats.pending_bookings, color: '#ff9800' },
          { label: 'Total Revenue', value: `Rp ${(stats.total_revenue || 0).toLocaleString('id-ID')}`, color: '#e91e63' }
        ].map((stat, i) => (
          <div key={i} style={{ background: '#0a0a0a', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '10px' }}>{stat.label}</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
