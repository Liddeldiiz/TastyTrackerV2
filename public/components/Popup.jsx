import React from 'react';
import '../static/css/Popup.css';

export const Popup = (props) => {
    return (props.trigger) ? (
        <div className='popup'>
            <div className='popup-inner'>
                <button className='cloes-btn' onClick={() => props.setTrigger(false)}>close</button>
                { props.children }
            </div>
        </div>
    ) : "";
}