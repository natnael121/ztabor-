import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaHome, FaBox, FaNewspaper, FaEnvelope, FaUserCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const BottomNav = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', icon: <FaHome />, label: 'Home' },
        { path: '/catalog', icon: <FaBox />, label: 'Catalog' },
        { path: '/blog', icon: <FaNewspaper />, label: 'News' },
        { path: '/contact', icon: <FaEnvelope />, label: 'Contact' },
        { path: '/about-us', icon: <FaUserCircle />, label: 'About' },
    ];

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(17, 17, 17, 0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '0.5rem 0.75rem',
            paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                maxWidth: '500px',
                margin: '0 auto',
            }}>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path ||
                        (item.path === '/catalog' && location.pathname.startsWith('/product'));

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.2rem',
                                padding: '0.5rem 0.75rem',
                                borderRadius: '1rem',
                                textDecoration: 'none',
                                position: 'relative',
                                minWidth: '60px',
                                transition: 'all 0.25s ease',
                            }}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="bottomNavIndicator"
                                    style={{
                                        position: 'absolute',
                                        top: '-2px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '24px',
                                        height: '3px',
                                        backgroundColor: 'var(--color-primary)',
                                        borderRadius: '2px',
                                    }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                            <span style={{
                                fontSize: '1.25rem',
                                color: isActive ? 'var(--color-primary)' : 'rgba(255,255,255,0.4)',
                                transition: 'color 0.25s ease',
                            }}>
                                {item.icon}
                            </span>
                            <span style={{
                                fontSize: '0.65rem',
                                fontWeight: isActive ? '700' : '500',
                                color: isActive ? 'var(--color-primary)' : 'rgba(255,255,255,0.4)',
                                letterSpacing: '0.04em',
                                transition: 'all 0.25s ease',
                            }}>
                                {item.label}
                            </span>
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
