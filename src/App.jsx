import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/common/Header';
import CustomCursor from './components/common/CustomCursor';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AnalyticsService from './services/analytics';
import BottomNav from './components/common/BottomNav';

const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin') || location.pathname === '/login';
  const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (!isAdminPath) {
      AnalyticsService.logVisit(location.pathname);
    }
  }, [location.pathname, isAdminPath]);

  return (
    <div className="app flex flex-col min-h-screen">
      {!isAdminPath && <CustomCursor />}
      {!isAdminPath && <Header theme={theme} toggleTheme={toggleTheme} />}
      <main style={{
        minHeight: '100vh',
        paddingTop: (!isAdminPath && location.pathname !== '/') ? '90px' : '0',
        paddingBottom: !isAdminPath ? '70px' : '0' // Space for BottomNav on mobile
      }}>
        {children}
      </main>
      {!isAdminPath && <BottomNav />}
      <Footer />
    </div>
  );
};

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
