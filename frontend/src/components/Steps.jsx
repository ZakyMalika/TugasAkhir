import { motion } from 'framer-motion';

const steps = [
  {
    num: "01",
    title: "Choose your car",
    desc: "Pick the premium model that suits your style and plans."
  },
  {
    num: "02",
    title: "Contact Us",
    desc: "Confirm availability and request a free quota."
  },
  {
    num: "03",
    title: "Confirm & Secure",
    desc: "Send documents, pay deposit and we'll handle the rest."
  },
  {
    num: "04",
    title: "Drive in Style",
    desc: "We deliver your car straight to your door in just 90 minutes."
  }
];

const Steps = () => {
  return (
    <section className="container">
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h2 style={{ fontSize: '3.5rem', letterSpacing: '-2px' }}>Get Rolling in 4 Steps</h2>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '20px' 
      }}>
        {steps.map((step, index) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{ 
              background: 'var(--bg-card)',
              padding: '40px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--glass-border)'
            }}
          >
            <div style={{ color: 'var(--text-gray)', fontSize: '0.9rem', marginBottom: '40px' }}>{step.num}</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>{step.title}</h3>
            <p style={{ color: 'var(--text-gray)', lineHeight: '1.6', fontSize: '0.95rem' }}>{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Steps;
