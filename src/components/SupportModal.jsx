import React from 'react';
import monseAvatar from '../monse.png';

const SupportModal = ({ onClose }) => {
    const handleDonate = () => {
        window.open('secondlife:///app/agent/a8c18228-601a-4a14-b5f3-b00d3202c0ad/pay', '_blank');
        onClose();
    };

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                animation: 'fadeIn 0.3s ease',
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: 'linear-gradient(145deg, rgba(30, 20, 35, 0.98), rgba(20, 15, 30, 0.98))',
                    border: '1px solid rgba(255, 133, 162, 0.3)',
                    borderRadius: '24px',
                    padding: '36px 32px',
                    maxWidth: '420px',
                    width: '100%',
                    textAlign: 'center',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,133,162,0.1)',
                    position: 'relative',
                    animation: 'slideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '14px',
                        right: '18px',
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(255,255,255,0.4)',
                        fontSize: '1.4rem',
                        cursor: 'pointer',
                        lineHeight: 1,
                        padding: '4px',
                        transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.target.style.color = '#fff'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}
                >
                    ×
                </button>

                {/* Avatar with glow */}
                <div style={{
                    width: '110px',
                    height: '110px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    margin: '0 auto 20px',
                    position: 'relative',
                    boxShadow: '0 0 25px rgba(255, 133, 162, 0.5)',
                }}>
                    <div style={{
                        position: 'absolute',
                        inset: '-25%',
                        background: 'conic-gradient(from 0deg, transparent 70%, rgba(255, 247, 0, 0.8) 80%, #ff85a2 100%)',
                        animation: 'rotate-glow 2s linear infinite',
                        zIndex: 1,
                    }} />
                    <img
                        src={monseAvatar}
                        alt="Monse"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '50%',
                            position: 'relative',
                            zIndex: 2,
                        }}
                    />
                </div>

                {/* Message */}
                <h2 style={{
                    color: '#fff',
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    marginBottom: '12px',
                    lineHeight: 1.3,
                }}>
                    ¡Hola! Soy Monse ✨
                </h2>
                <p style={{
                    color: 'rgba(255, 255, 255, 0.75)',
                    fontSize: '0.95rem',
                    lineHeight: '1.65',
                    marginBottom: '28px',
                }}>
                    Escribir es mi pasión y cada historia que ves aquí nació de horas de dedicación, imaginación y mucho cafecito. 💖
                    <br /><br />
                    Si disfrutas mi contenido y quieres que siga creando más mundos, más capítulos y más aventuras, puedes apoyarme con un pequeño gesto. Cada contribución me da energía para seguir escribiendo. ☕
                </p>

                {/* Donate Button */}
                <button
                    onClick={handleDonate}
                    style={{
                        background: 'linear-gradient(135deg, #ff85a2, #ff4d6d)',
                        border: 'none',
                        color: '#fff',
                        padding: '13px 32px',
                        borderRadius: '30px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 20px rgba(255, 77, 109, 0.4)',
                        letterSpacing: '0.3px',
                    }}
                    onMouseEnter={e => {
                        e.target.style.transform = 'scale(1.04)';
                        e.target.style.boxShadow = '0 6px 28px rgba(255, 77, 109, 0.6)';
                    }}
                    onMouseLeave={e => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 4px 20px rgba(255, 77, 109, 0.4)';
                    }}
                >
                    ☕ Invitame un cafecito 500L
                </button>

                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', marginTop: '14px' }}>
                    ¡Gracias por tu apoyo! 💖
                </p>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes rotate-glow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default SupportModal;
