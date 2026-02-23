import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import logoImg from '../../assets/photo_5784881328204484076_x.jpg';

const Footer = () => {
    return (
        <footer style={{
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            padding: '6rem 4rem 4rem',
            borderTop: '1px solid var(--color-border)',
            position: 'relative',
            zIndex: 10
        }} className="main-footer">
            <style>{`
                @media (max-width: 768px) {
                    .main-footer { padding: 4rem 1.5rem 6rem !important; }
                    .footer-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
                    .footer-brand-section { text-align: center; align-items: center; }
                    .footer-brand-section .brand-link { justify-content: center; }
                    .footer-brand-section .social-links { justify-content: center; }
                }
            `}</style>

            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div className="footer-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '4rem',
                    marginBottom: '4rem'
                }}>
                    {/* Brand Section */}
                    <div className="footer-brand-section">
                        <Link to="/" className="brand-link" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem', textDecoration: 'none', color: 'var(--color-text)' }}>
                            <img src={logoImg} alt="Z-Tabor Solar" style={{ height: '35px' }} />
                            <span style={{ fontSize: '1.1rem', fontWeight: '800', fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>Z-TABOR</span>
                        </Link>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                            Advanced solar technology and sustainable energy solutions for home, business, and industry. Powering Ethiopia's future.
                        </p>
                        <div className="social-links" style={{ display: 'flex', gap: '1rem' }}>
                            {[FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn].map((Icon, i) => (
                                <a key={i} href="#" style={{
                                    width: '35px', height: '35px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--color-surface)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--color-text)', transition: 'all 0.3s ease'
                                }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-surface)'}>
                                    <Icon size={14} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ color: 'var(--color-text)', marginBottom: '1.5rem', fontSize: '1rem' }}>Company</h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <li><Link to="/about-us" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>About Us</Link></li>
                            <li><Link to="/catalog" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Products</Link></li>
                            <li><Link to="/blog" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>News & Insights</Link></li>
                            <li><Link to="/contact" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Contact Support</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 style={{ color: 'var(--color-text)', marginBottom: '1.5rem', fontSize: '1rem' }}>Resources</h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <li><a href="#" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Documentation</a></li>
                            <li><a href="#" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Privacy Policy</a></li>
                            <li><a href="#" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Terms of Service</a></li>
                            <li><a href="#" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Cookie Usage</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 style={{ color: 'var(--color-text)', marginBottom: '1.5rem', fontSize: '1rem' }}>Stay Updated</h4>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                            Get the latest updates on solar technology and grid innovations.
                        </p>
                        <div className="footer-brand" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <input type="email" placeholder="Email address" style={{
                                background: 'var(--color-surface)',
                                border: '1px solid var(--color-border)',
                                padding: '0.8rem 1rem',
                                borderRadius: '8px',
                                color: 'var(--color-text)',
                                width: '100%',
                                fontSize: '0.85rem',
                                outline: 'none'
                            }} />
                            <button style={{
                                backgroundColor: 'var(--color-primary)',
                                border: 'none',
                                borderRadius: '8px',
                                width: '40px',
                                color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer'
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{
                    borderTop: '1px solid var(--color-border)',
                    paddingTop: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <p style={{ color: 'var(--color-text-dim)', fontSize: '0.8rem' }}>
                        © 2026 Z TABOR TRADING P.L.C. ALL RIGHTS RESERVED.
                    </p>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></span>
                            System Operational
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
