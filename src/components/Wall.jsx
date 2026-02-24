import React, { useEffect, useState } from 'react';

import ChapterCard from './ChapterCard';
import ChapterReader from './ChapterReader';

import './Wall.css';

const Wall = ({ chapters }) => {
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [activeTab, setActiveTab] = useState(null);

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

    const activeDiaryData = activeTab ? groupedData[activeTab] : null;

    // Get sorted tomos for the active diary
    const sortedTomoEntries = activeDiaryData
        ? Object.entries(activeDiaryData.tomos).sort((a, b) => {
            return (a[1].tomo_orden - b[1].tomo_orden) || (a[1].tomo_id - b[1].tomo_id);
        })
        : [];

    return (
        <div className="container">
            {/* Mini Support Button */}
            <div className="wall-mini-support">
                <a
                    href="secondlife:///app/agent/a8c18228-601a-4a14-b5f3-b00d3202c0ad/pay"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mini-support-btn"
                    style={{ textDecoration: 'none' }}
                >
                    Invitame un cafecito 500L ✨💖
                </a>
            </div>

            {/* Tabs */}
            <div className="wall-tabs">
                {diaryNames.map(diaryName => (
                    <button
                        key={diaryName}
                        className={`wall-tab ${activeTab === diaryName ? 'active' : ''}`}
                        onClick={() => setActiveTab(diaryName)}
                    >
                        {diaryName}
                        <span className="wall-tab-count">({groupedData[diaryName].count})</span>
                    </button>
                ))}
            </div>

            {/* Content for Active Tab */}
            {activeDiaryData && (
                <div className="diary-content">
                    {sortedTomoEntries.map(([tomoName, tomoData]) => (
                        <div key={tomoName} style={{ marginBottom: '30px' }}>
                            <h3 style={{
                                color: 'var(--accent-color)',
                                marginBottom: '15px',
                                fontSize: '1.2rem'
                            }}>
                                {tomoName}
                            </h3>
                            <div className="grid">
                                {tomoData.chapters.map(chapter => (
                                    <ChapterCard
                                        key={chapter.id}
                                        chapter={chapter}
                                        onClick={setSelectedChapter}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
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
