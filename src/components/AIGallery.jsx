import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getImageUrl } from '../utils/imageUtils';

const AIGallery = () => {
    const [prompts, setPrompts] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                const [promptsRes, imagesRes] = await Promise.all([
                    axios.get(`${apiUrl}/api/prompts-ai/`),
                    axios.get(`${apiUrl}/api/imagenes-ai-base/`)
                ]);
                setPrompts(promptsRes.data);
                setImages(imagesRes.data);
            } catch (err) {
                console.error("Error fetching AI data:", err);
                setError("No se pudieron cargar los datos de AI.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div style={{ color: '#aaa', textAlign: 'center', padding: '40px' }}>Cargando datos de AI...</div>;
    if (error) return <div style={{ color: '#ff4d4d', textAlign: 'center', padding: '40px' }}>{error}</div>;

    return (
        <div style={{ padding: '20px 0' }}>
            {/* Prompts Section */}
            <div style={{ marginBottom: '50px' }}>
                <h3 style={{
                    color: 'var(--accent-color, #ff4c4c)',
                    marginBottom: '20px',
                    fontSize: '1.4rem',
                    borderBottom: '1px solid rgba(255, 76, 76, 0.3)',
                    paddingBottom: '10px'
                }}>
                    ✨ Prompts AI Destacados
                </h3>
                {prompts.length === 0 ? (
                    <p style={{ color: '#666', fontStyle: 'italic' }}>No hay prompts registrados aún.</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                        {prompts.map(prompt => (
                            <div key={prompt.id} style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                padding: '20px',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <h4 style={{ color: '#fff', fontSize: '1.1rem', margin: '0 0 10px 0' }}>{prompt.titulo}</h4>
                                <div style={{
                                    backgroundColor: '#111',
                                    padding: '12px',
                                    borderRadius: '4px',
                                    flexGrow: 1,
                                    color: '#ccc',
                                    fontFamily: 'monospace',
                                    fontSize: '0.85rem',
                                    marginBottom: '15px',
                                    overflowY: 'auto',
                                    maxHeight: '150px',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {prompt.prompt}
                                </div>
                                {prompt.notas && (
                                    <p style={{ color: '#888', fontSize: '0.85rem', margin: '0 0 15px 0' }}>
                                        {prompt.notas}
                                    </p>
                                )}
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(prompt.prompt).catch(console.error);
                                    }}
                                    style={{
                                        marginTop: 'auto',
                                        background: 'transparent',
                                        border: '1px solid var(--accent-color, #ff4c4c)',
                                        color: 'var(--accent-color, #ff4c4c)',
                                        padding: '8px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        fontSize: '0.9rem'
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.background = 'var(--accent-color, #ff4c4c)';
                                        e.target.style.color = '#fff';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.background = 'transparent';
                                        e.target.style.color = 'var(--accent-color, #ff4c4c)';
                                    }}
                                >
                                    Copiar Prompt
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Images Section */}
            <div>
                <h3 style={{
                    color: 'var(--accent-color, #ff4c4c)',
                    marginBottom: '20px',
                    fontSize: '1.4rem',
                    borderBottom: '1px solid rgba(255, 76, 76, 0.3)',
                    paddingBottom: '10px'
                }}>
                    🖼️ Imágenes AI Base
                </h3>
                {images.length === 0 ? (
                    <p style={{ color: '#666', fontStyle: 'italic' }}>No hay imágenes registradas aún.</p>
                ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                        {images.map(item => (
                            <div key={item.id} style={{
                                width: '180px',
                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <div style={{ width: '180px', height: '270px', backgroundColor: '#111', overflow: 'hidden' }}>
                                    {item.imagen ? (
                                        <img
                                            src={getImageUrl(item.imagen)}
                                            alt={item.titulo}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>Sin imagen</div>
                                    )}
                                </div>
                                <div style={{ padding: '12px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h4 style={{ color: '#fff', fontSize: '0.95rem', margin: '0 0 5px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.titulo}</h4>
                                    {item.notas && (
                                        <p style={{ color: '#888', fontSize: '0.8rem', margin: '0', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {item.notas}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIGallery;
