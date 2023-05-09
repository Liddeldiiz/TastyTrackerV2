import { useEffect, useRef, useState} from 'react';
import { useLocation } from 'react-router-dom';

import home_icon from '../static/images/home_icon.svg';

import '../static/css/App.css';

export const AddImage = () => {

    const location = useLocation();
    const imgRef = useRef();
    const [imageFile, setImageFile] = useState();
    const [isLoading, setLoading] = useState(false);
    const [imgElement, setImgElement] = useState();
    const [readerResult, setReaderResult] = useState("");

    const imageArr = [];
    //let file = location.state.image;

    function previewFile() {
        console.log("location.state.image: ", location.state.image);
        const file = location.state.image;

        function readAndPreview(file) {
            const reader = new FileReader();

            console.log("before reader listener");
            reader.addEventListener(
                "load",
                () => {
                    //console.log("reader.addEventListener => load () => {}");
                    //console.log("imageFile: ", imageFile);
                    //console.log("imageFile.src: ", imageFile.src);
                    if (imageFile !== undefined) {
                        setImgElement(<img src={imageFile.src} className='upload-image'></img>)
                        return;
                    }
                    const image = new Image();
                    image.height = 100;
                    image.title = file.name;
                    image.src = reader.result;
                    setReaderResult(reader.result);
                    console.log("image: ", image);
                    imageArr.push(image);
                    setImageFile(image);
                    setLoading(false);
                },
                false
            );
            console.log("reader.readAsDataURL");
            reader.readAsDataURL(file);
        }

        if (file) {
            console.log("calling readAndPreview(file):");
            readAndPreview(file);
        }
    }

    
    useEffect(() => {
        setLoading(true);
        console.log("isLoading: ", isLoading);

        console.log("calling previewFile():");
        previewFile();
        //console.log("imageFile",imageFile);
        
        console.log("imageArr[0]: ", imageArr[0]);
        console.log("isLoading: ", isLoading);
        
        /*
        while(readerResult === "") {
            console.log("loading...");
        } */ // stuck ==> endless loop

        setLoading(false);
        
    
    }, [imageFile, location.state.image]);
      
/* 
<img src={home_icon} id="home_icon" className='home-icon'/>
{isLoading ? (<><h3>Loading</h3></>) : imgElement}
*/

    return(
    <>
        <div>
            <div>
                <a href='/'>
                    <img src={home_icon} id="home_icon" className='home-icon'/>
                </a>
                <p>
                    add image page
                </p>
            </div>
            <hr />
            <div className='images-flex-container'>
            {isLoading ? (<><h3>Loading</h3></>) : imgElement}
                
            </div>
        </div>
    </>)
}

/*

function readImage(file) {
        if(file.type && !file.type.startsWith('image/')) {
            console.log('File is not an image. ', file.type, file);
            return;
        }
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            src = event.target.result;
        });
        reader.readAsDataURL(file);
    }

*/


/*

function previewFile() {
            console.log("location.state.image: ", location.state.image);
            console.log("location.state.image.result: ", location.state.image.result);
        
            //let preview = imgRef;
            const file = location.state.image;
            console.log("file.result: ", file.result);
    
            console.log("before readAndPreview func");
            //console.log('file.type: ', file.type);
            function readAndPreview(file) {
                const reader = new FileReader();
                console.log("reader.result: ", reader.result);
                
                /*const image = new Image();
                console.log("image: ", image);
                image.height = 100;
                console.log("image.height: ", image.height);;
                console.log("image: ", image);
                //console.log("file.name: ", file.name);
                image.title = file.name;
                console.log("image.title: ", image.title);
                console.log("image:", image);
                //console.log("reader.result", reader.result);
                image.src = reader.result;
                console.log("image.src: ", image.src);
                console.log("image:", image);
                let tempImg = image;
                setImageFile(image);
                console.log("tempImg: ", tempImg);
                console.log("tempImg.result: ", tempImg.result);
    
                console.log("before reader listener");
                reader.addEventListener(
                    "load",
                    () => {
                        const image = new Image();
                        console.log("image: ", image);
                        image.height = 100;
                        console.log("image.height: ", image.height);;
                        console.log("image: ", image);
                        //console.log("file.name: ", file.name);
                        image.title = file.name;
                        console.log("image.title: ", image.title);
                        console.log("image:", image);
                        //console.log("reader.result", reader.result);
                        image.src = reader.result;
                        console.log("image.src: ", image.src);
                        console.log("image:", image);
                        let tempImg = image;
                        setImageFile(image);
                        console.log("tempImg: ", tempImg);
                        console.log("tempImg.result: ", tempImg.result);
                    },
                    false
                );
                console.log("reader.readAsDataURL");
                reader.readAsDataURL(file);
            }
    
            if (file) {
                console.log("inside if statment, before readAndPreview Call");
                readAndPreview(file);
            }

*/