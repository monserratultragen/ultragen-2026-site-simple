import React, { useState } from 'react';

const MasterKeyModal = ({ onClose, onMasterUnlock }) => {
    const [accessCode, setAccessCode] = useState('');
    const [validating, setValidating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleValidate = async (e) => {
        e.preventDefault();
        setValidating(true);
        setError('');

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/api/claves-acceso/validar/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clave: accessCode })
            });

            const data = await response.json();

            if (response.ok && data.status === 'valida') {
                if (data.tipo === 'maestra') {
                    sessionStorage.setItem('master_unlocked', 'true');
                    setSuccess(true);
                    setTimeout(() => {
                        if (onMasterUnlock) onMasterUnlock();
                        onClose();
                    }, 1000);
                } else {
                    setError('Esta no es una clave maestra. Usa esta clave directamente en el capítulo que quieras leer.');
                }
            } else {
                setError(data.mensaje || 'Código incorrecto o expirado');
            }
        } catch (err) {
            setError('Error de conexión con el servidor');
        } finally {
            setValidating(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 10000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid gold',
                padding: '30px',
                maxWidth: '400px',
                width: '100%',
                textAlign: 'center',
                boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)',
                borderRadius: '8px',
                position: 'relative'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '15px',
                        background: 'none',
                        border: 'none',
                        color: 'gold',
                        fontSize: '1.5rem',
                        cursor: 'pointer'
                    }}
                >
                    &times;
                </button>

                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔑</div>
                <h2 style={{ color: 'gold', marginBottom: '10px', textTransform: 'uppercase' }}>Acceso Maestro</h2>
                <p style={{ color: '#ccc', marginBottom: '20px', fontSize: '0.9rem' }}>
                    Introduce la clave maestra para desbloquear todo el contenido VIP.
                </p>

                {success ? (
                    <div style={{ color: '#4caf50', fontWeight: 'bold', marginBottom: '10px' }}>
                        ¡Clave aceptada! Reiniciando...
                    </div>
                ) : (
                    <form onSubmit={handleValidate}>
                        <input
                            type="text"
                            placeholder="Introduce la clave"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                            autoCapitalize="none"
                            autoCorrect="off"
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: '#333',
                                border: '1px solid #444',
                                color: 'white',
                                borderRadius: '4px',
                                marginBottom: '15px',
                                textAlign: 'center',
                                letterSpacing: '2px',
                                fontSize: '1.1rem'
                            }}
                            autoFocus
                        />
                        {error && <p style={{ color: '#ff4444', fontSize: '0.8rem', marginBottom: '15px' }}>{error}</p>}
                        <button
                            type="submit"
                            disabled={validating || !accessCode}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'gold',
                                color: 'black',
                                border: 'none',
                                borderRadius: '4px',
                                fontWeight: 'bold',
                                cursor: validating ? 'wait' : 'pointer',
                                opacity: validating || !accessCode ? 0.6 : 1
                            }}
                        >
                            {validating ? 'Validando...' : 'Desbloquear Todo'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default MasterKeyModal;
