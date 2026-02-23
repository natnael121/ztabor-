import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaGlobe, FaTicketAlt, FaHeadset, FaNewspaper } from 'react-icons/fa';
import SEO from '../components/common/SEO';

const Contact = () => {
    const [formState, setFormState] = useState({
        name: '', email: '', service: '', date: '', message: ''
    });

    const handleChange = (e) => setFormState({ ...formState, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Message Sent! We will contact you shortly.");
    };

    return (
        <div className="contact-page-wrapper">
            <SEO
                title="Contact - Tabor Solar"
                description="Get in touch with Tabor Solar for consultations, support, and inquiries."
            />

            <style>{`
                .contact-page-wrapper {
                    background-color: var(--color-bg);
                    color: var(--color-text);
                    font-family: 'Inter', sans-serif;
                    overflow-x: hidden;
                }

                .contact-header {
                    height: 40vh;
                    min-height: 250px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    background: radial-gradient(circle at 50% 100%, var(--color-primary-glow) 0%, var(--color-bg) 70%);
                    text-align: center;
                    position: relative;
                }

                .contact-header h1 {
                    font-size: clamp(2.5rem, 5vw, 4rem);
                    font-weight: 900;
                    margin-bottom: 0.5rem;
                }

                .contact-header p {
                    color: var(--color-text-muted);
                    font-size: 0.9rem;
                }

                .split-container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 4rem;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 4rem 1.5rem;
                    align-items: start;
                }

                .get-in-touch {
                    padding-right: 2rem;
                }

                .contact-item {
                    display: flex;
                    gap: 1.5rem;
                    margin-bottom: 2.5rem;
                    align-items: flex-start;
                }

                .icon-circle {
                    width: 50px;
                    height: 50px;
                    background: var(--color-surface);
                    border: 1px solid var(--color-border);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--color-primary);
                    font-size: 1.2rem;
                    flex-shrink: 0;
                    transition: all 0.3s ease;
                }

                .contact-item:hover .icon-circle {
                    background: var(--color-primary);
                    color: black;
                }

                .booking-card {
                    background: var(--color-surface); 
                    padding: 2.5rem;
                    border-radius: 20px;
                    border: 1px solid var(--color-border);
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                }

                .booking-form {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                    margin-top: 2rem;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .form-group label {
                    font-size: 0.85rem;
                    color: rgba(255,255,255,0.7);
                }

                .form-input {
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.1);
                    padding: 0.8rem 1rem;
                    border-radius: 8px;
                    color: white;
                    outline: none;
                    font-size: 0.9rem;
                }
                .form-input:focus { border-color: var(--color-primary); background: rgba(0,0,0,0.2); }

                .full-width { grid-column: span 2; }

                .btn-submit {
                    background: var(--color-primary);
                    color: black;
                    border: none;
                    padding: 1rem;
                    font-weight: 800;
                    border-radius: 30px;
                    cursor: pointer;
                    transition: transform 0.2s;
                    margin-top: 1rem;
                }
                .btn-submit:hover { transform: scale(1.02); }

                .support-cards-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 4rem 1.5rem 6rem;
                }

                .support-card {
                    padding: 2.5rem;
                    border-radius: 20px;
                    border: 1px solid rgba(255,255,255,0.1);
                    background: #0a0a0f;
                    transition: all 0.3s ease;
                }

                .support-card.highlight {
                    background: var(--color-primary);
                    color: black;
                    border: none;
                }
                
                .support-card.highlight p { color: rgba(0,0,0,0.7); }
                .support-card.highlight .card-btn { background: black; color: white; }

                .card-icon {
                    width: 40px; height: 40px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1.5rem;
                    font-size: 1.2rem;
                }
                .highlight .card-icon { background: rgba(0,0,0,0.1); color: black; }

                .card-btn {
                    display: inline-block;
                    padding: 0.6rem 1.5rem;
                    border-radius: 20px;
                    background: var(--color-primary);
                    color: black;
                    font-weight: 700;
                    font-size: 0.8rem;
                    text-decoration: none;
                    margin-top: 1.5rem;
                }

                @media (max-width: 1024px) {
                    .split-container { gap: 3rem; }
                }

                @media (max-width: 768px) {
                    .split-container { grid-template-columns: 1fr; padding: 2rem 1.5rem; }
                    .get-in-touch { padding-right: 0; }
                    .booking-card { padding: 1.5rem; }
                    .booking-form { grid-template-columns: 1fr; }
                    .full-width { grid-column: span 1; }
                    .support-cards-grid { grid-template-columns: 1fr; gap: 1.5rem; }
                }
            `}</style>

            {/* Header */}
            <div className="contact-header">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1>Contact</h1>
                    <p>We are here to help you revolutionize your energy.</p>
                </motion.div>
            </div>

            {/* Split Content */}
            <div className="split-container">
                {/* Left Side: Info */}
                <motion.div className="get-in-touch" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>Get in touch</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '3rem', lineHeight: 1.6 }}>
                        Whether you have a question about features, trials, pricing, or need a demo, our team is ready to answer all your questions.
                    </p>

                    <div className="contact-item">
                        <div className="icon-circle"><FaMapMarkerAlt /></div>
                        <div>
                            <h4 style={{ fontWeight: '700', marginBottom: '0.4rem' }}>Headquarters</h4>
                            <p style={{ color: '#888', fontSize: '0.9rem' }}>Bole Main Road, Woreda 03<br />Addis Ababa, Ethiopia</p>
                        </div>
                    </div>

                    <div className="contact-item">
                        <div className="icon-circle"><FaPhoneAlt /></div>
                        <div>
                            <h4 style={{ fontWeight: '700', marginBottom: '0.4rem' }}>Phone</h4>
                            <p style={{ color: '#888', fontSize: '0.9rem' }}>+251 948 66 66 11<br />+251 948 66 66 33</p>
                        </div>
                    </div>

                    <div className="contact-item">
                        <div className="icon-circle"><FaEnvelope /></div>
                        <div>
                            <h4 style={{ fontWeight: '700', marginBottom: '0.4rem' }}>Email</h4>
                            <p style={{ color: '#888', fontSize: '0.9rem' }}>info@ztabor.com<br />support@ztabor.com</p>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side: Form */}
                <motion.div className="booking-card" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Request Consultation</h2>
                    <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>A representative will contact you to confirm your appointment.</p>

                    <form className="booking-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Your Name</label>
                            <input type="text" placeholder="Enter full name" className="form-input" required />
                        </div>
                        <div className="form-group">
                            <label>Your Email</label>
                            <input type="email" placeholder="Enter Email" className="form-input" required />
                        </div>
                        <div className="form-group">
                            <label>Select Service</label>
                            <select className="form-input">
                                <option>Select</option>
                                <option>Residential Solar</option>
                                <option>Commercial Grid</option>
                                <option>Maintenance</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Date</label>
                            <input type="date" className="form-input" />
                        </div>
                        <div className="form-group full-width">
                            <label>Your Message</label>
                            <textarea placeholder="Your Message" rows="4" className="form-input" style={{ resize: 'none' }}></textarea>
                        </div>
                        <button type="submit" className="btn-submit full-width">Make An Appointment →</button>
                    </form>
                </motion.div>
            </div>

            {/* Bottom Cards */}
            <div className="support-cards-grid">
                <motion.div className="support-card highlight" whileHover={{ y: -10 }}>
                    <div className="card-icon"><FaTicketAlt /></div>
                    <h3>Ticket Support</h3>
                    <p style={{ margin: '1rem 0', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        Facing technical issues? Submit a ticket and track its status.
                    </p>
                    <a href="#" className="card-btn">Contact Now</a>
                </motion.div>

                <motion.div className="support-card" whileHover={{ y: -10 }}>
                    <div className="card-icon"><FaHeadset /></div>
                    <h3>Free Call Centre</h3>
                    <p style={{ color: '#888', margin: '1rem 0', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        Talk to our experts directly for immediate assistance.
                    </p>
                    <a href="#" className="card-btn">Contact Now</a>
                </motion.div>

                <motion.div className="support-card" whileHover={{ y: -10 }}>
                    <div className="card-icon"><FaNewspaper /></div>
                    <h3>Sales Inquiry</h3>
                    <p style={{ color: '#888', margin: '1rem 0', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        Interested in bulk orders or partnership opportunities?
                    </p>
                    <a href="#" className="card-btn">Contact Now</a>
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;
