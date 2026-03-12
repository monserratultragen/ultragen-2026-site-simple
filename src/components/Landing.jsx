import React, { useState, useEffect } from 'react';
import mysteriousBackground from '../assets/mysterious_background.png';

const Landing = ({ onLogin }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
    const [shouldRenderContent, setShouldRenderContent] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 900;
            setIsMobile(mobile);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleGuestLogin = () => {
        onLogin({ uid: 'guest', isAnonymous: true, displayName: 'Invitado' });
    };

    return (
        <div className="landing-wrapper">
            <div className={`landing-container fade-in ${!isMobile ? 'desktop-layout' : ''}`} style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${mysteriousBackground})`,
                opacity: 1,
                transition: 'opacity 1.5s ease-in-out'
            }}>
                <div className="landing-card">
                    <h1 className="landing-title">Novelas de Monserrat</h1>
                    <p className="landing-subtitle">Versión Ligera</p>

                    <div className="login-box">
                        <button className="btn login-btn" onClick={handleGuestLogin}>
                            INVITADO
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .landing-wrapper {
                    position: relative;
                    width: 100vw;
                    height: 100vh;
                    overflow: hidden;
                    background: black;
                    display: flex;
                }
                .desktop-layout {
                    flex: 1;
                }
                .hidden {
                    display: none;
                }
                .fade-in {
                    display: flex;
                    animation: fadeInEffect 2s forwards;
                }
                @keyframes fadeInEffect {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @media (max-width: 900px) {
                    .desktop-layout { padding-left: 0; }
                }
            `}</style>
        </div>
    );
};

export default Landing;
