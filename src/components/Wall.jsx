import React, { useEffect, useState } from 'react';

import ChapterCard from './ChapterCard';
import ChapterReader from './ChapterReader';

import './Wall.css';

const Wall = ({ chapters }) => {
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [activeTab, setActiveTab] = useState(null);

    // Grouping Logic
    const groupedData = chapters.reduce((acc, chapter) => {
        // Skip inactive chapters
        // Skip inactive chapters (treat absence of field as active for legacy compatibility if needed, but better to be strict if we expect it)
        if (chapter.is_active === false) return acc;

        const diario = chapter.diario_nombre || 'Sin Diario';
        const tomo = chapter.tomo_nombre || 'Sin Tomo';

        if (!acc[diario]) {
            acc[diario] = {
                count: 0,
                tomos: {}
            };
        }

        acc[diario].count++;

        if (!acc[diario].tomos[tomo]) {
            acc[diario].tomos[tomo] = [];
        }
        acc[diario].tomos[tomo].push(chapter);
        return acc;
    }, {});

    // Get sorted diary names
    const diaryNames = Object.keys(groupedData).sort();

    // Set active tab if not set and we have data
    useEffect(() => {
        if (!activeTab && diaryNames.length > 0) {
            setActiveTab(diaryNames[0]);
        }
    }, [diaryNames, activeTab]);




    const activeDiaryData = activeTab ? groupedData[activeTab] : null;

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
                    {Object.entries(activeDiaryData.tomos).map(([tomoName, tomoChapters]) => (
                        <div key={tomoName} style={{ marginBottom: '30px' }}>
                            <h3 style={{
                                color: 'var(--accent-color)',
                                marginBottom: '15px',
                                fontSize: '1.2rem'
                            }}>
                                {tomoName}
                            </h3>
                            <div className="grid">
                                {tomoChapters.map(chapter => (
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
