import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, Car as CarIcon, DollarSign, MessageCircle, Check, X, ShieldAlert, AlertTriangle } from 'lucide-react';

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
export default function AdminBookings() {
  const [statusFilter, setStatusFilter] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [confirmModal, setConfirmModal] = useState(null);
  // { id, status, message, actionLabel, actionColor }

  // Toast state
  const [toast, setToast] = useState(null);
  // { message, type }

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('admin_token');
    try {
      const params = {};
      if (statusFilter && statusFilter !== 'done') {
        params.status = statusFilter;
      }
      // 'done' = show all (completed + cancelled are filtered client-side in sections)
      const res = await axios.get('http://rentaljek.com/api/reservations', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setBookings(res.data.data);
    } catch (err) {
      console.error(err);
      setError('Gagal memuat data pemesanan. Pastikan Anda masuk sebagai Administrator.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  // Step 1: Show custom modal instead of window.confirm
  const handleUpdateStatus = (id, status) => {
    const labelMap = {
      ongoing: 'Approve (ON GOING)',
      completed: 'Selesaikan (COMPLETED)',
      cancelled: 'Batalkan (CANCELLED)',
    };
    const colorMap = {
      ongoing: '#3b82f6',
      completed: '#10b981',
      cancelled: '#ef4444',
    };
    setConfirmModal({
      id,
      status,
      message: `Apakah Anda yakin ingin mengubah status pesanan #${id} menjadi ${labelMap[status] || status.toUpperCase()}? Tindakan ini tidak dapat dibatalkan.`,
      actionLabel: labelMap[status] || 'Ya, Lanjutkan',
      actionColor: colorMap[status] || '#3b82f6',
    });
  };

  // Step 2: Execute after modal confirmed
  const executeStatusUpdate = async () => {
    const { id, status } = confirmModal;
    setConfirmModal(null);

    const token = localStorage.getItem('admin_token');
    try {
      await axios.put(
        `http://rentaljek.com/api/reservations/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast(`Status pesanan #${id} berhasil diperbarui!`, 'success');
      fetchBookings();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Gagal memperbarui status pemesanan.';
      showToast(msg, 'error');
    }
  };

  const getWhatsAppLink = (booking) => {
    let phone = booking.user?.phone_number || '628123456789';
    if (phone.startsWith('0')) {
      phone = '62' + phone.substring(1);
    }
    const statusText = booking.status === 'ongoing' ? 'ON GOING' : booking.status.toUpperCase();
    const message = `Halo *${booking.user?.name}*,\n\nSaya Admin dari *Rental Jek* ingin mengonfirmasi pesanan sewa mobil Anda:\n- *Mobil*: ${booking.car?.brand} ${booking.car?.name}\n- *Tanggal*: ${booking.start_date} s/d ${booking.end_date}\n- *Total Biaya*: Rp ${parseFloat(booking.total_price).toLocaleString('id-ID')}\n- *Status Saat Ini*: *${statusText}*\n\nMohon siapkan KTP & SIM A Anda untuk verifikasi fisik saat serah terima kunci di lokasi.\n\nApakah ada hal lain yang bisa kami bantu? Terima kasih!`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending':
        return { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', color: '#f59e0b' };
      case 'ongoing':
      case 'approved':
        return { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', color: '#3b82f6' };
      case 'completed':
        return { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', color: '#10b981' };
      case 'cancelled':
        return { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', color: '#ef4444' };
      default:
        return { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', color: '#fff' };
    }
  };

  // Render a single booking card, reused in sections
  const renderBookingCard = (booking) => {
    const statusStyle = getStatusStyle(booking.status);
    return (
      <motion.div
        key={booking.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.card}
      >
        {/* Header */}
        <div style={styles.cardHeader}>
          <span style={{
            backgroundColor: statusStyle.bg,
            border: `1px solid ${statusStyle.border}`,
            color: statusStyle.color,
            padding: '6px 14px',
            borderRadius: '99px',
            fontSize: '0.75rem',
            fontWeight: '700',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            {booking.status === 'ongoing' ? 'ON GOING' : booking.status}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
            ID: #{booking.id}
          </span>
        </div>
        {/* Details */}
        <div style={styles.detailSection}>
          <div style={styles.detailRow}>
            <CarIcon size={18} style={styles.icon} />
            <div>
              <div style={styles.detailTitle}>Mobil</div>
              <div style={styles.detailValue}>
                {booking.car ? `${booking.car.brand} ${booking.car.name}` : 'Mobil Dihapus'}
              </div>
            </div>
          </div>
          <div style={styles.detailRow}>
            <User size={18} style={styles.icon} />
            <div>
              <div style={styles.detailTitle}>Pelanggan</div>
              <div style={styles.detailValue}>
                {booking.user ? booking.user.name : 'Guest'}
                <span style={styles.detailSub}>{booking.user?.email && ` (${booking.user.email})`}</span>
              </div>
            </div>
          </div>
          <div style={styles.detailRow}>
            <Calendar size={18} style={styles.icon} />
            <div>
              <div style={styles.detailTitle}>Tanggal Sewa</div>
              <div style={styles.detailValue}>
                {booking.start_date} s/d {booking.end_date}
              </div>
            </div>
          </div>
          <div style={styles.detailRow}>
            <DollarSign size={18} style={styles.icon} />
            <div>
              <div style={styles.detailTitle}>Total Pembayaran</div>
              <div style={{ ...styles.detailValue, color: '#10b981', fontWeight: '700' }}>
                Rp {parseFloat(booking.total_price).toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        </div>
        {/* Actions */}
        <div style={styles.actions}>
          {booking.status === 'pending' && (
            <>
              <button
                onClick={() => handleUpdateStatus(booking.id, 'ongoing')}
                style={{ ...styles.actionBtn, backgroundColor: '#3b82f6', color: '#fff' }}
              >
                <Check size={16} /> Approve
              </button>
              <button
                onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                style={{ ...styles.actionBtn, backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
              >
                <X size={16} /> Cancel
              </button>
            </>
          )}
          {(booking.status === 'ongoing' || booking.status === 'approved') && (
            <>
              <button
                onClick={() => handleUpdateStatus(booking.id, 'completed')}
                style={{ ...styles.actionBtn, backgroundColor: '#10b981', color: '#fff' }}
              >
                <Check size={16} /> Complete
              </button>
              <button
                onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                style={{ ...styles.actionBtn, backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
              >
                <X size={16} /> Cancel
              </button>
            </>
          )}
          <a
            href={getWhatsAppLink(booking)}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.waBtn}
          >
            <MessageCircle size={16} /> Hubungi via WA
          </a>
        </div>
      </motion.div>
    );
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
            onConfirm={executeStatusUpdate}
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.04em' }}>Manage Bookings</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '5px' }}>Tinjau dan kelola seluruh reservasi pelanggan</p>
          <div style={{ marginTop: '15px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { val: '', label: 'All' },
              { val: 'pending', label: 'Pending' },
              { val: 'ongoing', label: 'Ongoing' },
              { val: 'done', label: 'Selesai / Batal' },
            ].map(({ val, label }) => (
              <button
                key={val}
                onClick={() => setStatusFilter(val)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '99px',
                  border: '1px solid',
                  borderColor: statusFilter === val ? '#fff' : 'rgba(255,255,255,0.15)',
                  backgroundColor: statusFilter === val ? '#fff' : 'transparent',
                  color: statusFilter === val ? '#000' : 'rgba(255,255,255,0.6)',
                  fontWeight: '600',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <button onClick={fetchBookings} style={styles.refreshBtn}>
          Refresh Data
        </button>
      </div>

      {error && (
        <div style={styles.errorAlert}>
          <ShieldAlert size={20} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px 0', color: 'rgba(255,255,255,0.5)' }}>
          Memuat data pemesanan...
        </div>
      ) : bookings.length === 0 ? (
        <div style={styles.emptyState}>
          Belum ada riwayat pemesanan masuk saat ini.
        </div>
      ) : (
        <div>
          {/* ── Section 1: Pending ── */}
          {(statusFilter === '' || statusFilter === 'pending') && (
            <div style={styles.section}>
              <h2 style={{ ...styles.sectionTitle, color: '#f59e0b' }}>⏳ Menunggu Konfirmasi (Pending)</h2>
              {bookings.filter(b => b.status === 'pending').length === 0 ? (
                <p style={styles.sectionEmpty}>Tidak ada pesanan pending.</p>
              ) : (
                <div style={styles.grid}>
                  {bookings.filter(b => b.status === 'pending').map(b => renderBookingCard(b))}
                </div>
              )}
            </div>
          )}

          {/* ── Section 2: On Going ── */}
          {(statusFilter === '' || statusFilter === 'ongoing') && (
            <div style={styles.section}>
              <h2 style={{ ...styles.sectionTitle, color: '#3b82f6' }}>🚗 Sedang Disewa (On Going)</h2>
              {bookings.filter(b => b.status === 'ongoing' || b.status === 'approved').length === 0 ? (
                <p style={styles.sectionEmpty}>Tidak ada pesanan yang sedang berjalan.</p>
              ) : (
                <div style={styles.grid}>
                  {bookings.filter(b => b.status === 'ongoing' || b.status === 'approved').map(b => renderBookingCard(b))}
                </div>
              )}
            </div>
          )}

          {/* ── Section 3: Completed / Cancelled ── */}
          {(statusFilter === '' || statusFilter === 'done') && (
            <div style={styles.section}>
              <h2 style={{ ...styles.sectionTitle, color: '#10b981' }}>✅ Selesai / Dibatalkan</h2>
              {bookings.filter(b => b.status === 'completed' || b.status === 'cancelled').length === 0 ? (
                <p style={styles.sectionEmpty}>Tidak ada riwayat selesai atau dibatalkan.</p>
              ) : (
                <div style={styles.grid}>
                  {bookings.filter(b => b.status === 'completed' || b.status === 'cancelled').map(b => renderBookingCard(b))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

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
    sectionHeader: { fontSize: '1.5rem', fontWeight: '700', marginBottom: '12px', color: '#fff' },
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
  refreshBtn: {
    backgroundColor: '#fff',
    color: '#000',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
    padding: '16px 20px',
    borderRadius: '16px',
    marginBottom: '30px',
    fontSize: '0.9rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
    border: '1px dashed rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '24px',
  },
  card: {
    background: '#0a0a0a',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '24px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '20px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  detailRow: {
    display: 'flex',
    gap: '14px',
    alignItems: 'flex-start',
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.3)',
    marginTop: '2px',
    flexShrink: 0,
  },
  detailTitle: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '2px',
  },
  detailValue: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#fff',
  },
  detailSub: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '400',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '20px',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '0.88rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  waBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    borderRadius: '12px',
    backgroundColor: '#25D366',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '0.88rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center',
  },
  section: {
    marginBottom: '48px',
  },
  sectionTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
  },
  sectionEmpty: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: '0.9rem',
    fontStyle: 'italic',
    padding: '20px 0',
  },
};
