import React, {useState} from 'react';
import Webcam from 'react-webcam';
import { useNavigate } from "react-router-dom";

import Button from 'react-bootstrap/Button';

const WebcamComponent = () => <Webcam />
const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";
const videoConstraints = {
    facingMode: FACING_MODE_ENVIRONMENT,
}

export const Camera = () => {
    const navigate = useNavigate();
    const [picture, setPicture] = useState('');
    const [facingMode, setFacingMode] = React.useState(FACING_MODE_ENVIRONMENT);
    
    const webcamRef = React.useRef(null);
    const capture = React.useCallback(() => {

        const pictureSrc = webcamRef.current.getScreenshot();
        setPicture(pictureSrc);
        
    }, [])

    const handleClick = React.useCallback(() => {
        console.log("should switch camera");
        setFacingMode(
            prevState =>
                prevState === FACING_MODE_ENVIRONMENT
                ? FACING_MODE_USER
                : FACING_MODE_ENVIRONMENT
        );
    })

    const homeButton = () => {
        navigate('/');
    }

    const confirmImage = () => {
        const url = picture;
        fetch(url)
        .then(res => res.blob())
        .then(blob => {
            const file = new File([blob], "File name", { type: "image/png"})
            console.log("File: ", file);
            console.log("type of file: ", typeof(file));
            navigate("/addImage", {state:{image: file}});
        })
        console.log("picture: ", picture);
        console.log("type of picture: ", typeof(picture));
    }
    return (
    <div>
    
    <div>
      {picture == '' ? (
        <Webcam
          audio={false}
          
          ref={webcamRef}
          
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
        />
      ) : (
        <img src={picture} />
      )}
    </div>
    <div>
      {picture != '' ? (
        <>
        <button
          onClick={(e) => {
            e.preventDefault()
            setPicture()
          }}
          className="btn btn-primary"
        >
          Retake
        </button>
        <Button onClick={confirmImage}>Confirm</Button>
        </>
      ) : (
        <>
        <button
          onClick={(e) => {
            e.preventDefault()
            capture()
          }}
          className="btn btn-danger"
        >
          Capture
        </button>
        <Button onClick={handleClick}> Switch Camera </Button>
        <Button onClick={homeButton}> Home </Button>
        </>
      )}
    </div>
  </div>
)
}