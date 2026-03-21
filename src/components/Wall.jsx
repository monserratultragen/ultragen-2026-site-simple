import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import ChapterCard from './ChapterCard';
import ChapterReader from './ChapterReader';

import './Wall.css';

const Wall = ({ chapters, onOpenSupportModal, onNavigate }) => {
    const { diarioId, tomoId, chapterId } = useParams();
    const navigate = useNavigate();

    const [selectedChapter, setSelectedChapter] = useState(null);
    const [activeTab, setActiveTab] = useState(null);
    const [activeTomoTab, setActiveTomoTab] = useState(null);

    const [, setForceUpdate] = useState(0);

    const handleMasterUnlock = () => {
        setForceUpdate(n => n + 1);
    };

    // Grouping Logic
    // Grouping Logic - Memoized for stability
    const groupedData = useMemo(() => {
        return chapters.reduce((acc, chapter) => {
            if (chapter.is_active === false) return acc;

            const diarioKey = `diario_${chapter.diario_orden}`;
            const tomoKey = `tomo_${chapter.tomo_orden}`;

            if (!acc[diarioKey]) {
                acc[diarioKey] = {
                    nombre: chapter.diario_nombre || 'Sin Diario',
                    count: 0,
                    diario_orden: chapter.diario_orden || 0,
                    tomos: {}
                };
            }

            acc[diarioKey].count++;

            if (!acc[diarioKey].tomos[tomoKey]) {
                acc[diarioKey].tomos[tomoKey] = {
                    nombre: chapter.tomo_nombre || 'Sin Tomo',
                    chapters: [],
                    tomo_orden: chapter.tomo_orden || 0,
                    tomo_id: chapter.tomo_id || 0
                };
            }
            acc[diarioKey].tomos[tomoKey].chapters.push(chapter);
            return acc;
        }, {});
    }, [chapters]);

    // Get sorted diary keys based on diario_orden
    const diaryKeys = Object.keys(groupedData).sort((a, b) => {
        return groupedData[a].diario_orden - groupedData[b].diario_orden;
    });

    // Set active tab if not set and we have data
    useEffect(() => {
        if (!activeTab && diaryKeys.length > 0) {
            setActiveTab(diaryKeys[0]);
        }
    }, [diaryKeys, activeTab]);

    const activeDiaryData = activeTab ? groupedData[activeTab] : null;

    // Get sorted tomos for the active diary
    const sortedTomoEntries = activeDiaryData
        ? Object.entries(activeDiaryData.tomos).sort((a, b) => {
            return (a[1].tomo_orden - b[1].tomo_orden) || (a[1].tomo_id - b[1].tomo_id);
        })
        : [];

    // Automatically set the first Tomo as active when diary changes
    useEffect(() => {
        if (sortedTomoEntries.length > 0) {
            setActiveTomoTab(sortedTomoEntries[0][0]);
        } else {
            setActiveTomoTab(null);
        }
    }, [activeTab]); // Remove sortedTomoEntries from deps to only trigger on tab change

    // Effect to handle deep linking from URL parameters
    useEffect(() => {
        if (chapters.length > 0 && diarioId && tomoId && chapterId) {
            const chapter = chapters.find(c => String(c.id) === String(chapterId));
            if (chapter) {
                setActiveTab(`diario_${chapter.diario_orden}`);
                setActiveTomoTab(`tomo_${chapter.tomo_orden}`);
                setSelectedChapter(chapter);
            }
        }
    }, [chapters, diarioId, tomoId, chapterId]);

    // Update URL when a chapter is selected manually
    const handleSelectChapter = (chapter) => {
        setSelectedChapter(chapter);
        if (chapter) {
            navigate(`/${chapter.diario_orden - 1}/${chapter.tomo_orden}/${chapter.id}`);
        }
    };

    const handleCloseReader = () => {
        setSelectedChapter(null);
        navigate('/');
    };

    const activeTomoData = activeTomoTab && activeDiaryData ? activeDiaryData.tomos[activeTomoTab] : null;

    return (
        <div className="container">
            {/* Menus Section (Before Division Line) */}
            <div style={{ marginBottom: '30px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '20px' }}>
                {/* Diarios Navigation */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: (sortedTomoEntries.length > 0) ? '15px' : '0' }}>
                    <span style={{ color: '#fff', fontSize: '1rem', fontWeight: 'bold', flexShrink: 0 }}>Diarios:</span>
                    <div className="nav-group" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {diaryKeys.map(diaryKey => (
                            <button
                                key={diaryKey}
                                className={`circle-nav-btn ${activeTab === diaryKey ? 'active' : ''}`}
                                onClick={() => setActiveTab(diaryKey)}
                                title={`${groupedData[diaryKey].nombre} (${groupedData[diaryKey].count} capítulos)`}
                            >
                                {groupedData[diaryKey].diario_orden - 1}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tomos Navigation */}
                {sortedTomoEntries.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', marginTop: '15px' }}>
                        <span style={{ color: '#fff', fontSize: '1rem', fontWeight: 'bold', flexShrink: 0 }}>Tomos:</span>
                        <div className="nav-group" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {sortedTomoEntries.map(([tomoKey, tomoData]) => (
                                <button
                                    key={tomoKey}
                                    className={`circle-nav-btn ${activeTomoTab === tomoKey ? 'active' : ''}`}
                                    onClick={() => setActiveTomoTab(tomoKey)}
                                    title={`${tomoData.nombre} (${tomoData.chapters.length} capítulos)`}
                                >
                                    {tomoData.tomo_orden}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* AI / Master Content Switch */}
                {sessionStorage.getItem('master_unlocked') === 'true' && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <button
                            className="pill-nav-btn pill-ai-btn"
                            onClick={() => onNavigate('backups')}
                            title="Solo visible por Clave Maestra"
                        >
                            ✨ Backups AI
                        </button>
                    </div>
                )}
            </div>

            {/* Content for Active Tab */}
            {activeDiaryData && (
                <div className="diary-content">

                    {/* Active Tomo Chapters */}
                    {activeTomoData && (
                        <div>
                            <h3 style={{
                                color: 'var(--accent-color)',
                                marginBottom: '15px',
                                fontSize: '1.2rem',
                                textAlign: 'center'
                            }}>
                                {activeTomoData.nombre} ({activeTomoData.chapters.length} capítulos)
                            </h3>
                            <div className="grid">
                                {activeTomoData.chapters.map(chapter => (
                                    <ChapterCard
                                        key={chapter.id}
                                        chapter={chapter}
                                        onClick={handleSelectChapter}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {selectedChapter && (
                <ChapterReader
                    key={selectedChapter.id}
                    chapter={selectedChapter}
                    onClose={handleCloseReader}
                    onMasterUnlock={handleMasterUnlock}
                />
            )}
        </div>
    );
};

export default Wall;
