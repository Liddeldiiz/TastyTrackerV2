import React, { useState } from "react";

import { UploadImage } from './UploadImage.jsx';
import { Popup } from './Popup.jsx';


import '../static/css/accordionHome.css';

import plus_icon from '../static/images/plus_icon.svg';
import minus_icon from '../static/images/minus_icon.png';

export const AccordionHome = () => {
    const [accordion, setActiveAccordion] = useState(false);
    const [buttonPopup, setButtonPopup] = useState(false);

    function toggleAccordion() {
        setActiveAccordion(!accordion);
    }

    function selectFromLib() {
        return (<div><UploadImage /></div>);
    }

    return(
    <>
        <div className="container">
            <div className="accordion__faq">
                <div>
                    <div onClick={toggleAccordion}>
                        {accordion ? (
                        <>
                            <img src={minus_icon}/>
                        </>
                        ) : (
                        <>
                            <img src={plus_icon}/>
                        </>
                        )}
                    </div>
                    <div className={accordion ? "active" : "inactive"}>
                        <div><button> Open Camera </button></div>
                        <div>
                            <button onClick={selectFromLib}> 
                            Select from library 
                            </button>
                            <button onClick={() => setButtonPopup(true)}>Open popup</button>

                            <UploadImage trigger={buttonPopup} setTrigger={() => setButtonPopup()}>
                                <h3 className='popup-inner-text-h3'>My popup</h3>
                                <p className='popup-inner-text-p'>This is my button triggered popup</p>
                            </UploadImage>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
}

// grafika wektorowa