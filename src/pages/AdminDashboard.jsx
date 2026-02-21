import React, { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import {
    FaChartPie, FaBox, FaEnvelope, FaUsers, FaCog, FaSignOutAlt,
    FaMoon, FaSun, FaArrowUp, FaArrowDown, FaPlus, FaSearch, FaBell
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import NewsManager from '../components/NewsManager';
import ProductManager from '../components/ProductManager';
import TelegramSettings from '../components/TelegramSettings';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

const AdminDashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('analytics');
    const [themeName, setThemeName] = useState(document.documentElement.getAttribute('data-theme') || 'dark');
    const isDarkMode = themeName === 'dark';
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                navigate('/login');
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    const toggleLocalTheme = () => {
        const newTheme = themeName === 'dark' ? 'light' : 'dark';
        setThemeName(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isDarkMode ? '#111827' : '#FFFFFF' }}>
            <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid #E5E7EB', borderTopColor: '#3B82F6', borderRadius: '50%' }}></div>
        </div>
    );

    const theme = {
        bg: isDarkMode ? '#111827' : '#F3F4F6',
        card: isDarkMode ? '#1F2937' : '#FFFFFF',
        text: isDarkMode ? '#F9FAFB' : '#000000',
        textMuted: isDarkMode ? '#9CA3AF' : '#1a1a1a',
        border: isDarkMode ? '#374151' : '#cbd5e1',
        sidebar: isDarkMode ? '#111827' : '#FFFFFF',
        accent: '#D4F462'
    };

    const navItems = [
        { id: 'analytics', label: 'Analytics', icon: <FaChartPie /> },
        { id: 'products', label: 'Catalog', icon: <FaBox /> },
        { id: 'news', label: 'Messages', icon: <FaEnvelope /> },
        { id: 'customers', label: 'Customers', icon: <FaUsers /> },
    ];

    const bottomNavItems = [
        { id: 'settings', label: 'Settings', icon: <FaCog /> },
    ];

    return (
        <>
            <style>{`
                .admin-layout { display: flex; min-height: 100vh; background-color: ${theme.bg}; color: ${theme.text}; font-family: 'Inter', sans-serif; }
                .admin-sidebar {
                    width: 260px;
                    background-color: ${theme.sidebar};
                    border-right: 1px solid ${theme.border};
                    display: flex;
                    flex-direction: column;
                    padding: 2rem 1.5rem;
                    position: fixed;
                    height: 100vh;
                    z-index: 100;
                }
                .admin-main { margin-left: 260px; flex: 1; padding: 2rem 3rem; }
                
                @media (max-width: 1024px) {
                    .admin-main { padding: 2rem; }
                }

                @media (max-width: 768px) {
                    .admin-layout { flex-direction: column; }
                    .admin-sidebar {
                        width: 100%;
                        height: auto;
                        position: relative;
                        border-right: none;
                        border-bottom: 1px solid ${theme.border};
                        padding: 1.5rem;
                    }
                    .admin-main { margin-left: 0; padding: 1.5rem; }
                    .admin-header { flex-direction: column; align-items: flex-start !important; gap: 1.5rem; }
                    .admin-sidebar-nav { flex-direction: row; overflow-x: auto; padding-bottom: 1rem; }
                    .admin-sidebar-nav button { white-space: nowrap; }
                    .admin-sidebar-footer { flex-direction: row; overflow-x: auto; }
                    .sidebar-help-card { display: none; }
                }
            `}</style>

            <div className="admin-layout">

                {/* SIDEBAR */}
                <aside className="admin-sidebar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem', padding: '0 0.5rem' }}>
                        <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>Z</div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Business</h2>
                    </div>

                    <nav className="admin-sidebar-nav" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '0.8rem 1rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: activeTab === item.id ? (isDarkMode ? '#374151' : '#F3F4F6') : 'transparent',
                                    color: activeTab === item.id ? theme.text : theme.textMuted,
                                    fontWeight: activeTab === item.id ? '600' : '500',
                                    fontSize: '0.9rem',
                                    transition: 'all 0.2s ease',
                                    textAlign: 'left'
                                }}
                            >
                                <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <div className="admin-sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: `1px solid ${theme.border}`, paddingTop: '1.5rem' }}>
                        {bottomNavItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '0.8rem 1rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: activeTab === item.id ? (isDarkMode ? '#374151' : '#F3F4F6') : 'transparent',
                                    color: activeTab === item.id ? theme.text : theme.textMuted,
                                    fontWeight: activeTab === item.id ? '600' : '500',
                                    fontSize: '0.9rem',
                                    transition: 'all 0.2s ease',
                                    textAlign: 'left'
                                }}
                            >
                                <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                        <button
                            onClick={handleLogout}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0.8rem 1rem',
                                borderRadius: '12px',
                                border: 'none',
                                background: 'transparent',
                                color: '#EF4444',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                marginTop: '0.5rem'
                            }}
                        >
                            <FaSignOutAlt /> Sign Out
                        </button>
                    </div>

                    {/* Sidebar Card Placeholder like in image */}
                    <div className="sidebar-help-card" style={{ marginTop: '2rem', padding: '1.25rem', backgroundColor: isDarkMode ? '#374151' : '#EFF6FF', borderRadius: '16px', position: 'relative' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.5rem' }}>Need help?<br />Feel free to contact</p>
                        <button style={{ backgroundColor: '#3B82F6', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 'bold' }}>Get support</button>
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main className="admin-main">

                    {/* Top Headers */}
                    <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                        <div>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                            <p style={{ fontSize: '0.85rem', color: theme.textMuted }}>01.06.2022 - 31.08.2022</p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ backgroundColor: theme.card, borderRadius: '20px', padding: '4px', display: 'flex', border: `1px solid ${theme.border}` }}>
                                <button onClick={() => { setThemeName('light'); document.documentElement.setAttribute('data-theme', 'light'); localStorage.setItem('theme', 'light'); }} style={{ padding: '6px 12px', borderRadius: '16px', backgroundColor: !isDarkMode ? '#EFF6FF' : 'transparent', color: !isDarkMode ? '#000000' : theme.textMuted, border: 'none' }}><FaSun /></button>
                                <button onClick={() => { setThemeName('dark'); document.documentElement.setAttribute('data-theme', 'dark'); localStorage.setItem('theme', 'dark'); }} style={{ padding: '6px 12px', borderRadius: '16px', backgroundColor: isDarkMode ? '#374151' : 'transparent', color: isDarkMode ? '#FFFFFF' : theme.textMuted, border: 'none' }}><FaMoon /></button>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '0.85rem', fontWeight: '700' }}>Kristi Kamilykova</p>
                                    <p style={{ fontSize: '0.7rem', color: theme.textMuted }}>Admin</p>
                                </div>
                                <img src="https://ui-avatars.com/api/?name=Kristi+K&background=8B5CF6&color=fff" style={{ width: '40px', height: '40px', borderRadius: '50%' }} alt="profile" />
                            </div>
                        </div>
                    </header>

                    <AnimatePresence mode="wait">
                        {activeTab === 'analytics' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                <AnalyticsDashboard isDarkMode={isDarkMode} />
                            </motion.div>
                        )}

                        {activeTab === 'products' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '1000px' }}>
                                <ProductManager isDarkMode={isDarkMode} />
                            </motion.div>
                        )}

                        {activeTab === 'news' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '900px' }}>
                                <NewsManager isDarkMode={isDarkMode} />
                            </motion.div>
                        )}

                        {activeTab === 'settings' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '600px' }}>
                                <TelegramSettings isDarkMode={isDarkMode} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </>
    );
};

export default AdminDashboard;
