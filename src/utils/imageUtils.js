const CLOUDINARY_BASE = "https://res.cloudinary.com/dxncjhrtt/image/upload/v1/";

/**
 * Función centralizada para resolver URLs de imágenes de Cloudinary.
 * Maneja limpieza de URLs de Render, prefijos /media/ y formateo con v1/.
 */
export const getImageUrl = (url) => {
    if (!url) return '';

    // 🔥 Limpieza ultra-agresiva para URLs de Render o absolutas
    let cleanUrl = String(url);

    // 1. Si contiene 'ultragen_media/', extraemos solo esa parte hasta el final
    if (cleanUrl.includes('ultragen_media/')) {
        cleanUrl = 'ultragen_media/' + cleanUrl.split('ultragen_media/').pop();
    }
    // 2. Si contiene '/media/', extraemos lo que hay después
    else if (cleanUrl.includes('/media/')) {
        cleanUrl = cleanUrl.split('/media/').pop();
    }

    // 3. Si sigue siendo una URL absoluta (http/https) que no es Cloudinary, la dejamos igual
    if (cleanUrl.startsWith('http')) return cleanUrl;

    // 4. Manejo de rutas parciales de Cloudinary (si ya traen el cloud_name)
    if (cleanUrl.startsWith('/dxncjhrtt/')) {
        return `https://res.cloudinary.com${cleanUrl}`;
    }

    // 5. Construcción de URL de Cloudinary usando el public_id
    if (cleanUrl.startsWith('ultragen_media/')) {
        return `${CLOUDINARY_BASE}${cleanUrl}`;
    }

    // 6. Fallback (desarrollo local o rutas relativas desconocidas)
    return `${import.meta.env.VITE_API_URL}${cleanUrl}`;
};
