import React, { useState, useEffect } from 'react';
import monseAvatar from '../monse.png';

const SupportButton = ({ onOpenModal, onVisibilityChange }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isSparkling, setIsSparkling] = useState(false);

    // Consolidated Cycle Logic
    useEffect(() => {
        let cycleTimer;

        const show = () => {
            setIsVisible(true);
            setIsSparkling(true);
            if (onVisibilityChange) onVisibilityChange(true);
            
            // Stop entry sparkle after 2s
            setTimeout(() => setIsSparkling(false), 2000);

            cycleTimer = setTimeout(() => {
                setIsVisible(false);
                setIsSparkling(true);
                if (onVisibilityChange) onVisibilityChange(false);
                
                // Stop exit sparkle after 2s
                setTimeout(() => setIsSparkling(false), 2000);
                
                // Schedule next show in 5m
                cycleTimer = setTimeout(show, 5 * 60 * 1000);
            }, 30000);
        };

        // First appearance after 8s
        cycleTimer = setTimeout(show, 8000);

        return () => {
            if (cycleTimer) clearTimeout(cycleTimer);
        };
    }, [onVisibilityChange]);


    // When not visible (the 5min interval), show the small coffee icon
    // Render even when isSparkling is true if isVisible is false (to avoid 2s delay)
    if (!isVisible) {
        return (
            <div 
                onClick={onOpenModal}
                className="mini-support-btn-floating"
                style={{
                    position: 'fixed',
                    left: '50px', // Less 'esquinado'
                    bottom: '60px', // Higher to align with where the avatar usually is
                    zIndex: 9997,
                    cursor: 'pointer',
                    transition: 'all 0.5s ease',
                    animation: 'fadeIn 0.5s ease-out'
                }}
            >
                <div className="mini-support-btn">
                    <span>☕</span>
                </div>
                <style>
                    {`
                        @keyframes fadeIn {
                            from { opacity: 0; transform: scale(0.5); }
                            to { opacity: 1; transform: scale(1); }
                        }
                        .mini-support-btn-floating .mini-support-btn {
                            background: rgba(30, 30, 30, 0.8);
                            color: #ff85a2;
                            width: 50px;
                            height: 50px;
                            border-radius: 50%;
                            font-size: 1.4rem;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            position: relative;
                            overflow: hidden;
                            border: none;
                            backdrop-filter: blur(5px);
                            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                        }
                        .mini-support-btn-floating .mini-support-btn::before {
                            content: '';
                            position: absolute;
                            top: -50%;
                            left: -50%;
                            width: 200%;
                            height: 200%;
                            background: conic-gradient(from 0deg, transparent 70%, rgba(255, 247, 0, 0.8) 80%, #ff85a2 100%);
                            animation: rotate-glow 2s linear infinite;
                            z-index: 0;
                        }
                        .mini-support-btn-floating .mini-support-btn::after {
                            content: '';
                            position: absolute;
                            top: 2px;
                            left: 2px;
                            right: 2px;
                            bottom: 2px;
                            background: rgba(30, 30, 30, 0.95);
                            border-radius: 50%;
                            z-index: 1;
                        }
                        .mini-support-btn-floating .mini-support-btn span {
                            position: relative;
                            z-index: 2;
                        }
                        @keyframes rotate-glow {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                        @media (max-width: 600px) {
                            body.reader-active .mini-support-btn-floating {
                                display: none !important;
                            }
                        }
                    `}
                </style>
            </div>
        );
    }

    return (
        <div
            onClick={onOpenModal}
            className={`support-button-container ${isSparkling ? 'tinkerbell' : ''}`}
            style={{
                position: 'fixed',
                left: '20px',
                bottom: '20px',
                zIndex: 9997,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.5s ease',
                opacity: isVisible ? (isSparkling ? 0.5 : 1) : 0,
                transform: isVisible ? (isSparkling ? 'scale(0.8)' : 'scale(1)') : 'scale(0.5)',
                pointerEvents: isVisible ? 'auto' : 'none',
                textDecoration: 'none'
            }}
        >
            {/* Tinkerbell Particles Backdrop */}
            {isSparkling && <div className="sparkles"></div>}

            <div style={{
                width: '110px',
                height: '110px',
                borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: isSparkling ? '0 0 20px #fff700' : '0 4px 12px rgba(255, 133, 162, 0.2)',
                backgroundColor: 'rgba(51, 51, 51, 0.5)',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '4px'
            }}>
                <div className="traveling-glow"></div>
                <img
                    src={monseAvatar}
                    alt="Monse"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '50%',
                        position: 'relative',
                        zIndex: 2
                    }}
                />
            </div>
            <div style={{
                backgroundColor: 'rgba(255, 133, 162, 0.6)',
                color: 'white',
                padding: '6px 18px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: '500',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.1)',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                letterSpacing: '0.5px',
                marginTop: '4px'
            }}>
                Invitame un cafecito 500L ✨💖
            </div>

            <style>
                {`
                    .tinkerbell {
                        position: relative;
                    }
                    .sparkles {
                        position: absolute;
                        width: 150%;
                        height: 150%;
                        background-image: 
                            radial-gradient(circle, #fff700 1px, transparent 1px),
                            radial-gradient(circle, #fff700 1px, transparent 1px),
                            radial-gradient(circle, #fff700 1px, transparent 1px);
                        background-size: 20px 20px, 15px 15px, 25px 25px;
                        background-position: 0 0, 10px 10px, 5px 5px;
                        animation: sparkles 1.5s linear infinite;
                        top: -25%;
                        left: -25%;
                        pointer-events: none;
                        opacity: 0.8;
                    }
                    @keyframes sparkles {
                        0% { transform: scale(1) rotate(0deg); opacity: 0; }
                        50% { opacity: 1; }
                        100% { transform: scale(1.2) rotate(15deg); opacity: 0; }
                    }
                    .traveling-glow {
                        position: absolute;
                        width: 150%;
                        height: 150%;
                        background: conic-gradient(from 0deg, transparent 70%, rgba(255, 247, 0, 0.8) 80%, #ff85a2 100%);
                        animation: rotate-glow 2s linear infinite;
                        z-index: 1;
                    }
                    @keyframes rotate-glow {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    @media (max-width: 600px) {
                        body.reader-active .support-button-container {
                            display: none !important;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default SupportButton;
