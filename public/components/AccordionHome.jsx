import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Popup } from './Popup.jsx';


import '../static/css/accordionHome.css';

import plus_icon from '../static/images/plus_icon.svg';
import minus_icon from '../static/images/minus_icon.png';

export const AccordionHome = () => {
    const navigate = useNavigate();

    const [accordion, setActiveAccordion] = useState(false);
    const [buttonPopup, setButtonPopup] = useState(false);
    const [imageUpload, setImagesUpload] = useState(null);

    function componentDidMount() {
        if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
            console.log("Lets get this party started");
            navigator.mediaDevices.getUserMedia({video: true});
        }
    }
    componentDidMount();

    function toggleAccordion() {
        setActiveAccordion(!accordion);
    }

    function onSelectedImage( event ) {
        
        setImagesUpload(event.target.files[0]);
        let tempImg =  event.target.files[0]
        console.log("event: ", event.target.files[0]);
        console.log("tempImg: ", tempImg);
        navigate("/addImage", {state:{image: tempImg}});
        
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
                        <div><a href="./camera"> Open Camera page </a></div>
                        <div><label><input type="file" accept="image/*" capture="camera"/>Open camera</label></div>
                        <div>
                            <label className="select-image-input">
                                <input id="getFile" type="file" onChange={(event) => {onSelectedImage(event)}} accept=".jpg, .jpeg, .png"/>
                                Select Image
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
}

// grafika wektorowa

/* 
<UploadImage trigger={buttonPopup} setTrigger={() => setButtonPopup()}>
                                <h3 className='popup-inner-text-h3'>My popup</h3>
                                <p className='popup-inner-text-p'>This is my button triggered popup</p>
                            </UploadImage>
*/