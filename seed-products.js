import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import fs from 'fs';

const dotenv = fs.readFileSync('.env', 'utf8');
const config = {
    apiKey: dotenv.match(/VITE_FIREBASE_API_KEY=(.*)/)[1].trim().replace(/['"]/g, ''),
    authDomain: dotenv.match(/VITE_FIREBASE_AUTH_DOMAIN=(.*)/)[1].trim().replace(/['"]/g, ''),
    projectId: dotenv.match(/VITE_FIREBASE_PROJECT_ID=(.*)/)[1].trim().replace(/['"]/g, ''),
    storageBucket: dotenv.match(/VITE_FIREBASE_STORAGE_BUCKET=(.*)/)[1].trim().replace(/['"]/g, ''),
    messagingSenderId: dotenv.match(/VITE_FIREBASE_MESSAGING_SENDER_ID=(.*)/)[1].trim().replace(/['"]/g, ''),
    appId: dotenv.match(/VITE_FIREBASE_APP_ID=(.*)/)[1].trim().replace(/['"]/g, '')
};

const app = initializeApp(config);
const db = getFirestore(app);

const urls = JSON.parse(fs.readFileSync('uploaded_urls.json', 'utf8'));

const demoProducts = [
    {
        name: "GlowSun-18", subtitle: "Practical Multifunction", category: "Portable Solar",
        dimensions: "5Wp", batteryStorage: "18.5Wh", college: "Practical & Portable", medals: 5,
        imageUrl: urls["GlowSun-1837.png"],
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
        imageUrl: urls["GlowSun-1837.png"],
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
        imageUrl: urls["GlowSun 160.png"],
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
        imageUrl: urls["IntelliSun-512.png"],
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
        imageUrl: urls["IntelliSun-1004.png"],
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
        imageUrl: urls["IntelliSun-5120.png"],
        description: "Industrial-grade energy solution capable of powering fridges, air conditioners, and professional equipment. The ultimate off-grid power plant.",
        timeline: [
            { year: "5.1kWh", title: "Giant Capacity", description: "Full day house power" },
            { year: "64h", title: "Fridge", description: "Keeps food fresh during outages" },
            { year: "4h", title: "AC Use", description: "Heavy appliance compatibility" }
        ]
    }
];

async function seed() {
    console.log("Seeding products...");
    for (const prod of demoProducts) {
        try {
            await addDoc(collection(db, "products"), {
                ...prod,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            console.log(`Added: ${prod.name}`);
        } catch (err) {
            console.error(`Error adding ${prod.name}:`, err);
        }
    }
    console.log("Seeding complete!");
    process.exit(0);
}

seed();
