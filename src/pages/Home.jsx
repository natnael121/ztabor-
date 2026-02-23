import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { FaPlus, FaSearch, FaFacebookF, FaInstagram, FaTwitter, FaBatteryFull, FaChartLine, FaBolt, FaGlobe, FaShieldAlt, FaNetworkWired, FaSun, FaLeaf, FaMicrochip, FaWind, FaArrowRight } from 'react-icons/fa';
import logoImg from '../assets/photo_5784881328204484076_x.jpg';

// Imported Assets
import glowSun from '../assets/GlowSun 160.png';
import intelliSun1 from '../assets/IntelliSun 1000.png';
import intelliSun2 from '../assets/IntelliSun-5120.png';
import lumiSun from '../assets/LumiSun 30K.png';
import primeSun from '../assets/PrimeSun 233K.png';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleKeyDown = useCallback((e) => {
        if (products.length === 0) return;
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % products.length);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + products.length) % products.length);
        }
    }, [products.length]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const selected = products[selectedIndex] || null;

    // Auto-advance loop
    useEffect(() => {
        if (products.length === 0) return;
        const timer = setInterval(() => {
            setSelectedIndex(prev => (prev + 1) % products.length);
        }, 8000); // 8 seconds per slide for a premium feel
        return () => clearInterval(timer);
    }, [products.length]);

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh', backgroundColor: 'var(--color-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-dim)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="animate-spin" style={{ width: '32px', height: '32px', border: '3px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', margin: '0 auto 1rem' }}></div>
                    Loading Catalog...
                </div>
            </div>
        );
    }

    return (
        <div className="home-wrapper">
            <SEO
                title="Z-Tabor Solar | Renewable Energy"
                description="Engineered for high performance, sustainability, and industrial reliability."
            />

            <style>{`
                .home-wrapper {
                    background: var(--color-bg);
                    color: var(--color-text);
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                    overflow-x: hidden;
                    width: 100%;
                }

                .bg-split {
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    height: 100vh;
                    left: 45%;
                    background: var(--color-surface);
                    z-index: 0;
                    clip-path: polygon(15% 0, 100% 0, 100% 100%, 0% 100%);
                    border-left: 1px solid var(--color-border);
                }

                .hero-section {
                    min-height: 100vh;
                    display: grid;
                    grid-template-columns: 48% 52%;
                    padding: 0 6rem;
                    align-items: center;
                    position: relative;
                    z-index: 10;
                    background: radial-gradient(circle at 10% 20%, rgba(34, 197, 94, 0.03) 0%, transparent 40%);
                }

                .brand-sidebar {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding-right: 4rem;
                    border-right: 1px solid var(--color-border);
                    height: 100%;
                }

                .product-title {
                    font-size: clamp(3rem, 10vw, 6rem);
                    font-family: var(--font-heading);
                    font-weight: 900;
                    line-height: .95;
                    margin-bottom: 2rem;
                    text-transform: uppercase;
                    letter-spacing: -0.04em;
                    color: var(--color-text);
                    margin: 2rem 0;
                }

                .product-description {
                    font-size: .95rem;
                    color: var(--color-text-muted);
                    max-width: 480px;
                    line-height: 1.8;
                    font-weight: 500;
                }

                .cta-btn {
                    background-color: var(--color-primary);
                    color: black;
                    padding: 1.25rem 3rem;
                    border-radius: 40px;
                    text-decoration: none;
                    font-weight: 900;
                    text-transform: uppercase;
                    font-size: 0.8rem;
                    letter-spacing: 0.1em;
                    width: fit-content;
                    box-shadow: 0 10px 40px rgba(34, 197, 94, 0.3);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: none;
                }

                .cta-btn:hover { 
                    transform: translateY(-5px); 
                    box-shadow: 0 15px 50px rgba(34, 197, 94, 0.5);
                }

                .product-display {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    width: 100%;
                    padding: 2rem;
                    box-sizing: border-box;
                }

                .image-constraints {
                    width: 100%;
                    height: 100%;
                    max-width: 700px;
                    max-height: 600px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                }

                .main-product-img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                    filter: drop-shadow(0 40px 100px rgba(0,0,0,0.9));
                    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .bottom-selection-bar {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 6rem 3rem;
                    height: 150px;
                    z-index: 100;
                    width: 100%;
                }

                .product-card-nav {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    padding: 1.5rem 2.5rem;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    background: var(--color-surface);
                    border: 1px solid var(--color-border);
                    border-radius: 20px;
                }

                .product-card-nav.active {
                    background: rgba(34, 197, 94, 0.1);
                    border-color: var(--color-primary);
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }

                .product-card-nav.active::after {
                    content: '';
                    position: absolute;
                    bottom: -15px;
                    left: 30%;
                    right: 30%;
                    height: 4px;
                    background-color: var(--color-primary);
                    border-radius: 10px;
                    box-shadow: 0 0 20px var(--color-primary);
                }

                .nav-thumb {
                    width: 60px;
                    height: 60px;
                    background-color: var(--color-bg-alt);
                    border-radius: 12px;
                    overflow: hidden;
                    border: 1px solid var(--color-border);
                }

                .nav-info h4 {
                    text-transform: uppercase;
                    font-size: 0.65rem;
                    font-weight: 900;
                    margin-bottom: 0.4rem;
                    color: var(--color-primary);
                    letter-spacing: 0.2em;
                }

                .nav-info p {
                    font-size: 1rem;
                    font-weight: 900;
                    color: var(--color-text);
                    line-height: 1;
                    text-transform: uppercase;
                }

                .cy-section {
                    padding: 8rem 2rem;
                    position: relative;
                    z-index: 2;
                }

                @media (max-width: 768px) {
                    .cy-section { padding: 4rem 1.5rem; }
                }

                .glass-card {
                    background: var(--color-surface);
                    backdrop-filter: blur(30px);
                    border: 1px solid var(--color-border);
                    border-radius: 32px;
                    padding: 4rem;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .glass-card:hover {
                    border-color: var(--color-primary);
                    background: var(--color-surface);
                }

                .section-tag {
                    color: var(--color-primary);
                    font-size: 0.8rem;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.4em;
                    margin-bottom: 1.5rem;
                    display: block;
                }

                .section-title {
                    font-family: var(--font-heading);
                    font-size: clamp(2.5rem, 6vw, 4.5rem);
                    font-weight: 900;
                    margin-bottom: 2rem;
                    line-height: 1;
                    color: var(--color-text);
                    text-transform: uppercase;
                    letter-spacing: -0.02em;
                }

                .solutions-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 2.5rem;
                    margin-top: 6rem;
                }

                .sol-card { text-align: left; padding: 4rem 3rem; }
                
                .sol-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    margin-bottom: 2rem;
                }

                .step-card {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                    background: var(--color-surface);
                    border: 1px solid var(--color-border);
                    border-radius: 20px;
                    padding: 2rem;
                    margin-bottom: 1.5rem;
                    transition: all 0.3s ease;
                }

                .step-card:hover {
                    border-color: var(--color-primary);
                    background: rgba(34, 197, 94, 0.05);
                }

                .step-num {
                    width: 50px;
                    height: 50px;
                    background: var(--color-primary);
                    color: black;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 900;
                    flex-shrink: 0;
                    font-size: 1.25rem;
                }

                .cta-banner {
                    background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-bg) 100%);
                    border: 1px solid var(--color-border);
                    border-radius: 40px;
                    padding: 6rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 8rem;
                    position: relative;
                    overflow: hidden;
                }

                .cta-banner::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    right: -20%;
                    width: 300px;
                    height: 300px;
                    background: var(--color-primary);
                    filter: blur(150px);
                    opacity: 0.1;
                }
                
                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 3rem;
                    margin-top: 4rem;
                }
                
                .feature-item {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                /* Liquid Glass Tag */
                .liquid-tag {
                    position: absolute;
                    padding: 0.6rem 1.2rem;
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    border-right: 1px solid rgba(255, 255, 255, 0.1);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 30px;
                    color: var(--color-text);
                    font-size: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                    z-index: 10;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    animation: floatTag 4s ease-in-out infinite;
                }
                
                @keyframes floatTag {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }

                @media (max-width: 1400px) {
                    .hero-section { padding: 0 3rem; }
                    .brand-sidebar { padding-right: 2rem; }
                    .bottom-selection-bar { padding: 0 3rem 2rem; }
                }

                @media (max-width: 1024px) {
                    .hero-section { 
                        grid-template-columns: 1fr; 
                        padding: 8rem 2rem 4rem; 
                        gap: 3rem; 
                        height: auto; 
                        min-height: 100vh;
                        text-align: center;
                    }
                    .brand-sidebar { 
                        border: none; 
                        padding-right: 0; 
                        text-align: center; 
                        align-items: center; 
                        height: auto; 
                        margin-bottom: 2rem;
                    }
                    .product-description {
                        margin: 0 auto;
                    }
                    .cta-btn {
                        margin: 0 auto;
                    }
                    .bottom-selection-bar { 
                        padding: 0 1.5rem 2rem; 
                        overflow-x: auto; 
                        height: auto; 
                        position: relative; 
                        bottom: auto; 
                        justify-content: center;
                    }
                    .product-display {
                        padding: 0;
                        height: 400px;
                    }
                    .bg-split { display: none; }
                    .home-wrapper { height: auto; overflow-y: visible; }
                    .cy-section div[style*="grid-template-columns"] {
                        grid-template-columns: 1fr !important;
                        gap: 3rem !important;
                    }
                    .cta-banner { padding: 3rem; flex-direction: column; text-align: center; gap: 2rem; }
                }

                @media (max-width: 640px) {
                    .hero-section { padding: 6rem 1.25rem 3rem; }
                    .product-title { font-size: 3.5rem; }
                    .glass-card { padding: 2rem 1.5rem; }
                    .solutions-grid { grid-template-columns: 1fr; }
                    .step-card { flex-direction: column; text-align: center; padding: 1.5rem; }
                }

            `}</style>

            <div className="bg-split"></div>

            <main className="hero-section">
                <div className="brand-sidebar">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selected ? selected.id : 'default'}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <span style={{ display: 'inline-block', color: 'var(--color-primary)', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1.25rem' }}>
                                Sustainable Precision
                            </span>

                            <h1 className="product-title">
                                {selected?.name ? (
                                    <>
                                        {selected.name.split(' ').slice(0, 2).join(' ')}<br />
                                        <span style={{ color: 'var(--color-text-dim)' }}>{selected.name.split(' ').slice(2).join(' ')}</span>
                                    </>
                                ) : "The Tabor"}
                            </h1>

                            <p className="product-description">
                                {selected?.description || "Innovative solar energy products designed for high performance, sustainability, and reliability in every environment."}
                            </p>

                            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--color-primary)', fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    <FaBolt /> Efficiency Optima
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--color-text-dim)', fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    <FaShieldAlt /> Military Grade
                                </div>
                            </div>

                            <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <Link
                                    to={selected ? `/product/${selected.id}` : '/catalog'}
                                    className="cta-btn"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '1rem',
                                        padding: '1.2rem 2.5rem',
                                        backgroundColor: 'var(--color-primary)',
                                        color: 'black',
                                        borderRadius: '40px',
                                        fontWeight: '800',
                                        fontSize: '0.85rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        boxShadow: '0 10px 30px var(--color-primary-glow)',
                                        transition: 'all 0.4s ease',
                                        width: 'fit-content'
                                    }}
                                >
                                    Explore <FaArrowRight />
                                </Link>

                                <div style={{ display: 'flex', gap: '2rem', color: 'var(--color-text-dim)', paddingLeft: '1rem' }}>
                                    <FaFacebookF className="hover:text-primary transition-colors cursor-pointer" />
                                    <FaInstagram className="hover:text-primary transition-colors cursor-pointer" />
                                    <FaTwitter className="hover:text-primary transition-colors cursor-pointer" />
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="product-display">
                    <AnimatePresence mode="wait">
                        {selected && (
                            <motion.div
                                key={selected.id}
                                initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.9, rotate: 3 }}
                                transition={{ duration: 0.6 }}
                                className="image-constraints"
                                style={{ zIndex: 2 }}
                            >
                                <img
                                    src={selected.imageUrl || intelliSun2}
                                    alt={selected.name}
                                    className="main-product-img"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <div className="bottom-selection-bar">
                <div style={{ display: 'flex', gap: '1rem', marginLeft: 'auto' }}>
                    {[0, 1].map((offset) => {
                        if (offset > 0 && products.length <= offset) return null;
                        const idx = (selectedIndex + offset) % products.length;
                        const prod = products[idx];
                        if (!prod) return null;
                        return (
                            <div
                                key={prod.id}
                                className={`product-card-nav ${offset === 0 ? 'active' : ''}`}
                                onClick={() => setSelectedIndex(idx)}
                            >
                                <div className="nav-thumb">
                                    <img src={prod.imageUrl || intelliSun1} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div className="nav-info">
                                    <h4>{prod.category || "SOLAR"}</h4>
                                    <p>{prod.name}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <section id="tech-specs" className="cy-section" style={{ background: 'linear-gradient(180deg, var(--color-bg) 0%, var(--color-surface) 100%)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <div className="glass-card" style={{ padding: '1rem', width: 'fit-content', transform: 'rotate(-5deg)' }}>
                            <div className="liquid-tag" style={{ top: '20px', right: '-10px', animationDelay: '0s' }}>
                                <FaMicrochip style={{ color: '#4ade80' }} /> AI Integrated
                            </div>
                            <img src={intelliSun1} alt="Solar Precision" style={{ width: '100%', maxWidth: '450px', borderRadius: '16px' }} />
                        </div>
                    </div>
                    <div>
                        <span className="section-tag">Technical Excellence</span>
                        <h2 className="section-title">Next Generation<br />Solar Intelligence</h2>
                        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8, marginBottom: '2.5rem', maxWidth: '500px' }}>
                            We aren't just building panels; we're architecting a decentralized energy future. Our systems utilize real-time environmental data to optimize power output.
                        </p>
                        <button className="cta-btn" style={{ border: 'none', cursor: 'pointer' }}>Download Paper</button>
                    </div>
                </div>
            </section>

            <section className="cy-section" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '20%', right: '5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(239, 68, 68, 0.05) 0%, transparent 70%)', zIndex: 0 }}></div>

                <div style={{ textAlign: 'center', marginBottom: '6rem', position: 'relative', zIndex: 1 }}>
                    <span className="section-tag" style={{ margin: '0 auto' }}>Platform Capability</span>
                    <h2 className="section-title">Complete Solution<br />for every Ecosystem</h2>
                </div>

                <div className="solutions-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '2.5rem',
                    position: 'relative',
                    zIndex: 1
                }}>
                    {/* Card 1: Multifunction Practical */}
                    <motion.div
                        whileHover={{ y: -15 }}
                        className="glass-card"
                        style={{ padding: '4rem 3rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                    >
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(239, 68, 68, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: '#ef4444',
                            boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)', marginBottom: '1rem'
                        }}>
                            <FaNetworkWired />
                        </div>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                            Multifunction<br /><span style={{ color: '#ef4444' }}>Practical</span>
                        </h3>
                        <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8', fontSize: '0.95rem' }}>
                            Versatile energy distribution engineered for maximum utility across industrial grids and custom solar arrays.
                        </p>
                        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff0000' }}></div>
                            High-Utility Core
                        </div>
                    </motion.div>

                    {/* Card 2: Light-Weighted Compact Integration */}
                    <motion.div
                        whileHover={{ y: -15, scale: 1.02 }}
                        className="glass-card"
                        style={{ padding: '4rem 3rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid rgba(255, 0, 0, 0.2)', boxShadow: '0 10px 40px rgba(255, 0, 0, 0.05)' }}
                    >
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(255, 0, 0, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: '#ff0000',
                            boxShadow: '0 0 20px rgba(255, 0, 0, 0.2)', marginBottom: '1rem'
                        }}>
                            <FaBolt />
                        </div>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                            Compact<br /><span style={{ color: '#ff0000' }}>Integration</span>
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8', fontSize: '0.95rem', margin: 0 }}>
                                Ultra-portable design without compromising performance. Lightweight modules built for rapid scaling.
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                                <span style={{ padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '700', color: 'var(--color-text)' }}>Multimedia</span>
                                <span style={{ padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '700', color: 'var(--color-text)' }}>App Value</span>
                            </div>
                        </div>
                        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff0000' }}></div>
                            Efficiency Optimized
                        </div>
                    </motion.div>

                    {/* Card 3: Quality Intelligent */}
                    <motion.div
                        whileHover={{ y: -15, scale: 1.02 }}
                        className="glass-card"
                        style={{ padding: '4rem 3rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid rgba(59, 130, 246, 0.2)', boxShadow: '0 10px 40px rgba(59, 130, 246, 0.05)' }}
                    >
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(59, 130, 246, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: '#3b82f6',
                            boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)', marginBottom: '1rem'
                        }}>
                            <FaMicrochip />
                        </div>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                            Quality<br /><span style={{ color: '#3b82f6' }}>Intelligent</span>
                        </h3>
                        <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8', fontSize: '0.95rem' }}>
                            Smart monitoring systems with AI-driven analytics. Military-grade hardware for uncompromising reliability.
                        </p>
                        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></div>
                            AI Dashboard Ready
                        </div>
                    </motion.div>

                    {/* Card 4: Global Grid Sync */}
                    <motion.div
                        whileHover={{ y: -15, scale: 1.02 }}
                        className="glass-card"
                        style={{ padding: '4rem 3rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid rgba(168, 85, 247, 0.2)', boxShadow: '0 10px 40px rgba(168, 85, 247, 0.05)' }}
                    >
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(168, 85, 247, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: '#a855f7',
                            boxShadow: '0 0 20px rgba(168, 85, 247, 0.2)', marginBottom: '1rem'
                        }}>
                            <FaGlobe />
                        </div>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                            Global<br /><span style={{ color: '#a855f7' }}>Grid Sync</span>
                        </h3>
                        <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8', fontSize: '0.95rem' }}>
                            Seamless integration with international grid standards, allowing for cross-border energy sharing.
                        </p>
                        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a855f7' }}></div>
                            Network Ready
                        </div>
                    </motion.div>

                    {/* Card 5: Sustainable Future */}
                    <motion.div
                        whileHover={{ y: -15, scale: 1.02 }}
                        className="glass-card"
                        style={{ padding: '4rem 3rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid rgba(34, 197, 94, 0.2)', boxShadow: '0 10px 40px rgba(34, 197, 94, 0.05)' }}
                    >
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(34, 197, 94, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: '#22c55e',
                            boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)', marginBottom: '1rem'
                        }}>
                            <FaLeaf />
                        </div>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                            Renewable<br /><span style={{ color: '#22c55e' }}>Future</span>
                        </h3>
                        <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8', fontSize: '0.95rem' }}>
                            100% recyclable components ensuring that our energy solutions are as green as the power they generate.
                        </p>
                        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></div>
                            Eco Certified
                        </div>
                    </motion.div>

                    {/* Card 6: Extreme Reliability (NEW) */}
                    <motion.div
                        whileHover={{ y: -15, scale: 1.02 }}
                        className="glass-card"
                        style={{ padding: '4rem 3rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid rgba(234, 179, 8, 0.2)', boxShadow: '0 10px 40px rgba(234, 179, 8, 0.05)' }}
                    >
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(234, 179, 8, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: '#eab308',
                            boxShadow: '0 0 20px rgba(234, 179, 8, 0.2)', marginBottom: '1rem'
                        }}>
                            <FaShieldAlt />
                        </div>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                            Extreme<br /><span style={{ color: '#eab308' }}>Reliability</span>
                        </h3>
                        <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8', fontSize: '0.95rem' }}>
                            Engineered to thrive in the harshest conditions, from arctic freezes to desert heatwaves.
                        </p>
                        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#eab308' }}></div>
                            Military Tested
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="cy-section" style={{ background: 'radial-gradient(circle at 70% 30%, rgba(34, 197, 94, 0.05) 0%, transparent 50%)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: '6rem', alignItems: 'center', marginBottom: '6rem' }}>
                    <div>
                        <span className="section-tag">Partnership</span>
                        <h2 className="section-title">Become a Tabor<br />Partner Now</h2>
                        <div style={{ marginTop: '3rem' }}>
                            {[
                                { title: "Register Your Grid", desc: "Connect your existing infrastructure." },
                                { title: "Set Up Hardware", desc: "Deploy modular solar stacks." },
                                { title: "Optimize Output", desc: "Let our AI core handle distribution." }
                            ].map((step, i) => (
                                <div key={i} className="step-card">
                                    <div className="step-num">{i + 1}</div>
                                    <div className="step-content">
                                        <h4>{step.title}</h4>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="glass-card" style={{ padding: '0.5rem', borderRadius: '40px', overflow: 'hidden', position: 'relative' }}>
                        <div className="liquid-tag" style={{ top: '30px', left: '30px', animationDelay: '1s' }}>
                            <FaNetworkWired style={{ color: '#3b82f6' }} /> Grid Sync
                        </div>
                        <img src={lumiSun} alt="Solar Automation" style={{ width: '100%', display: 'block' }} />
                    </div>
                </div>

                {/* ─── NEW FEATURES SECTION ─── */}
                <span className="section-tag" style={{ textAlign: 'center' }}>Capabilities</span>
                <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '4rem' }}>Engineered to Outperform</h2>

                <div className="features-grid">
                    <div className="glass-card" style={{ padding: '3rem' }}>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} style={{ display: 'inline-block', marginBottom: '1.5rem', color: '#eab308', fontSize: '3rem' }}>
                            <FaSun />
                        </motion.div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '800' }}>Extreme Efficiency</h3>
                        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                            Proprietary nano-coating maximizes light absorption even in low-light conditions, delivering 30% more consistent power.
                        </p>
                    </div>
                    <div className="glass-card" style={{ padding: '3rem' }}>
                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }} style={{ display: 'inline-block', marginBottom: '1.5rem', color: '#22c55e', fontSize: '3rem' }}>
                            <FaShieldAlt />
                        </motion.div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '800' }}>Unmatched Durability</h3>
                        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                            Tested in extreme desert and arctic environments. Guaranteed to withstand 140mph winds and heavy hail capability.
                        </p>
                    </div>
                    <div className="glass-card" style={{ padding: '3rem' }}>
                        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} style={{ display: 'inline-block', marginBottom: '1.5rem', color: '#3b82f6', fontSize: '3rem' }}>
                            <FaNetworkWired />
                        </motion.div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '800' }}>Smart Grid Ready</h3>
                        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                            Native IoT integration allows for rapid synchronization with local and national grid infrastructures out of the box.
                        </p>
                    </div>
                </div>

                {/* ─── NEW WHY CHOOSE US SECTION ─── */}
                <div style={{ marginTop: '8rem', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '5rem', alignItems: 'center', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '32px', padding: '4rem', position: 'relative', boxShadow: '0 0 100px rgba(34, 197, 94, 0.05)' }}>
                    <div style={{ position: 'relative' }}>
                        <div className="liquid-tag" style={{ bottom: '40px', right: '10px', animationDelay: '2s' }}>
                            <FaShieldAlt style={{ color: '#fbbf24' }} /> 25-Year Warranty
                        </div>
                        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: -1 }}></div>
                        <img src={primeSun} alt="Why Choose Us" style={{ width: '100%', filter: 'drop-shadow(0 0 50px rgba(34,197,94,0.3))' }} />
                    </div>
                    <div>
                        <span className="section-tag">Why Choose Tabor</span>
                        <h2 className="section-title">Powering the<br />World Differently</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
                            <motion.div initial={{ x: 20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <span style={{ color: '#22c55e' }}><FaGlobe /></span> Global Reliability
                                </h4>
                                <p style={{ color: 'var(--color-text-muted)', paddingLeft: '2.5rem' }}>Trusted by 4 of the G7 nations for critical infrastructure power support.</p>
                            </motion.div>
                            <motion.div initial={{ x: 20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <span style={{ color: '#3b82f6' }}><FaNetworkWired /></span> Decentralized First
                                </h4>
                                <p style={{ color: 'var(--color-text-muted)', paddingLeft: '2.5rem' }}>Our architecture prevents single-point failures, ensuring grid resilience.</p>
                            </motion.div>
                            <motion.div initial={{ x: 20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <span style={{ color: '#f59e0b' }}><FaShieldAlt /></span> 25-Year Guarantee
                                </h4>
                                <p style={{ color: 'var(--color-text-muted)', paddingLeft: '2.5rem' }}>We stand by our hardware with the industry's modest comprehensive warranty.</p>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* ─── NEWS FEED SECTION ─── */}
                <NewsFeed />

                <div className="cta-banner" style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 20px 80px rgba(0,0,0,0.5)' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 70% 30%, rgba(34, 197, 94, 0.1) 0%, transparent 60%)', pointerEvents: 'none' }}></div>
                    <div>
                        <h3 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1rem', color: 'var(--color-text)', letterSpacing: '-0.04em' }}>Ready to empower your grid?</h3>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem', maxWidth: '600px' }}>The future of sustainable energy is decentralized. Join the Tabor movement today.</p>
                    </div>
                    <Link to="/contact" className="cta-btn" style={{ border: 'none', cursor: 'pointer', padding: '1.5rem 4rem', display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}>
                        Get Started <FaArrowRight />
                    </Link>
                </div>
            </section>
        </div>
    );
};

const NewsFeed = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).slice(0, 3);
            setNews(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const placeholders = [
        { id: 'p1', title: 'Tabor Solar Engineering Peak Performance', excerpt: 'Discover how our new nano-coating technology is revolutionizing light absorption even in low-light environments.', date: 'FEB 20, 2026', category: 'INNOVATION' },
        { id: 'p2', title: 'Global Expansion: Mid-East Solar Corridors', excerpt: 'Tabor announces a new initiative to bridge energy gaps across emerging markets with modular solar stacks.', date: 'FEB 18, 2026', category: 'GLOBAL' },
        { id: 'p3', title: 'Eco-System Integration: AI Core update v4.0', excerpt: 'Our latest firmware brings 15% better grid synchronization and automated load distribution.', date: 'FEB 15, 2026', category: 'TECH' }
    ];

    const displayNews = news.length > 0 ? news : placeholders;

    return (
        <section id="news" className="cy-section" style={{ position: 'relative', marginTop: '10rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '60px', padding: '10rem 4rem' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '80%', background: 'radial-gradient(circle, rgba(34, 197, 94, 0.03) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0 }}></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                <span className="section-tag" style={{ margin: '0 auto' }}>Updates</span>
                <h2 className="section-title">Tabor Times<br />Latest news</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginTop: '6rem', textAlign: 'left' }}>
                    {displayNews.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.6 }}
                            viewport={{ once: true }}
                            className="glass-card"
                            style={{
                                padding: '0',
                                overflow: 'hidden',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                border: '1px solid var(--color-border)',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                            }}
                            whileHover={{ y: -10, boxShadow: '0 30px 60px rgba(34, 197, 94, 0.1)' }}
                        >
                            <div style={{ height: '220px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                                <img src={item.imageUrl || lumiSun} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
                                <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'var(--color-primary)', color: 'black', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.7rem', fontWeight: '900', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}>
                                    {item.category}
                                </div>
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)' }}></div>
                            </div>
                            <div style={{ padding: '2.5rem', position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: '800', marginBottom: '1rem', letterSpacing: '0.1em' }}>{item.date}</div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '1.25rem', lineHeight: '1.2', color: 'var(--color-text)' }}>{item.title}</h3>
                                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '2.5rem', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.7' }}>{item.excerpt}</p>
                                <Link to="/blog" style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text)', fontWeight: '900', fontSize: '0.85rem', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.15em' }} className="hover:text-primary transition-all group">
                                    Read Full Story <FaArrowRight fontSize="0.75rem" style={{ transition: 'transform 0.3s ease' }} className="group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <div style={{ marginTop: '6rem' }}>
                    <Link to="/blog" className="cta-btn" style={{ background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text)', textDecoration: 'none', padding: '1.25rem 3rem', fontSize: '0.85rem' }}>
                        Visit Tabor Archives
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Home;
