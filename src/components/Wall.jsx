import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChapterCard from './ChapterCard';
import ChapterReader from './ChapterReader';

import './Wall.css';

const Wall = () => {
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [activeTab, setActiveTab] = useState(null);

    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/capitulos/?es_demo=true`);
                setChapters(response.data);
            } catch (err) {
                console.error("Error fetching chapters:", err);
                setError("Error al cargar los capítulos.");
            } finally {
                setLoading(false);
            }
        };

        fetchChapters();
    }, []);

    // Grouping Logic
    const groupedData = chapters.reduce((acc, chapter) => {
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


    if (loading) return <div className="container">Cargando...</div>;
    if (error) return <div className="container">{error}</div>;

    const activeDiaryData = activeTab ? groupedData[activeTab] : null;

    return (
        <div className="container">
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
                                {tomoName} (capitulos de muestra)
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
                    chapter={selectedChapter}
                    onClose={() => setSelectedChapter(null)}
                />
            )}
        </div>
    );
};

export default Wall;
