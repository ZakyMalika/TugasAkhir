import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CarsPage from './pages/CarsPage';
import CarDetailPage from './pages/CarDetailPage';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminCars from './pages/AdminCars';
import AdminBookings from './pages/AdminBookings';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import './App.css';

// Scroll to Top Component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Smoother Page Wrapper
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

function AnimatedRoutes({ cars, loading }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PageWrapper><Home cars={cars} /></PageWrapper>} />
        <Route path="/cars" element={<PageWrapper><CarsPage cars={cars} loading={loading} /></PageWrapper>} />
        <Route path="/cars/:id" element={<PageWrapper><CarDetailPage /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/cars" element={<AdminLayout><AdminCars /></AdminLayout>} />
        <Route path="/admin/bookings" element={<AdminLayout><AdminBookings /></AdminLayout>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCars = async () => {
    try {
      const response = await axios.get('http://rentaljek.com/api/cars');
      setCars(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cars:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        {/* Only show Navbar/Footer on public routes */}
        <ConditionalWrapper />
        <main style={{ minHeight: '100vh' }}>
          <AnimatedRoutes cars={cars} loading={loading} />
        </main>
        <ConditionalFooter />
      </div>
    </Router>
  );
}

const ConditionalWrapper = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;
  return <Navbar />;
};

const ConditionalFooter = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;
  return <Footer />;
};

export default App;
