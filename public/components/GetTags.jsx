import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, onSnapshot, DocumentSnapshot, QuerySnapshot } from 'firebase/firestore';

import { db } from '../config/Firebase';

import Button from 'react-bootstrap/Button';

export const GetTags = ( props ) => {
    
    /*
    async function deprecatedTags() {
        const snapshot = await FirebaseError.firestore().collection('tags').get()
        return snapshot.docs.map(doc => doc.data());
    }*/

// checkout useContext
// const { currentUser } = useContext(AuthContext) was imported from ./auth/Auth by dev world (yt)
    const [isLoading, setLoading] = useState(false);
    const [tags, setTags] = useState();
    const [buttons, setButtons] = useState();

    const [ breakfastButtonValue, setBreakfastButtonValue ] = useState(0);
    const [ lunchButtonValue, setLunchButtonValue ] = useState(0);
    const [ dinnerButtonValue, setDinnerButtonValue ] = useState(0);
    const [ snackButtonValue, setSnackButtonValue ] = useState(0);

    const [ selectedValue, setSelectedValue] = useState(-1);

    const tagRef = collection(db, 'tags');
    const elementArr = [];

    useEffect(() => {
        

        try {
            getTagsFromDb();
            
        } catch (error) {
            console.error("error: ", error);
        }
    }, []);

    let tempTags;
    const items = [];
        const getTagsFromDb = async () => {
            setLoading(true);

            const querySnapshot = await getDocs(tagRef);
            

            querySnapshot.forEach((doc) => {
                if(items.length <= 3) {
                    //console.log("doc.data: ", doc.data());
                    //let key = Object.keys(doc.data())[0];
                    let value = Object.values(doc.data())[0];
                    let mapElement =  `${value}`; //${key}:
                    items.push(mapElement);
                    
                }
            
                /*
            items.forEach((item) => {
                let key = Object.keys(item)[0];
                let value = Object.values(item)[0];
                let mapElement =  `${key}:${value}`;
                elementArr.push(mapElement);
            })*/
            setTags(items);
            setLoading(false);
            
            });

            ///////////// setting the button values /////////////

            setBreakfastButtonValue(parseInt(Object.keys(items)[0]) + 1);
            //console.log("breakfastButtonValue: ", breakfastButtonValue);
            setLunchButtonValue(parseInt(Object.keys(items)[1]) + 1);
            //console.log("lunchButtonValue: ", lunchButtonValue);
            setDinnerButtonValue(parseInt(Object.keys(items)[2]) + 1);
            setSnackButtonValue(parseInt(Object.keys(items)[3]) + 1);
        };

    function sayHello() {
        alert("hello world")
    }

    function getBreakfastButtonValue() {
        console.log("value of button: ", breakfastButtonValue);
        if(selectedValue !== breakfastButtonValue) {
            setSelectedValue(breakfastButtonValue);// delay because of queue
        }
        console.log("selectedValue: ", selectedValue);
    }

    function getLunchButtonValue() {
        console.log("value of button: ", lunchButtonValue);
        if(selectedValue !== lunchButtonValue) {
            setSelectedValue(lunchButtonValue);
        }
        console.log("selectedValue: ", selectedValue);
    }

    function getDinnerButtonValue() {
        console.log("value of button: ", dinnerButtonValue);
        if(selectedValue !== dinnerButtonValue) {
            setSelectedValue(dinnerButtonValue);
        }
        console.log("selectedValue: ", selectedValue);
    }

    function getSnackButtonValue() {
        console.log("value of button: ", snackButtonValue);
        if(selectedValue !== snackButtonValue) {
            setSelectedValue(snackButtonValue);
        }
        console.log("selectedValue: ", selectedValue);
    }
    


    const renderButtons = () => {
        //console.log("tags: ", tags);


        if (tags === undefined) {
            return (<><p>loading</p></>);
        }
        
        let breakfastButton = Object.values(tags)[0];
        
        let lunchButton = Object.values(tags)[1];
       
        let dinnerButton = Object.values(tags)[2];
        
        let snackButton = Object.values(tags)[3];
        return (
            <div>
                <Button value={breakfastButtonValue} onClick={getBreakfastButtonValue}>{breakfastButton}</Button>
                <Button value={lunchButtonValue} onClick={getLunchButtonValue}>{lunchButton}</Button>
                <Button value={dinnerButtonValue} onClick={getDinnerButtonValue}>{dinnerButton}</Button>
                <Button value={snackButtonValue} onClick={getSnackButtonValue}>{snackButton}</Button>   
            </div>
        )
    }

    
    /////////// Pushing the selected value to AddImage.jsx ///////////
    props.func(selectedValue);

    return (
    <>
        <div>
            {renderButtons()}
        </div>
    </>);
}

/* this is throwing an type error: cannot read properties of undefined...
{tags.forEach((item) => {
                <div className='button-div'> 
                    {item}
                </div>
            })}


setTags(items);
            tempTags = items;
            console.log("tempTags: ", tempTags);
            setLoading(false);
            tags.forEach((item) => {
                console.log(Object.keys(item));
                console.log(Object.values(item))
                let element = <><button value={Object.keys(item)}>{Object.values(item)}</button></>
                elementArr.push(element)
            })
            setButtons(elementArr);
            console.log("tags: ", tags);
            console.log("elementArr: ", elementArr);

            
            {isLoading ? (
        <>
            <p>loading</p>
        </>) : (
            tags.forEach((item) => {
            console.log("return: item: ", Object.values(item));
                <div className='button-div'> 
                    <p>{Object.values(item)}</p>
                </div>
            }))}
            
            */