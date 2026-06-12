import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const CarCatalog = ({ cars = [], loading = false }) => {
  const [filteredCars, setFilteredCars] = useState([]);

  const [filters, setFilters] = useState({
    brand: 'All',
    category: 'All',
    transmission: 'All',
    sort: 'Most Relevant'
  });
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    let result = [...cars];
    if (filters.brand !== 'All') result = result.filter(car => car.brand === filters.brand);
    if (filters.category !== 'All') result = result.filter(car => car.category === filters.category);
    if (filters.transmission !== 'All') result = result.filter(car => car.transmission === filters.transmission);

    if (filters.sort === 'Price: Low to High') result.sort((a, b) => a.price_per_day - b.price_per_day);
    else if (filters.sort === 'Price: High to Low') result.sort((a, b) => b.price_per_day - a.price_per_day);
    else if (filters.sort === 'Top Speed') result.sort((a, b) => b.top_speed - a.top_speed);

    setFilteredCars(result);
  }, [filters, cars]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  if (loading && cars.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px', minHeight: '80vh' }}>
        <div className="text-gradient" style={{ fontSize: '1.5rem' }}>Preparing your collection...</div>
      </div>
    );
  }

  const options = {
    brand: ['All', ...new Set(cars.map(car => car.brand))],
    category: ['All', ...new Set(cars.map(car => car.category))],
    transmission: ['All', ...new Set(cars.map(car => car.transmission))],
    sort: ['Most Relevant', 'Price: Low to High', 'Price: High to Low', 'Top Speed']
  };

  const FilterDropdown = ({ label, field }) => {
    const isActive = filters[field] !== 'All' && filters[field] !== 'Most Relevant';
    return (
      <div style={{ position: 'relative' }}>
        <div
          onClick={() => setActiveDropdown(activeDropdown === field ? null : field)}
          style={{
            background: isActive ? '#fff' : 'rgba(255,255,255,0.03)',
            color: isActive ? '#000' : '#fff',
            padding: '12px 24px',
            borderRadius: '99px',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.85rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'var(--transition-main)'
          }}
        >
          {label}: <span style={{ fontWeight: '600' }}>{filters[field]}</span>
          <ChevronDown size={14} style={{ opacity: 0.5 }} />
        </div>
        <AnimatePresence>
          {activeDropdown === field && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                top: '120%',
                left: 0,
                width: '220px',
                background: '#0a0a0a',
                border: '1px solid var(--glass-border)',
                borderRadius: '24px',
                zIndex: 100,
                padding: '12px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                backdropFilter: 'blur(20px)'
              }}
            >
              {options[field].map(opt => (
                <div
                  key={opt}
                  onClick={() => {
                    setFilters({ ...filters, [field]: opt });
                    setActiveDropdown(null);
                  }}
                  style={{
                    padding: '12px 18px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color: filters[field] === opt ? '#fff' : 'var(--text-gray)',
                    background: filters[field] === opt ? 'rgba(255,255,255,0.05)' : 'transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  {opt}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <section id="cars" className="container" style={{ marginBottom: '100px', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h1 style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', marginBottom: '32px', fontWeight: '800', letterSpacing: '-0.05em' }}>Collection</h1>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '100px' }}>
          <FilterDropdown label="Brand" field="brand" />
          <FilterDropdown label="Type" field="category" />
          <FilterDropdown label="Transmission" field="transmission" />
          <FilterDropdown label="Sort" field="sort" />
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className={filteredCars.length > 0 ? "grid-2" : ""}
        style={{
          display: filteredCars.length === 0 ? 'block' : undefined,
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        {filteredCars.map((car) => (
          <motion.div
            variants={itemVariants}
            key={car.id}
            className="car-card"
          >
            <Link to={`/cars/${car.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="car-image-container">
                <motion.img
                  src={car.image_url}
                  alt={car.name}
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', gap: '10px', zIndex: 10 }}>
                  <div className="spec-badge">{car.top_speed} km/h</div>
                  <div className="spec-badge">{car.horsepower} hp</div>
                  <div className="spec-badge">{car.transmission}</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 10px 10px' }}>
                <div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.04em' }}>{car.brand} {car.name}</h3>
                  <div style={{ color: 'var(--text-gray)', fontSize: '1.1rem', fontWeight: '500' }}>from Rp {car.price_per_day.toLocaleString()} / day</div>
                </div>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '1px solid var(--glass-border)',
                  color: '#fff'
                }}>
                  <ArrowRight size={20} />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default CarCatalog;
