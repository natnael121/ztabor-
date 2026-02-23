import { useEffect } from 'react';

const SEO = ({ title, description, keywords, image, url }) => {
    const siteName = "Z-Tabor Solar";

    const fullTitle = title
        ? `${title} | ${siteName}`
        : `${siteName} - Renewable Energy Solutions`;

    const defaultDescription =
        "Z-Tabor Solar provides advanced renewable energy solutions, from high-efficiency solar panels to intelligent energy storage systems. Powering Ethiopia sustainably.";
    const metaDescription = description || defaultDescription;

    const metaKeywords =
        keywords ||
        "Z-Tabor Solar, solar panels, renewable energy, portable power, energy storage, clean energy Ethiopia, sustainable technology";

    // Update with new OG image if available, else default
    const metaImage = image || "https://www.z-tabor.com/logo-og.png";

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