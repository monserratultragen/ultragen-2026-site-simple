import React from 'react';

const ChapterCard = ({ chapter, onClick }) => {
    return (
        <div
            className="card chapter-card"
            onClick={() => onClick(chapter)}
            style={{
                cursor: 'pointer',
                padding: 0,
                overflow: 'hidden',
                position: 'relative',
                aspectRatio: '2/3', // Magazine cover ratio
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {chapter.ruta_img ? (
                <img
                    src={chapter.ruta_img}
                    alt={chapter.nombre}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                    }}
                />
            ) : (
                <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#222',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#444'
                }}>
                    Sin Portada
                </div>
            )}

            <div className="card-overlay" style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                padding: '20px 10px 10px',
                textShadow: '0 2px 4px rgba(0,0,0,0.8)'
            }}>
                <h3 style={{
                    margin: 0,
                    fontSize: '1.1rem',
                    color: '#fff',
                    textTransform: 'uppercase',
                    borderBottom: '2px solid var(--accent-color)',
                    display: 'inline-block',
                    marginBottom: '5px'
                }}>
                    {chapter.nombre}
                </h3>
                <p style={{
                    margin: 0,
                    fontSize: '0.8rem',
                    color: 'var(--accent-color)',
                    fontWeight: 'bold'
                }}>
                    Capitulo: {chapter.orden}
                </p>
            </div>
        </div>
    );
};

export default ChapterCard;
