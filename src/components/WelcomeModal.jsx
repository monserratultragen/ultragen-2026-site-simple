import React from 'react';

const WelcomeModal = ({ onAccept, onCancel }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.85)', // Slightly transparent black overlay
            zIndex: 9999, // Above LoadingScreen (9998)
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
        }}>
            <div className="welcome-modal-content" style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                padding: '30px',
                maxWidth: '500px',
                width: '100%',
                textAlign: 'center',
                color: '#e0e0e0',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                borderRadius: '4px'
            }}>
                <h2 style={{
                    fontFamily: 'Playfair Display, serif',
                    marginBottom: '20px',
                    fontSize: '1.8rem',
                    color: '#fff'
                }}>
                    Bienvenido
                </h2>

                <p style={{
                    lineHeight: '1.6',
                    marginBottom: '30px',
                    fontSize: '1rem',
                    color: '#ccc'
                }}>
                    ⚠ ADVERTENCIA — CONTENIDO PARA ADULTOS (+18): El contenido de este sitio está dirigido exclusivamente a personas mayores de 18 años y puede incluir material sensible, emocionalmente intenso o de naturaleza adulta; si no tienes 18 años o más, te recomendamos no continuar.
                </p>

                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                    <button
                        onClick={onCancel}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: 'transparent',
                            border: '1px solid #555',
                            color: '#aaa',
                            cursor: 'pointer',
                            fontFamily: 'monospace',
                            transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => { e.target.style.borderColor = '#888'; e.target.style.color = '#fff'; }}
                        onMouseOut={(e) => { e.target.style.borderColor = '#555'; e.target.style.color = '#aaa'; }}
                    >
                        CANCELAR
                    </button>

                    <button
                        onClick={onAccept}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#fff',
                            border: '1px solid #fff',
                            color: '#000',
                            cursor: 'pointer',
                            fontFamily: 'monospace',
                            fontWeight: 'bold',
                            transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => { e.target.style.backgroundColor = '#ddd'; }}
                        onMouseOut={(e) => { e.target.style.backgroundColor = '#fff'; }}
                    >
                        ACEPTAR
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WelcomeModal;
