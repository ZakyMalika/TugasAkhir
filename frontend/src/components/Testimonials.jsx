import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const reviews = [
  {
    name: "Emily Roberts",
    role: "Client",
    text: "Renting a luxury car here made my business trip so much better. The car was elegant and comfortable, and the service was fast and friendly.",
    img: "https://i.pravatar.cc/150?u=emily"
  },
  {
    name: "Andrew Collins",
    role: "Client",
    text: "I wanted a premium ride for a weekend getaway, and this company delivered perfectly. The car handled beautifully, and the whole experience felt personalized.",
    img: "https://i.pravatar.cc/150?u=andrew"
  },
  {
    name: "Isabelle Turner",
    role: "Client",
    text: "The luxury car I rented was flawless — stylish, powerful, and incredibly smooth to drive. The team provided excellent support throughout.",
    img: "https://i.pravatar.cc/150?u=isabelle"
  }
];

const Testimonials = () => {
  return (
    <section className="container" style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: '60px' }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '8px', 
          background: 'rgba(255,255,255,0.05)',
          padding: '8px 16px',
          borderRadius: '99px',
          fontSize: '0.75rem',
          marginBottom: '1.5rem',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <span>💎</span>
          Chosen by more than 250 clients
        </div>
        <h2 style={{ fontSize: '3.5rem', letterSpacing: '-2px' }}>
          Read Testimonials,<br />
          <span style={{ color: 'var(--text-gray)' }}>Ride with confidence</span>
        </h2>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '20px' 
      }}>
        {reviews.map((review, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -10 }}
            style={{
              background: 'var(--bg-secondary)',
              padding: '40px',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'left',
              border: '1px solid var(--glass-border)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', gap: '2px', color: '#fff', marginBottom: '20px' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="white" />)}
              </div>
              <p style={{ color: 'var(--text-white)', lineHeight: '1.6', marginBottom: '30px', fontSize: '0.95rem' }}>
                "{review.text}"
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src={review.img} alt={review.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{review.name}</div>
                <div style={{ color: 'var(--text-gray)', fontSize: '0.75rem' }}>{review.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
