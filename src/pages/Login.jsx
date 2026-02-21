import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/admin/dashboard');
        } catch (err) {
            let message = 'Invalid credentials. Please try again.';
            if (err.code === 'auth/user-not-found') {
                message = 'No user found with this email.';
            } else if (err.code === 'auth/wrong-password') {
                message = 'Incorrect password.';
            } else if (err.code === 'auth/invalid-email') {
                message = 'Invalid email format.';
            } else if (err.code === 'auth/too-many-requests') {
                message = 'Too many failed attempts. Please try again later.';
            } else if (err.code === 'auth/invalid-credential') {
                message = 'Invalid email or password.';
            }
            setError(message);
            console.error("Login error:", err.code, err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--color-bg-alt)',
            marginTop: '-80px' // Offset for main margin
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card"
                style={{ width: '100%', maxWidth: '400px', padding: '3rem' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 className="heading-sm">Admin Access</h2>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Enter your credentials to manage the site</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'grid', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--color-text)' }}>Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@ztabor.com"
                            style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', outline: 'none', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--color-text)' }}>Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', outline: 'none', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
                        />
                    </div>

                    {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', textAlign: 'center' }}>{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
