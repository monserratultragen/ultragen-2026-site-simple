import React, { useState, useEffect } from 'react';


const Guestbook = ({ entries }) => {

    return (
        <div className="guestbook-container">
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--accent-color)',
                paddingBottom: '10px',
                marginBottom: '20px'
            }}>
                <h2 style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>
                    LIBRO DE VISITAS
                </h2>
                <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSdOybvlEsZIbQxsfFdvt6gJdNLgKSgU8R3mlv1vd0nlnzTMGQ/viewform?usp=header"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Firmar el Libro de Visitas"
                    style={{
                        textDecoration: 'none',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        lineHeight: 1
                    }}
                >
                    ✍️
                </a>
            </div>

            <div className="guestbook-content">
                {entries.length === 0 ? (
                    <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', marginTop: '20px' }}>
                        Sé el primero en firmar...
                    </p>
                ) : (
                    <div style={{ marginTop: '20px' }}>
                        {entries.map((entry) => (
                            <div key={entry.id} style={{ marginBottom: '15px', borderBottom: '1px solid #222', paddingBottom: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <strong style={{ color: 'var(--accent-color)' }}>{entry.nombre}</strong>
                                    <span style={{ fontSize: '0.8rem', color: '#666' }}>{entry.fecha}</span>
                                </div>
                                <p style={{ margin: '5px 0', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{entry.mensaje}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Guestbook;
