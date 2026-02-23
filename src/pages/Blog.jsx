import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';
import { FaCalendarAlt, FaUser, FaArrowRight, FaTag } from 'react-icons/fa';

const Blog = () => {
    const [newsPosts, setNewsPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const posts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNewsPosts(posts);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const getPlaceholder = (category) => {
        const cat = category?.toUpperCase();
        if (cat?.includes('TECH')) return 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80';
        if (cat?.includes('EVENT')) return 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80';
        return 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b0?auto=format&fit=crop&w=800&q=80';
    };

    // Fallback data if no firebase data
    const allPosts = newsPosts.length > 0 ? newsPosts : [
        {
            id: 'p1',
            title: "Tabor Solar Unveils New High-Efficiency Panel Series",
            category: "TECHNOLOGY",
            author: "Tabor Press",
            date: "FEB 15, 2026",
            imageUrl: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80",
            excerpt: "Our latest R&D breakthrough achieves 28% efficiency in low-light conditions, setting a new industry standard for residential solar solutions."
        },
        {
            id: 'p2',
            title: "Partnership Announcement: Green Grid Initiative",
            category: "PARTNERSHIP",
            author: "Admin",
            date: "JAN 28, 2026",
            imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
            excerpt: "We are proud to join forces with the National Green Grid Initiative to supply sustainable power to over 5000 rural homes."
        },
        {
            id: 'p3',
            title: "2025 Sustainability Report Released",
            category: "CORPORATE",
            date: "JAN 10, 2026",
            imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80",
            excerpt: "Transparency is key. Read our full report on carbon offsetting, manufacturing ethics, and our roadmap to net-zero."
        }
    ];

    const featuredPost = selectedPost || allPosts[0];
    const otherPosts = allPosts.filter(p => p.id !== featuredPost?.id);

    return (
        <div className="news-page-wrapper">
            <SEO
                title="News & Updates - Z-Tabor Solar"
                description="Latest stories, product announcements, and industry insights from Z-Tabor Solar."
            />

            <style>{`
                .news-page-wrapper {
                    background-color: var(--color-bg);
                    color: var(--color-text);
                    font-family: 'Inter', sans-serif;
                    overflow-x: hidden;
                }

                .news-header {
                    min-height: 250px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    background: radial-gradient(circle at 50% 0%, var(--color-primary-glow) 0%, var(--color-bg) 80%);
                    text-align: center;
                    position: relative;
                    padding: 4rem 1.5rem 2rem;
                }

                .news-header h1 {
                    font-size: clamp(2.5rem, 5vw, 4rem);
                    font-weight: 900;
                    margin-bottom: 0.5rem;
                }

                .news-header p {
                    color: var(--color-text-muted);
                    font-size: 1rem;
                    max-width: 600px;
                    padding: 0 1rem;
                }

                .featured-section {
                    padding: 4rem 1.5rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .featured-card {
                    display: grid;
                    grid-template-columns: 1.2fr 1fr;
                    background: var(--color-surface);
                    border: 1px solid var(--color-border);
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.1);
                    transition: transform 0.3s ease;
                }
                .featured-card:hover { transform: translateY(-5px); border-color: rgba(34, 197, 94, 0.3); }

                .featured-img-wrap {
                    height: 100%;
                    min-height: 400px;
                    position: relative;
                }
                .featured-img-wrap img { width: 100%; height: 100%; object-fit: cover; }

                .featured-content {
                    padding: 2.5rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .grid-section {
                    padding: 0 1.5rem 6rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .news-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 2rem;
                }

                .news-card {
                    background: var(--color-surface);
                    border-radius: 20px;
                    overflow: hidden;
                    border: 1px solid var(--color-border);
                    transition: all 0.3s ease;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                }
                
                .news-card:hover {
                    transform: translateY(-8px);
                    border-color: rgba(34, 197, 94, 0.3);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                }

                .news-card-img {
                    height: 220px;
                    overflow: hidden;
                }
                .news-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
                .news-card:hover .news-card-img img { transform: scale(1.05); }

                .news-card-body {
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                }

                .tag-date {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.75rem;
                    color: var(--color-text-muted);
                    margin-bottom: 1rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .tag-pill {
                    color: var(--color-primary);
                    background: rgba(34, 197, 94, 0.1);
                    padding: 0.2rem 0.6rem;
                    border-radius: 4px;
                    font-weight: 700;
                }

                .read-more-btn {
                    margin-top: auto;
                    color: var(--color-primary);
                    text-decoration: none;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.9rem;
                    padding-top: 1rem;
                }

                .newsletter-section {
                    padding: 6rem 2rem;
                    text-align: center;
                    background: radial-gradient(circle at 50% 100%, rgba(34, 197, 94, 0.1) 0%, transparent 60%);
                }

                .newsletter-input-group {
                    display: flex;
                    max-width: 500px;
                    margin: 2rem auto 0;
                    gap: 1rem;
                }

                .newsletter-input {
                    flex: 1;
                    background: var(--color-surface);
                    border: 1px solid var(--color-border);
                    padding: 1rem 1.5rem;
                    border-radius: 30px;
                    color: var(--color-text);
                    outline: none;
                }

                .btn-subscribe {
                    background: var(--color-primary);
                    color: black;
                    border: none;
                    padding: 0 2rem;
                    border-radius: 30px;
                    font-weight: 700;
                    cursor: pointer;
                }

                @media (max-width: 1024px) {
                    .featured-card { grid-template-columns: 1fr; }
                    .featured-img-wrap { min-height: 300px; }
                    .featured-content { padding: 2rem; }
                }

                @media (max-width: 768px) {
                    .news-header h1 { font-size: 2.5rem; }
                    .featured-section { padding: 2rem 1.25rem; }
                    .grid-section { padding: 0 1.25rem 4rem; }
                    .newsletter-section { padding: 4rem 1.25rem; }
                    .newsletter-input-group { flex-direction: column; }
                }
            `}</style>

            {/* Header */}
            <div className="news-header">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1>News & Insights</h1>
                    <p>Updates, sustainability stories, and technical breakthroughs from Tabor Solar.</p>
                </motion.div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>Loading Articles...</div>
            ) : (
                <>
                    {/* Featured Article */}
                    <div className="featured-section">
                        <div style={{ marginBottom: '2rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>• Featured Story</div>
                        <motion.div className="featured-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                            <div className="featured-img-wrap">
                                <img src={featuredPost.imageUrl || getPlaceholder(featuredPost.category)} alt={featuredPost.title} />
                            </div>
                            <div className="featured-content">
                                <div className="tag-date" style={{ justifyContent: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <span className="tag-pill">{featuredPost.category || 'NEWS'}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaCalendarAlt /> {featuredPost.date}</span>
                                </div>
                                <h2 style={{ fontSize: '2rem', fontWeight: '800', lineHeight: 1.2, marginBottom: '1rem', color: 'var(--color-text)' }}>{featuredPost.title}</h2>
                                <p style={{ color: 'var(--color-text-dim)', lineHeight: 1.7, marginBottom: '2rem' }}>{featuredPost.excerpt}</p>
                                <a href="#" className="read-more-btn" style={{ fontSize: '1rem' }}>Read Full Article <FaArrowRight /></a>
                            </div>
                        </motion.div>
                    </div>

                    {/* News Grid */}
                    <div className="grid-section">
                        <div style={{ marginBottom: '2rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>• Recent Updates</div>
                        <div className="news-grid">
                            {otherPosts.map((post, i) => (
                                <motion.div
                                    className="news-card"
                                    key={post.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => setSelectedPost(post)}
                                >
                                    <div className="news-card-img">
                                        <img src={post.imageUrl || getPlaceholder(post.category)} alt={post.title} />
                                    </div>
                                    <div className="news-card-body">
                                        <div className="tag-date">
                                            <span style={{ color: 'var(--color-primary)', fontWeight: '700' }}>{post.category || 'NEWS'}</span>
                                            <span>{post.date}</span>
                                        </div>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.75rem', lineHeight: 1.3 }}>{post.title}</h3>
                                        <p style={{ fontSize: '0.9rem', color: '#888', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {post.excerpt}
                                        </p>
                                        <div className="read-more-btn">
                                            Read More <FaArrowRight />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Newsletter */}
            <section className="newsletter-section">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem', color: 'var(--color-text)' }}>Join the Network</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>Subscribe to get the latest solar technology breakthroughs directly to your inbox.</p>

                    <div className="newsletter-input-group">
                        <input type="email" placeholder="Your email" className="newsletter-input" />
                        <button className="btn-subscribe">Sign Up</button>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default Blog;
