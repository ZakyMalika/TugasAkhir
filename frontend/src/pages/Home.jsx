import Hero from '../components/Hero';
import CarCatalog from '../components/CarCatalog';
import { motion } from 'framer-motion';

const Home = ({ cars }) => {
  return (
    <>
      <Hero />

      {/* Numbers Section */}
      <section style={{ borderBottom: '1px solid var(--glass-border)', background: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="grid-4" style={{ gap: '40px' }}>
            {[
              { label: 'Happy Clients', value: '250+' },
              { label: 'Premium Cars', value: '15+' },
              { label: 'Years Experience', value: '8+' },
              { label: 'Awards Won', value: '12' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                style={{ textAlign: 'center' }}
              >
                <div style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '10px', letterSpacing: '-0.05em' }}>{stat.value}</div>
                <div style={{ color: 'var(--text-gray)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '4rem', marginBottom: '20px' }}>How to rent a car</h2>
            <p style={{ color: 'var(--text-gray)', fontSize: '1.2rem' }}>Four simple steps to get behind the wheel of your dream car.</p>
          </div>

          <div className="grid-4">
            {[
              { step: '01', title: 'Choose a car', desc: 'Browse our collection and select the car that suits your style.' },
              { step: '02', title: 'Pick a date', desc: 'Choose your rental dates and check for availability.' },
              { step: '03', title: 'Book it', desc: 'Fill in your details and complete the secure booking process.' },
              { step: '04', title: 'Drive it', desc: 'Pick up your car or have it delivered to your location.' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  padding: '40px',
                  borderRadius: '32px',
                  border: '1px solid var(--glass-border)',
                  height: '100%'
                }}
              >
                <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-gray)', marginBottom: '30px' }}>{item.step}</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-gray)', fontSize: '1rem', lineHeight: '1.6' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CarCatalog cars={cars.slice(0, 4)} />

      {/* Testimonial Marquee (Simplified) */}
      <section style={{ overflow: 'hidden', padding: '100px 0', background: 'var(--bg-primary)', borderTop: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', gap: '50px', whiteSpace: 'nowrap' }}>
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            style={{ display: 'flex', gap: '50px', fontSize: '5rem', fontWeight: '800', letterSpacing: '-0.05em', color: 'rgba(255,255,255,0.05)', textTransform: 'uppercase' }}
          >
            <span>Luxurious Experience • Premium Service • Best Supercars • Unmatched Comfort • Luxurious Experience • Premium Service • Best Supercars • Unmatched Comfort</span>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
