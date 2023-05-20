import { useEffect, useState, useContext} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import addNotification from 'react-push-notification';

import { GeoPoint } from 'firebase/firestore';

import { GetTags } from '../components/GetTags';
import { uploadImage } from '../components/UploadImageV2';
import { GeoLocation } from '../components/GeoLocation';
import { UserContext } from '../App';

import Button from 'react-bootstrap/Button';

import home_icon from '../static/images/home_icon.svg';
import logo from '../static/images/logo.svg';

//import '../static/css/App.css';
import '../static/css/AddImage.css';
import LoadingSpinner from '../components/LoadingSpinner';

export const AddImage = () => {

    
    const [refreshKey, setRefreshKey] = useState(0); 

    const navigate = useNavigate();

    const location = useLocation(); // location for file
    const [imageFile, setImageFile] = useState(); // to pass to the db
    const [imageRender, setImageRender] = useState(); // only for rendering
    const [isLoading, setLoading] = useState(false);
    const [imgElement, setImgElement] = useState();

    const [ selectedTag, setSelectedTag ] = useState();
    const [ timeStamp, setTimeStamp] = useState();
    //const [ geoLocation, setGeoLocation ] = useState(); // location of user
    const [ note, setNote ] = useState("");
    const [latitude, setLatitude] = useState();
    const [longitude, setLongitude] = useState();
    const [geoLocation, setGeoLocation] = useState();
    const [isGeo, setIsGeo] = useState(false);
    const [isUploading, setUploading] = useState(false);


    const imageArr = [];
    const d = new Date();

    useEffect(() => {
        if (latitude !== undefined && longitude !== undefined) {
            setGeoLocation(new GeoPoint(latitude, longitude));
            console.log("setting isGeo: true");
            setIsGeo(true);
        }
    }, [latitude, longitude])

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

    useEffect(() => {
        if ("geolocation" in navigator) {
            //console.log("Available");

            navigator.permissions
                .query({ name: 'geolocation'})
                .then((permissionStatus) => {
                    if (permissionStatus.state === 'granted') {
                        getCurrentLocation();
                    } else if (permissionStatus.state === 'prompt') {
                        requestGeolocationPermission();
                    } else {
                        handleGeolocationPermissionDenied();
                    }
                })
                .catch((error) => {
                    alert('Error querying geolocation permission: ', error);
                });
        } else {
            alert('Geolocation is not supported');
        }
    }, [])

    //const geoLocation = latitude && longitude ? new GeoPoint(latitude, longitude) : null;

    const requestGeolocationPermission = () => {
        navigator.geolocation.getCurrentPosition(
          () => {
            // Geolocation permission granted by the user
            // Proceed with geolocation operations
            getCurrentLocation();
          },
          (error) => {
            alert('Error requesting geolocation permission:', error);
          }
        );
      };

    const getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            // Use the obtained latitude and longitude values
            alert('Current location:', latitude, longitude);
          },
          (error) => {
            alert('Error retrieving current location:', error);
          }
        );
      };

      const handleGeolocationPermissionDenied = () => {
        // Geolocation permission denied or unavailable
        // Handle the situation accordingly (e.g., display an error message)
        alert('Geolocation permission denied or unavailable');
      }

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

    const pullDataFromTags = (data) => {
        setSelectedTag(data);
        console.log("data: ", data);
        console.log("selectedTag: ", selectedTag);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        
      
        try {
          await uploadImage(imageFile, timeStamp, geoLocation, selectedTag, note);
          navigate('/');
          addNotification({
            title: 'TastyTracker',
            message: 'Image uploaded successfully',
            duration: 4000,
            icon: logo, // custom logo would be nice
            native: true,
        })
        setUploading(false);
        } catch (error) {
          addNotification({
            title: 'TastyTracker',
            message: `Error uploading image: ${error.message}`,
            duration: 4000,
            icon: logo, // custom logo would be nice
            native: true,
        })
        setUploading(false);
        }
      };

    return(
    <>
        <div className='div-add-image-body'>
            <div className='div-header'>
                <h3 className='add-image-tilte'>Add Image</h3>
                <a href='/'>
                    <img src={home_icon} id="home_icon" className='home-icon'/>
                </a>
                
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
                        Location: {isGeo ? (<><p>{geoLocation.latitude}, {geoLocation.longitude}</p></>) : (<><p>loading...</p></>)}
                        
                    </div>
                    { /* <div className='div-upload-component'> */ }
                    <button type="submit">Add</button>
                    {isUploading ? <LoadingSpinner /> : null}
                        
                    { /* </div> */ }
                </div>
            </form>
        </div>
    </>)
}


