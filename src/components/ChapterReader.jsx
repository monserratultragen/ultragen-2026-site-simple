import React, { useEffect, useState } from 'react';
import { getImageUrl as resolveUrl } from '../utils/imageUtils';

const getImageUrl = (tag) => {
    const match = tag.match(/\[img:\s*(.*?)\]/);
    const url = match ? match[1].trim() : tag.trim();
    return resolveUrl(url);
};

const GalleryLayout = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    return (
        <div className="gallery-layout">
            <div className="gallery-sidebar">
                {images.map((img, idx) => (
                    <img
                        key={idx}
                        src={getImageUrl(img)}
                        className={`gallery-thumb ${getImageUrl(img) === getImageUrl(selectedImage) ? 'active' : ''}`}
                        onClick={() => setSelectedImage(img)}
                        alt="Thumbnail"
                    />
                ))}
            </div>
            <div className="gallery-main">
                <img src={getImageUrl(selectedImage)} alt="Selected" />
            </div>
        </div>
    );
};


const ChapterReader = ({ chapter, onClose }) => {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [copied, setCopied] = useState(false);

    // Access Control State
    const [accessCode, setAccessCode] = useState('');
    // Explicitly check for is_vip property
    const isActuallyVip = !!chapter?.is_vip;
    // Unlocked if NOT VIP OR if we have a global master unlock OR if this specific chapter was unlocked
    const [isUnlocked, setIsUnlocked] = useState(() => {
        if (!isActuallyVip) return true;
        if (sessionStorage.getItem('master_unlocked') === 'true') return true;
        if (sessionStorage.getItem(`unlocked_${chapter?.id}`) === 'true') return true;
        return false;
    });
    const [validating, setValidating] = useState(false);
    const [error, setError] = useState('');

    console.warn(`[DEBUG-VIP] Chapter: ${chapter?.nombre} (ID: ${chapter?.id}) | is_vip: ${chapter?.is_vip} | Start Unlocked: ${!isActuallyVip}`);

    const handleCopy = () => {
        if (!chapter || !chapter.contenido) return;
        // Clean text: remove [img:...] tags and extra whitespace
        const cleanText = chapter.contenido.replace(/\[img:\s*.*?\]/g, '').replace(/\n\s*\n/g, '\n\n').trim();
        navigator.clipboard.writeText(cleanText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleValidate = async (e) => {
        e.preventDefault();
        setValidating(true);
        setError('');

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/api/claves-acceso/validar/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clave: accessCode })
            });

            const data = await response.json();

            if (response.ok && data.status === 'valida') {
                setIsUnlocked(true);
                if (data.tipo === 'maestra') {
                    console.warn("[DEBUG-VIP] Master Key detected! Global unlock activated.");
                    sessionStorage.setItem('master_unlocked', 'true');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    sessionStorage.setItem(`unlocked_${chapter.id}`, 'true');
                }
            } else {
                setError(data.mensaje || 'Código incorrecto o expirado');
            }
        } catch (err) {
            setError('Error de conexión con el servidor');
        } finally {
            setValidating(false);
        }
    };

    useEffect(() => {
        // Double check session storage
        if (isActuallyVip) {
            if (sessionStorage.getItem('master_unlocked') === 'true' ||
                sessionStorage.getItem(`unlocked_${chapter.id}`) === 'true') {
                console.warn(`[DEBUG-VIP] Chapter ${chapter.id} unlocked via session storage`);
                setIsUnlocked(true);
            }
        }

        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';

        if (!chapter) return;

        // If locked, we don't load images yet
        if (chapter.is_vip && !isUnlocked) {
            setLoading(false);
            return;
        }

        // Extract image URLs
        const content = chapter.contenido || '';
        const matches = content.match(/\[img:\s*(.*?)\]/g) || [];
        const imageUrls = matches.map(tag => getImageUrl(tag)).filter(url => url);

        if (imageUrls.length === 0) {
            setLoading(false);
            return () => { document.body.style.overflow = 'unset'; };
        }

        // Preload images
        let loadedCount = 0;
        const totalImages = imageUrls.length;

        const updateProgress = () => {
            loadedCount++;
            const newProgress = (loadedCount / totalImages) * 100;
            setProgress(newProgress);
            if (loadedCount >= totalImages) {
                setLoading(false);
            }
        };

        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
            img.onload = updateProgress;
            img.onerror = updateProgress; // Proceed even if error
        });

        return () => {
            document.body.style.overflow = 'unset';
            // Cleanup logic if needed (e.g. cancel image loads - complex in pure JS)
        };
    }, [chapter]);

    if (!chapter) return null;

    // UI for Access Prompt
    if (isActuallyVip && !isUnlocked) {
        return (
            <div className="reader-overlay access-overlay">
                <div className="reader-content access-prompt" style={{
                    maxWidth: '400px',
                    margin: 'auto',
                    textAlign: 'center',
                    padding: '40px 20px',
                    backgroundColor: '#1a1a1a',
                    border: '1px solid gold',
                    boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)',
                    height: 'auto'
                }}>
                    <button className="close-reader-btn" onClick={onClose}>&times;</button>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔒</div>
                    <h2 style={{ color: 'gold', marginBottom: '10px' }}>Contenido VIP</h2>
                    <p style={{ color: '#ccc', marginBottom: '20px', fontSize: '0.9rem' }}>
                        Este capítulo requiere un código de acceso válido.
                    </p>

                    <form onSubmit={handleValidate}>
                        <input
                            type="text"
                            placeholder="Introduce tu código"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                            autoCapitalize="none"
                            autoCorrect="off"
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: '#333',
                                border: '1px solid #444',
                                color: 'white',
                                borderRadius: '4px',
                                marginBottom: '15px',
                                textAlign: 'center',
                                letterSpacing: '2px',
                                fontSize: '1.1rem'
                            }}
                            autoFocus
                        />
                        {error && <p style={{ color: '#ff4444', fontSize: '0.8rem', marginBottom: '15px' }}>{error}</p>}
                        <button
                            type="submit"
                            disabled={validating || !accessCode}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'gold',
                                color: 'black',
                                border: 'none',
                                borderRadius: '4px',
                                fontWeight: 'bold',
                                cursor: validating ? 'wait' : 'pointer',
                                opacity: validating || !accessCode ? 0.6 : 1
                            }}
                        >
                            {validating ? 'Validando...' : 'Desbloquear'}
                        </button>
                    </form>
                </div>
            </div >
        );
    }

    // Parsing Logic
    const contentParts = chapter.contenido ? chapter.contenido.split(/(\[img:.*?\])/) : [];
    const groupedContent = [];
    let currentImages = [];

    contentParts.forEach(part => {
        if (part.match(/\[img:.*?\]/)) {
            currentImages.push(part);
        } else {
            if (currentImages.length > 0) {
                groupedContent.push({ type: 'images', items: currentImages });
                currentImages = [];
            }
            if (part.trim()) { // Only add non-empty text
                groupedContent.push({ type: 'text', content: part });
            }
        }
    });
    // Push remaining images
    if (currentImages.length > 0) {
        groupedContent.push({ type: 'images', items: currentImages });
    }

    return (
        <div className="reader-overlay">
            <div className="reader-content">
                <button className="close-reader-btn" onClick={onClose}>&times;</button>
                <div className="reader-header">
                    <h2>{chapter.nombre}</h2>
                    <p>{chapter.tomo_nombre} - {chapter.diario_nombre} {chapter.is_vip && <span style={{ color: 'gold' }}>[VIP]</span>}</p>
                </div>

                {loading ? (
                    <div className="reader-loading" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '200px',
                        color: 'white' // Assuming dark theme usually, or adapt
                    }}>
                        <p style={{ marginBottom: '10px' }}>Cargando imágenes...</p>
                        <div style={{
                            width: '200px',
                            height: '4px',
                            backgroundColor: '#333',
                            borderRadius: '2px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                width: `${progress}%`,
                                height: '100%',
                                backgroundColor: 'var(--accent-color, #fff)', // Use CSS var or fallback
                                transition: 'width 0.2s ease-out'
                            }}></div>
                        </div>
                    </div>
                ) : (
                    <div className="reader-body">
                        <button
                            className={`copy-chapter-btn ${copied ? 'copied' : ''}`}
                            onClick={handleCopy}
                            title="Copiar texto al portapapeles"
                        >
                            {copied ? '✓ Copiado' : '📋 Copiar'}
                        </button>
                        {groupedContent.length > 0 ? (
                            groupedContent.map((block, index) => {
                                if (block.type === 'text') {
                                    // Detect lines starting with -- and wrap them
                                    const processedContent = block.content.split('\n').map(line => {
                                        if (line.trim().startsWith('--')) {
                                            return `<span class="scene-marker">${line}</span>`;
                                        }
                                        return line;
                                    }).join('\n');
                                    return <div key={index} dangerouslySetInnerHTML={{ __html: processedContent }} />;
                                } else if (block.type === 'images') {
                                    if (block.items.length === 1) {
                                        return <img key={index} src={getImageUrl(block.items[0])} className="single-image" alt="Chapter Content" />;
                                    } else if (block.items.length === 2) {
                                        return (
                                            <div key={index} className="double-image-grid">
                                                {block.items.map((img, i) => <img key={i} src={getImageUrl(img)} alt="Chapter Content" />)}
                                            </div>
                                        );
                                    } else {
                                        return <GalleryLayout key={index} images={block.items} />;
                                    }
                                }
                                return null;
                            })
                        ) : (
                            <p>Contenido no disponible.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChapterReader;
