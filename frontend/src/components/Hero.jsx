import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section style={{
      height: '100vh',
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--bg-primary)',
      padding: 0
    }}>
      {/* Background Image Container */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1
        }}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000"
          alt="Porsche Hero"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.6)'
          }}
        />

        {/* Gradient Overlays for smooth blending */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, #060606 0%, transparent 50%, transparent 100%)',
          zIndex: 2
        }}></div>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, #060606 0%, transparent 40%)',
          zIndex: 2
        }}></div>
      </motion.div>

      {/* Content */}
      <div className="container" style={{
        position: 'relative',
        zIndex: 10,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: '800px' }}
        >


          <h1 className="hero-title text-gradient">
            Premium Car <br /> Rental in Jakarta
          </h1>

          <p style={{
            fontSize: '1.25rem',
            color: 'var(--text-gray)',
            marginBottom: '48px',
            lineHeight: '1.5',
            maxWidth: '550px'
          }}>
            Experience unmatched comfort, style, and service — wherever the road takes you.
          </p>

          <Link to="/cars">
            <button className="btn-primary" style={{ padding: '22px 50px', fontSize: '1rem' }}>
              Choose Your Car
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          bottom: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          color: 'var(--text-gray)',
          fontSize: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase'
        }}
      >
        <div style={{ width: '1px', height: '80px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)' }}></div>
        Scroll
      </motion.div>
    </section>
  );
};

export default Hero;
