import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const CarDetailPage = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedCars, setRelatedCars] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkUserRole = () => {
      try {
        const userVal = localStorage.getItem('user');
        const adminUserVal = localStorage.getItem('admin_user');
        const adminToken = localStorage.getItem('admin_token');
        
        if (adminToken) {
          setIsAdminUser(true);
          return;
        }
        
        if (userVal) {
          const parsed = JSON.parse(userVal);
          if (parsed && parsed.role === 'admin') {
            setIsAdminUser(true);
            return;
          }
        }

        if (adminUserVal) {
          const parsed = JSON.parse(adminUserVal);
          if (parsed && parsed.role === 'admin') {
            setIsAdminUser(true);
            return;
          }
        }

        setIsAdminUser(false);
      } catch (e) {
        console.error("Error parsing user role:", e);
        setIsAdminUser(false);
      }
    };

    checkUserRole();
    window.addEventListener('authChange', checkUserRole);
    return () => window.removeEventListener('authChange', checkUserRole);
  }, []);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const [carRes, allCarsRes] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/cars/${id}`),
          axios.get('http://127.0.0.1:8000/api/cars')
        ]);
        setCar(carRes.data.data);
        // Get 2 other random cars for "Explore More"
        setRelatedCars(allCarsRes.data.data.filter(c => c.id !== parseInt(id)).slice(0, 2));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div className="container" style={{ padding: '200px 0', textAlign: 'center' }}>Loading details...</div>;
  if (!car) return <div className="container" style={{ padding: '200px 0', textAlign: 'center' }}>Car not found.</div>;

  const getDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return 0;
    const diffTime = Math.abs(end - start);
    let calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return calculatedDays < 1 ? 1 : calculatedDays;
  };

  const days = getDays();

  const getRateAndBase = () => {
    if (days <= 0) return { rate: car.price_per_day, base: 0, discount: 0 };
    let rate = parseFloat(car.price_per_day);
    let discount = 0;
    if (days >= 7) {
      rate = car.price_per_day * 0.8;
      discount = car.price_per_day * 0.2 * days;
    } else if (days >= 3) {
      rate = car.price_per_day * 0.9;
      discount = car.price_per_day * 0.1 * days;
    }
    const base = days * car.price_per_day;
    return { rate, base, discount };
  };

  const { rate, base, discount } = getRateAndBase();
  const deposit = 15000000;
  const total = base - discount + deposit;

  const handleBook = async () => {
    const token = localStorage.getItem('user_token');
    if (!token) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (!startDate || !endDate) {
      setBookingError('Silakan pilih rentang tanggal sewa terlebih dahulu.');
      return;
    }

    setSubmitting(true);
    setBookingError('');
    try {
      await axios.post('http://127.0.0.1:8000/api/reservations', {
        car_id: car.id,
        start_date: startDate,
        end_date: endDate
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setBookingSuccess('Pemesanan berhasil diajukan! Status sewa Anda saat ini Pending. Admin akan segera menghubungi Anda.');
      setCar({
        ...car,
        status: 'rented'
      });
    } catch (err) {
      console.error(err);
      setBookingError(
        err.response?.data?.message ||
        err.response?.data?.errors && Object.values(err.response.data.errors)[0][0] ||
        'Gagal mengajukan pemesanan. Silakan coba lagi.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const PriceRow = ({ label, value }) => (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '24px 0',
      borderBottom: '1px solid var(--glass-border)'
    }}>
      <span style={{ color: 'var(--text-gray)', fontWeight: '500' }}>{label}</span>
      <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{value}</span>
    </div>
  );

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingBottom: '150px' }}>
      {/* Top Navigation */}
      <div className="container" style={{ paddingTop: '140px', marginBottom: '60px' }}>
        <Link to="/cars" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-gray)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
          <ArrowLeft size={18} /> BACK TO COLLECTION
        </Link>
      </div>

      <div className="container">
        <div className="detail-grid" style={{ alignItems: 'start' }}>

          {/* Left: Content */}
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ fontSize: '5.5rem', lineHeight: '0.9', marginBottom: '40px', letterSpacing: '-0.05em' }}
            >
              {car.brand} <br /> {car.name}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="car-image-container"
              style={{ aspectRatio: '16/9', marginBottom: '60px', borderRadius: '40px' }}
            >
              <img src={car.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={car.name} />
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '40px', marginBottom: '60px' }}>
              <div>
                <h4 style={{ color: 'var(--text-gray)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.1em' }}>Horsepower</h4>
                <div style={{ fontSize: '1.8rem', fontWeight: '700' }}>{car.horsepower} HP</div>
              </div>
              <div>
                <h4 style={{ color: 'var(--text-gray)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.1em' }}>0-100 KM/H</h4>
                <div style={{ fontSize: '1.8rem', fontWeight: '700' }}>3.2 SEC</div>
              </div>
              <div>
                <h4 style={{ color: 'var(--text-gray)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.1em' }}>Top Speed</h4>
                <div style={{ fontSize: '1.8rem', fontWeight: '700' }}>{car.top_speed} KM/H</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '60px' }}>
              <h3 style={{ fontSize: '2rem', marginBottom: '24px' }}>Overview</h3>
              <p style={{ color: 'var(--text-gray)', fontSize: '1.2rem', lineHeight: '1.7', maxWidth: '800px' }}>
                {car.description || "Indulge in the ultimate driving experience with this masterpiece of engineering. This vehicle combines breathtaking performance with unparalleled luxury, making every journey an unforgettable event. Perfect for those who demand excellence in every detail."}
              </p>
            </div>
          </div>

          {/* Right: Booking Box */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: 'rgba(10, 10, 10, 0.8)',
              border: car.status === 'rented' ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid var(--glass-border)',
              borderRadius: '32px',
              padding: '40px',
              position: 'sticky',
              top: '120px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}
          >
            {car.status === 'rented' && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                padding: '12px',
                borderRadius: '16px',
                fontSize: '0.9rem',
                fontWeight: '700',
                textAlign: 'center',
                marginBottom: '24px',
                letterSpacing: '0.05em'
              }}>
                SEDANG DISEWA / TIDAK TERSEDIA
              </div>
            )}

            <h3 style={{ fontSize: '1.8rem', marginBottom: '24px', letterSpacing: '-0.04em' }}>Rental Price</h3>

            <div style={{ marginBottom: '30px' }}>
              <PriceRow label="1 — 2 Hari" value={`Rp ${parseFloat(car.price_per_day).toLocaleString()}`} />
              <PriceRow label="3 — 6 Hari" value={`Rp ${(car.price_per_day * 0.9).toLocaleString()}`} />
              <PriceRow label="7+ Hari" value={`Rp ${(car.price_per_day * 0.8).toLocaleString()}`} />
              <PriceRow label="Security Deposit" value="Rp 15.000.000" />
            </div>

            {bookingSuccess ? (
              <div style={{
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                color: '#10b981',
                padding: '20px',
                borderRadius: '20px',
                fontSize: '0.95rem',
                lineHeight: '1.5',
                textAlign: 'center'
              }}>
                <Check size={28} style={{ margin: '0 auto 10px', display: 'block' }} />
                {bookingSuccess}
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-gray)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Waktu Mulai</label>
                    <input
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => { setStartDate(e.target.value); setBookingError(''); }}
                      onClick={(e) => {
                        if (car.status === 'available' && !isAdminUser) {
                          try { e.target.showPicker(); } catch (err) {}
                        }
                      }}
                      onFocus={(e) => {
                        if (car.status === 'available' && !isAdminUser) {
                          try { e.target.showPicker(); } catch (err) {}
                        }
                      }}
                      min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                      disabled={car.status !== 'available' || isAdminUser}
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        padding: '12px 14px',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none',
                        width: '100%',
                        cursor: (car.status !== 'available' || isAdminUser) ? 'not-allowed' : 'pointer'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-gray)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Waktu Selesai</label>
                    <input
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => { setEndDate(e.target.value); setBookingError(''); }}
                      onClick={(e) => {
                        if (car.status === 'available' && startDate && !isAdminUser) {
                          try { e.target.showPicker(); } catch (err) {}
                        }
                      }}
                      onFocus={(e) => {
                        if (car.status === 'available' && startDate && !isAdminUser) {
                          try { e.target.showPicker(); } catch (err) {}
                        }
                      }}
                      min={startDate || new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                      disabled={car.status !== 'available' || !startDate || isAdminUser}
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        padding: '12px 14px',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none',
                        width: '100%',
                        cursor: (car.status !== 'available' || !startDate || isAdminUser) ? 'not-allowed' : 'pointer'
                      }}
                    />
                  </div>
                </div>

                {days > 0 && (
                  <div style={{ marginBottom: '24px', borderTop: '1px solid var(--glass-border)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-gray)' }}>
                      <span>Durasi Sewa</span>
                      <span style={{ color: '#fff', fontWeight: '600' }}>{days} Hari</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-gray)' }}>
                      <span>Tarif Sewa Harian</span>
                      <span style={{ color: '#fff', fontWeight: '600' }}>Rp {rate.toLocaleString()} / hari</span>
                    </div>
                    {discount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#ef4444' }}>
                        <span>Diskon Sewa Jangka Panjang</span>
                        <span style={{ fontWeight: '600' }}>- Rp {discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-gray)' }}>
                      <span>Security Deposit (Flat)</span>
                      <span style={{ color: '#fff', fontWeight: '600' }}>Rp {deposit.toLocaleString()}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      borderTop: '1px dashed var(--glass-border)',
                      paddingTop: '15px',
                      marginTop: '5px',
                      fontWeight: '800',
                      fontSize: '1.2rem',
                      color: '#fff'
                    }}>
                      <span>Total Biaya</span>
                      <span>Rp {total.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {isAdminUser && (
                  <div style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontSize: '0.88rem',
                    marginBottom: '20px',
                    lineHeight: '1.4',
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>
                    Akun Administrator tidak dapat melakukan sewa mobil.
                  </div>
                )}

                {bookingError && (
                  <div style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    marginBottom: '20px',
                    lineHeight: '1.4'
                  }}>
                    {bookingError}
                  </div>
                )}

                <button
                  onClick={handleBook}
                  disabled={submitting || car.status !== 'available' || isAdminUser}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '18px',
                    fontSize: '1.05rem',
                    marginBottom: '24px',
                    cursor: (car.status !== 'available' || isAdminUser) ? 'not-allowed' : 'pointer',
                    opacity: (car.status !== 'available' || isAdminUser) ? 0.5 : 1
                  }}
                >
                  {submitting 
                    ? 'Memproses Pemesanan...' 
                    : isAdminUser 
                      ? 'Admin Tidak Bisa Booking' 
                      : car.status === 'available' 
                        ? 'Sewa Sekarang' 
                        : 'Armada Tidak Tersedia'}
                </button>
              </>
            )}

            <div style={{ display: 'flex', gap: '12px', color: 'var(--text-gray)', fontSize: '0.85rem', lineHeight: '1.4' }}>
              <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Pengantaran gratis wilayah DKI Jakarta untuk sewa di atas 3 hari.</span>
            </div>
          </motion.div>

        </div>

        {/* Explore More */}
        <div style={{ marginTop: '150px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '3.5rem' }}>Explore More</h2>
            <Link to="/cars" style={{ color: '#fff', fontWeight: '600', textDecoration: 'none', borderBottom: '1px solid #fff', paddingBottom: '5px' }}>View All</Link>
          </div>

          <div className="grid-2">
            {relatedCars.map(rc => (
              <motion.div key={rc.id} className="car-card">
                <Link to={`/cars/${rc.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="car-image-container" style={{ marginBottom: '24px' }}>
                    <motion.img
                      src={rc.image_url}
                      alt={rc.name}
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px' }}>
                    <div>
                      <h4 style={{ fontSize: '1.8rem', fontWeight: '700', letterSpacing: '-0.04em' }}>{rc.brand} {rc.name}</h4>
                      <div style={{ color: 'var(--text-gray)', fontSize: '1.1rem', marginTop: '5px' }}>from Rp {rc.price_per_day.toLocaleString()} / day</div>
                    </div>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.05)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      border: '1px solid var(--glass-border)'
                    }}>
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailPage;
