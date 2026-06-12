import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, AlertTriangle, Check, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Custom Confirmation Modal ────────────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onCancel, actionLabel, actionColor }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={styles.modalOverlay}
        onClick={onCancel}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={styles.modalBox}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={styles.modalIcon}>
            <AlertTriangle size={28} color="#f59e0b" />
          </div>
          <h3 style={styles.modalTitle}>Konfirmasi Tindakan</h3>
          <p style={styles.modalMessage}>{message}</p>
          <div style={styles.modalActions}>
            <button onClick={onCancel} style={styles.modalCancelBtn}>
              Batal
            </button>
            <button
              onClick={onConfirm}
              style={{ ...styles.modalConfirmBtn, backgroundColor: actionColor || '#3b82f6' }}
            >
              {actionLabel || 'Ya, Lanjutkan'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Notification Toast ───────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const isError = type === 'error';
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: -20, x: '-50%' }}
      style={{
        position: 'fixed', top: '24px', left: '50%',
        zIndex: 9999,
        backgroundColor: isError ? 'rgba(239,68,68,0.95)' : 'rgba(16,185,129,0.95)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isError ? 'rgba(239,68,68,0.5)' : 'rgba(16,185,129,0.5)'}`,
        color: '#fff',
        padding: '14px 24px',
        borderRadius: '14px',
        fontWeight: '600',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        maxWidth: '480px',
        textAlign: 'center',
      }}
    >
      {isError ? <X size={18} /> : <Check size={18} />}
      {message}
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCar, setCurrentCar] = useState(null); // For edit mode
  
  // Custom Modal & Toast States
  const [confirmModal, setConfirmModal] = useState(null); // { message, onConfirm, actionLabel, actionColor }
  const [toast, setToast] = useState(null); // { message, type }

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Supercar',
    price_per_day: '',
    image_url: '',
    description: '',
    horsepower: '',
    top_speed: '',
    transmission: 'Automatic',
    status: 'available'
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // New: filter for car status
  const [statusFilter, setStatusFilter] = useState('');

  const fetchCars = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) {
        // Directly send the selected status to the backend
        params.status = statusFilter;
      }
      const res = await axios.get('http://rentaljek.com/api/cars', { params });
      setCars(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat daftar mobil.', 'error');
      setLoading(false);
    }
  };

  // Fetch cars when component mounts or when status filter changes
  useEffect(() => {
    fetchCars();
  }, [statusFilter]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    const headers = { Authorization: `Bearer ${token}` };
    try {
      if (currentCar) {
        await axios.put(`http://rentaljek.com/api/cars/${currentCar.id}`, formData, { headers });
        showToast('Mobil berhasil diperbarui!', 'success');
      } else {
        await axios.post('http://rentaljek.com/api/cars', formData, { headers });
        showToast('Mobil berhasil ditambahkan!', 'success');
      }
      setIsModalOpen(false);
      resetForm();
      fetchCars();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 
                  (err.response?.data?.errors && Object.values(err.response.data.errors)[0][0]) ||
                  'Gagal menyimpan data mobil.';
      showToast(msg, 'error');
    }
  };

  const handleDeleteClick = (id, carName) => {
    setConfirmModal({
      message: `Apakah Anda yakin ingin menghapus mobil "${carName}"? Tindakan ini tidak dapat dibatalkan.`,
      actionLabel: 'Ya, Hapus',
      actionColor: '#ef4444',
      onConfirm: () => executeDelete(id)
    });
  };

  const executeDelete = async (id) => {
    setConfirmModal(null);
    const token = localStorage.getItem('admin_token');
    const headers = { Authorization: `Bearer ${token}` };
    try {
      await axios.delete(`http://rentaljek.com/api/cars/${id}`, { headers });
      showToast('Mobil berhasil dihapus!', 'success');
      fetchCars();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Gagal menghapus mobil.';
      showToast(msg, 'error');
    }
  };

  const openEditModal = (car) => {
    setCurrentCar(car);
    setFormData({
      name: car.name,
      brand: car.brand,
      category: car.category,
      price_per_day: car.price_per_day,
      image_url: car.image_url || '',
      description: car.description || '',
      horsepower: car.horsepower || '',
      top_speed: car.top_speed || '',
      transmission: car.transmission || 'Automatic',
      status: car.status || 'available'
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setCurrentCar(null);
    setFormData({
      name: '',
      brand: '',
      category: 'Supercar',
      price_per_day: '',
      image_url: '',
      description: '',
      horsepower: '',
      top_speed: '',
      transmission: 'Automatic',
      status: 'available'
    });
  };

  return (
    <div>
      {/* ── Custom Confirmation Modal ── */}
      <AnimatePresence>
        {confirmModal && (
          <ConfirmModal
            message={confirmModal.message}
            actionLabel={confirmModal.actionLabel}
            actionColor={confirmModal.actionColor}
            onConfirm={confirmModal.onConfirm}
            onCancel={() => setConfirmModal(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Toast Notification ── */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Manage Cars</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '5px' }}>Kelola inventaris armada mobil premium Anda</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
        >
          <Plus size={18} /> Add New Car
        </button>
      </div>

      {/* Car Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px 0', color: 'rgba(255,255,255,0.5)' }}>
          Memuat data armada mobil...
        </div>
      ) : cars.length === 0 ? (
        <div style={styles.emptyState}>
          Belum ada data mobil di inventaris. Klik "Add New Car" untuk menambahkan.
        </div>
      ) : (
        <div style={{ background: '#0a0a0a', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '20px' }}>Car</th>
                <th style={{ padding: '20px' }}>Category</th>
                <th style={{ padding: '20px' }}>Price/Day</th>
                <th style={{ padding: '20px' }}>Status</th>
                <th style={{ padding: '20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <img src={car.image_url} style={{ width: '50px', height: '35px', borderRadius: '4px', objectFit: 'cover' }} alt="" />
                      <div>
                        <div style={{ fontWeight: '600' }}>{car.brand} {car.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{car.transmission}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '20px', fontSize: '0.9rem' }}>{car.category}</td>
                  <td style={{ padding: '20px', fontSize: '0.9rem' }}>Rp {parseFloat(car.price_per_day).toLocaleString('id-ID')}</td>
                  <td style={{ padding: '20px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      background: car.status === 'pending' ? 'rgba(255, 165, 0, 0.1)' :
                                car.status === 'on_rent' ? 'rgba(59, 130, 246, 0.1)' :
                                car.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' :
                                car.status === 'cancelled' ? 'rgba(239, 68, 68, 0.1)' :
                                'rgba(76, 175, 80, 0.1)',
                      color: car.status === 'pending' ? '#ff9800' :
                             car.status === 'on_rent' ? '#3b82f6' :
                             car.status === 'completed' ? '#10b981' :
                             car.status === 'cancelled' ? '#ef4444' :
                             '#4caf50'
                    }}>
                      {car.status === 'pending' ? 'Pending' :
                       car.status === 'on_rent' ? 'On‑Rent' :
                       car.status === 'completed' ? 'Completed' :
                       car.status === 'cancelled' ? 'Cancelled' :
                       car.status === 'available' ? 'Available' :
                       car.status === 'rented' ? 'Rented' :
                       car.status === 'maintenance' ? 'Maintenance' :
                       car.status}
                    </span>
                  </td>
                  <td style={{ padding: '20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                      <button onClick={() => openEditModal(car)} style={{ background: 'none', border: 'none', color: '#4a9eff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Edit2 size={18} /></button>
                      <button onClick={() => handleDeleteClick(car.id, `${car.brand} ${car.name}`)} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
            padding: '20px'
          }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                background: '#111',
                width: '100%',
                maxWidth: '600px',
                borderRadius: '24px',
                padding: '40px',
                border: '1px solid rgba(255,255,255,0.1)',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{currentCar ? 'Edit Car' : 'Add New Car'}</h3>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'rgba(255,255,255,0.5)' }}>Brand</label>
                    <input name="brand" value={formData.brand} onChange={handleInputChange} required style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', padding: '12px', borderRadius: '10px', color: '#fff' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'rgba(255,255,255,0.5)' }}>Model Name</label>
                    <input name="name" value={formData.name} onChange={handleInputChange} required style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', padding: '12px', borderRadius: '10px', color: '#fff' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'rgba(255,255,255,0.5)' }}>Category</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', padding: '12px', borderRadius: '10px', color: '#fff' }}>
                      <option value="Supercar">Supercar</option>
                      <option value="Luxury Sedan">Luxury Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Coupe">Coupe</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'rgba(255,255,255,0.5)' }}>Price / Day (IDR)</label>
                    <input name="price_per_day" type="number" min="10000000" max="99000000" value={formData.price_per_day} onChange={handleInputChange} required style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', padding: '12px', borderRadius: '10px', color: '#fff' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'rgba(255,255,255,0.5)' }}>Transmission</label>
                    <select name="transmission" value={formData.transmission} onChange={handleInputChange} style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', padding: '12px', borderRadius: '10px', color: '#fff' }}>
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'rgba(255,255,255,0.5)' }}>Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', padding: '12px', borderRadius: '10px', color: '#fff' }}>
                      <option value="available">Available</option>
                      <option value="rented">Rented</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'rgba(255,255,255,0.5)' }}>Image URL</label>
                  <input name="image_url" value={formData.image_url} onChange={handleInputChange} required style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', padding: '12px', borderRadius: '10px', color: '#fff' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'rgba(255,255,255,0.5)' }}>Horsepower</label>
                    <input name="horsepower" type="number" value={formData.horsepower} onChange={handleInputChange} style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', padding: '12px', borderRadius: '10px', color: '#fff' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'rgba(255,255,255,0.5)' }}>Top Speed (km/h)</label>
                    <input name="top_speed" type="number" value={formData.top_speed} onChange={handleInputChange} style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', padding: '12px', borderRadius: '10px', color: '#fff' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'rgba(255,255,255,0.5)' }}>Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', padding: '12px', borderRadius: '10px', color: '#fff', resize: 'none' }}></textarea>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '15px' }}>
                  {currentCar ? 'Update Car' : 'Add Car Now'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(6px)',
    zIndex: 9000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBox: {
    backgroundColor: '#111',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '24px',
    padding: '40px',
    maxWidth: '440px',
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
  },
  modalIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: 'rgba(245,158,11,0.1)',
    border: '1px solid rgba(245,158,11,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: '1.3rem',
    fontWeight: '800',
    color: '#fff',
    margin: 0,
  },
  modalMessage: {
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: '1.6',
    margin: 0,
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    width: '100%',
    marginTop: '8px',
  },
  modalCancelBtn: {
    flex: 1,
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  modalConfirmBtn: {
    flex: 1,
    padding: '12px',
    borderRadius: '12px',
    border: 'none',
    color: '#fff',
    fontWeight: '700',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
    border: '1px dashed rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: '1rem',
  }
};

export default AdminCars;
