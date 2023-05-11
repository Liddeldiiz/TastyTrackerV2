// React/Bootstrap
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';

// Firebase/Firestore
import { db } from '../config/Firebase';
import { auth } from '../config/Firebase';
import { collection, query, where, onSnapshot, doc, setDoc } from 'firebase/firestore';


export const ChangeUserName = () => {
    const [userName, setUserName] = useState();
    const [documentReference, setDocumentReference] = useState();

    const handleSubmit = () => {
        try {

            console.log(auth?.currentUser.uid);
            const colRef = collection(db, 'users');
            const q = query(colRef, where('userId', '==', auth?.currentUser.uid));

            const queryResults = [];
            let queryResult;

            onSnapshot(q, (snapshot) => {
                snapshot.docs.forEach((doc) => {
                    queryResults.push({ ...doc.data(), id: doc.id });
                })
                setDocumentReference(queryResults[0].id);
            });

            const docRef = doc(db, 'users', documentReference);

            const data = {
                username: userName,
                userId: auth?.currentUser.uid
            };

            setDoc(docRef, data)
            .then(docRef => {
                console.log("document has been updated successfully");
            })
            .catch(error => {
                console.log(error);
            })

/*
            const docRef = await addDoc(collection(db, "users"), {
              username: userName,
              userId: auth?.currentUser.uid
            });
            console.log("Document written with ID: ", docRef.id);*/
          } catch (e) {
            console.error("Error adding document: ", e);
          }
        console.log("userName: ", userName);
    }

    return (

        <div>
            <a href="./settings"><Button>back</Button></a>
            <div>
                <form onSubmit={handleSubmit}>
                <input 
                onChange={(e) => setUserName(e.target.value)}
                type='text'
                placeholder="Username..."
                id='username'
                name='username'/>

                <Button onClick={handleSubmit}>Change Username</Button>
                </form>
            </div>
        </div>
        
    )
}