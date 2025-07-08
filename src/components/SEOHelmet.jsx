import { Helmet } from 'react-helmet-async';

const SEOHelmet = ({ 
    title, 
    description, 
    keywords, 
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    ogType = 'website'
}) => {
    const defaultTitle = 'FresaTerra - Fresas Frescas en Cusco | Entrega en 1-2 horas';
    const defaultDescription = 'Fresas frescas de calidad premium en Cusco. Entrega rápida en 1-2 horas. Paquetes de 1kg, 2kg y 5kg. Directo del productor a tu mesa. ¡Ordena ahora!';
    const defaultKeywords = 'fresas cusco, fresas frescas, entrega fresas cusco, fresas premium, frutas frescas cusco, delivery fresas, paquetes fresas';
    const baseUrl = 'https://fresaterra.shop';
    const defaultOgImage = `${baseUrl}/img/fresasfondo.jpg`;

    return (
        <Helmet>
            {/* Title Tags */}
            <title>{title ? `${title} | FresaTerra` : defaultTitle}</title>
            
            {/* Meta Tags */}
            <meta name="description" content={description || defaultDescription} />
            <meta name="keywords" content={keywords || defaultKeywords} />
            <meta name="author" content="FresaTerra" />
            <meta name="robots" content="index, follow" />
            <meta name="language" content="es" />
            <meta name="geo.region" content="PE-CUS" />
            <meta name="geo.placename" content="Cusco, Perú" />
            <meta name="geo.position" content="-13.5319;-71.9675" />
            <meta name="ICBM" content="-13.5319, -71.9675" />
            
            {/* Canonical URL */}
            {canonical && <link rel="canonical" href={`${baseUrl}${canonical}`} />}
            
            {/* Favicon and Icons */}
            <link rel="icon" type="image/svg+xml" href="/favicon-strawberry.svg" />
            <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            <link rel="apple-touch-icon" sizes="180x180" href="/favicon-strawberry.svg" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-strawberry.svg" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-strawberry.svg" />
            <link rel="manifest" href="/site.webmanifest" />
            <link rel="mask-icon" href="/favicon-strawberry.svg" color="#dc2626" />
            <meta name="msapplication-TileColor" content="#dc2626" />
            
            {/* Open Graph Tags */}
            <meta property="og:type" content={ogType} />
            <meta property="og:title" content={ogTitle || title || defaultTitle} />
            <meta property="og:description" content={ogDescription || description || defaultDescription} />
            <meta property="og:image" content={ogImage || defaultOgImage} />
            <meta property="og:url" content={canonical ? `${baseUrl}${canonical}` : baseUrl} />
            <meta property="og:site_name" content="FresaTerra" />
            <meta property="og:locale" content="es_PE" />
            
            {/* Twitter Card Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={ogTitle || title || defaultTitle} />
            <meta name="twitter:description" content={ogDescription || description || defaultDescription} />
            <meta name="twitter:image" content={ogImage || defaultOgImage} />
            
            {/* Additional Meta Tags for E-commerce */}
            <meta name="theme-color" content="#dc2626" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="format-detection" content="telephone=no" />
            
            {/* Structured Data for Local Business */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "LocalBusiness",
                    "name": "FresaTerra",
                    "description": "Venta de fresas frescas premium en Cusco con entrega rápida",
                    "url": "https://fresaterra.shop",
                    "telephone": "+51929714978",
                    "email": "fresaterra@gmail.com",
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Cusco",
                        "addressRegion": "Cusco",
                        "addressCountry": "PE"
                    },
                    "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": -13.5319,
                        "longitude": -71.9675
                    },
                    "openingHours": [
                        "Mo-Fr 08:00-18:00",
                        "Sa 09:00-14:00"
                    ],
                    "priceRange": "$$",
                    "servesCuisine": "Frutas Frescas",
                    "serviceArea": {
                        "@type": "City",
                        "name": "Cusco"
                    }
                })}
            </script>
        </Helmet>
    );
};

export default SEOHelmet;
