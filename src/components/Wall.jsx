import React, { useEffect, useState } from 'react';

import ChapterCard from './ChapterCard';
import ChapterReader from './ChapterReader';
import AIGallery from './AIGallery';

import './Wall.css';

const Wall = ({ chapters }) => {
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [activeTab, setActiveTab] = useState(null);
    const [activeTomoTab, setActiveTomoTab] = useState(null);
    const hasMasterKey = sessionStorage.getItem('master_unlocked') === 'true';

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
            // Check if current activeTomoTab exists in new diary, if not, reset to first
            const hasCurrentTomo = sortedTomoEntries.some(([tomoName]) => tomoName === activeTomoTab);
            if (!hasCurrentTomo || !activeTomoTab) {
                setActiveTomoTab(sortedTomoEntries[0][0]);
            }
        } else {
            setActiveTomoTab(null);
        }
    }, [activeTab, sortedTomoEntries, isAITabActive]);

    const activeTomoData = activeTomoTab && activeDiaryData ? activeDiaryData.tomos[activeTomoTab] : null;

    return (
        <div className="container">
            {/* Mini Support Button */}
            <div className="wall-mini-support">
                <a
                    href="secondlife:///app/agent/a8c18228-601a-4a14-b5f3-b00d3202c0ad/pay"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mini-support-btn"
                >
                    <span>Invitame un cafecito 500L ✨💖</span>
                </a>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '30px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '10px' }}>
                <span style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' }}>Diarios:</span>
                <div className="wall-tabs" style={{ marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>
                    {diaryNames.map(diaryName => (
                        <button
                            key={diaryName}
                            className={`wall-tab ${activeTab === diaryName ? 'active' : ''}`}
                            onClick={() => setActiveTab(diaryName)}
                            title={`${diaryName} (${groupedData[diaryName].count} capítulos)`}
                            style={{ padding: '8px 12px' }}
                        >
                            {groupedData[diaryName].diario_orden - 1}
                        </button>
                    ))}
                    {hasMasterKey && (
                        <button
                            className={`wall-tab wall-tab-ai ${isAITabActive ? 'active' : ''}`}
                            onClick={() => setActiveTab('AI_BACKUPS')}
                            title="Solo visible por Clave Maestra"
                            style={{ padding: '8px 12px' }}
                        >
                            ✨ AI
                        </button>
                    )}
                </div>
            </div>

            {/* Content for Active Tab */}
            {isAITabActive ? (
                <AIGallery />
            ) : activeDiaryData && (
                <div className="diary-content">
                    {/* Tomo Sub-Navigation */}
                    {sortedTomoEntries.length > 0 && (
                        <div className="tomo-tabs">
                            {sortedTomoEntries.map(([tomoName, tomoData]) => (
                                <button
                                    key={tomoName}
                                    className={`tomo-tab ${activeTomoTab === tomoName ? 'active' : ''}`}
                                    onClick={() => setActiveTomoTab(tomoName)}
                                >
                                    {tomoName} ({tomoData.chapters.length})
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Active Tomo Chapters */}
                    {activeTomoData && (
                        <div>
                            <h3 style={{
                                color: 'var(--accent-color)',
                                marginBottom: '15px',
                                fontSize: '1.2rem',
                                textAlign: 'center'
                            }}>
                                {activeTomoTab}
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
                />
            )}
        </div>
    );
};

export default Wall;
