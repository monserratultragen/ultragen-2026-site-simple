import React, { useEffect, useState } from 'react';

// Helper to extract URL from [img: url]
const getImageUrl = (tag) => {
    const match = tag.match(/\[img:\s*(.*?)\]/);
    return match ? `http://localhost:8000${match[1].trim()}` : '';
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
    useEffect(() => {
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (!chapter) return null;

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
                    <p>{chapter.tomo_nombre} - {chapter.diario_nombre}</p>
                </div>
                <div className="reader-body">
                    {groupedContent.length > 0 ? (
                        groupedContent.map((block, index) => {
                            if (block.type === 'text') {
                                return <div key={index} dangerouslySetInnerHTML={{ __html: block.content }} />;
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
            </div>
        </div>
    );
};

export default ChapterReader;
