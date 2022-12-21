import { useState, useEffect } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup } from 'firebase/auth';
import { auth } from '../lib/initFirebase';
import { useRouter } from 'next/router';
import timediff from 'timediff';
export default function useFirebaseAuth() {
    const [authenticated, setAuthenticated] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [userCredential, setUserCredential] = useState([]);
    const router = useRouter();
    const signIn = (auth, email, password) => {
        signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
            console.log(userCredential);
            setUserCredential(userCredential)
            console.log("okay good !!!!");
                router.push('/');
                window.location.reload();   
        }).catch((error) => {
            console.log(error)
        });
    };
    const createUser = (auth, email, password) => {
        createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            console.log(userCredential.user.uid);
            router.push('/');
            window.location.reload();
        }).catch((error) => {
            console.log(error.message)
        });
    };
    const logOut = (auth) => {
        signOut(auth).then(() => {
            console.log("you are logout");
            router.push("/");
            window.location.reload();
        }).catch((error) => {
            console.log(error)
        });
    };
    const googleAuth = (auth,provider) => {
        signInWithPopup(auth, provider)
            .then((result) => {
            //    location.href('/');
            router.push('/');
            window.location.reload();
                // ...
            }).catch((error) => {
               console.log(error.message)
            });
    };
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const date = new Date(); 
                setAuthenticated(true)
                setUserCredential(user);
                setImageUrl(user.photoURL);
                user.getIdTokenResult().then((idTokenResult) => {
                    // Make sure all the times are in milliseconds!
                    const authTime = user.metadata.lastSignInTime;
                    console.log(user)
                    console.log(date.toUTCString()  , authTime);
                    const diffrence = timediff( new Date(authTime),new Date(), 's');
                    console.log(diffrence);
                    const sessionDuration = 1200000;
                    const millisecondsUntilExpiration = sessionDuration - diffrence.milliseconds;
                    console.log(millisecondsUntilExpiration)
                    
                    setTimeout(() => logOut(auth), millisecondsUntilExpiration);
                });
            } else {
                setAuthenticated(false);
                router.push('/');
            }
        });
    }, []);

    return {
        imageUrl,
        authenticated,
        userCredential,
        signIn,
        logOut,
        googleAuth,
        createUser,
        userCredential
    };
}