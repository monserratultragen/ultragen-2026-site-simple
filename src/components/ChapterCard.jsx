import React from 'react';
import { getImageUrl } from '../utils/imageUtils';
import sinPortadaImg from '../assets/sin_portada.png';


const ChapterCard = ({ chapter, onClick }) => {
    const isBlocked = chapter.es_demo === false;
    const isVip = !!chapter.is_vip;

    // Debug log
    if (chapter.is_vip) {
        console.warn(`[DEBUG] Rendering Chapter ${chapter.id} - Name: ${chapter.nombre} - is_vip: ${chapter.is_vip} (effective: ${isVip})`);
    }

    const handleClick = () => {
        const isMaster = sessionStorage.getItem('master_unlocked') === 'true';
        if (isBlocked && !isMaster) {
            alert('Este capítulo no está disponible en la versión demo.');
            return;
        }
        onClick(chapter);
    };

    const isMasterActive = sessionStorage.getItem('master_unlocked') === 'true';

    return (
        <div
            className={`card chapter-card ${isBlocked && !isMasterActive ? 'blocked' : ''} ${isVip ? 'vip' : ''}`}
            onClick={handleClick}
            style={{
                cursor: (isBlocked && !isMasterActive) ? 'not-allowed' : 'pointer',
                padding: 0,
                overflow: 'hidden',
                position: 'relative',
                aspectRatio: '2/3',
                display: 'flex',
                flexDirection: 'column',
                filter: (isBlocked && !isMasterActive) ? 'grayscale(100%) brightness(0.7)' : 'none'
            }}
        >
            {chapter?.ruta_img ? (
                <img
                    src={getImageUrl(chapter.ruta_img)}
                    alt={chapter.nombre}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                    }}
                />
            ) : (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <img
                        src={sinPortadaImg}
                        alt="Sin Portada"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: 0.6
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: '#fff',
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                            fontSize: '0.8rem',
                            textAlign: 'center',
                            textShadow: '0 0 10px #000',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            padding: '4px 10px',
                            width: '100%'
                        }}
                    >
                        En construcción
                    </div>
                </div>
            )}

            {isVip && !isBlocked && !isMasterActive && (
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    zIndex: 2,
                    border: '1px solid gold'
                }}>
                    🔒
                </div>
            )}

            {isBlocked && !isMasterActive && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: '#fff',
                    textAlign: 'center',
                    zIndex: 3,
                    width: '80%'
                }}>
                    <div style={{ fontSize: '2rem', marginBottom: '5px' }}>🚫</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Bloqueado</div>
                </div>
            )}

            <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                display: 'flex',
                alignItems: 'center', // Center vertically
                flexWrap: 'wrap',
                gap: '5px',
                zIndex: 4
            }}>
                {isMasterActive && (isVip || isBlocked) && (
                    <div style={{
                        backgroundColor: 'rgba(255, 215, 0, 0.8)',
                        color: 'black',
                        padding: '1px 6px', // Reduced vertical padding
                        borderRadius: '4px',
                        fontSize: '0.6rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        lineHeight: '1' // Tighten line height
                    }}>
                        VIP
                    </div>
                )}

                {chapter.palabras > 0 && (
                    <div style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: '#fff',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: '0.6rem',
                        fontWeight: 'bold',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(4px)',
                        lineHeight: '1'
                    }}>
                        {chapter.palabras} palabras
                    </div>
                )}
            </div>

            <div
                className="card-overlay"
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background:
                        'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                    padding: '20px 10px 10px',
                    textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                }}
            >
                <h3
                    style={{
                        margin: 0,
                        fontSize: '1.1rem',
                        color: '#fff',
                        textTransform: 'uppercase',
                        borderBottom:
                            `2px solid ${isVip ? 'gold' : 'var(--accent-color)'}`,
                        display: 'inline-block',
                        marginBottom: '5px'
                    }}
                >
                    {chapter.nombre} {isVip && <span style={{ color: 'gold', fontSize: '0.8rem' }}>[VIP]</span>}
                </h3>

                <p
                    style={{
                        margin: 0,
                        fontSize: '0.8rem',
                        color: isVip ? 'gold' : 'var(--accent-color)',
                        fontWeight: 'bold'
                    }}
                >
                    Capítulo: {chapter.orden}
                </p>
            </div>
        </div>
    );
};

export default ChapterCard;
