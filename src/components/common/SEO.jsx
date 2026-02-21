import { useEffect } from 'react';

const SEO = ({ title, description, keywords, image, url }) => {
    const siteName = "Tabor Solar";

    const fullTitle = title
        ? `${title} | ${siteName}`
        : `${siteName} - Sustainable Energy Solutions`;

    const defaultDescription =
        "Empower your grid with Tabor Solar. Discover next-generation solar solutions, from portable kits to industrial energy storage systems.";
    const metaDescription = description || defaultDescription;

    const metaKeywords =
        keywords ||
        "Tabor Solar, solar energy, sustainable power, portable solar, energy storage, industrial solar, clean energy Ethiopia";

    // ✅ YOUR IMAGE ADDED HERE
    const metaImage =
        image ||
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxxtFeeMi-YSz1U9J5rpgMz7gaNdNbvaSKGO9oMtNmjw&s=10";

    useEffect(() => {
        // Update document title
        document.title = fullTitle;

        const siteUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

        // Helper function to update/create meta tags
        const updateMetaTag = (attr, value, content) => {
            if (!content) return;
            let element = document.querySelector(`meta[${attr}="${value}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attr, value);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        // Standard SEO
        updateMetaTag('name', 'description', metaDescription);
        updateMetaTag('name', 'keywords', metaKeywords);

        // OpenGraph (Facebook, Telegram, LinkedIn)
        updateMetaTag('property', 'og:title', fullTitle);
        updateMetaTag('property', 'og:description', metaDescription);
        updateMetaTag('property', 'og:image', metaImage);
        updateMetaTag('property', 'og:url', siteUrl);
        updateMetaTag('property', 'og:type', 'website');

        // Optional (better previews)
        updateMetaTag('property', 'og:image:width', '1200');
        updateMetaTag('property', 'og:image:height', '630');

        // Twitter SEO
        updateMetaTag('name', 'twitter:card', 'summary_large_image');
        updateMetaTag('name', 'twitter:title', fullTitle);
        updateMetaTag('name', 'twitter:description', metaDescription);
        updateMetaTag('name', 'twitter:image', metaImage);

    }, [fullTitle, metaDescription, metaKeywords, metaImage, url]);

    return null;
};

export default SEO;