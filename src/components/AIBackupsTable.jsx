import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Wall.css'; // Reusing some styles if needed

const AIBackupsTable = ({ chapters }) => {
    const [selectedChapterPrompts, setSelectedChapterPrompts] = useState(null);
    const [prompts, setPrompts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredChapters, setFilteredChapters] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [viewLevel, setViewLevel] = useState('diarios'); // 'diarios', 'tomos', 'chapters', 'prompts'
    const [selectedDiario, setSelectedDiario] = useState(null);
    const [selectedTomo, setSelectedTomo] = useState(null);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [selectedSinglePrompt, setSelectedSinglePrompt] = useState(null);
    const [movingPrompt, setMovingPrompt] = useState(null);
    const [toast, setToast] = useState(null); // { message: string }
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 1500); // 1.5s for a slightly more natural feel, but fast
    };

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);

        const fetchExistingPrompts = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/capitulo-prompts/`);
                const chapterIdsWithPrompts = new Set(res.data.map(p => p.capitulo));

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

        return () => window.removeEventListener('resize', handleResize);
    }, [chapters, apiUrl]);

    // Navigation Handlers
    const goToDiarios = () => {
        setViewLevel('diarios');
        setSelectedDiario(null);
        setSelectedTomo(null);
        setSelectedChapter(null);
    };

    const selectDiario = (diarioName) => {
        setSelectedDiario(diarioName);
        setViewLevel('tomos');
    };

    const selectTomo = (tomoName) => {
        setSelectedTomo(tomoName);
        setViewLevel('chapters');
    };

    const selectChapter = async (chapter) => {
        setSelectedChapter(chapter);
        setLoading(true);
        try {
            const res = await axios.get(`${apiUrl}/api/capitulo-prompts/?capitulo=${chapter.id}`);
            setPrompts(res.data);
            setViewLevel('prompts');
        } catch (err) {
            console.error("Error fetching prompts:", err);
            alert("Error al cargar los prompts.");
        } finally {
            setLoading(false);
        }
    };

    const handleMovePrompt = (prompt) => {
        setMovingPrompt(prompt);
        // For simplicity, we just keep the current navigation and let the user pick
    };

    const confirmMove = async (targetChapter) => {
        if (!movingPrompt) return;
        try {
            await axios.patch(`${apiUrl}/api/capitulo-prompts/${movingPrompt.id}/`, {
                capitulo: targetChapter.id
            });
            alert("Prompt movido exitosamente.");
            setMovingPrompt(null);
            // Refresh current view if we are in prompts view
            if (viewLevel === 'prompts') {
                selectChapter(selectedChapter);
            } else {
                // If we were navigating to move it, maybe go back to where it was or stay here
            }
        } catch (err) {
            console.error("Error moving prompt:", err);
            alert("No se pudo mover el prompt.");
        }
    };

    if (initialLoading) return <div style={{ color: '#888', textAlign: 'center', padding: '20px' }}>Analizando respaldos...</div>;
    // if (filteredChapters.length === 0) return null; // Removed to allow adding prompts maybe later

    // Data Helpers
    const uniqueDiarios = [...new Set(filteredChapters.map(cap => cap.diario_nombre))].sort((a, b) => {
        const d_a = filteredChapters.find(c => c.diario_nombre === a);
        const d_b = filteredChapters.find(c => c.diario_nombre === b);
        return (d_a?.diario_orden || 0) - (d_b?.diario_orden || 0);
    });

    const tomosInDiario = selectedDiario
        ? [...new Set(filteredChapters.filter(c => c.diario_nombre === selectedDiario).map(c => c.tomo_nombre))].sort((a, b) => {
            const t_a = filteredChapters.find(c => c.diario_nombre === selectedDiario && c.tomo_nombre === a);
            const t_b = filteredChapters.find(c => c.diario_nombre === selectedDiario && c.tomo_nombre === b);
            return (t_a?.tomo_orden || 0) - (t_b?.tomo_orden || 0);
        })
        : [];

    const chaptersInTomo = selectedTomo
        ? filteredChapters.filter(c => c.diario_nombre === selectedDiario && c.tomo_nombre === selectedTomo)
        : [];

    const Breadcrumbs = () => (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', fontSize: '0.85rem', color: '#888', flexWrap: 'wrap' }}>
            <span onClick={goToDiarios} style={{ cursor: 'pointer', color: viewLevel === 'diarios' ? 'var(--accent-color)' : 'inherit' }}>Inicio</span>
            {selectedDiario && (
                <>
                    <span>/</span>
                    <span onClick={() => { setViewLevel('tomos'); setSelectedTomo(null); setSelectedChapter(null); }} style={{ cursor: 'pointer', color: viewLevel === 'tomos' ? 'var(--accent-color)' : 'inherit' }}>{selectedDiario}</span>
                </>
            )}
            {selectedTomo && (
                <>
                    <span>/</span>
                    <span onClick={() => { setViewLevel('chapters'); setSelectedChapter(null); }} style={{ cursor: 'pointer', color: viewLevel === 'chapters' ? 'var(--accent-color)' : 'inherit' }}>{selectedTomo}</span>
                </>
            )}
            {selectedChapter && (
                <>
                    <span>/</span>
                    <span style={{ color: 'var(--accent-color)' }}>{selectedChapter.nombre}</span>
                </>
            )}
        </div>
    );

    const TableHeader = ({ columns }) => (
        <thead style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
            <tr>
                {columns.map(col => (
                    <th key={col} style={{ padding: '12px', textAlign: col === 'Acción' || col === 'Acciones' ? 'center' : 'left', borderBottom: '1px solid #333' }}>{col}</th>
                ))}
            </tr>
        </thead>
    );

    const ActionButton = ({ onClick, label, variant = 'primary' }) => (
        <button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            style={{
                padding: '6px 12px',
                background: variant === 'primary' ? 'rgba(255, 76, 76, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                border: variant === 'primary' ? '1px solid var(--accent-color, #ff4c4c)' : '1px solid #555',
                color: variant === 'primary' ? 'var(--accent-color, #ff4c4c)' : '#ccc',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                margin: '0 4px'
            }}
        >
            {label}
        </button>
    );

    const TreeSelector = ({ onSelect, onCancel }) => {
        const [expandedDiarios, setExpandedDiarios] = useState({});
        const [expandedTomos, setExpandedTomos] = useState({});
        const [selectedDest, setSelectedDest] = useState(null);

        // Group chapters for the tree
        const treeData = chapters.reduce((acc, cap) => {
            if (!acc[cap.diario_nombre]) acc[cap.diario_nombre] = { orden: cap.diario_orden, tomos: {} };
            if (!acc[cap.diario_nombre].tomos[cap.tomo_nombre]) acc[cap.diario_nombre].tomos[cap.tomo_nombre] = { orden: cap.tomo_orden, chapters: [] };
            acc[cap.diario_nombre].tomos[cap.tomo_nombre].chapters.push(cap);
            return acc;
        }, {});

        const toggleDiario = (d) => setExpandedDiarios(prev => ({ ...prev, [d]: !prev[d] }));
        const toggleTomo = (t) => setExpandedTomos(prev => ({ ...prev, [t]: !prev[t] }));

        return (
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 3000, display: 'flex',
                alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)'
            }}>
                <div style={{
                    width: '90%', maxWidth: '500px', backgroundColor: '#1a1a1a',
                    border: '1px solid #444', borderRadius: '12px', padding: '25px',
                    maxHeight: '80vh', display: 'flex', flexDirection: 'column'
                }}>
                    <h3 style={{ color: 'var(--accent-color)', marginTop: 0, marginBottom: '20px' }}>Seleccionar Destino</h3>

                    <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', padding: '10px', backgroundColor: '#000', borderRadius: '8px' }}>
                        {Object.entries(treeData).sort((a, b) => a[1].orden - b[1].orden).map(([dName, dData]) => (
                            <div key={dName} style={{ marginBottom: '5px' }}>
                                <div onClick={() => toggleDiario(dName)} style={{ cursor: 'pointer', color: '#fff', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', padding: '4px' }}>
                                    <span>{expandedDiarios[dName] ? '▼' : '▶'}</span>
                                    <span>📁 {dName}</span>
                                </div>
                                {expandedDiarios[dName] && (
                                    <div style={{ marginLeft: '20px', borderLeft: '1px solid #333' }}>
                                        {Object.entries(dData.tomos).sort((a, b) => a[1].orden - b[1].orden).map(([tName, tData]) => (
                                            <div key={tName}>
                                                <div onClick={() => toggleTomo(tName)} style={{ cursor: 'pointer', color: '#ccc', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', padding: '4px' }}>
                                                    <span>{expandedTomos[tName] ? '▼' : '▶'}</span>
                                                    <span>📂 {tName}</span>
                                                </div>
                                                {expandedTomos[tName] && (
                                                    <div style={{ marginLeft: '20px' }}>
                                                        {tData.chapters.map(cap => (
                                                            <div
                                                                key={cap.id}
                                                                onClick={() => setSelectedDest(cap)}
                                                                style={{
                                                                    cursor: 'pointer',
                                                                    padding: '4px 8px',
                                                                    fontSize: '0.8rem',
                                                                    color: selectedDest?.id === cap.id ? 'var(--accent-color)' : '#999',
                                                                    backgroundColor: selectedDest?.id === cap.id ? 'rgba(255,76,76,0.1)' : 'transparent',
                                                                    borderRadius: '4px'
                                                                }}
                                                            >
                                                                📄 {cap.nombre}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button onClick={onCancel} style={{ padding: '8px 16px', background: 'none', border: '1px solid #444', color: '#888', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
                        <button
                            onClick={() => onSelect(selectedDest)}
                            disabled={!selectedDest}
                            style={{
                                padding: '8px 16px',
                                background: selectedDest ? 'var(--accent-color)' : '#333',
                                border: 'none', color: '#fff', borderRadius: '4px', cursor: selectedDest ? 'pointer' : 'not-allowed'
                            }}
                        >
                            Mover Aquí
                        </button>
                    </div>
                </div>
            </div>
        );
    };
    return (
        <div style={{ padding: '10px 0', minHeight: '400px' }}>
            <h3 style={{
                color: 'var(--accent-color, #ff4c4c)',
                marginBottom: '10px',
                fontSize: isMobile ? '1.1rem' : '1.4rem',
                borderBottom: '1px solid rgba(255, 76, 76, 0.3)',
                paddingBottom: '10px',
                textAlign: 'center'
            }}>
                Gestión de Backups por Estructura
            </h3>

            <Breadcrumbs />

            {movingPrompt && (
                <TreeSelector
                    onSelect={confirmMove}
                    onCancel={() => setMovingPrompt(null)}
                />
            )}

            <div style={{
                overflowX: 'auto',
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.05)',
                marginBottom: '20px'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#eee', fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                    {viewLevel === 'diarios' && (
                        <>
                            <TableHeader columns={['Diario']} />
                            <tbody>
                                {uniqueDiarios.map(d => (
                                    <tr key={d} onClick={() => selectDiario(d)} style={{ cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                        <td style={{ padding: '12px' }}>{d}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </>
                    )}

                    {viewLevel === 'tomos' && (
                        <>
                            <TableHeader columns={['Tomo']} />
                            <tbody>
                                {tomosInDiario.map(t => (
                                    <tr key={t} onClick={() => selectTomo(t)} style={{ cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                        <td style={{ padding: '12px' }}>{t}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </>
                    )}

                    {viewLevel === 'chapters' && (
                        <>
                            <TableHeader columns={['Capítulo', 'Acción']} />
                            <tbody>
                                {chaptersInTomo.map(cap => (
                                    <tr key={cap.id} onClick={() => selectChapter(cap)} style={{ cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                        <td style={{ padding: '12px' }}>{cap.nombre}</td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            <ActionButton label="Ver Prompts" onClick={() => selectChapter(cap)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </>
                    )}

                    {viewLevel === 'prompts' && (
                        <>
                            <TableHeader columns={['Título', 'Acciones']} />
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="2" style={{ textAlign: 'center', padding: '20px' }}>Cargando...</td></tr>
                                ) : prompts.length === 0 ? (
                                    <tr><td colSpan="2" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Sin prompts en este capítulo.</td></tr>
                                ) : (
                                    prompts.map(p => (
                                        <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                            <td style={{ padding: '12px' }}>{p.titulo}</td>
                                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                                <ActionButton label="Ver" onClick={() => { setSelectedSinglePrompt(p); }} />
                                                <ActionButton label="Mover" onClick={() => handleMovePrompt(p)} variant="secondary" />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </>
                    )}
                </table>
            </div>

            {/* Modal for Prompt Detail (Single or Multiple) */}
            {(selectedChapterPrompts || selectedSinglePrompt) && (
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
                            onClick={() => { setSelectedChapterPrompts(null); setSelectedSinglePrompt(null); }}
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
                            {selectedSinglePrompt ? 'Detalle de Prompt' : `Prompts: ${selectedChapterPrompts.nombre}`}
                        </h2>

                        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
                            {loading ? (
                                <p style={{ textAlign: 'center', color: '#888' }}>Cargando...</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {(selectedSinglePrompt ? [selectedSinglePrompt] : prompts).map(p => (
                                        <div key={p.id} style={{
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            padding: '15px'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                <h4 style={{ margin: 0, color: '#fff' }}>{p.titulo}</h4>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(p.prompt);
                                                        showToast("Prompt copiado al portapapeles");
                                                    }}
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

            {/* Subtle Toast Notification */}
            {toast && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0,0,0,0.85)',
                    color: 'var(--accent-color, #ff4c4c)',
                    border: '1px solid var(--accent-color, #ff4c4c)',
                    padding: '10px 20px',
                    borderRadius: '50px',
                    fontSize: '0.9rem',
                    zIndex: 9999,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(5px)',
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

export default AIBackupsTable;
