import React, { useState, useEffect } from 'react';
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
    updateDoc
} from 'firebase/firestore';
import { FaImage, FaPlus, FaTimes, FaBox, FaEdit, FaTrash, FaCheck, FaMedal, FaChevronDown, FaChevronUp, FaQrcode, FaDownload, FaPrint } from 'react-icons/fa';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';

const ProductManager = ({ isDarkMode }) => {
    // Form States — Product fields
    const [name, setName] = useState('');
    const [subtitle, setSubtitle] = useState(''); // "Word" e.g. PASSIONATE
    const [description, setDescription] = useState('');
    const [qrOpenId, setQrOpenId] = useState(null); // Track which product's QR is open

    const getProductUrl = (productId) => {
        // 1. Try environment variable first (VITE_APP_URL)
        let origin = import.meta.env.VITE_APP_URL || '';

        // 2. Fallback to current browser URL if in browser
        if (!origin && typeof window !== 'undefined') {
            origin = window.location.origin;
        }

        // 3. Last resort fallback
        if (!origin) return `https://www.z-tabor.com/product/${productId}`;

        // Cleanup: remove trailing slashes
        const normalizedOrigin = origin.replace(/\/+$/, "");

        // Cleanup: Ensure protocol exists (needed for some Vercel variables)
        const finalOrigin = normalizedOrigin.startsWith('http')
            ? normalizedOrigin
            : `https://${normalizedOrigin}`;

        return `${finalOrigin}/product/${productId}`;
    };

    const downloadQR = (productId, productName) => {
        // Use the hidden high-res canvas for the download
        const canvas = document.getElementById(`qr-bulk-canvas-${productId}`);
        if (canvas) {
            try {
                // Create a temporary canvas to include the name text
                const tempCanvas = document.createElement('canvas');
                const ctx = tempCanvas.getContext('2d');
                const padding = 60;
                const textHeight = 60;

                tempCanvas.width = canvas.width + padding;
                tempCanvas.height = canvas.height + padding + textHeight;

                // Fill background
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

                // Draw QR code
                ctx.drawImage(canvas, padding / 2, padding / 2);

                // Draw Name
                ctx.fillStyle = '#000000';
                ctx.font = 'bold 28px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(productName, tempCanvas.width / 2, canvas.height + padding + 10);

                const url = tempCanvas.toDataURL('image/png', 1.0);
                const link = document.createElement('a');
                link.download = `QR-${productName.replace(/\s+/g, '-')}.png`;
                link.href = url;
                link.click();
            } catch (err) {
                console.error("Failed to generate QR download:", err);
                alert("Could not generate QR code image. Please try again.");
            }
        } else {
            console.error("Canvas not found for ID:", `qr-bulk-canvas-${productId}`);
        }
    };

    const printSingleQR = (productId, productName) => {
        const canvas = document.getElementById(`qr-bulk-canvas-${productId}`);
        if (canvas) {
            const qrDataUrl = canvas.toDataURL('image/png', 1.0);
            const printWindow = window.open('', '_blank');
            if (!printWindow) return;

            printWindow.document.write(`
                <html>
                    <head>
                        <title>Print QR - ${productName}</title>
                        <style>
                            @page { margin: 0; }
                            body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
                            .container { text-align: center; border: 2px solid #000; padding: 50px; border-radius: 30px; background: white; }
                            img { width: 350px; height: 350px; image-rendering: pixelated; }
                            h1 { margin: 25px 0 10px 0; font-size: 32px; font-weight: 800; }
                            p { margin: 0; font-size: 14px; color: #666; font-family: monospace; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <img src="${qrDataUrl}" />
                            <h1>${productName}</h1>
                            <p>${getProductUrl(productId)}</p>
                        </div>
                        <script>
                            window.onload = () => { 
                                setTimeout(() => {
                                    window.print(); 
                                    window.close(); 
                                }, 500);
                            };
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    const printAllQRs = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        let qrItemsHtml = '';

        products.forEach(prod => {
            const canvas = document.getElementById(`qr-bulk-canvas-${prod.id}`);
            if (canvas) {
                const qrDataUrl = canvas.toDataURL('image/png', 1.0);
                qrItemsHtml += `
                    <div class="qr-item">
                        <img src="${qrDataUrl}" />
                        <h3>${prod.name}</h3>
                        <p>${prod.category || 'Product'}</p>
                    </div>
                `;
            }
        });

        printWindow.document.write(`
            <html>
                <head>
                    <title>Product QR Roster</title>
                    <style>
                        body { font-family: -apple-system, sans-serif; padding: 40px; background: white; }
                        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
                        .qr-item { border: 1.5px solid #000; padding: 25px; text-align: center; border-radius: 15px; page-break-inside: avoid; background: white; }
                        img { width: 180px; height: 180px; image-rendering: pixelated; }
                        h3 { margin: 15px 0 5px 0; font-size: 18px; font-weight: 800; }
                        p { margin: 0; font-size: 13px; color: #444; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
                        .header { text-align: center; margin-bottom: 50px; border-bottom: 2px solid #000; padding-bottom: 20px; }
                        @media print {
                            body { padding: 20px; }
                            .grid { gap: 20px; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1 style="margin: 0; font-size: 32px;">PRODUCT QR ROSTER</h1>
                        <p style="margin-top: 5px;">Generated on ${new Date().toLocaleDateString()}</p>
                    </div>
                    <div class="grid">
                        ${qrItemsHtml}
                    </div>
                    <script>
                        window.onload = () => { 
                            setTimeout(() => {
                                window.print(); 
                                window.close(); 
                            }, 500);
                        };
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };
    const [category, setCategory] = useState('Track & Field');
    const [dimensions, setDimensions] = useState(''); // Height
    const [hometown, setHometown] = useState('');
    const [birthday, setBirthday] = useState('');
    const [college, setCollege] = useState('');
    const [medals, setMedals] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Timeline management
    const [timeline, setTimeline] = useState([]);
    const [showTimelineForm, setShowTimelineForm] = useState(false);
    const [tlYear, setTlYear] = useState('');
    const [tlTitle, setTlTitle] = useState('');
    const [tlDescription, setTlDescription] = useState('');
    const [tlImage, setTlImage] = useState('');

    // Management States
    const [products, setProducts] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const theme = {
        bg: isDarkMode ? '#1F2937' : '#FFFFFF',
        cardBg: isDarkMode ? '#374151' : '#F9FAFB',
        text: isDarkMode ? '#F9FAFB' : '#000000',
        textMuted: isDarkMode ? '#9CA3AF' : '#1a1a1a',
        border: isDarkMode ? '#4B5563' : '#cbd5e1',
        inputBg: isDarkMode ? '#374151' : '#FFFFFF',
        accent: '#D4F462',
    };

    // Fetch Products
    useEffect(() => {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const prods = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(prods);
        });
        return () => unsubscribe();
    }, []);

    const inputStyle = {
        padding: '0.85rem 1rem',
        borderRadius: '0.75rem',
        border: `1px solid ${theme.border}`,
        backgroundColor: theme.inputBg,
        color: theme.text,
        fontSize: '0.9rem',
        transition: 'border-color 0.2s ease',
        outline: 'none',
        width: '100%',
    };

    const labelStyle = {
        fontSize: '0.8rem',
        fontWeight: '700',
        color: theme.textMuted,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: '0.4rem',
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const addTimelineItem = () => {
        if (tlYear && tlTitle) {
            setTimeline([...timeline, { year: tlYear, title: tlTitle, description: tlDescription, image: tlImage || null }]);
            setTlYear(''); setTlTitle(''); setTlDescription(''); setTlImage('');
            setShowTimelineForm(false);
        }
    };

    const removeTimelineItem = (index) => {
        setTimeline(timeline.filter((_, i) => i !== index));
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            let imageUrl = previewUrl;
            if (imageFile) {
                setMessage('Uploading image...');
                imageUrl = await uploadImageToImgBB(imageFile);
            }

            const productData = {
                name, subtitle, description, category, dimensions, hometown, birthday, college,
                medals: medals ? parseInt(medals) : 0,
                imageUrl, timeline, updatedAt: serverTimestamp()
            };

            if (editingId) {
                setMessage('Updating product...');
                await updateDoc(doc(db, 'products', editingId), productData);
                setMessage('Product updated successfully!');
            } else {
                setMessage('Adding product...');
                await addDoc(collection(db, 'products'), {
                    ...productData, createdAt: serverTimestamp()
                });
                setMessage('Product added successfully!');
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
        setName(''); setSubtitle(''); setDescription('');
        setDimensions(''); setCategory('Track & Field');
        setHometown(''); setBirthday(''); setCollege('');
        setMedals('');
        setImageFile(null); setPreviewUrl('');
        setEditingId(null); setTimeline([]);
    };

    const handleEdit = (prod) => {
        setEditingId(prod.id);
        setName(prod.name || '');
        setSubtitle(prod.subtitle || '');
        setDescription(prod.description || '');
        setCategory(prod.category || 'Track & Field');
        setDimensions(prod.dimensions || '');
        setHometown(prod.hometown || '');
        setBirthday(prod.birthday || '');
        setCollege(prod.college || '');
        setMedals(prod.medals ? String(prod.medals) : '');
        setPreviewUrl(prod.imageUrl || '');
        setTimeline(prod.timeline || []);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteDoc(doc(db, 'products', id));
                setMessage('Product removed successfully.');
            } catch (error) {
                console.error(error);
                setMessage('Error removing product.');
            }
        }
    };

    const handleLoadDemoData = async () => {
        if (!window.confirm('This will add 6 new solar products to your database including GlowSun and IntelliSun series. Continue?')) return;
        setLoading(true);
        setMessage('Loading new product catalog...');

        const demoProducts = [
            {
                name: "GlowSun-18", subtitle: "Practical Multifunction", category: "Portable Solar",
                dimensions: "5Wp", batteryStorage: "18.5Wh", college: "Practical & Portable", medals: 5,
                imageUrl: "https://i.ibb.co/bgt2hX1P/da0213a0fba4.png",
                description: "Compact and reliable portable solar kit. Perfect for lighting, radio, and mobile charging in remote locations. Includes 3 hours of light and 1 phone charge capacity.",
                timeline: [
                    { year: "5Wp", title: "Solar Output", description: "High-efficiency mini panel" },
                    { year: "3h", title: "Light Duration", description: "Continuous bright LED lighting" },
                    { year: "Phone", title: "Charging", description: "1 full mobile charge per cycle" }
                ]
            },
            {
                name: "GlowSun-37", subtitle: "Practical Multifunction", category: "Portable Solar",
                dimensions: "10Wp", batteryStorage: "37Wh", college: "Practical & Portable", medals: 5,
                imageUrl: "https://i.ibb.co/bgt2hX1P/da0213a0fba4.png",
                description: "High-performance portable solar system with double the storage capacity. Ideal for families needing more lighting and frequent phone charging.",
                timeline: [
                    { year: "10Wp", title: "Solar Output", description: "Enhanced solar harvesting" },
                    { year: "6h", title: "Light Duration", description: "Extended lighting for the whole night" },
                    { year: "2x", title: "Phone Charges", description: "Dual mobile charging capacity" }
                ]
            },
            {
                name: "GlowSun-160", subtitle: "Light-Weighted", category: "Integrated Solar",
                dimensions: "30Wp", batteryStorage: "160Wh", college: "Compact Integration", medals: 5,
                imageUrl: "https://i.ibb.co/23SZX3Ny/38ac5fa6febc.png",
                description: "Innovative compact integration with multimedia entertainment capabilities. Supports TV, fans, and mobile charging with a lightweight design.",
                timeline: [
                    { year: "28h", title: "Light", description: "Long-lasting illumination" },
                    { year: "5h", title: "TV Use", description: "Supports small entertainment systems" },
                    { year: "8h", title: "Fan Use", description: "Cooling comfort for your space" }
                ]
            },
            {
                name: "IntelliSun-512", subtitle: "Quality Practical", category: "Smart Storage",
                dimensions: "120Wp", batteryStorage: "512Wh", college: "Quality & Intelligent", medals: 5,
                imageUrl: "https://i.ibb.co/gLn8bVkJ/aee68748851f.png",
                description: "Quality-focused portable energy storage with intelligent power management. Powers laptops, fans, and multiple lamps for professional and home use.",
                timeline: [
                    { year: "512Wh", title: "Capacity", description: "High-density energy storage" },
                    { year: "84h", title: "Lamp Use", description: "Weeks of light on a single charge" },
                    { year: "7h", title: "Laptop", description: "Professional work runtime" }
                ]
            },
            {
                name: "IntelliSun-1004", subtitle: "Extended Runtime", category: "Smart Storage",
                dimensions: "200Wp", batteryStorage: "1004Wh", college: "High Safety & Rich Interfaces", medals: 5,
                imageUrl: "https://i.ibb.co/FkSm42L7/e231ed27c6c5.png",
                description: "High-safety energy system with rich interfaces and extended runtime. Powers multiple household appliances simultaneously with advanced safety protocols.",
                timeline: [
                    { year: "1kWh", title: "Storage", description: "Large scale household energy" },
                    { year: "46", title: "Phone Charges", description: "Massive mobile power hub" },
                    { year: "13h", title: "Laptop Use", description: "All-day professional energy" }
                ]
            },
            {
                name: "IntelliSun-5120", subtitle: "Powerful Output", category: "Industrial Solar",
                dimensions: "1170Wp", batteryStorage: "5120Wh", college: "Powerful & Convenient", medals: 5,
                imageUrl: "https://i.ibb.co/BKFTYtZb/2ac0bb4c740a.png",
                description: "Industrial-grade energy solution capable of powering fridges, air conditioners, and professional equipment. The ultimate off-grid power plant.",
                timeline: [
                    { year: "5.1kWh", title: "Giant Capacity", description: "Full day house power" },
                    { year: "64h", title: "Fridge", description: "Keeps food fresh during outages" },
                    { year: "4h", title: "AC Use", description: "Heavy appliance compatibility" }
                ]
            }
        ];

        try {
            const batchPromises = demoProducts.map(product => {
                return addDoc(collection(db, 'products'), {
                    ...product,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
            });
            await Promise.all(batchPromises);
            setMessage('Success! Demo Catalog Loaded.');
        } catch (e) {
            console.error(e);
            setMessage('Error adding demo data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ paddingBottom: '4rem' }}>
            {/* Form Card */}
            <div style={{
                backgroundColor: theme.bg,
                borderRadius: '1rem',
                padding: '2.5rem',
                border: `1px solid ${theme.border}`,
                boxShadow: '0 4px 6px rgba(0,0,0,0.04)'
            }} className="manager-form-card">
                <style>{`
                    @media (max-width: 768px) {
                        .manager-form-card { padding: 1.5rem !important; }
                        .form-grid { grid-template-columns: 1fr !important; gap: 1rem !important; }
                        .manager-header { flex-direction: column; align-items: flex-start !important; gap: 1rem !important; }
                        .product-list-card { padding: 1.5rem !important; }
                        .product-item { flex-direction: column; align-items: flex-start !important; }
                        .product-actions { width: 100%; justify-content: space-between; margin-top: 1rem; }
                    }
                `}</style>
                <div className="manager-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h3 style={{
                        fontSize: '1.3rem',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        color: theme.text,
                        margin: 0
                    }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <FaBox style={{ color: 'var(--color-primary)' }} /> {editingId ? 'Edit Product' : 'Add New Product'}
                        </span>
                    </h3>

                    <button
                        type="button"
                        onClick={handleLoadDemoData}
                        style={{
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            color: '#3B82F6',
                            backgroundColor: 'rgba(59,130,246,0.1)',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            border: '1px solid rgba(59,130,246,0.2)',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}
                    >
                        <FaPlus size={10} /> Load Demo Catalog
                    </button>

                    {editingId && (
                        <button onClick={resetForm} style={{ fontSize: '0.8rem', color: '#EF4444', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}>Cancel Edit</button>
                    )}
                </div>

                <form onSubmit={handleSubmit}>

                    {/* Section: Basic Info */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: `1px solid ${theme.border}` }}>
                            Product Classification
                        </h4>
                        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={labelStyle}>Product Name *</label>
                                <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. SANY Portable Solar System" style={inputStyle} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={labelStyle}>Product Tagline *</label>
                                <input type="text" required value={subtitle} onChange={(e) => setSubtitle(e.target.value)}
                                    placeholder="e.g. MULTIFUNCTION, COMPACT, POWERFUL" style={inputStyle} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={labelStyle}>Sport / Category</label>
                                <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
                                    <option>Portable Systems</option>
                                    <option>Solar Panels</option>
                                    <option>Inverters</option>
                                    <option>Batteries</option>
                                    <option>Accessories</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={labelStyle}>Technical Spec (e.g. Capacity)</label>
                                <input type="text" value={dimensions} onChange={(e) => setDimensions(e.target.value)}
                                    placeholder="e.g. 500Wh or 100W" style={inputStyle} />
                            </div>
                        </div>
                    </div>

                    {/* Section: Personal Details */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: `1px solid ${theme.border}` }}>
                            Commercial Details
                        </h4>
                        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={labelStyle}>Manufacturer/Origin</label>
                                <input type="text" value={hometown} onChange={(e) => setHometown(e.target.value)}
                                    placeholder="e.g. SANY Energy" style={inputStyle} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={labelStyle}>Release Date / Warranty</label>
                                <input type="text" value={birthday} onChange={(e) => setBirthday(e.target.value)}
                                    placeholder="e.g. 2024 Model (2Y Warranty)" style={inputStyle} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={labelStyle}>Certifications</label>
                                <input type="text" value={college} onChange={(e) => setCollege(e.target.value)}
                                    placeholder="e.g. CE, RoHS, ISO9001" style={inputStyle} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={labelStyle}>Rating (1-5)</label>
                                <input type="number" value={medals} onChange={(e) => setMedals(e.target.value)}
                                    placeholder="e.g. 5" style={inputStyle} min="0" max="5" />
                            </div>
                        </div>
                    </div>



                    {/* Section: Profile Image */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: `1px solid ${theme.border}` }}>
                            Product Media
                        </h4>
                        <div
                            style={{
                                border: `2px dashed ${theme.border}`,
                                borderRadius: '1rem',
                                padding: '2rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                backgroundColor: theme.cardBg,
                                transition: 'border-color 0.2s ease',
                            }}
                            onClick={() => document.getElementById('product-image').click()}
                        >
                            {previewUrl ? (
                                <div style={{ position: 'relative' }}>
                                    <img src={previewUrl} alt="Preview" style={{ width: '160px', height: '200px', objectFit: 'cover', borderRadius: '0.75rem', margin: '0 auto' }} />
                                    <button type="button" onClick={(e) => { e.stopPropagation(); setPreviewUrl(''); setImageFile(null); }}
                                        style={{ position: 'absolute', top: '-8px', right: 'calc(50% - 88px)', backgroundColor: '#EF4444', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
                                        <FaTimes size={10} />
                                    </button>
                                </div>
                            ) : (
                                <div style={{ color: theme.textMuted }}>
                                    <FaImage size={40} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
                                    <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>Upload Product Photo</p>
                                    <p style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.6 }}>Click to browse or drag & drop</p>
                                </div>
                            )}
                            <input type="file" id="product-image" hidden accept="image/*" onChange={handleImageChange} />
                        </div>
                    </div>

                    {/* Section: Bio / Description */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: `1px solid ${theme.border}` }}>
                            Product Description
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={labelStyle}>Bio / Description</label>
                            <textarea rows="4" required value={description} onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the product features and utility..."
                                style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }}></textarea>
                        </div>
                    </div>

                    {/* Section: Timeline / Achievements */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            Technical Specifications / Features
                            <button type="button" onClick={() => setShowTimelineForm(!showTimelineForm)}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-primary)', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', padding: '0.4rem 0.8rem', borderRadius: '2rem', cursor: 'pointer' }}>
                                <FaPlus size={10} /> Add Feature
                            </button>
                        </h4>

                        {/* Existing Timeline Items */}
                        {timeline.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                                {timeline.map((item, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex', alignItems: 'center', gap: '1rem',
                                        padding: '0.75rem 1rem',
                                        backgroundColor: theme.cardBg,
                                        borderRadius: '0.75rem',
                                        border: `1px solid ${theme.border}`,
                                    }}>
                                        <div style={{ width: '50px', height: '50px', borderRadius: '0.5rem', backgroundColor: 'rgba(212,244,98,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <span style={{ fontWeight: '800', fontSize: '0.8rem', color: '#D4F462' }}>{item.year}</span>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h5 style={{ fontWeight: '700', fontSize: '0.9rem', color: theme.text }}>{item.title}</h5>
                                            <p style={{ fontSize: '0.75rem', color: theme.textMuted }}>{item.description?.substring(0, 80)}...</p>
                                        </div>
                                        <button type="button" onClick={() => removeTimelineItem(idx)}
                                            style={{ color: '#EF4444', padding: '0.5rem', flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer' }}>
                                            <FaTimes size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add Timeline Item Form */}
                        {showTimelineForm && (
                            <div style={{
                                padding: '1.5rem',
                                backgroundColor: theme.cardBg,
                                borderRadius: '0.75rem',
                                border: `1px solid ${theme.border}`,
                            }}>
                                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <label style={labelStyle}>Year</label>
                                        <input type="text" value={tlYear} onChange={(e) => setTlYear(e.target.value)}
                                            placeholder="e.g. 2012" style={inputStyle} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <label style={labelStyle}>Achievement Title</label>
                                        <input type="text" value={tlTitle} onChange={(e) => setTlTitle(e.target.value)}
                                            placeholder="e.g. Battery Capacity" style={inputStyle} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem' }}>
                                    <label style={labelStyle}>Description</label>
                                    <textarea rows="2" value={tlDescription} onChange={(e) => setTlDescription(e.target.value)}
                                        placeholder="Short description of this achievement..." style={{ ...inputStyle, resize: 'none' }}></textarea>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem' }}>
                                    <label style={labelStyle}>Image URL (optional)</label>
                                    <input type="url" value={tlImage} onChange={(e) => setTlImage(e.target.value)}
                                        placeholder="https://example.com/image.jpg" style={inputStyle} />
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                    <button type="button" onClick={() => setShowTimelineForm(false)}
                                        style={{ padding: '0.6rem 1.25rem', borderRadius: '0.5rem', border: `1px solid ${theme.border}`, color: theme.textMuted, fontSize: '0.85rem', fontWeight: '600', backgroundColor: 'transparent', cursor: 'pointer' }}>
                                        Cancel
                                    </button>
                                    <button type="button" onClick={addTimelineItem}
                                        style={{ padding: '0.6rem 1.25rem', borderRadius: '0.5rem', border: 'none', backgroundColor: 'var(--color-primary)', color: '#fff', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' }}>
                                        Add Spec
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <div>
                        {message && (
                            <div style={{
                                padding: '0.85rem',
                                borderRadius: '0.75rem',
                                backgroundColor: message.includes('success') || message.includes('Loading') ? '#ECFDF5' : '#FEF2F2',
                                color: message.includes('success') || message.includes('Loading') ? '#065F46' : '#991B1B',
                                fontSize: '0.85rem',
                                textAlign: 'center',
                                marginBottom: '1rem',
                                fontWeight: '600'
                            }}>
                                {message}
                            </div>
                        )}
                        <button type="submit" disabled={loading}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '0.75rem',
                                border: 'none',
                                backgroundColor: loading ? '#999' : '#D4F462',
                                color: '#111',
                                fontSize: '0.95rem',
                                fontWeight: '800',
                                letterSpacing: '0.02em',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease',
                            }}>
                            {loading ? 'Processing...' : (editingId ? '✏️ Update Product Info' : '⚡ Add Product to Catalog')}
                        </button>
                    </div>
                </form>
            </div>

            {/* Product List Card */}
            <div className="product-list-card" style={{
                backgroundColor: theme.bg,
                borderRadius: '1rem',
                padding: '2.5rem',
                marginTop: '2rem',
                border: `1px solid ${theme.border}`,
                boxShadow: '0 4px 6px rgba(0,0,0,0.04)'
            }}>
                <div className="manager-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: theme.text, display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
                        <FaMedal style={{ color: 'var(--color-primary)' }} /> Product Catalog ({products.length})
                    </h3>
                    {products.length > 0 && (
                        <button
                            onClick={printAllQRs}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.6rem 1.25rem', backgroundColor: 'var(--color-primary)', color: '#fff',
                                borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: '700',
                                border: 'none', cursor: 'pointer', transition: 'transform 0.2s ease'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <FaPrint size={14} /> Print All QR Codes
                        </button>
                    )}
                </div>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {products.length === 0 ? (
                        <p style={{ color: theme.textMuted, fontStyle: 'italic', textAlign: 'center', padding: '2rem 0' }}>No products in the catalog yet. Add one above!</p>
                    ) : (
                        products.map(prod => (
                            <div key={prod.id} className="product-item" style={{
                                display: 'flex', flexWrap: 'wrap', gap: '1.25rem',
                                padding: '1.25rem',
                                border: `1px solid ${theme.border}`,
                                borderRadius: '0.75rem',
                                alignItems: 'center',
                                backgroundColor: theme.cardBg,
                                transition: 'all 0.2s ease',
                            }}>
                                <div style={{ width: '64px', height: '80px', backgroundColor: '#333', borderRadius: '0.5rem', overflow: 'hidden', flexShrink: 0 }}>
                                    {prod.imageUrl && <img src={prod.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.25rem', color: theme.text }}>{prod.name}</h4>
                                    <div style={{ fontSize: '0.75rem', color: theme.textMuted, display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                        {prod.subtitle && <span style={{ fontWeight: '700', color: '#D4F462' }}>{prod.subtitle}</span>}
                                        {prod.category && <span>• {prod.category}</span>}
                                        {prod.hometown && <span>• {prod.hometown}</span>}
                                        {prod.medals > 0 && <span>• ⭐ {prod.medals}/5</span>}
                                    </div>
                                    {prod.timeline && prod.timeline.length > 0 && (
                                        <div style={{ fontSize: '0.7rem', color: theme.textMuted, marginTop: '0.3rem' }}>
                                            {prod.timeline.length} timeline event{prod.timeline.length !== 1 ? 's' : ''}
                                        </div>
                                    )}
                                </div>
                                <div className="product-actions" style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                    <button onClick={() => setQrOpenId(qrOpenId === prod.id ? null : prod.id)} style={{
                                        color: '#8B5CF6', display: 'flex', alignItems: 'center', gap: '0.4rem',
                                        fontSize: '0.8rem', fontWeight: '600', padding: '0.5rem 0.75rem', borderRadius: '0.5rem',
                                        backgroundColor: qrOpenId === prod.id ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.08)', border: 'none', cursor: 'pointer'
                                    }}>
                                        <FaQrcode size={12} /> QR
                                    </button>
                                    <button onClick={() => handleEdit(prod)} style={{
                                        color: '#3B82F6', display: 'flex', alignItems: 'center', gap: '0.4rem',
                                        fontSize: '0.8rem', fontWeight: '600', padding: '0.5rem 0.75rem', borderRadius: '0.5rem',
                                        backgroundColor: 'rgba(59,130,246,0.08)', border: 'none', cursor: 'pointer'
                                    }}>
                                        <FaEdit size={12} /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(prod.id)} style={{
                                        color: '#EF4444', display: 'flex', alignItems: 'center', gap: '0.4rem',
                                        fontSize: '0.8rem', fontWeight: '600', padding: '0.5rem 0.75rem', borderRadius: '0.5rem',
                                        backgroundColor: 'rgba(239,68,68,0.08)', border: 'none', cursor: 'pointer'
                                    }}>
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                                {/* QR Code Panel */}
                                {qrOpenId === prod.id && (
                                    <div style={{
                                        width: '100%',
                                        display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem',
                                        marginTop: '0.75rem', padding: '1.25rem',
                                        backgroundColor: isDarkMode ? '#1a1a2e' : '#F5F3FF',
                                        borderRadius: '0.75rem',
                                        border: `1px solid ${isDarkMode ? '#2a2a4a' : '#DDD6FE'}`,
                                    }}>
                                        <div style={{ padding: '0.75rem', backgroundColor: 'white', borderRadius: '0.75rem', flexShrink: 0 }}>
                                            <QRCodeSVG
                                                id={`qr-ui-${prod.id}`}
                                                value={getProductUrl(prod.id)}
                                                size={140}
                                                bgColor="#ffffff"
                                                fgColor="#000000"
                                                level="Q"
                                                includeMargin={true}
                                            />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <h5 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.3rem', color: theme.text }}>
                                                QR Code — {prod.name}
                                            </h5>
                                            <p style={{ fontSize: '0.7rem', color: theme.textMuted, marginBottom: '0.75rem', lineHeight: 1.5 }}>
                                                Scan this QR code to open this product's profile page directly.
                                            </p>
                                            <div style={{
                                                fontSize: '0.65rem', color: theme.textMuted, marginBottom: '0.75rem',
                                                padding: '0.4rem 0.6rem', backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                                                borderRadius: '0.3rem', wordBreak: 'break-all',
                                                border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.08)' : '#E5E7EB'}`
                                            }}>
                                                {getProductUrl(prod.id)}
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                <button onClick={() => downloadQR(prod.id, prod.name)} style={{
                                                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                                                    padding: '0.5rem 1rem', backgroundColor: '#8B5CF6', color: 'white',
                                                    borderRadius: '0.35rem', fontSize: '0.75rem', fontWeight: '700',
                                                    border: 'none', cursor: 'pointer',
                                                }}>
                                                    <FaDownload size={11} /> PNG
                                                </button>
                                                <button onClick={() => printSingleQR(prod.id, prod.name)} style={{
                                                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                                                    padding: '0.5rem 1rem', backgroundColor: '#D4F462', color: '#111',
                                                    borderRadius: '0.35rem', fontSize: '0.75rem', fontWeight: '700',
                                                    border: 'none', cursor: 'pointer',
                                                }}>
                                                    <FaPrint size={11} /> Print
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Hidden high-res canvases for printing/downloading */}
                <div style={{ position: 'fixed', top: '-10000px', left: '-10000px', pointerEvents: 'none' }}>
                    {products.map(prod => (
                        <QRCodeCanvas
                            key={`bulk-canvas-${prod.id}`}
                            id={`qr-bulk-canvas-${prod.id}`}
                            value={getProductUrl(prod.id)}
                            size={512}
                            level="H"
                            includeMargin={true}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductManager;
