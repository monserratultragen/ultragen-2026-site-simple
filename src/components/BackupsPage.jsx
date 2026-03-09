import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getImageUrl } from '../utils/imageUtils';
import AIBackupsTable from './AIBackupsTable';

const BackupsPage = ({ chapters, onNavigate }) => {
    const [activeTab, setActiveTab] = useState('chapter_backups'); // Default to chapter backups
    const [prompts, setPrompts] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [visitorStats, setVisitorStats] = useState([]);
    const [toast, setToast] = useState(null);

    const isMaster = localStorage.getItem('isMaster') === 'true' || !!chapters?.some(c => c.is_vip); // Heuristic for master key

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 1500);
    };

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);

        const fetchData = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

                // 1. Log Visit (Silent)
                axios.post(`${apiUrl}/api/visitas/log_visit/`, { ruta: '/backups' })
                    .catch(e => console.error("Tracking silent error", e));

                const requests = [
                    axios.get(`${apiUrl}/api/prompts-ai/`),
                    axios.get(`${apiUrl}/api/imagenes-ai-base/`)
                ];

                // 2. Fetch Stats if authorized
                if (isMaster) {
                    requests.push(axios.get(`${apiUrl}/api/visitas/stats/`));
                }

                const responses = await Promise.all(requests);
                setPrompts(responses[0].data);
                setImages(responses[1].data);
                if (isMaster && responses[2]) {
                    setVisitorStats(responses[2].data);
                }
            } catch (err) {
                console.error("Error fetching AI data:", err);
                setError("No se pudieron cargar los datos de AI.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // Ensure scroll is enabled for this page
        document.body.style.overflow = 'unset';
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const tabStyle = (isActive) => ({
        padding: isMobile ? '8px 6px' : '12px 24px',
        cursor: 'pointer',
        borderBottom: isActive ? '3px solid var(--accent-color, #ff4c4c)' : '3px solid transparent',
        color: isActive ? 'var(--accent-color, #ff4c4c)' : '#888',
        fontWeight: 'bold',
        fontSize: isMobile ? '0.65rem' : '0.9rem',
        transition: 'all 0.3s ease',
        background: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        borderTop: 'none',
        outline: 'none',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        flex: isMobile ? '1' : '0 1 auto',
        textAlign: 'center',
        whiteSpace: 'nowrap'
    });

    const getFlagEmoji = (countryCode) => {
        if (!countryCode || countryCode === '??' || countryCode === 'LH') return '🌐';
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt());
        return String.fromCodePoint(...codePoints);
    };

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#aaa' }}>
            <p>Cargando archivos clasificados...</p>
        </div>
    );

    return (
        <div className="container" style={{
            paddingTop: isMobile ? '20px' : '40px',
            paddingBottom: '150px', // Extra padding at the bottom
            position: 'relative'
        }}>
            {/* Header / Back Navigation */}
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: isMobile ? '10px' : '40px',
                gap: '15px',
                paddingInline: '20px'
            }}>
                <h1 style={{ margin: 0, fontSize: isMobile ? '0.8rem' : '2rem', textAlign: 'center' }}>BACKUPS AI</h1>
                <button
                    onClick={() => onNavigate('home')}
                    className="btn"
                    style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                >
                    Volver
                </button>
            </div>

            {/* Tabs Navigation */}
            <div style={{
                display: 'flex',
                gap: isMobile ? '5px' : '20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: isMobile ? '25px' : '40px',
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}>
                <button
                    onClick={() => setActiveTab('base_images')}
                    style={tabStyle(activeTab === 'base_images')}
                >
                    img base
                </button>
                <button
                    onClick={() => setActiveTab('featured_prompts')}
                    style={tabStyle(activeTab === 'featured_prompts')}
                >
                    prompts vip
                </button>
                <button
                    onClick={() => setActiveTab('chapter_backups')}
                    style={tabStyle(activeTab === 'chapter_backups')}
                >
                    prompt lista
                </button>
                {isMaster && (
                    <button
                        onClick={() => setActiveTab('visitor_stats')}
                        style={tabStyle(activeTab === 'visitor_stats')}
                    >
                        visitas
                    </button>
                )}
            </div>

            {/* Error State */}
            {error && <div style={{ color: '#ff4d4d', textAlign: 'center', padding: '40px' }}>{error}</div>}

            {/* Tab Content */}
            {!error && (
                <div>
                    {activeTab === 'visitor_stats' && isMaster && (
                        <div className="card" style={{ padding: isMobile ? '15px' : '30px', textAlign: 'center' }}>
                            <h3 style={{ color: '#aaa', marginBottom: '25px' }}>Geolocalización de Visitas</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '500px', margin: '0 auto' }}>
                                {visitorStats.length === 0 ? (
                                    <p style={{ color: '#666' }}>No hay datos de visitas aún.</p>
                                ) : (
                                    visitorStats.map((stat, idx) => (
                                        <div key={idx} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '12px 20px',
                                            backgroundColor: 'rgba(255,255,255,0.03)',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(255,255,255,0.05)'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <span style={{ fontSize: '1.2rem' }}>
                                                    {getFlagEmoji(stat.pais_codigo)}
                                                </span>
                                                <span style={{ color: '#eee', fontWeight: '500' }}>{stat.pais}</span>
                                            </div>
                                            <span style={{
                                                backgroundColor: 'var(--accent-color)',
                                                color: 'white',
                                                padding: '2px 10px',
                                                borderRadius: '12px',
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold'
                                            }}>
                                                {stat.total}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                    {activeTab === 'base_images' && (
                        <div>
                            <h3 style={{ color: '#aaa', marginBottom: '20px', textAlign: 'center', fontSize: isMobile ? '1rem' : '1.1rem' }}>Galeria de imagenes</h3>
                            {images.length === 0 ? (
                                <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center' }}>No hay imagenes registradas aun.</p>
                            ) : (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(180px, 1fr))',
                                    gap: isMobile ? '10px' : '20px',
                                    justifyContent: 'center'
                                }}>
                                    {images.map(item => (
                                        <div key={item.id} style={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'transform 0.2s',
                                        }}
                                            onMouseOver={(e) => !isMobile && (e.currentTarget.style.transform = 'scale(1.02)')}
                                            onMouseOut={(e) => !isMobile && (e.currentTarget.style.transform = 'scale(1)')}
                                        >
                                            <div style={{ width: '100%', height: isMobile ? '200px' : '270px', backgroundColor: '#111', overflow: 'hidden' }}>
                                                {item.imagen ? (
                                                    <img
                                                        src={getImageUrl(item.imagen)}
                                                        alt={item.titulo}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                                                    />
                                                ) : (
                                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '0.8rem' }}>Sin imagen</div>
                                                )}
                                            </div>
                                            <div style={{ padding: isMobile ? '8px' : '12px' }}>
                                                <h4 style={{ color: '#fff', fontSize: isMobile ? '0.8rem' : '0.95rem', margin: '0 0 5px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.titulo}</h4>
                                                {item.notas && <p style={{ color: '#888', fontSize: '0.75rem', margin: '0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.notas}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'featured_prompts' && (
                        <div>
                            <h3 style={{ color: '#aaa', marginBottom: '20px', textAlign: 'center' }}>Lista de Prompts AI</h3>

                            {/* Categories Sub-Nav */}
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '10px',
                                justifyContent: 'center',
                                marginBottom: '30px',
                                padding: '0 10px'
                            }}>
                                {[
                                    { id: 'all', label: 'Todos' },
                                    { id: 'perfil-sl', label: 'Perfil' },
                                    { id: 'personajes', label: 'Personajes' },
                                    { id: 'bienvenidas', label: 'Bienvenidas' },
                                    { id: 'book-fotos', label: 'Book' },
                                    { id: 'utilidades', label: 'Utilidades' },
                                    { id: 'modelo-prompt', label: 'Modelo' },
                                    { id: 'variados', label: 'Variados' }
                                ].map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            border: '1px solid',
                                            borderColor: selectedCategory === cat.id ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)',
                                            backgroundColor: selectedCategory === cat.id ? 'rgba(255, 76, 76, 0.1)' : 'transparent',
                                            color: selectedCategory === cat.id ? 'var(--accent-color)' : '#888',
                                            fontSize: '0.75rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            fontWeight: selectedCategory === cat.id ? 'bold' : 'normal'
                                        }}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>

                            {prompts.filter(p => selectedCategory === 'all' || p.categoria === selectedCategory).length === 0 ? (
                                <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center' }}>No hay prompts en esta categoría.</p>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                                    {prompts
                                        .filter(p => selectedCategory === 'all' || p.categoria === selectedCategory)
                                        .map(prompt => (
                                            <div key={prompt.id} style={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '8px',
                                                padding: isMobile ? '15px' : '20px',
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                                    <h4 style={{ color: 'var(--accent-color)', fontSize: isMobile ? '1rem' : '1.2rem', margin: 0 }}>{prompt.titulo}</h4>
                                                    <span style={{
                                                        fontSize: '0.65rem',
                                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                                        padding: '2px 8px',
                                                        borderRadius: '4px',
                                                        color: '#666',
                                                        textTransform: 'uppercase'
                                                    }}>
                                                        {prompt.categoria || 'variados'}
                                                    </span>
                                                </div>
                                                <div style={{
                                                    backgroundColor: '#000',
                                                    padding: '15px',
                                                    borderRadius: '4px',
                                                    color: '#ccc',
                                                    fontFamily: 'monospace',
                                                    fontSize: isMobile ? '0.8rem' : '0.9rem',
                                                    marginBottom: '15px',
                                                    overflowY: 'auto',
                                                    maxHeight: '200px',
                                                    border: '1px solid #333'
                                                }}>
                                                    {prompt.prompt}
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(prompt.prompt).then(() => {
                                                            showToast("Prompt copiado con éxito");
                                                        });
                                                    }}
                                                    className="btn"
                                                    style={{ width: '100%', marginTop: 'auto', fontSize: '0.8rem' }}
                                                >
                                                    Copiar Prompt
                                                </button>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'chapter_backups' && (
                        <div className="card" style={{
                            padding: isMobile ? '12px' : '20px'
                        }}>
                            <h3 style={{ color: '#aaa', marginBottom: '25px', textAlign: 'center', fontSize: isMobile ? '1rem' : '1.1rem' }}>Respaldos por Capitulo</h3>
                            <AIBackupsTable chapters={chapters || []} />
                        </div>
                    )}
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <div style={{
                    position: 'fixed',
                    bottom: '30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    color: 'var(--accent-color, #ff4c4c)',
                    padding: '12px 24px',
                    borderRadius: '50px',
                    zIndex: 9999,
                    boxShadow: '0 5px 20px rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255, 76, 76, 0.3)',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    pointerEvents: 'none',
                    animation: 'toastFadeIn 0.3s ease-out'
                }}>
                    ✨ {toast}
                </div>
            )}

            <style>{`
                @keyframes toastFadeIn {
                    from { opacity: 0; transform: translate(-50%, -20px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
            `}</style>
        </div>
    );
};

export default BackupsPage;
