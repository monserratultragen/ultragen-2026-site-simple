import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Wall.css'; // Reusing some styles if needed

const AIBackupsTable = ({ chapters }) => {
    const [selectedChapterPrompts, setSelectedChapterPrompts] = useState(null);
    const [prompts, setPrompts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredChapters, setFilteredChapters] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    useEffect(() => {
        const fetchExistingPrompts = async () => {
            try {
                // Fetch all prompts to see which chapters have them
                const res = await axios.get(`${apiUrl}/api/capitulo-prompts/`);
                const chapterIdsWithPrompts = new Set(res.data.map(p => p.capitulo));

                // Filter and Sort chapters: diario.orden - 1, tomo.orden, capitulo.nombre
                const filtered = chapters
                    .filter(cap => chapterIdsWithPrompts.has(cap.id))
                    .sort((a, b) => {
                        const d_a = (a.diario_orden || 0) - 1;
                        const d_b = (b.diario_orden || 0) - 1;
                        if (d_a !== d_b) return d_a - d_b;

                        const t_a = a.tomo_orden || 0;
                        const t_b = b.tomo_orden || 0;
                        if (t_a !== t_b) return t_a - t_b;

                        return (a.nombre || '').localeCompare(b.nombre || '');
                    });

                setFilteredChapters(filtered);
            } catch (err) {
                console.error("Error identifying chapters with prompts:", err);
            } finally {
                setInitialLoading(false);
            }
        };

        if (chapters && chapters.length > 0) {
            fetchExistingPrompts();
        } else {
            setInitialLoading(false);
        }
    }, [chapters, apiUrl]);

    const viewPrompts = async (chapter) => {
        setLoading(true);
        setSelectedChapterPrompts(chapter);
        setPrompts([]);
        try {
            const res = await axios.get(`${apiUrl}/api/capitulo-prompts/?capitulo=${chapter.id}`);
            setPrompts(res.data);
        } catch (err) {
            console.error("Error fetching chapter prompts:", err);
            alert("No se pudieron cargar los prompts de este capítulo.");
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <div style={{ color: '#888', textAlign: 'center', padding: '20px' }}>Analizando respaldos...</div>;
    if (filteredChapters.length === 0) return null; // Don't show the section if no chapters have prompts

    return (
        <div style={{ padding: '20px 0' }}>
            <h3 style={{
                color: 'var(--accent-color, #ff4c4c)',
                marginBottom: '20px',
                fontSize: '1.4rem',
                borderBottom: '1px solid rgba(255, 76, 76, 0.3)',
                paddingBottom: '10px'
            }}>
                📂 Backups de Prompts por Capítulo
            </h3>

            <div style={{ overflowX: 'auto', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#eee', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #333' }}>Diario</th>
                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #333' }}>Tomo</th>
                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #333' }}>Capítulo</th>
                            <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #333' }}>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredChapters.map(cap => (
                            <tr key={cap.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                <td style={{ padding: '10px' }}>{cap.diario_nombre || 'N/A'} ({(cap.diario_orden || 1) - 1})</td>
                                <td style={{ padding: '10px' }}>{cap.tomo_nombre || 'N/A'} ({cap.tomo_orden || 0})</td>
                                <td style={{ padding: '10px', color: '#fff', fontWeight: '500' }}>{cap.nombre}</td>
                                <td style={{ padding: '10px', textAlign: 'center' }}>
                                    <button
                                        onClick={() => viewPrompts(cap)}
                                        style={{
                                            padding: '6px 12px',
                                            background: 'rgba(255, 76, 76, 0.1)',
                                            border: '1px solid var(--accent-color, #ff4c4c)',
                                            color: 'var(--accent-color, #ff4c4c)',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem'
                                        }}
                                    >
                                        Ver Prompts
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Read-only Modal for Chapter Prompts */}
            {selectedChapterPrompts && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'rgba(0,0,0,0.85)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000,
                    backdropFilter: 'blur(5px)'
                }}>
                    <div style={{
                        width: '90%',
                        maxWidth: '800px',
                        backgroundColor: '#1a1a1a',
                        border: '1px solid var(--accent-color, #ff4c4c)',
                        borderRadius: '12px',
                        padding: '30px',
                        maxHeight: '85vh',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        boxShadow: '0 0 30px rgba(255, 76, 76, 0.2)'
                    }}>
                        <button
                            onClick={() => setSelectedChapterPrompts(null)}
                            style={{
                                position: 'absolute',
                                top: '15px', right: '15px',
                                background: 'transparent', border: 'none',
                                color: '#666', fontSize: '1.5rem', cursor: 'pointer'
                            }}
                        >
                            ✕
                        </button>

                        <h2 style={{ margin: '0 0 20px 0', color: '#fff', fontSize: '1.4rem' }}>
                            Prompts: <span style={{ color: 'var(--accent-color, #ff4c4c)' }}>{selectedChapterPrompts.nombre}</span>
                        </h2>

                        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
                            {loading ? (
                                <p style={{ textAlign: 'center', color: '#888' }}>Cargando prompts...</p>
                            ) : prompts.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic', padding: '20px' }}>
                                    No hay prompts registrados para este capítulo.
                                </p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {prompts.map(p => (
                                        <div key={p.id} style={{
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            padding: '15px'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                <h4 style={{ margin: 0, color: '#fff' }}>{p.titulo}</h4>
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(p.prompt)}
                                                    style={{
                                                        fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)',
                                                        border: '1px solid #444', color: '#ccc',
                                                        padding: '4px 8px', borderRadius: '4px', cursor: 'pointer'
                                                    }}
                                                >
                                                    Copiar
                                                </button>
                                            </div>
                                            <div style={{
                                                background: '#000', padding: '12px',
                                                borderRadius: '4px', fontFamily: 'monospace',
                                                fontSize: '0.85rem', color: '#00ffcc',
                                                whiteSpace: 'pre-wrap', border: '1px solid rgba(0,255,204,0.1)'
                                            }}>
                                                {p.prompt}
                                            </div>
                                            {p.notas && (
                                                <p style={{ margin: '10px 0 0 0', fontSize: '0.8rem', color: '#888' }}>
                                                    <strong>Notas:</strong> {p.notas}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIBackupsTable;
