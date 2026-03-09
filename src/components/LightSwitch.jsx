import React from 'react';
import './LightSwitch.css';

const LightSwitch = ({ onToggle, isOn }) => {
    return (
        <div className={`light-switch-container ${isOn ? 'on' : 'off'}`}>
            <div className="switch-base">
                <div className="industrial-plate">
                    <div className="bolt top-left"></div>
                    <div className="bolt top-right"></div>
                    <div className="bolt bottom-left"></div>
                    <div className="bolt bottom-right"></div>

                    <div className="switch-wrapper">
                        <label className={`switch ${isOn ? 'locked' : ''}`}>
                            <input
                                type="checkbox"
                                checked={isOn}
                                onChange={onToggle}
                                disabled={isOn}
                            />
                            <span className="slider">
                                <span className="toggle-lever"></span>
                            </span>
                        </label>
                        <div className="label-text">
                            <span className="off-label">O</span>
                            <span className="on-label">I</span>
                        </div>
                    </div>
                </div>
                <div className="base-shadow"></div>
            </div>
        </div>
    );
};

export default LightSwitch;
