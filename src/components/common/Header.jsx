import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSearch, FaMoon, FaSun } from 'react-icons/fa';

import logoImg from '../../assets/photo_5784881328204484076_x.jpg';

const Header = ({ theme, toggleTheme }) => {
    const location = useLocation();

    // Check if link is active
    const isActive = (path) => location.pathname === path;

    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.5rem 4rem',
            zIndex: 100,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: 'transparent'
        }}>
            <style>{`
                .nav-links {
                    display: flex;
                    align-items: center;
                    gap: 3rem;
                    text-transform: uppercase;
                    font-size: 0.7rem;
                    font-weight: 700;
                    letter-spacing: 0.15em;
                    color: var(--color-text-muted);
                }
                .nav-links a { 
                    color: inherit; 
                    text-decoration: none; 
                    transition: all 0.3s ease;
                    position: relative;
                    padding-bottom: 4px;
                }
                .nav-links a:hover { color: var(--color-primary); }
                .nav-links a.active { 
                    color: var(--color-primary); 
                    border-bottom: 2px solid var(--color-primary);
                }

                .theme-toggle {
                    background: var(--color-surface);
                    border: 1px solid var(--color-border);
                    color: var(--color-text);
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 1.1rem;
                }
                .theme-toggle:hover {
                    background: var(--color-primary);
                    color: white;
                    border-color: var(--color-primary);
                }

                @media (max-width: 1024px) {
                    .nav-links { display: none; }
                }
            `}</style>

            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: 'var(--color-text)' }}>
                <img src={logoImg} alt="Tabor Solar" style={{ height: '45px', objectFit: 'contain', filter: theme === 'light' ? 'none' : 'invert(0)' }} />
                <span style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '0.15em', fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>TABOR</span>
            </Link>

            <nav className="nav-links">
                <Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link>
                <Link to="/catalog" className={isActive('/catalog') ? 'active' : ''}>Products</Link>
                <Link to="/blog" className={isActive('/blog') ? 'active' : ''}>News</Link>
                <Link to="/about-us" className={isActive('/about-us') ? 'active' : ''}>About Us</Link>
                <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>Support</Link>

                <button className="theme-toggle" onClick={toggleTheme}>
                    {theme === 'dark' ? <FaSun /> : <FaMoon />}
                </button>
            </nav>
        </header >
    );
};

export default Header;
