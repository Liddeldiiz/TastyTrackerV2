import { GeoPoint } from 'firebase/firestore';

export const GeoLocation = ( props ) => {

    // insert code for geolocation of user
    let location = new GeoPoint(0, 0);
    console.log("location._lat: ", location._lat);
    console.log("location._long: ", location._long);

    // passing the data back to AddImage.jsx
    props.func(location);
}