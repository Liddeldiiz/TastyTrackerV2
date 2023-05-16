import { useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { GeoPoint } from 'firebase/firestore';

import { GetTags } from '../components/GetTags';
import { uploadImage } from '../components/UploadImageV2';
import { GeoLocation } from '../components/GeoLocation';

import Button from 'react-bootstrap/Button';

import home_icon from '../static/images/home_icon.svg';

import '../static/css/App.css';

export const AddImage = () => {

    const navigate = useNavigate();

    const location = useLocation(); // location for file
    const [imageFile, setImageFile] = useState(); // to pass to the db
    const [imageRender, setImageRender] = useState(); // only for rendering
    const [isLoading, setLoading] = useState(false);
    const [imgElement, setImgElement] = useState();

    const [ selectedTag, setSelectedTag ] = useState();
    const [ timeStamp, setTimeStamp] = useState();
    const [ geoLocation, setGeoLocation ] = useState(); // location of user
    const [ note, setNote ] = useState("");



    var latitude;
    var longitude;

    const imageArr = [];
    const d = new Date();

    //////// useEffect is triggered by any change in the imageFile and location.state.image ////////
    useEffect(() => {

        setLoading(true);
        previewFile();
        
        if(imageFile !== undefined) {
            setLoading(false);
            console.log("image loaded")
        } else {
            
            console.log("still waiting");
        }
        console.log("imageFile: " ,imageFile)
        //setGeoLocation(geoLocationVar);

        setTimeStamp(d);
        
    }, [imageRender]);

    function componentDidMount() {
        if ("geolocation" in navigator) {
          console.log("Available");
          navigator.geolocation.getCurrentPosition(function(position) {
            console.log("Latitude is: ", position.coords.latitude);
            latitude = position.coords.latitude;
            console.log("Longitude is: ", position.coords.longitude);
            longitude = position.coords.longitude;
          })
        } else {
          console.log("Not Available");
        }
      }
      componentDidMount();
      

    function previewFile() {
    
        const file = location.state?.image;
        

        function readAndPreview(file) {
            const reader = new FileReader();

            reader.addEventListener(
                "load",
                () => {
                    if (imageRender !== undefined) {
                        setImgElement(<img src={imageRender.src} className='upload-image'></img>)
                        return;
                    }
                    const image = new Image();
                    
                    image.height = 100;
                    image.title = file.name;
                    image.src = reader.result;
                    imageArr.push(image);
                    setImageRender(image);
                },
                false
            );
            console.log(imageRender);
            reader.readAsDataURL(file);
            
        }

        if (file) {
            readAndPreview(file);
            setImageFile(file);
        }
    }


    const addImage = () => {
        console.log("gathering data for upload...");
        console.log("imageFile: ", imageFile);
        console.log("selectedTag: ", selectedTag);
        console.log("note: ", note);
        console.log("timestamp: ", timeStamp);
        console.log("geoLocation: ", geoLocation);

        return (null);
    }

    const pullDataFromTags = (data) => {
        setSelectedTag(data);
        console.log("data: ", data);
        console.log("selectedTag: ", selectedTag);
    }

    const pullDataFromGeoLocation = (data) => {
        setGeoLocation(data);
        console.log("geoLocation: ", geoLocation);
    }

    const handleSubmit = async (e) => {
        console.log("handleSubmit"); // here is an uncaught (in promise) error: invalid hook call
        e.preventDefault();
        let geoLocationVar = new GeoPoint(latitude, longitude);
        //console.log("image: ", imageFile); -- not null
        // upload the picture to the db with the gathered information
        // I need to access the functions defined in UploadImage from here
        uploadImage(imageFile, timeStamp, geoLocationVar, selectedTag, note);
        navigate('/');
    }

    return(
    <>
        <div className='div-add-image-body'>
            <div className='div-header'>
                <a href='/'>
                    <img src={home_icon} id="home_icon" className='home-icon'/>
                </a>
                <p>
                    add image page
                </p>
            </div>
            <hr />
            <form className='upload-image-form' onSubmit={handleSubmit}>
                <div className='images-flex-container'>
                {isLoading ? (<><h3>Loading</h3></>) : imgElement}
                    
                </div>
                <div className='div-get-tags'>
                    <GetTags func={pullDataFromTags}/>
                </div>
                <div className='div-note'>
                    <input 
                    onChange={(e) => setNote(e.target.value)}
                    type='text' 
                    placeholder='your note'/>
                </div>
                <div className='div-footer'>
                    <div className='div-timestamp'>
                        Timestamp
                        <br />
                            
                    </div>
                    <div className='div-location'>
                        Location:
                        
                    </div>
                    <div className='div-upload-component'>
                        {}
                        <button type="submit">Add</button>
                        
                    </div>
                </div>
            </form>
        </div>
    </>)
}


/*

{geoLocation._lat === undefined && geoLocation._long === undefined ? (
                        <>
                            <p>loading</p>
                        </>
                        ) : (
                        <>
                            <br />
                            <p>Latitude: </p>{geoLocation._lat}
                            <br />
                            <p>Longitude: </p>{geoLocation._long}
                        </>
    )}

*/