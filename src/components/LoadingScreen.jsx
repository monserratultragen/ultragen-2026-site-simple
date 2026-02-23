import React, { useState, useEffect } from 'react';
import monseAvatar from '../monse.png';

const LoadingScreen = ({ progress = 0 }) => {
    const [showPatienceMessage, setShowPatienceMessage] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPatienceMessage(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'black',
            zIndex: 9998, // Below modal (9999)
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            overflow: 'hidden'
        }}>
            <div className="spinner" style={{
                border: '4px solid rgba(255, 255, 255, 0.3)',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                borderTopColor: '#fff',
                animation: 'spin 1s ease-in-out infinite',
                marginBottom: '20px'
            }}></div>
            <p style={{ fontFamily: 'monospace', letterSpacing: '2px', marginBottom: '10px' }}>CARGANDO...</p>

            {/* Progress Bar Container */}
            <div style={{
                width: '300px',
                height: '4px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '2px',
                overflow: 'hidden'
            }}>
                {/* Progress Fill */}
                <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    backgroundColor: 'white',
                    transition: 'width 0.3s ease-out'
                }}></div>
            </div>
            <p style={{ fontFamily: 'monospace', fontSize: '0.8rem', marginTop: '5px', opacity: 0.7 }}>
                {Math.round(progress)}%
            </p>

            {/* Patience Message Card - Repositioned and stylized */}
            {showPatienceMessage && (
                <div className="patience-card" style={{
                    marginTop: '30px',
                    backgroundColor: 'rgba(255, 133, 162, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 133, 162, 0.3)',
                    borderRadius: '15px',
                    padding: '12px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    maxWidth: '400px',
                    boxShadow: '0 4px 15px rgba(255, 133, 162, 0.1)',
                    animation: 'fadeInUp 0.8s ease-out forwards',
                    zIndex: 9999
                }}>
                    <img
                        src={monseAvatar}
                        alt="Monse"
                        style={{
                            width: '45px',
                            height: '45px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '1.5px solid #ff85a2'
                        }}
                    />
                    <p style={{
                        fontSize: '0.8rem',
                        lineHeight: '1.5',
                        margin: 0,
                        color: '#ffc1d1',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        letterSpacing: '0.3px',
                        fontStyle: 'italic'
                    }}>
                        Utilizo servicios gratuitos y son algo lentos...por lo que el contenido nuevo puede demorar en cargar por primera vez...ten paciencia 💖
                    </p>
                </div>
            )}

            <style>
                {`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                    @keyframes fadeInUp {
                        from {
                            transform: translateY(20px);
                            opacity: 0;
                        }
                        to {
                            transform: translateY(0);
                            opacity: 1;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default LoadingScreen;
