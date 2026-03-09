import React, { useState, useEffect } from 'react';
import mysteriousBackground from '../assets/mysterious_background.png';
import LightSwitch from './LightSwitch';

const Landing = ({ onLogin }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
    const [isLightOn, setIsLightOn] = useState(isMobile);
    const [shouldRenderContent, setShouldRenderContent] = useState(isMobile);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 900;
            setIsMobile(mobile);
            if (mobile) {
                setIsLightOn(true);
                setShouldRenderContent(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!isMobile && isLightOn) {
            const timer = setTimeout(() => {
                setShouldRenderContent(true);
            }, 600); // Sync with CSS transition
            return () => clearTimeout(timer);
        }
    }, [isLightOn, isMobile]);

    const handleGuestLogin = () => {
        onLogin({ uid: 'guest', isAnonymous: true, displayName: 'Invitado' });
    };

    const handleToggle = () => {
        if (!isMobile) {
            setIsLightOn(true);
        }
    };

    return (
        <div className="landing-wrapper">
            {!isMobile && <LightSwitch onToggle={handleToggle} isOn={isLightOn} />}

            {!isMobile && !shouldRenderContent && (
                <div className={`darkness-overlay ${isLightOn ? 'fade-out' : ''}`}></div>
            )}

            <div className={`landing-container ${shouldRenderContent ? 'fade-in' : 'hidden'} ${!isMobile ? 'desktop-layout' : ''}`} style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${mysteriousBackground})`,
                opacity: shouldRenderContent ? 1 : 0,
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
                    padding-left: 250px;
                }
                .darkness-overlay {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: calc(100% - 250px);
                    height: 100%;
                    background: radial-gradient(circle at 10% 50%, #1a1a1a 0%, #000000 80%);
                    z-index: 1000;
                    pointer-events: none;
                    transition: opacity 0.5s ease;
                }
                .darkness-overlay.fade-out {
                    opacity: 0;
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
