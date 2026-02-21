import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FaTelegram, FaSave, FaCheckCircle, FaRobot, FaHashtag, FaSyncAlt } from 'react-icons/fa';

const TelegramSettings = ({ isDarkMode }) => {
    const theme = {
        bg: isDarkMode ? '#1F2937' : '#FFFFFF',
        cardBg: isDarkMode ? '#374151' : '#F9FAFB',
        text: isDarkMode ? '#F9FAFB' : '#000000',
        textMuted: isDarkMode ? '#9CA3AF' : '#1a1a1a',
        border: isDarkMode ? '#4B5563' : '#cbd5e1',
        inputBg: isDarkMode ? '#374151' : '#FFFFFF',
        accent: '#D4F462',
    };
    const [botToken, setBotToken] = useState('');
    const [channelId, setChannelId] = useState('');
    const [autoSync, setAutoSync] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            const docRef = doc(db, 'settings', 'telegram');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setBotToken(data.botToken || '');
                setChannelId(data.channelId || '');
                setAutoSync(data.autoSync || false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            await setDoc(doc(db, 'settings', 'telegram'), {
                botToken,
                channelId,
                autoSync,
                updatedAt: new Date()
            }, { merge: true });
            setMessage('Settings saved successfully!');
        } catch (error) {
            console.error(error);
            setMessage('Error saving settings.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ padding: '2.5rem', maxWidth: '600px', margin: '0 auto', backgroundColor: theme.bg, border: `1px solid ${theme.border}` }}>
            <h3 className="heading-sm" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: theme.text }}>
                <FaTelegram className="text-primary" /> Telegram Notification Settings
            </h3>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', color: theme.textMuted }}>
                        <FaRobot /> Bot Token
                    </label>
                    <input
                        type="password"
                        value={botToken}
                        onChange={(e) => setBotToken(e.target.value)}
                        placeholder="Enter your Telegram Bot Token"
                        style={{ padding: '0.8rem', borderRadius: '0.5rem', border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, color: theme.text }}
                    />
                    <p style={{ fontSize: '0.7rem', color: theme.textMuted }}>Get this from @BotFather on Telegram</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', color: theme.textMuted }}>
                        <FaHashtag /> Channel/Group Chat ID
                    </label>
                    <input
                        type="text"
                        value={channelId}
                        onChange={(e) => setChannelId(e.target.value)}
                        placeholder="e.g. -1001234567890"
                        style={{ padding: '0.8rem', borderRadius: '0.5rem', border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, color: theme.text }}
                    />
                    <p style={{ fontSize: '0.7rem', color: theme.textMuted }}>The unique ID of the channel where news will be posted</p>
                </div>

                <div style={{
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    backgroundColor: '#F0F9FF',
                    border: '1px solid #B9E6FE',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <input
                        type="checkbox"
                        id="autoSync"
                        checked={autoSync}
                        onChange={(e) => setAutoSync(e.target.checked)}
                        style={{ width: '1.2rem', height: '1.2rem' }}
                    />
                    <div>
                        <label htmlFor="autoSync" style={{ fontSize: '0.9rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FaSyncAlt /> Enable Background Auto-Sync
                        </label>
                        <p style={{ fontSize: '0.75rem', color: '#0369A1', marginTop: '0.2rem' }}> Automatically fetch and post news from Telegram when you visit the dashboard.</p>
                    </div>
                </div>

                {message && (
                    <div style={{
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        backgroundColor: message.includes('success') ? '#ECFDF5' : '#FEF2F2',
                        color: message.includes('success') ? '#065F46' : '#991B1B',
                        fontSize: '0.85rem',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}>
                        {message.includes('success') && <FaCheckCircle />} {message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                >
                    <FaSave /> {loading ? 'Saving...' : 'Save Configuration'}
                </button>
            </form>

            <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: theme.cardBg, borderRadius: '0.5rem', fontSize: '0.8rem', color: theme.textMuted, lineHeight: '1.5' }}>
                <strong>How to setup:</strong>
                <ol style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                    <li>Create a bot with @BotFather and copy the API Token.</li>
                    <li>Create a Telegram Channel or Group and add your bot as an admin.</li>
                    <li>Send a test message in the channel and use @IDBot to find your Chat ID.</li>
                    <li>Enter both values above and save.</li>
                </ol>
            </div>
        </div>
    );
};

export default TelegramSettings;
