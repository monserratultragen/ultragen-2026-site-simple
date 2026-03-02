import React, { useEffect, useState } from 'react';

import ChapterCard from './ChapterCard';
import ChapterReader from './ChapterReader';
import AIGallery from './AIGallery';

import './Wall.css';

const Wall = ({ chapters, onOpenSupportModal }) => {
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [activeTab, setActiveTab] = useState(null);
    const [activeTomoTab, setActiveTomoTab] = useState(null);
    const [hasMasterKey, setHasMasterKey] = useState(
        () => sessionStorage.getItem('master_unlocked') === 'true'
    );

    const handleMasterUnlock = () => {
        setHasMasterKey(true);
    };

    // Grouping Logic
    const groupedData = chapters.reduce((acc, chapter) => {
        if (chapter.is_active === false) return acc;

        const diario = chapter.diario_nombre || 'Sin Diario';
        const tomo = chapter.tomo_nombre || 'Sin Tomo';

        if (!acc[diario]) {
            acc[diario] = {
                count: 0,
                diario_orden: chapter.diario_orden || 0,
                tomos: {}
            };
        }

        acc[diario].count++;

        if (!acc[diario].tomos[tomo]) {
            acc[diario].tomos[tomo] = {
                chapters: [],
                tomo_orden: chapter.tomo_orden || 0,
                tomo_id: chapter.tomo_id || 0
            };
        }
        acc[diario].tomos[tomo].chapters.push(chapter);
        return acc;
    }, {});

    // Get sorted diary names based on diario_orden
    const diaryNames = Object.keys(groupedData).sort((a, b) => {
        return groupedData[a].diario_orden - groupedData[b].diario_orden;
    });

    // Set active tab if not set and we have data
    useEffect(() => {
        if (!activeTab && diaryNames.length > 0) {
            setActiveTab(diaryNames[0]);
        }
    }, [diaryNames, activeTab]);

    const isAITabActive = activeTab === 'AI_BACKUPS';
    const activeDiaryData = (!isAITabActive && activeTab) ? groupedData[activeTab] : null;

    // Get sorted tomos for the active diary
    const sortedTomoEntries = activeDiaryData
        ? Object.entries(activeDiaryData.tomos).sort((a, b) => {
            return (a[1].tomo_orden - b[1].tomo_orden) || (a[1].tomo_id - b[1].tomo_id);
        })
        : [];

    // Automatically set the first Tomo as active when diary changes
    useEffect(() => {
        if (!isAITabActive && sortedTomoEntries.length > 0) {
            setActiveTomoTab(sortedTomoEntries[0][0]);
        } else {
            setActiveTomoTab(null);
        }
    }, [activeTab, isAITabActive]); // Remove sortedTomoEntries from deps to only trigger on tab change

    const activeTomoData = activeTomoTab && activeDiaryData ? activeDiaryData.tomos[activeTomoTab] : null;

    return (
        <div className="container">
            {/* Mini Support Button */}
            <div className="wall-mini-support">
                <button
                    className="mini-support-btn"
                    title="Invitame un cafecito 500L ✨💖"
                    onClick={onOpenSupportModal}
                >
                    <span>☕</span>
                </button>
            </div>

            {/* Menus Section (Before Division Line) */}
            <div style={{ marginBottom: '30px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '20px' }}>
                {/* Diarios Navigation */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: (!isAITabActive && sortedTomoEntries.length > 0) ? '15px' : '0' }}>
                    <span style={{ color: '#fff', fontSize: '1rem', fontWeight: 'bold', flexShrink: 0 }}>Diarios:</span>
                    <div className="nav-group" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {diaryNames.map(diaryName => (
                            <button
                                key={diaryName}
                                className={`circle-nav-btn ${activeTab === diaryName ? 'active' : ''}`}
                                onClick={() => setActiveTab(diaryName)}
                                title={`${diaryName} (${groupedData[diaryName].count} capítulos)`}
                            >
                                {groupedData[diaryName].diario_orden - 1}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tomos Navigation */}
                {!isAITabActive && sortedTomoEntries.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', marginTop: '15px' }}>
                        <span style={{ color: '#fff', fontSize: '1rem', fontWeight: 'bold', flexShrink: 0 }}>Tomos:</span>
                        <div className="nav-group" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {sortedTomoEntries.map(([tomoName, tomoData]) => (
                                <button
                                    key={tomoName}
                                    className={`circle-nav-btn ${activeTomoTab === tomoName ? 'active' : ''}`}
                                    onClick={() => setActiveTomoTab(tomoName)}
                                    title={`${tomoName} (${tomoData.chapters.length} capítulos)`}
                                >
                                    {tomoData.tomo_orden}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* AI / Master Content Switch */}
                {hasMasterKey && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <button
                            className={`pill-nav-btn pill-ai-btn ${isAITabActive ? 'active' : ''}`}
                            onClick={() => setActiveTab('AI_BACKUPS')}
                            title="Solo visible por Clave Maestra"
                        >
                            ✨ Backups AI
                        </button>
                    </div>
                )}
            </div>

            {/* Content for Active Tab */}
            {isAITabActive ? (
                <AIGallery chapters={chapters} />
            ) : activeDiaryData && (
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
                                {activeTomoTab} ({activeTomoData.chapters.length} capítulos)
                            </h3>
                            <div className="grid">
                                {activeTomoData.chapters.map(chapter => (
                                    <ChapterCard
                                        key={chapter.id}
                                        chapter={chapter}
                                        onClick={setSelectedChapter}
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
                    onClose={() => setSelectedChapter(null)}
                    onMasterUnlock={handleMasterUnlock}
                />
            )}
        </div>
    );
};

export default Wall;
