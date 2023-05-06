import React, { useState } from "react";
import '../css/accordionHome.css';

export const AccordionHome = () => {
    const [accordion, setActiveAccordion] = useState(false);

    function toggleAccordion() {
        setActiveAccordion(!accordion);
    }

    return(
    <>
        <div className="container">
            <div className="accordion__faq">
                <div>
                    <div onClick={toggleAccordion}>
                        {accordion ? (
                        <>
                            <span className="verticle">
                                -
                            </span>
                        </>
                        ) : (
                        <>
                            <span className="verticle">
                                +
                            </span>
                        </>
                        )}
                    </div>
                    <div className={accordion ? "active" : "inactive"}>
                        <p>Open camera</p>
                        <p>Select from library</p>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
}