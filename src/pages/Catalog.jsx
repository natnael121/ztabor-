import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { FaArrowRight, FaBolt, FaLayerGroup } from 'react-icons/fa';

const Catalog = () => {
    const [products, setProducts] = useState([]);
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

    return (
        <div className="page-catalog" style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', color: 'var(--color-text)' }}>
            <SEO
                title="Product Catalog - Z-Tabor Solar"
                description="Explore our complete catalog of high-efficiency solar energy products for every need."
            />

            <style>{`
                .catalog-hero {
                    padding: 6rem 0 4rem;
                    text-align: center;
                    position: relative;
                    background: radial-gradient(circle at 50% 100%, rgba(34, 197, 94, 0.05) 0%, transparent 70%);
                }

                .catalog-title {
                    font-size: clamp(3.5rem, 8vw, 6rem);
                    font-weight: 900;
                    line-height: 0.9;
                    margin-bottom: 2rem;
                    text-transform: uppercase;
                    letter-spacing: -0.04em;
                }

                .catalog-subtitle {
                    color: var(--color-primary);
                    font-size: 0.8rem;
                    font-weight: 800;
                    letter-spacing: 0.5em;
                    text-transform: uppercase;
                    margin-bottom: 1rem;
                    display: block;
                }

                .product-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 2.5rem;
                    padding-bottom: 6rem;
                }

                @media (max-width: 640px) {
                    .product-grid {
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }
                    .catalog-hero { padding: 4rem 1rem 3rem; }
                    .catalog-title { font-size: 3rem; }
                }

                .product-card {
                    background: var(--color-surface);
                    border: 1px solid var(--color-border);
                    padding: 2rem;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    text-decoration: none;
                    color: var(--color-text);
                    display: flex;
                    flex-direction: column;
                    border-radius: 24px;
                    overflow: hidden;
                }

                .product-card:hover {
                    border-color: var(--color-primary);
                    background: rgba(34, 197, 94, 0.05);
                    transform: translateY(-8px);
                }

                .product-card-image {
                    width: 100%;
                    background: rgba(255,255,255,0.03);
                    border-radius: 16px;
                    margin-bottom: 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    position: relative;
                    height: 250px; /* Fixed height for better mobile stability */
                }

                @media (min-width: 641px) {
                    .product-card-image {
                        height: auto;
                        aspect-ratio: 1/1;
                    }
                }

                .product-card-image img {
                    max-width: 90%;
                    max-height: 90%;
                    object-fit: contain;
                    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .product-card:hover .product-card-image img {
                    transform: scale(1.1) rotate(-2deg);
                }

                .product-card-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    margin-bottom: 2rem;
                }

                .product-card-name {
                    font-size: 1.5rem;
                    font-weight: 900;
                    margin: 0;
                    text-transform: uppercase;
                    letter-spacing: -0.01em;
                }

                .product-card-tag {
                    font-size: 0.65rem;
                    font-weight: 800;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    color: var(--color-primary);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .product-card-desc {
                    font-size: 0.85rem;
                    color: var(--color-text-muted);
                    line-height: 1.6;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .explore-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 0.75rem;
                    font-weight: 900;
                    letter-spacing: 0.1em;
                    color: var(--color-text);
                    text-transform: uppercase;
                    transition: all 0.3s ease;
                }

                .product-card:hover .explore-btn {
                    color: var(--color-primary);
                }

                .product-card:hover .explore-btn svg {
                    transform: translateX(5px);
                }
            `}</style>

            <div className="container">
                <header className="catalog-hero">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="catalog-subtitle">Energy Standards</span>
                        <h1 className="catalog-title">Solar <br /><span style={{ color: 'var(--color-primary)' }}>Solutions</span></h1>
                        <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.8, fontSize: '0.95rem' }}>
                            Advanced engineering meets sustainable power. Explore our next-generation solar ecosystems built for reliability and global impact.
                        </p>
                    </motion.div>
                </header>

                <main>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '10rem 0', color: 'var(--color-text-muted)' }}>
                            <div className="animate-spin" style={{ width: '40px', height: '40px', border: '2px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', margin: '0 auto 2rem' }}></div>
                            <p style={{ letterSpacing: '0.2em', fontSize: '0.8rem', fontWeight: '800' }}>LOADING ECOSYSTEM...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '10rem 0', color: 'var(--color-text-muted)' }}>
                            <FaLayerGroup size={40} style={{ marginBottom: '1.5rem', opacity: 0.2 }} />
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.5rem' }}>NO PRODUCTS FOUND</h3>
                            <p style={{ fontSize: '0.8rem' }}>Check back soon for our next-generation solar updates.</p>
                        </div>
                    ) : (
                        <div className="product-grid">
                            {products.map((product, idx) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <Link to={`/product/${product.id}`} className="product-card">
                                        <div className="product-card-image">
                                            <img
                                                src={product.imageUrl || 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=400'}
                                                alt={product.name}
                                            />
                                        </div>
                                        <div className="product-card-info">
                                            <span className="product-card-tag">
                                                <FaBolt size={10} /> {product.category || "INDUSTRIAL"}
                                            </span>
                                            <h3 className="product-card-name">{product.name}</h3>
                                            <p className="product-card-desc">
                                                {product.description || "High-performance solar module optimized for decentralized power grids."}
                                            </p>
                                        </div>
                                        <div className="explore-btn">
                                            View Details <FaArrowRight />
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Catalog;
