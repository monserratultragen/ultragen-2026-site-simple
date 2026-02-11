import React from 'react';

const Guestbook = () => {
    return (
        <div className="guestbook-container">
            <h2 style={{ borderBottom: '1px solid var(--accent-color)', paddingBottom: '10px' }}>
                LIBRO DE VISITAS
            </h2>
            <div className="guestbook-content">
                <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', marginTop: '20px' }}>
                    Próximamente...
                </p>
                {/* Placeholder entries */}
                <div style={{ marginTop: '20px', opacity: 0.5 }}>
                    <div style={{ marginBottom: '15px', borderBottom: '1px solid #222', paddingBottom: '10px' }}>
                        <strong style={{ color: 'var(--accent-color)' }}>Usuario Desconocido</strong>
                        <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>¿Hay alguien ahí?</p>
                    </div>
                    <div style={{ marginBottom: '15px', borderBottom: '1px solid #222', paddingBottom: '10px' }}>
                        <strong style={{ color: 'var(--accent-color)' }}>Viajero del Tiempo</strong>
                        <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>Este lugar me resulta familiar...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Guestbook;
