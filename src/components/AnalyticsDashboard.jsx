import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, where, Timestamp } from 'firebase/firestore';
import {
    FaGlobe, FaMobileAlt, FaDesktop, FaTabletAlt, FaEye, FaMapMarkerAlt,
    FaClock, FaWifi, FaBolt, FaChartBar, FaChrome, FaFirefox,
    FaSafari, FaEdge, FaOpera, FaApple, FaWindows, FaLinux,
    FaMemory, FaMicrochip, FaLanguage, FaSun, FaMoon, FaTachometerAlt,
    FaChartLine, FaHourglassHalf, FaNetworkWired, FaBatteryFull,
    FaPlug, FaMousePointer, FaQrcode, FaUserSecret, FaDownload,
    FaMapMarkedAlt, FaCrosshairs, FaLocationArrow
} from 'react-icons/fa';

const AnalyticsDashboard = ({ isDarkMode, timeRange = '24h' }) => {
    const [stats, setStats] = useState({
        totalVisits: 0,
        uniqueVisitors: new Set(),
        recentVisits: [],
        deviceData: { Mobile: 0, Desktop: 0, Tablet: 0 },
        browserData: {},
        osData: {},
        topPages: {},
        topCountries: {},
        topCities: {},
        locations: [], // Array of locations with lat/long
        connectionData: {},
        screenResolutions: {},
        avgLoadTime: 0,
        bounceRate: 0,
        returningVisitors: 0
    });
    const [loading, setLoading] = useState(true);
    const [selectedMetric, setSelectedMetric] = useState('realtime');
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [mapView, setMapView] = useState('heatmap'); // 'heatmap' or 'points'

    useEffect(() => {
        // Adjust time range based on selection
        const now = new Date();
        let startDate = new Date();
        switch (timeRange) {
            case '1h':
                startDate = new Date(now - 60 * 60 * 1000);
                break;
            case '24h':
                startDate = new Date(now - 24 * 60 * 60 * 1000);
                break;
            case '7d':
                startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now - 24 * 60 * 60 * 1000);
        }

        const q = query(
            collection(db, 'visits'),
            where('timestamp', '>=', startDate),
            orderBy('timestamp', 'desc'),
            limit(500)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const visits = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate() || new Date()
            }));

            // Initialize stats objects
            const devices = { Mobile: 0, Desktop: 0, Tablet: 0 };
            const browsers = {};
            const operatingSystems = {};
            const pages = {};
            const countries = {};
            const cities = {};
            const locations = []; // Store locations with lat/long
            const connections = {};
            const resolutions = {};
            const uniqueIps = new Set();
            let totalLoadTime = 0;
            let loadTimeCount = 0;
            let bounceCount = 0;
            let returnCount = 0;

            // Track visitors by IP for uniqueness
            const visitorHistory = new Map();

            visits.forEach((v, index) => {
                // Basic stats
                if (v.device) devices[v.device] = (devices[v.device] || 0) + 1;
                if (v.browser) browsers[v.browser] = (browsers[v.browser] || 0) + 1;
                if (v.os) operatingSystems[v.os] = (operatingSystems[v.os] || 0) + 1;
                if (v.path) pages[v.path] = (pages[v.path] || 0) + 1;
                if (v.country) countries[v.country] = (countries[v.country] || 0) + 1;
                if (v.city) cities[v.city] = (cities[v.city] || 0) + 1;

                // Store location data with lat/long if available
                if (v.latitude && v.longitude) {
                    locations.push({
                        id: v.id,
                        lat: v.latitude,
                        lng: v.longitude,
                        city: v.city || 'Unknown',
                        country: v.country || 'Unknown',
                        countryCode: v.countryCode,
                        ip: v.ip,
                        timestamp: v.timestamp,
                        device: v.device,
                        browser: v.browser,
                        path: v.path,
                        accuracy: 1000 // Approximate accuracy for IP geolocation
                    });
                }

                // Connection info
                if (v.connectionType) {
                    connections[v.connectionType] = (connections[v.connectionType] || 0) + 1;
                }

                // Screen resolution
                if (v.screenWidth && v.screenHeight) {
                    const res = `${v.screenWidth}x${v.screenHeight}`;
                    resolutions[res] = (resolutions[res] || 0) + 1;
                }

                // Unique visitors by IP
                if (v.ip) {
                    uniqueIps.add(v.ip);

                    // Track returning visitors (simplified - visits from same IP)
                    if (visitorHistory.has(v.ip)) {
                        returnCount++;
                    } else {
                        visitorHistory.set(v.ip, true);
                    }
                }

                // Load time performance
                if (v.loadTime) {
                    totalLoadTime += v.loadTime;
                    loadTimeCount++;
                }

                // Bounce rate (simplified - only one page view in session)
                if (index === 0 || v.referrer === 'Direct') {
                    bounceCount++;
                }
            });

            setStats({
                totalVisits: visits.length,
                uniqueVisitors: uniqueIps.size,
                recentVisits: visits.slice(0, 15),
                deviceData: devices,
                browserData: Object.entries(browsers).sort((a, b) => b[1] - a[1]),
                osData: Object.entries(operatingSystems).sort((a, b) => b[1] - a[1]),
                topPages: Object.entries(pages).sort((a, b) => b[1] - a[1]).slice(0, 10),
                topCountries: Object.entries(countries).sort((a, b) => b[1] - a[1]).slice(0, 8),
                topCities: Object.entries(cities).sort((a, b) => b[1] - a[1]).slice(0, 8),
                locations: locations,
                connectionData: Object.entries(connections).sort((a, b) => b[1] - a[1]),
                screenResolutions: Object.entries(resolutions).sort((a, b) => b[1] - a[1]).slice(0, 5),
                avgLoadTime: loadTimeCount > 0 ? (totalLoadTime / loadTimeCount).toFixed(0) : 0,
                bounceRate: visits.length > 0 ? ((bounceCount / visits.length) * 100).toFixed(1) : 0,
                returningVisitors: visits.length > 0 ? ((returnCount / visits.length) * 100).toFixed(1) : 0
            });
            setLoading(false);
        });

        return () => unsubscribe();
    }, [timeRange]);

    const theme = {
        card: isDarkMode ? '#1F2937' : '#FFFFFF',
        text: isDarkMode ? '#F9FAFB' : '#000000',
        textMuted: isDarkMode ? '#9CA3AF' : '#1a1a1a',
        border: isDarkMode ? '#374151' : '#cbd5e1',
        accent: isDarkMode ? '#3B82F6' : '#D4F462',
        bg: isDarkMode ? '#111827' : '#FFFFFF'
    };

    const getBrowserIcon = (browser) => {
        switch (browser?.toLowerCase()) {
            case 'chrome': return <FaChrome color="#4285F4" />;
            case 'firefox': return <FaFirefox color="#FF7139" />;
            case 'safari': return <FaSafari color="#006CFF" />;
            case 'edge': return <FaEdge color="#0078D7" />;
            case 'opera': return <FaOpera color="#FF1B2D" />;
            default: return <FaGlobe color={theme.textMuted} />;
        }
    };

    const getOsIcon = (os) => {
        if (os?.toLowerCase().includes('windows')) return <FaWindows color="#00ADEF" />;
        if (os?.toLowerCase().includes('mac')) return <FaApple color="#555555" />;
        if (os?.toLowerCase().includes('linux')) return <FaLinux color="#FCC624" />;
        if (os?.toLowerCase().includes('android')) return <FaMobileAlt color="#3DDC84" />;
        if (os?.toLowerCase().includes('ios')) return <FaApple color="#555555" />;
        return <FaMicrochip color={theme.textMuted} />;
    };

    // Simple map component using div with coordinate display
    const LocationMap = ({ locations, selectedLocation, onSelectLocation }) => {
        // Group locations by approximate area for better visualization
        const groupedLocations = locations.reduce((acc, loc) => {
            const key = `${Math.round(loc.lat * 10) / 10},${Math.round(loc.lng * 10) / 10}`;
            if (!acc[key]) {
                acc[key] = {
                    ...loc,
                    count: 1,
                    lat: loc.lat,
                    lng: loc.lng
                };
            } else {
                acc[key].count++;
            }
            return acc;
        }, {});

        const locationGroups = Object.values(groupedLocations);

        return (
            <div style={{ position: 'relative' }}>
                {/* Map Controls */}
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    zIndex: 10,
                    display: 'flex',
                    gap: '0.5rem'
                }}>
                    <button
                        onClick={() => setMapView('points')}
                        style={{
                            padding: '0.5rem',
                            backgroundColor: mapView === 'points' ? theme.accent : theme.card,
                            color: mapView === 'points' ? '#FFFFFF' : theme.text,
                            border: `1px solid ${theme.border}`,
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        <FaMapMarkedAlt />
                    </button>
                    <button
                        onClick={() => setMapView('heatmap')}
                        style={{
                            padding: '0.5rem',
                            backgroundColor: mapView === 'heatmap' ? theme.accent : theme.card,
                            color: mapView === 'heatmap' ? '#FFFFFF' : theme.text,
                            border: `1px solid ${theme.border}`,
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        <FaCrosshairs />
                    </button>
                </div>

                {/* Map Grid */}
                <div style={{
                    backgroundColor: theme.bg,
                    borderRadius: '12px',
                    padding: '1rem',
                    minHeight: '400px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* World Map Placeholder with Grid */}
                    <svg width="100%" height="400" viewBox="0 0 800 400" style={{ background: theme.bg }}>
                        {/* Grid Lines */}
                        {Array.from({ length: 9 }).map((_, i) => (
                            <line
                                key={`v-${i}`}
                                x1={i * 100}
                                y1="0"
                                x2={i * 100}
                                y2="400"
                                stroke={theme.border}
                                strokeWidth="0.5"
                                strokeDasharray="5,5"
                            />
                        ))}
                        {Array.from({ length: 5 }).map((_, i) => (
                            <line
                                key={`h-${i}`}
                                x1="0"
                                y1={i * 100}
                                x2="800"
                                y2={i * 100}
                                stroke={theme.border}
                                strokeWidth="0.5"
                                strokeDasharray="5,5"
                            />
                        ))}

                        {/* Location Points */}
                        {locationGroups.map((loc, index) => {
                            // Convert lat/lng to SVG coordinates (rough approximation)
                            const x = ((loc.lng + 180) / 360) * 800;
                            const y = ((90 - loc.lat) / 180) * 400;

                            // Only show if within bounds
                            if (x < 0 || x > 800 || y < 0 || y > 400) return null;

                            const size = Math.min(20, 10 + loc.count * 2);
                            const isSelected = selectedLocation?.id === loc.id;

                            return (
                                <g
                                    key={loc.id || index}
                                    onClick={() => onSelectLocation(loc)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {mapView === 'heatmap' ? (
                                        // Heatmap style
                                        <circle
                                            cx={x}
                                            cy={y}
                                            r={size / 2}
                                            fill={theme.accent}
                                            opacity={0.3 + (loc.count * 0.1)}
                                        />
                                    ) : (
                                        // Point style
                                        <circle
                                            cx={x}
                                            cy={y}
                                            r={isSelected ? 8 : 5}
                                            fill={isSelected ? '#F59E0B' : theme.accent}
                                            stroke="#FFFFFF"
                                            strokeWidth="2"
                                        />
                                    )}
                                    {/* Label for selected location */}
                                    {isSelected && (
                                        <text
                                            x={x + 10}
                                            y={y - 10}
                                            fill={theme.text}
                                            fontSize="12"
                                            fontWeight="bold"
                                        >
                                            {loc.city}, {loc.countryCode}
                                        </text>
                                    )}
                                </g>
                            );
                        })}

                        {/* Map Attribution */}
                        <text x="10" y="390" fill={theme.textMuted} fontSize="10">
                            Approximate locations based on IP geolocation
                        </text>
                    </svg>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '400px',
                color: theme.textMuted
            }}>
                <FaHourglassHalf size={48} style={{ animation: 'spin 2s linear infinite' }} />
                <p style={{ marginLeft: '1rem' }}>Loading analytics data...</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'grid', gap: '2rem', padding: '1rem' }} className="analytics-container">
            <style>{`
                @media (max-width: 1024px) {
                    .analytics-container { padding: 0.5rem !important; }
                    .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 1rem !important; }
                    .dashboard-layout { grid-template-columns: 1fr !important; }
                }

                @media (max-width: 640px) {
                    .stats-grid { grid-template-columns: 1fr !important; }
                    .metric-tabs { gap: 0.5rem !important; }
                    .metric-tabs button { padding: 0.4rem 0.75rem !important; font-size: 0.8rem !important; }
                }
            `}</style>

            {/* Metric Selection Tabs */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                padding: '0.5rem',
                backgroundColor: theme.card,
                borderRadius: '12px',
                border: `1px solid ${theme.border}`,
                overflowX: 'auto'
            }} className="metric-tabs">
                {['realtime', 'geography', 'technology', 'performance'].map(metric => (
                    <button
                        key={metric}
                        onClick={() => setSelectedMetric(metric)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: selectedMetric === metric ? theme.accent : 'transparent',
                            color: selectedMetric === metric ? '#FFFFFF' : theme.textMuted,
                            cursor: 'pointer',
                            fontWeight: '600',
                            textTransform: 'capitalize',
                            transition: 'all 0.2s'
                        }}
                    >
                        {metric}
                    </button>
                ))}
            </div>

            {/* Key Metrics Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem'
            }} className="stats-grid">
                <MetricCard
                    icon={<FaEye />}
                    label="Total Visits"
                    value={stats.totalVisits}
                    subValue={`${stats.uniqueVisitors} unique`}
                    color="#3B82F6"
                    theme={theme}
                />
                <MetricCard
                    icon={<FaGlobe />}
                    label="Countries"
                    value={stats.topCountries.length}
                    subValue={`${stats.locations.length} locations`}
                    color="#10B981"
                    theme={theme}
                />
                <MetricCard
                    icon={<FaTachometerAlt />}
                    label="Avg Load Time"
                    value={`${stats.avgLoadTime}ms`}
                    subValue={`${stats.bounceRate}% bounce`}
                    color="#F59E0B"
                    theme={theme}
                />
                <MetricCard
                    icon={<FaChartLine />}
                    label="Return Rate"
                    value={`${stats.returningVisitors}%`}
                    subValue="returning visitors"
                    color="#8B5CF6"
                    theme={theme}
                />
            </div>

            {/* Location Map Section */}
            {stats.locations.length > 0 && (
                <div style={{
                    backgroundColor: theme.card,
                    padding: '1.5rem',
                    borderRadius: '20px',
                    border: `1px solid ${theme.border}`
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem'
                    }}>
                        <h4 style={{
                            fontWeight: '800',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <FaMapMarkedAlt color="#10B981" /> Visitor Locations
                            <span style={{
                                fontSize: '0.8rem',
                                backgroundColor: theme.bg,
                                color: theme.textMuted,
                                padding: '0.2rem 0.5rem',
                                borderRadius: '12px'
                            }}>
                                {stats.locations.length} points
                            </span>
                        </h4>

                        {/* Location Stats */}
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ fontSize: '0.8rem', color: theme.textMuted }}>
                                <FaLocationArrow color={theme.accent} /> Most active:{' '}
                                {stats.topCities[0]?.[0] || 'N/A'}
                            </div>
                        </div>
                    </div>

                    {/* Map */}
                    <LocationMap
                        locations={stats.locations}
                        selectedLocation={selectedLocation}
                        onSelectLocation={setSelectedLocation}
                    />

                    {/* Selected Location Details */}
                    {selectedLocation && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            backgroundColor: theme.bg,
                            borderRadius: '12px',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '1rem'
                        }}>
                            <div>
                                <p style={{ color: theme.textMuted, fontSize: '0.7rem' }}>Location</p>
                                <p style={{ fontWeight: '600' }}>
                                    {selectedLocation.city}, {selectedLocation.country}
                                </p>
                            </div>
                            <div>
                                <p style={{ color: theme.textMuted, fontSize: '0.7rem' }}>Coordinates</p>
                                <p style={{ fontWeight: '600', fontFamily: 'monospace' }}>
                                    {selectedLocation.lat.toFixed(4)}°, {selectedLocation.lng.toFixed(4)}°
                                </p>
                            </div>
                            <div>
                                <p style={{ color: theme.textMuted, fontSize: '0.7rem' }}>Device</p>
                                <p style={{ fontWeight: '600' }}>
                                    {selectedLocation.device} / {selectedLocation.browser}
                                </p>
                            </div>
                            <div>
                                <p style={{ color: theme.textMuted, fontSize: '0.7rem' }}>Visited</p>
                                <p style={{ fontWeight: '600' }}>
                                    {selectedLocation.timestamp?.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Main Dashboard Content */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: selectedMetric === 'realtime' ? '2fr 1fr' : '1fr 1fr',
                gap: '1.5rem'
            }} className="dashboard-layout">

                {/* Recent Visitors Table */}
                <div style={{
                    backgroundColor: theme.card,
                    padding: '1.5rem',
                    borderRadius: '20px',
                    border: `1px solid ${theme.border}`,
                    gridColumn: selectedMetric === 'realtime' ? '1 / 2' : '1 / -1'
                }}>
                    <h4 style={{
                        marginBottom: '1.5rem',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <FaChartLine color={theme.accent} /> Recent Visitors
                        <span style={{
                            fontSize: '0.7rem',
                            backgroundColor: theme.accent,
                            color: '#FFFFFF',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '12px',
                            marginLeft: 'auto'
                        }}>
                            LIVE
                        </span>
                    </h4>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                            <thead style={{ borderBottom: `2px solid ${theme.border}`, color: theme.textMuted }}>
                                <tr>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Visitor</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Location</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Coordinates</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Page</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Device</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Browser/OS</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentVisits.map(v => (
                                    <tr
                                        key={v.id}
                                        style={{
                                            borderBottom: `1px solid ${theme.border}`,
                                            cursor: v.latitude && v.longitude ? 'pointer' : 'default',
                                            backgroundColor: selectedLocation?.id === v.id ? theme.bg : 'transparent'
                                        }}
                                        onClick={() => v.latitude && v.longitude && setSelectedLocation({
                                            id: v.id,
                                            lat: v.latitude,
                                            lng: v.longitude,
                                            city: v.city,
                                            country: v.country,
                                            countryCode: v.countryCode,
                                            device: v.device,
                                            browser: v.browser,
                                            timestamp: v.timestamp
                                        })}
                                    >
                                        <td style={{ padding: '1rem 0.75rem', fontWeight: '600' }}>
                                            <FaUserSecret size={12} style={{ marginRight: '4px', opacity: 0.5 }} />
                                            {v.ip ? v.ip.split('.').slice(0, 2).join('.') + '.xxx' : 'Anonymous'}
                                        </td>
                                        <td style={{ padding: '1rem 0.75rem' }}>
                                            <FaMapMarkerAlt size={12} style={{ marginRight: '4px' }} />
                                            {v.city || 'Unknown'}, {v.countryCode || '--'}
                                        </td>
                                        <td style={{ padding: '1rem 0.75rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                            {v.latitude && v.longitude ? (
                                                <span title={`${v.latitude}, ${v.longitude}`}>
                                                    {v.latitude.toFixed(2)}°, {v.longitude.toFixed(2)}°
                                                </span>
                                            ) : (
                                                <span style={{ color: theme.textMuted }}>—</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem 0.75rem', color: theme.accent }}>
                                            {v.path?.split('/').pop() || '/'}
                                        </td>
                                        <td style={{ padding: '1rem 0.75rem' }}>
                                            {v.device === 'Mobile' ? <FaMobileAlt /> :
                                                v.device === 'Tablet' ? <FaTabletAlt /> : <FaDesktop />}
                                        </td>
                                        <td style={{ padding: '1rem 0.75rem' }}>
                                            {getBrowserIcon(v.browser)} {v.browser} / {getOsIcon(v.os)} {v.os?.split(' ')[0]}
                                        </td>
                                        <td style={{ padding: '1rem 0.75rem', textAlign: 'right', color: theme.textMuted }}>
                                            {v.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Dynamic Content Based on Selected Metric */}
                {selectedMetric === 'geography' && (
                    <div style={{
                        backgroundColor: theme.card,
                        padding: '1.5rem',
                        borderRadius: '20px',
                        border: `1px solid ${theme.border}`
                    }}>
                        <h4 style={{ marginBottom: '1rem', fontWeight: '800' }}>
                            <FaGlobe color="#10B981" /> Geographic Distribution
                        </h4>

                        {/* Countries */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h5 style={{ color: theme.textMuted, marginBottom: '0.5rem' }}>Top Countries</h5>
                            {stats.topCountries.map(([country, count]) => (
                                <div key={country} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '0.5rem',
                                    padding: '0.25rem 0'
                                }}>
                                    <span style={{ color: theme.text }}>{country}</span>
                                    <span style={{ fontWeight: '600' }}>{count} visits</span>
                                </div>
                            ))}
                        </div>

                        {/* Cities with Coordinates */}
                        <div>
                            <h5 style={{ color: theme.textMuted, marginBottom: '0.5rem' }}>Top Cities</h5>
                            {stats.topCities.map(([city, count]) => {
                                // Find a location with this city to get coordinates
                                const location = stats.locations.find(l => l.city === city);
                                return (
                                    <div key={city} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '0.5rem',
                                        padding: '0.25rem 0'
                                    }}>
                                        <span style={{ color: theme.text }}>
                                            {city}
                                            {location && (
                                                <span style={{
                                                    fontSize: '0.7rem',
                                                    color: theme.textMuted,
                                                    marginLeft: '0.5rem',
                                                    fontFamily: 'monospace'
                                                }}>
                                                    ({location.lat.toFixed(2)}°, {location.lng.toFixed(2)}°)
                                                </span>
                                            )}
                                        </span>
                                        <span style={{ fontWeight: '600' }}>{count} visits</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Coordinate Summary */}
                        {stats.locations.length > 0 && (
                            <div style={{
                                marginTop: '1rem',
                                padding: '0.75rem',
                                backgroundColor: theme.bg,
                                borderRadius: '8px',
                                fontSize: '0.8rem'
                            }}>
                                <p style={{ color: theme.textMuted, marginBottom: '0.25rem' }}>
                                    <FaCrosshairs /> Coordinate Range:
                                </p>
                                <p style={{ fontFamily: 'monospace' }}>
                                    Lat: {Math.min(...stats.locations.map(l => l.lat)).toFixed(2)}° to {Math.max(...stats.locations.map(l => l.lat)).toFixed(2)}°
                                </p>
                                <p style={{ fontFamily: 'monospace' }}>
                                    Lng: {Math.min(...stats.locations.map(l => l.lng)).toFixed(2)}° to {Math.max(...stats.locations.map(l => l.lng)).toFixed(2)}°
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {selectedMetric === 'technology' && (
                    <div style={{
                        backgroundColor: theme.card,
                        padding: '1.5rem',
                        borderRadius: '20px',
                        border: `1px solid ${theme.border}`
                    }}>
                        <h4 style={{ marginBottom: '1rem', fontWeight: '800' }}>
                            <FaMicrochip color="#8B5CF6" /> Technology Stack
                        </h4>

                        {/* Browsers */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h5 style={{ color: theme.textMuted, marginBottom: '0.5rem' }}>Browsers</h5>
                            {stats.browserData.slice(0, 5).map(([browser, count]) => (
                                <div key={browser} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '0.5rem',
                                    padding: '0.25rem 0'
                                }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {getBrowserIcon(browser)} {browser}
                                    </span>
                                    <span style={{ fontWeight: '600' }}>{count}</span>
                                </div>
                            ))}
                        </div>

                        {/* Operating Systems */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h5 style={{ color: theme.textMuted, marginBottom: '0.5rem' }}>Operating Systems</h5>
                            {stats.osData.slice(0, 5).map(([os, count]) => (
                                <div key={os} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '0.5rem',
                                    padding: '0.25rem 0'
                                }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {getOsIcon(os)} {os}
                                    </span>
                                    <span style={{ fontWeight: '600' }}>{count}</span>
                                </div>
                            ))}
                        </div>

                        {/* Screen Resolutions */}
                        <div>
                            <h5 style={{ color: theme.textMuted, marginBottom: '0.5rem' }}>Screen Resolutions</h5>
                            {stats.screenResolutions.map(([res, count]) => (
                                <div key={res} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '0.25rem',
                                    fontSize: '0.8rem'
                                }}>
                                    <span>{res}</span>
                                    <span>{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {selectedMetric === 'performance' && (
                    <div style={{
                        backgroundColor: theme.card,
                        padding: '1.5rem',
                        borderRadius: '20px',
                        border: `1px solid ${theme.border}`
                    }}>
                        <h4 style={{ marginBottom: '1rem', fontWeight: '800' }}>
                            <FaTachometerAlt color="#F59E0B" /> Performance Metrics
                        </h4>

                        {/* Core Metrics */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '1rem',
                            marginBottom: '1.5rem'
                        }}>
                            <div style={{
                                padding: '1rem',
                                backgroundColor: theme.bg,
                                borderRadius: '12px',
                                textAlign: 'center'
                            }}>
                                <FaHourglassHalf size={20} color={theme.accent} />
                                <p style={{ fontSize: '0.7rem', color: theme.textMuted }}>Load Time</p>
                                <p style={{ fontSize: '1.2rem', fontWeight: '700' }}>{stats.avgLoadTime}ms</p>
                            </div>
                            <div style={{
                                padding: '1rem',
                                backgroundColor: theme.bg,
                                borderRadius: '12px',
                                textAlign: 'center'
                            }}>
                                <FaChartLine size={20} color={theme.accent} />
                                <p style={{ fontSize: '0.7rem', color: theme.textMuted }}>Bounce Rate</p>
                                <p style={{ fontSize: '1.2rem', fontWeight: '700' }}>{stats.bounceRate}%</p>
                            </div>
                        </div>

                        {/* Connection Types */}
                        <div>
                            <h5 style={{ color: theme.textMuted, marginBottom: '0.5rem' }}>
                                <FaNetworkWired /> Connection Distribution
                            </h5>
                            {stats.connectionData.map(([type, count]) => (
                                <div key={type} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '0.5rem'
                                }}>
                                    <span style={{ textTransform: 'uppercase' }}>{type || 'Unknown'}</span>
                                    <span style={{ fontWeight: '600' }}>{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Popular Pages - Always visible */}
            <div style={{
                backgroundColor: theme.card,
                padding: '1.5rem',
                borderRadius: '20px',
                border: `1px solid ${theme.border}`
            }}>
                <h4 style={{ marginBottom: '1rem', fontWeight: '800' }}>
                    <FaChartBar color={theme.accent} /> Popular Pages
                </h4>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem'
                }}>
                    {stats.topPages.map(([page, count]) => (
                        <div key={page} style={{
                            padding: '1rem',
                            backgroundColor: theme.bg,
                            borderRadius: '12px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span style={{ color: theme.text, fontWeight: '500' }}>
                                {page.split('/').pop() || '/'}
                            </span>
                            <span style={{
                                backgroundColor: theme.accent,
                                color: '#FFFFFF',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                fontWeight: '600'
                            }}>
                                {count}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Metric Card Component
const MetricCard = ({ icon, label, value, subValue, color, theme }) => (
    <div style={{
        backgroundColor: theme.card,
        padding: '1.5rem',
        borderRadius: '20px',
        border: `1px solid ${theme.border}`,
        transition: 'transform 0.2s',
        cursor: 'pointer',
        ':hover': {
            transform: 'translateY(-2px)'
        }
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ color }}>{icon}</span>
            <p style={{ color: theme.textMuted, fontSize: '0.8rem', fontWeight: '700' }}>{label}</p>
        </div>
        <h3 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.25rem' }}>{value}</h3>
        <p style={{ color: theme.textMuted, fontSize: '0.8rem' }}>{subValue}</p>
    </div>
);

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

export default AnalyticsDashboard;