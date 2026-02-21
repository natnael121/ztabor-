import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const AnalyticsService = {
    logVisit: async (path) => {
        try {
            // Enhanced Device Detection
            const ua = navigator.userAgent;
            const platform = navigator.platform;
            
            // Device Type
            let deviceType = 'Desktop';
            if (/Mobi|Android|iPhone|BlackBerry|IEMobile|Opera Mini/i.test(ua)) deviceType = 'Mobile';
            if (/Tablet|iPad|PlayBook|Silk/i.test(ua)) deviceType = 'Tablet';

            // OS Detection
            let os = 'Unknown';
            if (/Windows NT 10/i.test(ua)) os = 'Windows 10';
            else if (/Windows NT 6.3/i.test(ua)) os = 'Windows 8.1';
            else if (/Windows NT 6.2/i.test(ua)) os = 'Windows 8';
            else if (/Windows NT 6.1/i.test(ua)) os = 'Windows 7';
            else if (/Mac OS X/i.test(ua)) os = 'macOS';
            else if (/Linux/i.test(ua)) os = 'Linux';
            else if (/Android/i.test(ua)) os = 'Android';
            else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';

            // Browser Detection (more accurate)
            let browser = 'Unknown';
            if (ua.includes('Firefox/')) browser = 'Firefox';
            else if (ua.includes('Edg/')) browser = 'Edge';
            else if (ua.includes('Chrome/') && !ua.includes('Edg/')) browser = 'Chrome';
            else if (ua.includes('Safari/') && !ua.includes('Chrome/')) browser = 'Safari';
            else if (ua.includes('OPR/') || ua.includes('Opera/')) browser = 'Opera';

            // Screen & Window Info
            const screenInfo = {
                screenWidth: window.screen.width,
                screenHeight: window.screen.height,
                screenColorDepth: window.screen.colorDepth,
                windowWidth: window.innerWidth,
                windowHeight: window.innerHeight,
                pixelRatio: window.devicePixelRatio || 1,
                orientation: window.screen.orientation?.type || 'unknown'
            };

            // Connection Info (where available)
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            const connectionInfo = connection ? {
                connectionType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData
            } : {};

            // Language & Timezone
            const localeInfo = {
                language: navigator.language,
                languages: navigator.languages?.join(','),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                timezoneOffset: new Date().getTimezoneOffset()
            };

            // Hardware Info (basic)
            const hardwareInfo = {
                cores: navigator.hardwareConcurrency || 'unknown',
                memory: navigator.deviceMemory ? `${navigator.deviceMemory}GB` : 'unknown',
                platform: platform,
                vendor: navigator.vendor,
                cookiesEnabled: navigator.cookieEnabled,
                doNotTrack: navigator.doNotTrack
            };

            // More detailed geo data
            let geoData = {};
            try {
                // Using ipapi.co with more fields
                const geoRes = await fetch('https://ipapi.co/json/');
                if (geoRes.ok) {
                    const data = await geoRes.json();
                    geoData = {
                        ip: data.ip,
                        city: data.city,
                        region: data.region,
                        regionCode: data.region_code,
                        country: data.country_name,
                        countryCode: data.country_code,
                        continent: data.continent_code,
                        postal: data.postal,
                        latitude: data.latitude,
                        longitude: data.longitude,
                        timezone: data.timezone,
                        utcOffset: data.utc_offset,
                        countryCallingCode: data.country_calling_code,
                        currency: data.currency,
                        languages: data.languages,
                        org: data.org,
                        asn: data.asn
                    };
                }
            } catch (e) {
                console.warn('Geo tracking failed:', e);
            }

            // Performance metrics
            let performanceData = {};
            if (window.performance) {
                const perf = window.performance;
                const nav = perf.navigation;
                performanceData = {
                    loadTime: perf.timing ? perf.timing.loadEventEnd - perf.timing.navigationStart : null,
                    domInteractive: perf.timing ? perf.timing.domInteractive - perf.timing.navigationStart : null,
                    redirectCount: nav ? nav.redirectCount : null,
                    type: nav ? nav.type : null
                };
            }

            // Touch support
            const touchSupport = {
                maxTouchPoints: navigator.maxTouchPoints || 0,
                touchEvent: 'ontouchstart' in window
            };

            // User behavior (optional)
            const behavior = {
                referrer: document.referrer || 'Direct',
                landingPage: path || window.location.pathname,
                queryString: window.location.search || null,
                hash: window.location.hash || null,
                href: window.location.href
            };

            // Log all data to Firestore
            await addDoc(collection(db, 'visits'), {
                timestamp: serverTimestamp(),
                
                // Basic Info
                path: behavior.landingPage,
                referrer: behavior.referrer,
                fullUrl: behavior.href,
                queryString: behavior.queryString,
                
                // Device & Browser
                deviceType,
                browser,
                browserVersion: ua.match(/(Chrome|Firefox|Safari|Edge)\/(\d+)/)?.[2] || 'unknown',
                os,
                
                // Screen & Window
                ...screenInfo,
                
                // Connection
                ...connectionInfo,
                
                // Locale
                ...localeInfo,
                
                // Hardware
                ...hardwareInfo,
                
                // Touch
                ...touchSupport,
                
                // Performance
                ...performanceData,
                
                // Geo (if available)
                ...geoData,
                
                // User agent for debugging
                userAgent: ua.substring(0, 500) // Truncate to avoid Firestore limits
            });

        } catch (error) {
            console.error('Analytics log failed:', error);
        }
    },

    // Optional: Log custom events
    logEvent: async (eventName, eventData = {}) => {
        try {
            await addDoc(collection(db, 'events'), {
                eventName,
                ...eventData,
                timestamp: serverTimestamp(),
                path: window.location.pathname,
                userAgent: navigator.userAgent.substring(0, 500)
            });
        } catch (error) {
            console.error('Event logging failed:', error);
        }
    },

    // Optional: Log page leave/exit
    logExit: async () => {
        try {
            await addDoc(collection(db, 'exits'), {
                path: window.location.pathname,
                timestamp: serverTimestamp(),
                timeOnPage: Date.now() - performance.timing.navigationStart
            });
        } catch (error) {
            console.error('Exit logging failed:', error);
        }
    }
};

export default AnalyticsService;