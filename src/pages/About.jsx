import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { FaCheckCircle, FaLeaf, FaSolarPanel, FaAward, FaArrowRight, FaUsers, FaGlobe, FaShieldAlt, FaBullseye } from 'react-icons/fa';
import aboutImg from '../assets/IntelliSun 1000.png'; // Using a product image for the 'About' visual
import logoImg from '../assets/photo_5784881328204484076_x.jpg';

const About = () => {
    return (
        <div className="about-page-wrapper">
            <SEO
                title="About Us - Z Tabor Trading"
                description="Learn about Z Tabor Trading P.L.C., Ethiopia's leading partner in solar energy solutions and international trade."
            />

            <style>{`
                .about-page-wrapper {
                    background-color: var(--color-bg);
                    color: var(--color-text);
                    overflow-x: hidden;
                    font-family: 'Inter', sans-serif;
                }

                .about-header {
                    min-height: 350px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    background: radial-gradient(circle at 50% 50%, var(--color-primary-glow) 0%, var(--color-bg) 80%);
                    position: relative;
                    text-align: center;
                    padding: 4rem 1.5rem;
                }

                .about-header h1 {
                    font-size: clamp(2.5rem, 8vw, 5rem);
                    font-weight: 900;
                    margin-bottom: 1.5rem;
                    text-transform: uppercase;
                    letter-spacing: -0.02em;
                    color: var(--color-text);
                    line-height: 1;
                }

                .about-header p {
                    color: var(--color-text-dim);
                    max-width: 800px;
                    font-size: 1.1rem;
                    line-height: 1.6;
                }

                .section-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 6rem 1.5rem;
                }

                .intro-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 6rem;
                    align-items: center;
                }

                .section-label {
                    color: var(--color-primary);
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.3em;
                    font-size: 0.75rem;
                    margin-bottom: 1.5rem;
                    display: block;
                }

                .content-title {
                    font-size: clamp(2.2rem, 5vw, 3.5rem);
                    font-weight: 900;
                    line-height: 1.1;
                    margin-bottom: 2rem;
                    letter-spacing: -0.03em;
                }

                .text-p {
                    color: var(--color-text-muted);
                    font-size: 1.05rem;
                    line-height: 1.8;
                    margin-bottom: 2rem;
                }

                .v-m-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 3rem;
                    margin-top: 4rem;
                }

                .glass-v-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    padding: 2.5rem;
                    border-radius: 32px;
                    transition: all 0.4s ease;
                    position: relative;
                    overflow: hidden;
                }

                .glass-v-card:hover {
                    background: rgba(34, 197, 94, 0.05);
                    border-color: var(--color-primary-glow);
                    transform: translateY(-10px);
                }

                .glass-v-card h3 {
                    font-size: 2rem;
                    font-weight: 900;
                    margin-bottom: 1.5rem;
                    text-transform: uppercase;
                }

                .glass-v-card p {
                    color: var(--color-text-muted);
                    line-height: 1.8;
                    font-size: 1rem;
                }

                .values-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 2rem;
                    margin-top: 3rem;
                }

                .value-item {
                    background: var(--color-surface);
                    padding: 2.5rem 1.5rem;
                    border-radius: 24px;
                    border: 1px solid var(--color-border);
                    transition: all 0.3s ease;
                }

                .value-item:hover {
                    border-color: var(--color-primary);
                    transform: translateY(-5px);
                }

                .value-icon {
                    width: 60px;
                    height: 60px;
                    background: rgba(34, 197, 94, 0.1);
                    color: var(--color-primary);
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    margin-bottom: 1.5rem;
                }

                .value-item h4 {
                    font-size: 1.25rem;
                    font-weight: 800;
                    margin-bottom: 1rem;
                }

                .purpose-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 2rem;
                }

                .purpose-card {
                    background: var(--color-bg);
                    border-left: 4px solid var(--color-primary);
                    padding: 2.5rem;
                    border-radius: 0 20px 20px 0;
                    transition: all 0.3s ease;
                    border-top: 1px solid var(--color-border);
                    border-right: 1px solid var(--color-border);
                    border-bottom: 1px solid var(--color-border);
                }

                .purpose-card:hover {
                    background: var(--color-surface);
                    transform: translateX(10px);
                }

                .founder-section {
                    background: var(--color-surface);
                    padding: 6rem 1rem;
                }

                .founder-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 4rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .founder-card {
                    background: var(--color-bg);
                    border: 1px solid var(--color-border);
                    border-radius: 32px;
                    padding: 2.5rem;
                    transition: all 0.4s ease;
                }

                .founder-card:hover {
                    border-color: var(--color-primary);
                }

                .founder-role {
                    color: var(--color-primary);
                    font-weight: 800;
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    margin-bottom: 1rem;
                    display: block;
                }

                .founder-name {
                    font-size: 2rem;
                    font-weight: 900;
                    margin-bottom: 2rem;
                }

                .founder-bio {
                    list-style: none;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .founder-bio li {
                    display: flex;
                    gap: 1rem;
                    color: var(--color-text-muted);
                    font-size: 0.95rem;
                    line-height: 1.5;
                }

                .founder-bio li svg {
                    color: var(--color-primary);
                    flex-shrink: 0;
                    margin-top: 0.2rem;
                }

                @media (max-width: 1024px) {
                    .intro-grid { gap: 3rem; }
                    .founder-grid { gap: 2rem; }
                }

                @media (max-width: 768px) {
                    .intro-grid, .v-m-grid, .founder-grid { grid-template-columns: 1fr; gap: 3rem; }
                    .about-header h1 { font-size: 3rem; }
                    .section-container { padding: 4rem 1.25rem; }
                    .content-title { font-size: 2.2rem; }
                    .glass-v-card { padding: 2rem; }
                    .founder-section { padding: 4rem 0.75rem; }
                    .founder-card { padding: 1.5rem; }
                    .founder-name { font-size: 1.75rem; }
                }
            `}</style>

            {/* HERO SECTION */}
            <header className="about-header">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <span className="section-label">Established in Ethiopia</span>
                    <h1>Z Tabor Trading</h1>
                    <p>
                        A privately owned dynamic leader in Ethiopia's renewable energy,
                        construction, and agricultural export sectors.
                    </p>
                </motion.div>
            </header>

            {/* INTRO SECTION */}
            <section className="section-container">
                <div className="intro-grid">
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <span className="section-label">Our Story</span>
                        <h2 className="content-title">A Legacy of <br />Dependability</h2>
                        <p className="text-p">
                            Z Tabor Trading P.L.C. is a privately owned company based in Addis Ababa, Ethiopia.
                            It was established through the collaboration of two accomplished entrepreneurs with
                            decades of combined experience in trading, distribution, and international business.
                        </p>
                        <p className="text-p">
                            We are recognized as a dynamic and fast-growing company in the Ethiopian market,
                            specializing in the import and distribution of solar energy products, alongside
                            trading construction materials and exporting agricultural goods.
                        </p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '40px', padding: '3rem', position: 'relative' }}>
                            <img src={aboutImg} alt="Tabor Innovation" style={{ width: '100%', height: 'auto', borderRadius: '20px', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }} />
                            <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'var(--color-primary)', color: 'white', padding: '1rem 2rem', borderRadius: '20px', fontWeight: '900', fontSize: '1.5rem', boxShadow: '0 10px 30px var(--color-primary-glow)' }}>
                                10+ <span style={{ fontSize: '0.8rem', display: 'block', fontWeight: '700' }}>Years Experience</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginTop: '6rem', textAlign: 'center' }}>
                    <p className="text-p" style={{ maxWidth: '900px', margin: '0 auto', fontSize: '1.2rem' }}>
                        As Ethiopia continues to embrace renewable energy solutions, Z Tabor Trading is committed to
                        playing a key role by supplying high-quality solar technologies that are
                        reliable, efficient, and accessible.
                    </p>
                </motion.div>

                {/* VISION & MISSION */}
                <div className="v-m-grid">
                    <motion.div className="glass-v-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className="value-icon"><FaGlobe /></div>
                        <h3>Vision</h3>
                        <p>To become the most trusted and preferred partner in Ethiopia and beyond for solar energy solutions and trading services, known for our integrity, dependability, and superior product quality.</p>
                    </motion.div>
                    <motion.div className="glass-v-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                        <div className="value-icon"><FaBullseye /></div>
                        <h3>Mission</h3>
                        <p>To build a reliable and efficient sales and distribution system focused on customer satisfaction by delivering High-quality solar and trading products, competitive pricing, and exceptional customer service.</p>
                    </motion.div>
                </div>
            </section>

            {/* CORE VALUES */}
            <section style={{ background: 'var(--color-bg-alt)', padding: '10rem 0' }}>
                <div className="section-container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <span className="section-label">The Tabor Standard</span>
                        <h2 className="content-title">Our Core Values</h2>
                    </div>
                    <div className="values-grid">
                        <motion.div className="value-item" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                            <div className="value-icon"><FaUsers /></div>
                            <h4>Customer-Centricity</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>Our clients are at the center of everything we do. We actively listen, adapt to their needs, and strive to exceed expectations.</p>
                        </motion.div>
                        <motion.div className="value-item" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                            <div className="value-icon"><FaShieldAlt /></div>
                            <h4>Loyalty</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>We are committed to our company, our team, and our customers. Loyalty drives unity, trust, and shared success.</p>
                        </motion.div>
                        <motion.div className="value-item" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                            <div className="value-icon"><FaCheckCircle /></div>
                            <h4>Respect</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>We treat everyone—employees, partners, and clients—with dignity, fairness, and professionalism.</p>
                        </motion.div>
                        <motion.div className="value-item" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                            <div className="value-icon"><FaLeaf /></div>
                            <h4>Social Responsibility</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>Dedicated to supporting sustainable development by promoting clean energy solutions and contributing to communities.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* OUR PURPOSE */}
            <section className="section-container">
                <div style={{ marginBottom: '4rem' }}>
                    <span className="section-label">Commitment to Progress</span>
                    <h2 className="content-title">Our Purpose</h2>
                </div>
                <div className="purpose-list">
                    <motion.div className="purpose-card" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: '900', marginBottom: '0.75rem' }}>Powering Sustainable Energy</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>Supplying high-quality solar products sourced from trusted international manufacturers, ensuring efficiency and durability.</p>
                    </motion.div>
                    <motion.div className="purpose-card" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: '900', marginBottom: '0.75rem' }}>Delivering Excellence</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>Through competitive pricing and reliable service, we offer the best value for your investment without compromising quality.</p>
                    </motion.div>
                    <motion.div className="purpose-card" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: '900', marginBottom: '0.75rem' }}>Driving Trade Innovation</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>Leveraging modern systems and market strategies to ensure efficient, transparent, and accountable trading operations.</p>
                    </motion.div>
                    <motion.div className="purpose-card" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: '900', marginBottom: '0.75rem' }}>Expanding Horizons</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>Growing both locally and internationally, making clean energy and high-quality products more accessible.</p>
                    </motion.div>
                </div>
            </section>

            {/* FOUNDERS SECTION */}
            <section className="founder-section">
                <div className="section-container">
                    <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                        <span className="section-label">Visionary Leadership</span>
                        <h2 className="content-title">The Founders</h2>
                    </div>

                    <div className="founder-grid">
                        <motion.div className="founder-card" whileHover={{ y: -10 }} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}>
                            <span className="founder-role">Co-Founder & Managing Director</span>
                            <h3 className="founder-name">Mr. Solomon Awoke</h3>
                            <ul className="founder-bio">
                                <li><FaCheckCircle /> Graduate of Bahir Dar University with a strong business background</li>
                                <li><FaCheckCircle /> Over 10 years of experience in wholesale distribution</li>
                                <li><FaCheckCircle /> Former distributor of National Cement in Ethiopia</li>
                                <li><FaCheckCircle /> Strong expertise in financial management and EFDR tax compliance</li>
                                <li><FaCheckCircle /> Key strategist in establishing Z Tabor Trading's credibility</li>
                            </ul>
                        </motion.div>

                        <motion.div className="founder-card" whileHover={{ y: -10 }} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <span className="founder-role">Co-Founder & Deputy Manager</span>
                            <h3 className="founder-name">Mr. Dagmawi Buzuneh</h3>
                            <ul className="founder-bio">
                                <li><FaCheckCircle /> Over 10 years of experience in import-export business</li>
                                <li><FaCheckCircle /> Extensive knowledge in industrial goods and solar technologies</li>
                                <li><FaCheckCircle /> Expertise in exporting high-value agricultural commodities</li>
                                <li><FaCheckCircle /> Specialist in international trade and supplier relationship management</li>
                                <li><FaCheckCircle /> Instrumental in expanding global partnerships</li>
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section style={{ padding: '8rem 2rem', textAlign: 'center' }}>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '2rem' }}>Ready to Partner with Us?</h2>
                    <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', background: 'var(--color-primary)', color: 'white', padding: '1.25rem 3rem', borderRadius: '40px', fontWeight: '900', fontSize: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', boxShadow: '0 10px 30px var(--color-primary-glow)' }}>
                        Start a Conversation <FaArrowRight />
                    </Link>
                </motion.div>
            </section>
        </div>
    );
};

export default About;
