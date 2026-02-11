import mysteriousBackground from '../assets/mysterious_background.png';

const Landing = ({ onLogin }) => {
    const handleGuestLogin = () => {
        onLogin({ uid: 'guest', isAnonymous: true, displayName: 'Invitado' });
    };

    return (
        <div className="landing-container" style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${mysteriousBackground})`
        }}>
            <div className="landing-card">
                <h1 className="landing-title">Diarios de Monserrat</h1>
                <p className="landing-subtitle">Sitio Simplificado</p>

                <div className="login-box">
                    <button className="btn login-btn" onClick={handleGuestLogin}>
                        INVITADO
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Landing;
