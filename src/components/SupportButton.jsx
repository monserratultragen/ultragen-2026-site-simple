import React, { useState, useEffect } from 'react';
import monseAvatar from '../monse.png';

const SupportButton = ({ onOpenModal }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isSparkling, setIsSparkling] = useState(false);

    useEffect(() => {
        let timer;

        const startCycle = () => {
            // Initial 8s delay (or 5m break)
            timer = setTimeout(() => {
                setIsSparkling(true); // Start Tinkerbell effect
                setIsVisible(true);

                // Hide after 30s
                timer = setTimeout(() => {
                    setIsSparkling(true); // Exit sparkle
                    setIsVisible(false);

                    // Restart after 5 minutes
                    timer = setTimeout(startCycle, 5 * 60 * 1000);
                }, 30000);

                // Stop entry sparkle after 1s
                setTimeout(() => setIsSparkling(false), 1000);
            }, isVisible ? 0 : 8000); // Use 8s for first one
        };

        // First run with 8s delay
        timer = setTimeout(() => {
            setIsVisible(true);
            setIsSparkling(true);
            setTimeout(() => setIsSparkling(false), 1000);

            timer = setTimeout(() => {
                setIsVisible(false);
                setIsSparkling(true);
                setTimeout(() => setIsSparkling(false), 1000);

                // Schedule next appearance in 5m
                const repeat = () => {
                    const nextShow = () => {
                        setIsVisible(true);
                        setIsSparkling(true);
                        setTimeout(() => setIsSparkling(false), 1000);

                        setTimeout(() => {
                            setIsVisible(false);
                            setIsSparkling(true);
                            setTimeout(() => setIsSparkling(false), 1000);
                            setTimeout(nextShow, 5 * 60 * 1000);
                        }, 30000);
                    };
                    setTimeout(nextShow, 5 * 60 * 1000);
                };
                repeat();
            }, 30000);
        }, 8000);

        return () => clearTimeout(timer);
    }, []);

    // Cleaner Logic for the cycle
    useEffect(() => {
        let cycleTimer;

        const show = () => {
            setIsVisible(true);
            setIsSparkling(true);
            setTimeout(() => setIsSparkling(false), 2000);

            cycleTimer = setTimeout(() => {
                setIsVisible(false);
                setIsSparkling(true);
                setTimeout(() => setIsSparkling(false), 2000);
                cycleTimer = setTimeout(show, 5 * 60 * 1000);
            }, 30000);
        };

        cycleTimer = setTimeout(show, 8000);

        return () => clearTimeout(cycleTimer);
    }, []);


    if (!isVisible && !isSparkling) return null;

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
                transform: isVisible ? 'scale(1)' : 'scale(0.5)',
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
                `}
            </style>
        </div>
    );
};

export default SupportButton;
