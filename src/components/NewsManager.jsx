import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../lib/firebase';
import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot,
    deleteDoc,
    doc,
    updateDoc,
    getDoc,
    where,
    getDocs
} from 'firebase/firestore';
import { FaImage, FaPlus, FaTimes, FaNewspaper, FaEdit, FaTrash, FaTelegramPlane, FaCheckCircle, FaDownload, FaSync } from 'react-icons/fa';
import TelegramService from '../services/telegram';

const NewsManager = ({ isDarkMode }) => {
    const theme = {
        bg: isDarkMode ? '#1F2937' : '#FFFFFF',
        cardBg: isDarkMode ? '#374151' : '#F9FAFB',
        text: isDarkMode ? '#F9FAFB' : '#000000',
        textMuted: isDarkMode ? '#9CA3AF' : '#1a1a1a',
        border: isDarkMode ? '#4B5563' : '#cbd5e1',
        inputBg: isDarkMode ? '#374151' : '#FFFFFF',
        accent: '#D4F462',
    };
    // Form States
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('BUSINESS');
    const [customCategory, setCustomCategory] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [postToTelegramChecked, setPostToTelegramChecked] = useState(false);
    const [telegramConfig, setTelegramConfig] = useState(null);

    // Management States
    const [newsPosts, setNewsPosts] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [categories, setCategories] = useState(['BUSINESS', 'CONSTRUCTION', 'IMPORT', 'EXPORT']);
    const [showCategoryInput, setShowCategoryInput] = useState(false);

    // Telegram Sync States
    const [showSyncModal, setShowSyncModal] = useState(false);
    const [syncLoading, setSyncLoading] = useState(false);
    const [tgUpdates, setTgUpdates] = useState([]);

    // Fetch News Posts and Telegram Settings
    useEffect(() => {
        const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const posts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNewsPosts(posts);

            // Extract unique categories from posts
            const existingCats = [...new Set(posts.map(p => p.category))];
            setCategories(prev => [...new Set([...prev, ...existingCats])]);
        });

        const fetchTgSettings = async () => {
            const docRef = doc(db, 'settings', 'telegram');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setTelegramConfig(docSnap.data());
            }
        };
        fetchTgSettings();

        return () => unsubscribe();
    }, []);

    const uploadUrlToImgBB = async (imageUrl) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const formData = new FormData();
            formData.append('image', blob);
            const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
            const uploadRes = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                method: 'POST',
                body: formData,
            });
            const data = await uploadRes.json();
            if (data.success) return data.data.url;
            return null;
        } catch (error) {
            console.error('Failed to proxy upload to ImgBB:', error);
            return null;
        }
    };

    const processAutoSync = useCallback(async (updates, config) => {
        const tg = new TelegramService(config.botToken);
        for (const u of updates) {
            const msg = u.channel_post || u.message;
            if (!msg) continue;

            const updateId = u.update_id.toString();
            // Check if already exists
            const q = query(collection(db, 'news'), where('tgUpdateId', '==', updateId));
            const existing = await getDocs(q);

            if (existing.empty && (msg.text || msg.caption)) {
                let imageUrl = '';
                if (msg.photo) {
                    const fileId = msg.photo[msg.photo.length - 1].file_id;
                    const filePath = await tg.getFile(fileId);
                    const tgUrl = tg.getFileLink(filePath);
                    imageUrl = await uploadUrlToImgBB(tgUrl) || '';
                }

                const text = msg.text || msg.caption || '';
                const lines = text.split('\n');
                const title = lines[0].substring(0, 100);
                const date = new Date(msg.date * 1000).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();

                await addDoc(collection(db, 'news'), {
                    title,
                    category: 'TELEGRAM',
                    excerpt: text,
                    imageUrl,
                    date,
                    tgUpdateId: updateId,
                    createdAt: serverTimestamp()
                });
            }
        }
    }, []);

    const fetchTelegramUpdates = useCallback(async (isAuto = false) => {
        if (!telegramConfig || !telegramConfig.botToken) return;

        if (!isAuto) setSyncLoading(true);
        try {
            const tg = new TelegramService(telegramConfig.botToken);
            const updates = await tg.getUpdates();

            if (telegramConfig.autoSync && isAuto) {
                await processAutoSync(updates, telegramConfig);
            }

            const processed = await Promise.all(updates.map(async u => {
                const msg = u.channel_post || u.message;
                if (!msg) return null;

                let imageUrl = '';
                if (msg.photo) {
                    const fileId = msg.photo[msg.photo.length - 1].file_id;
                    const filePath = await tg.getFile(fileId);
                    imageUrl = tg.getFileLink(filePath);
                }

                return {
                    id: u.update_id,
                    text: msg.text || msg.caption || '',
                    date: new Date(msg.date * 1000).toLocaleString(),
                    imageUrl: imageUrl,
                    photoId: msg.photo ? msg.photo[msg.photo.length - 1].file_id : null
                };
            }));

            setTgUpdates(processed.filter(u => u && u.text));
        } catch (error) {
            console.error('Updates fetch failed:', error);
        } finally {
            if (!isAuto) setSyncLoading(false);
        }
    }, [telegramConfig, processAutoSync]);

    // Auto Sync Trigger
    useEffect(() => {
        if (telegramConfig?.autoSync) {
            fetchTelegramUpdates(true);
            const interval = setInterval(() => fetchTelegramUpdates(true), 60000); // Poll every minute
            return () => clearInterval(interval);
        }
    }, [telegramConfig, fetchTelegramUpdates]);

    const handleImportPost = async (tgPost) => {
        setLoading(true);
        const lines = tgPost.text.split('\n');
        setTitle(lines[0].substring(0, 100));
        setExcerpt(tgPost.text);

        if (tgPost.imageUrl) {
            setMessage('Importing image...');
            const permanentUrl = await uploadUrlToImgBB(tgPost.imageUrl);
            setPreviewUrl(permanentUrl || '');
        }

        setShowSyncModal(false);
        setLoading(false);
        setMessage('Imported from Telegram! Structure preserved. Please add a category and publish.');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const addCategory = () => {
        if (customCategory && !categories.includes(customCategory.toUpperCase())) {
            const newCat = customCategory.toUpperCase();
            setCategories([...categories, newCat]);
            setCategory(newCat);
            setCustomCategory('');
            setShowCategoryInput(false);
        }
    };

    const uploadImageToImgBB = async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        if (data.success) return data.data.url;
        throw new Error('Image upload failed');
    };

    const handlePostToTelegram = async (post) => {
        if (!telegramConfig || !telegramConfig.botToken || !telegramConfig.channelId) {
            alert('Please configure Telegram settings first in the Settings tab.');
            return false;
        }

        try {
            const tg = new TelegramService(telegramConfig.botToken);
            await tg.sendNewsPost(telegramConfig.channelId, {
                title: post.title,
                excerpt: post.excerpt,
                imageUrl: post.imageUrl,
                category: post.category
            });
            return true;
        } catch (error) {
            console.error(error);
            alert('Failed to send to Telegram. Check your bot token and channel ID.');
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            let imageUrl = previewUrl; // Keep existing if editing
            if (imageFile) {
                setMessage('Uploading image...');
                imageUrl = await uploadImageToImgBB(imageFile);
            }

            const postData = {
                title,
                category,
                excerpt,
                imageUrl,
                updatedAt: serverTimestamp()
            };

            let finalPost = null;

            if (editingId) {
                setMessage('Updating news...');
                await updateDoc(doc(db, 'news', editingId), postData);
                finalPost = { ...postData, id: editingId };
                setMessage('News updated successfully!');
            } else {
                setMessage('Publishing news...');
                const date = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();
                const newPost = {
                    ...postData,
                    date,
                    createdAt: serverTimestamp()
                };
                const docRef = await addDoc(collection(db, 'news'), newPost);
                finalPost = { ...newPost, id: docRef.id };
                setMessage('News published successfully!');
            }

            if (postToTelegramChecked && finalPost) {
                setMessage('Sending to Telegram...');
                await handlePostToTelegram(finalPost);
                setMessage(prev => prev + ' (Also shared on Telegram)');
            }

            resetForm();
        } catch (error) {
            console.error(error);
            setMessage('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setExcerpt('');
        setImageFile(null);
        setPreviewUrl('');
        setEditingId(null);
        setCategory('BUSINESS');
        setPostToTelegramChecked(false);
    };

    const handleEdit = (post) => {
        setEditingId(post.id);
        setTitle(post.title);
        setCategory(post.category);
        setExcerpt(post.excerpt);
        setPreviewUrl(post.imageUrl || '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this news post?')) {
            try {
                await deleteDoc(doc(db, 'news', id));
                setMessage('Post deleted successfully.');
            } catch (error) {
                console.error(error);
                setMessage('Error deleting post.');
            }
        }
    };

    return (
        <div style={{ paddingBottom: '4rem' }}>
            {/* Form Card */}
            <div className="card" style={{ padding: '2.5rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h3 className="heading-sm" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', color: theme.text }}>
                        <FaNewspaper className="text-primary" /> {editingId ? 'Edit News Post' : 'Create News Post'}
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            type="button"
                            onClick={() => { setShowSyncModal(true); fetchTelegramUpdates(); }}
                            className="btn-secondary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                        >
                            <FaDownload /> Import from Telegram
                        </button>
                        {editingId && (
                            <button onClick={resetForm} style={{ fontSize: '0.8rem', color: '#EF4444', fontWeight: '600' }}>Cancel Edit</button>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: theme.textMuted }}>Headline / Title</label>
                        <input
                            type="text" required value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Headline..."
                            style={{ padding: '0.8rem', borderRadius: '0.5rem', border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, color: theme.text }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: theme.textMuted }}>Category</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {!showCategoryInput ? (
                                <>
                                    <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ flex: 1, padding: '0.8rem', borderRadius: '0.5rem', border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, color: theme.text }}>
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                    <button type="button" onClick={() => setShowCategoryInput(true)} className="btn-secondary" style={{ padding: '0.8rem' }}><FaPlus /></button>
                                </>
                            ) : (
                                <>
                                    <input type="text" placeholder="New category..." value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} style={{ flex: 1, padding: '0.8rem', borderRadius: '0.5rem', border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, color: theme.text }} />
                                    <button type="button" onClick={addCategory} className="btn-primary" style={{ padding: '0.8rem 1.2rem' }}>Add</button>
                                    <button type="button" onClick={() => setShowCategoryInput(false)} className="btn-secondary" style={{ padding: '0.8rem' }}><FaTimes /></button>
                                </>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: theme.textMuted }}>Featured Image</label>
                        <div
                            style={{ border: `2px dashed ${theme.border}`, borderRadius: '1rem', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', backgroundColor: theme.cardBg }}
                            onClick={() => document.getElementById('news-image').click()}
                        >
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '0.5rem' }} />
                            ) : (
                                <div style={{ color: '#9CA3AF' }}><FaImage size={30} style={{ marginBottom: '0.5rem' }} /><p style={{ fontSize: '0.8rem' }}>Upload Image</p></div>
                            )}
                            <input type="file" id="news-image" hidden accept="image/*" onChange={handleImageChange} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: theme.textMuted }}>Post content / Summary</label>
                        <textarea rows="4" required value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Content..." style={{ padding: '0.8rem', borderRadius: '0.5rem', border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, color: theme.text, resize: 'none' }}></textarea>
                    </div>

                    {/* Telegram Option */}
                    <div style={{ padding: '1rem', backgroundColor: '#F0F7FF', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <input
                            type="checkbox"
                            id="tg-post"
                            checked={postToTelegramChecked}
                            onChange={(e) => setPostToTelegramChecked(e.target.checked)}
                            style={{ width: '1.2rem', height: '1.2rem' }}
                        />
                        <label htmlFor="tg-post" style={{ fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <FaTelegramPlane color="#0088cc" /> Post also to Telegram Channel
                        </label>
                    </div>

                    {message && (
                        <div style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: message.includes('success') ? '#ECFDF5' : '#FEF2F2', color: message.includes('success') ? '#065F46' : '#991B1B', fontSize: '0.85rem', textAlign: 'center' }}>
                            {message}
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                        {loading ? 'Processing...' : (editingId ? 'Update Post' : 'Publish to Tabor Times')}
                    </button>
                </form>
            </div>

            {/* List Card */}
            <div className="card" style={{ marginTop: '3rem', padding: '2.5rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h3 className="heading-sm" style={{ color: theme.text }}>Manage Existing News</h3>
                    <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                        {telegramConfig ? <span style={{ color: '#059669', fontWeight: '600' }}><FaCheckCircle /> Telegram Connected</span> : <span>Telegram Not Configured</span>}
                    </div>
                </div>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {newsPosts.length === 0 ? (
                        <p style={{ color: theme.textMuted, fontStyle: 'italic' }}>No news posts found.</p>
                    ) : (
                        newsPosts.map(post => (
                            <div key={post.id} style={{ display: 'flex', gap: '1.5rem', padding: '1rem', border: `1px solid ${theme.border}`, borderRadius: '0.75rem', alignItems: 'center' }}>
                                <div style={{ width: '80px', height: '60px', backgroundColor: theme.cardBg, borderRadius: '0.4rem', overflow: 'hidden', flexShrink: 0 }}>
                                    {post.imageUrl && <img src={post.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.25rem', color: theme.text }}>{post.title}</h4>
                                    <div style={{ fontSize: '0.75rem', color: theme.textMuted }}>
                                        <span style={{ fontWeight: '700', color: 'var(--color-primary)' }}>{post.category}</span> • {post.date}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button
                                        onClick={() => handlePostToTelegram(post)}
                                        title="Send to Telegram"
                                        style={{ color: '#0088cc', backgroundColor: '#F0F9FF', border: '1px solid #B9E6FE', padding: '0.4rem 0.6rem', borderRadius: '0.4rem', fontSize: '0.8rem', fontWeight: '600' }}
                                    >
                                        <FaTelegramPlane /> Share
                                    </button>
                                    <button onClick={() => handleEdit(post)} style={{ color: '#3B82F6', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: '600' }}>
                                        <FaEdit /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(post.id)} style={{ color: '#EF4444', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: '600' }}>
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Sync Modal */}
            {showSyncModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <div className="card" style={{ maxWidth: '600px', width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 className="heading-sm" style={{ margin: 0 }}>Latest Telegram Messages</h3>
                            <button onClick={() => setShowSyncModal(false)}><FaTimes /></button>
                        </div>

                        {syncLoading ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}>
                                <FaSync className="animate-spin" size={30} style={{ marginBottom: '1rem', color: 'var(--color-primary)' }} />
                                <p>Fetching data from Telegram...</p>
                            </div>
                        ) : tgUpdates.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                                <p>No recent messages found. Note: Telegram only keeps messages from the last 24 hours for bot fetching.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {tgUpdates.map(u => (
                                    <div key={u.id} style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '0.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.75rem', color: '#9CA3AF' }}>
                                            <span>{u.date}</span>
                                        </div>
                                        {u.imageUrl && (
                                            <img src={u.imageUrl} alt="" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '0.5rem' }} />
                                        )}
                                        <p style={{ fontSize: '0.85rem', color: '#374151', whiteSpace: 'pre-wrap', marginBottom: '1rem' }}>
                                            {u.text.substring(0, 200)}{u.text.length > 200 ? '...' : ''}
                                        </p>
                                        <button
                                            onClick={() => handleImportPost(u)}
                                            className="btn-primary"
                                            style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem' }}
                                        >
                                            Use this Content
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewsManager;
