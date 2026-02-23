import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaChevronLeft, FaChevronRight, FaInfoCircle,
    FaBolt, FaBatteryFull, FaLightbulb, FaPlug, FaTv, FaBroadcastTower,
    FaArrowRight, FaFacebookF, FaInstagram, FaTwitter,
    FaSun, FaClock, FaShieldAlt, FaMicrochip, FaLayerGroup, FaSnowflake, FaCheckCircle, FaChartLine
} from 'react-icons/fa';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import SEO from '../components/common/SEO';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [allProducts, setAllProducts] = useState([]);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const docRef = doc(db, 'products', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProduct({ id: docSnap.id, ...docSnap.data() });
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAllProducts(data);
        });
        return () => unsubscribe();
    }, []);

    if (loading) return (
        <div style={{
            minHeight: '100vh', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{ textAlign: 'center' }}>
                <div className="animate-spin" style={{ width: '32px', height: '32px', border: '3px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', margin: '0 auto 1rem' }}></div>
                <p style={{ letterSpacing: '0.1em', fontSize: '0.8rem' }}>LOADING EXCELLENCE...</p>
            </div>
        </div>
    );

    if (!product) {
        return (
            <div style={{
                minHeight: '100vh', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem'
            }}>\
                <h2 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '0.1em' }}>PRODUCT NOT FOUND</h2>
                <Link to="/" style={{ padding: '1rem 2rem', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', borderRadius: '30px', fontWeight: '800', fontSize: '0.8rem', textDecoration: 'none' }}>BACK TO COLLECTION</Link>
            </div>
        );
    }

    const images = [product.imageUrl, ...(product.gallery || [])].filter(Boolean);
    const currentIndex = allProducts.findIndex(a => a.id === id);
    const nextProduct = allProducts[currentIndex + 1] || allProducts[0];
    const prevProduct = allProducts[currentIndex - 1] || allProducts[allProducts.length - 1];

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="premium-product-page"
        >
            <SEO title={`${product.name} - Z-Tabor Solar`} description={product.description} image={product.imageUrl} />

            <style>{`
                .premium-product-page {
                    background-color: var(--color-bg);
                    min-height: 100vh;
                    color: var(--color-text);
                    font-family: 'Inter', sans-serif;
                    overflow-x: hidden;
                    position: relative;
                }

                .main-layout {
                    display: grid;
                    grid-template-columns: 80px 1fr 450px;
                    min-height: calc(100vh - 120px);
                    padding: 0 4rem;
                    gap: 4rem;
                    align-items: center;
                }

                @media (max-width: 1400px) {
                    .main-layout { padding: 0 2rem; gap: 2rem; grid-template-columns: 80px 1fr 400px; }
                }

                .sidebar-thumbnails {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .thumb-card {
                    width: 65px;
                    height: 65px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.05);
                    cursor: pointer;
                    overflow: hidden;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    border-radius: 12px;
                }

                .thumb-card.active {
                    border-color: var(--color-primary);
                    background: rgba(34, 197, 94, 0.1);
                    transform: scale(1.1);
                    box-shadow: 0 0 20px rgba(34, 197, 94, 0.2);
                }

                .thumb-card img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    opacity: 0.5;
                    padding: 0.5rem;
                    transition: opacity 0.3s;
                }

                .thumb-card.active img {
                    opacity: 1;
                }

                .hero-image-container {
                    position: relative;
                    width: 100%;
                    max-width: 650px;
                    margin: 0 auto;
                    height: 350px; /* Fallback height for mobile */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: radial-gradient(circle at center, rgba(34, 197, 94, 0.05) 0%, transparent 70%);
                }

                @media (min-width: 1025px) {
                    .hero-image-container {
                        height: auto;
                        aspect-ratio: 1/1;
                    }
                }

                .hero-image-container img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                    filter: drop-shadow(0 30px 80px rgba(0,0,0,0.8));
                }

                .product-info {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    padding-left: 2rem;
                }

                .brand-label {
                    color: var(--color-primary);
                    font-size: 0.75rem;
                    font-weight: 800;
                    letter-spacing: 0.4em;
                    text-transform: uppercase;
                }

                .product-title {
                    font-size: clamp(3.2rem, 5vw, 4.5rem);
                    line-height: 1;
                    margin: 0;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: -0.02em;
                    color: var(--color-text);
                }

                .product-desc {
                    color: var(--color-text-muted);
                    line-height: 1.8;
                    font-size: 0.95rem;
                    max-width: 440px;
                }

                .btn-contact-us {
                    background: var(--color-primary);
                    color: black;
                    padding: 1.25rem 3rem;
                    border-radius: 40px;
                    font-weight: 900;
                    font-size: 0.8rem;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 1rem;
                    width: fit-content;
                    border: none;
                }

                .btn-contact-us:hover {
                    box-shadow: 0 10px 30px rgba(34, 197, 94, 0.3);
                    transform: translateY(-3px);
                }

                .bottom-nav {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 2rem 4rem;
                    border-top: 1px solid var(--color-border);
                    background: var(--color-surface);
                    z-index: 10;
                }

                .nav-pagination {
                    color: rgba(255,255,255,0.3);
                    font-size: 0.75rem;
                    font-weight: 800;
                }

                .arrow-btn {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    border: 1px solid var(--color-border);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    color: var(--color-text);
                    text-decoration: none;
                }

                .arrow-btn:hover {
                    border-color: var(--color-primary);
                    color: var(--color-primary);
                    background: rgba(34, 197, 94, 0.05);
                }

                .spec-section {
                    padding: 8rem 4rem;
                    background: linear-gradient(180deg, var(--color-bg) 0%, var(--color-surface) 100%);
                }

                .spec-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8rem;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .spec-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .spec-table th, .spec-table td {
                    padding: 1.5rem 0;
                    border-bottom: 1px solid var(--color-border);
                }

                .spec-table th {
                    text-align: left;
                    color: var(--color-primary);
                    font-size: 0.75rem;
                    font-weight: 800;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                }

                .spec-table td.label { 
                    color: var(--color-text-muted); 
                    font-size: 0.9rem; 
                    font-weight: 600; 
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .spec-table td.label svg {
                    color: var(--color-primary);
                    font-size: 1rem;
                    opacity: 0.8;
                }
                .spec-table td.value { text-align: right; font-weight: 800; font-size: 1.1rem; color: var(--color-text); }

                .feature-cards {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1.5rem;
                }

                .feature-card {
                    padding: 2rem;
                    background: var(--color-surface);
                    border: 1px solid var(--color-border);
                    border-radius: 24px;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .feature-card:hover {
                    background: rgba(34, 197, 94, 0.05);
                    border-color: var(--color-primary);
                    transform: translateY(-5px);
                }

                .feature-icon-box {
                    width: 45px;
                    height: 45px;
                    background: rgba(34, 197, 94, 0.1);
                    color: var(--color-primary);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1.5rem;
                    font-size: 1.25rem;
                }

                .feature-card h4 {
                    font-size: 1.1rem;
                    font-weight: 900;
                    margin-bottom: 0.75rem;
                    color: var(--color-text);
                    text-transform: uppercase;
                    letter-spacing: -0.01em;
                }

                .feature-card p {
                    font-size: 0.8rem;
                    color: var(--color-text-muted);
                    line-height: 1.6;
                }

                @media (max-width: 1024px) {
                    .main-layout { grid-template-columns: 1fr; height: auto; padding: 4rem 2rem; text-align: center; }
                    .sidebar-thumbnails { flex-direction: row; justify-content: center; order: 2; }
                    .hero-image-container { order: 1; max-width: 400px; }
                    .product-info { padding-left: 0; order: 3; align-items: center; }
                    .product-desc { margin: 0 auto; }
                    .spec-grid { grid-template-columns: 1fr; gap: 4rem; }
                    .product-title { font-size: 3rem; }
                    .bottom-nav { padding: 2rem; flex-wrap: wrap; gap: 1.5rem; justify-content: center; }
                    .spec-section { padding: 4rem 1.5rem; }
                }

                @media (max-width: 640px) {
                    .main-layout { padding: 3rem 1.25rem; }
                    .feature-cards { grid-template-columns: 1fr; }
                    .spec-table td.value { font-size: 0.95rem; }
                }
            `}</style>

            <div style={{ padding: '1rem' }}>
                <Link to="/catalog" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.4, fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.1em' }}>
                    <FaChevronLeft size={10} /> BACK TO CATALOG
                </Link>
            </div>

            <main className="main-layout">
                <div className="sidebar-thumbnails">
                    {images.map((img, idx) => (
                        <div
                            key={idx}
                            className={`thumb-card ${selectedImage === idx ? 'active' : ''}`}
                            onClick={() => setSelectedImage(idx)}
                        >
                            <img src={img} alt="" />
                        </div>
                    ))}
                </div>

                <div className="hero-image-container">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={selectedImage}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.1, y: -20 }}
                            transition={{ duration: 0.5 }}
                            src={images[selectedImage]}
                            alt={product.name}
                        />
                    </AnimatePresence>
                </div>

                <div className="product-info">
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <span className="brand-label">THE TABOR ECOSYSTEM</span>
                        <h1 className="product-title">{product.name}</h1>
                        <p className="product-desc">
                            {product.description || "Next-generation solar architecture designed for industrial efficiency and off-grid reliability."}
                        </p>

                        <Link to="/contact" className="btn-contact-us">
                            Contact Specialist <FaArrowRight />
                        </Link>
                    </motion.div>
                </div>
            </main>

            <section className="spec-section">
                <div className="spec-grid">
                    <div>
                        <h2 style={{ fontSize: '2.5rem', fontStyle: 'italic', fontWeight: '900', marginBottom: '3rem', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                            Technical <span style={{ color: 'var(--color-primary)', fontStyle: 'normal' }}>Specs</span>
                        </h2>
                        <table className="spec-table">
                            <thead>
                                <tr>
                                    <th colSpan="2">Core Architecture</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="label"><FaSun /> Solar Output (Wp)</td>
                                    <td className="value">{product.dimensions || "100W"}</td>
                                </tr>
                                <tr>
                                    <td className="label"><FaBatteryFull /> Storage Capacity (Wh)</td>
                                    <td className="value">{product.batteryStorage || "500Wh"}</td>
                                </tr>
                                <tr>
                                    <td className="label"><FaChartLine /> Peak Performance</td>
                                    <td className="value">98.4% Efficiency</td>
                                </tr>
                                <tr>
                                    <td className="label"><FaClock /> Deployment Time</td>
                                    <td className="value">Under 48 Hours</td>
                                </tr>
                                <tr>
                                    <td className="label"><FaShieldAlt /> Certifications</td>
                                    <td className="value">{product.college || "IEC, CE, ISO"}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="feature-cards">
                        <div className="feature-card">
                            <div className="feature-icon-box"><FaShieldAlt /></div>
                            <h4>Grid Resilience</h4>
                            <p>Engineered to withstand extreme environmental conditions while maintaining peak output stability.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-box"><FaMicrochip /></div>
                            <h4>AI Optimization</h4>
                            <p>Integrated smart cores dynamically distribute power based on localized consumption patterns.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-box"><FaLayerGroup /></div>
                            <h4>Modular Growth</h4>
                            <p>Easily expand your energy grid with our plug-and-play stackable hardware architecture.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-box"><FaSnowflake /></div>
                            <h4>Active Cooling</h4>
                            <p>Proprietary thermal management system extends battery life cycle by up to 40%.</p>
                        </div>
                    </div>
                </div>
            </section>

            <nav className="bottom-nav">
                <div className="nav-pagination">
                    {currentIndex + 1} / {allProducts.length}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to={`/product/${prevProduct.id}`} className="arrow-btn">
                        <FaChevronLeft />
                    </Link>
                    <Link to={`/product/${nextProduct.id}`} className="arrow-btn">
                        <FaChevronRight />
                    </Link>
                </div>

                <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.2em' }}>
                    SCROLL TO EXPLORE
                </div>
            </nav>
        </motion.div>
    );
};

export default ProductDetail;
