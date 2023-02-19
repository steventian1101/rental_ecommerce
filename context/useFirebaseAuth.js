import { useState, useEffect } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup } from 'firebase/auth';
import { auth } from '../lib/initFirebase';
import timediff from 'timediff';
import { db } from '../lib/initFirebase';
import { collection, addDoc, query, orderBy, where, getDocs } from "firebase/firestore";
import { useRouter } from 'next/router';
export default function useFirebaseAuth() {
    const [authenticated, setAuthenticated] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [userCredential, setUserCredential] = useState([]);
    const [confirmationEmail, setConfirmationEmail] = useState('');
    const [newCredential, setNewCredential] = useState(null);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState(null);
    const [generalProfile, setGeneralProfile] = useState(null);
    const router = useRouter();
    const listCollectionRef = collection(db, "users")
    const signIn = (auth, email, password) => {
        signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
            setUserCredential(userCredential.user)
            if (typeof window !== "undefined" && "localStorage" in window && localStorage.getItem("loginNextUrl")) {
                let url = localStorage.getItem("loginNextUrl");
                router.push(url);
            } else {
                router.push('/');
            }
        }).catch((error) => {
            setError(error.message)
            console.log(error.message)
        });
    };
    const createUser = (auth, email, password) => {
        createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            console.log(userCredential.user.uid);
            if (typeof window !== "undefined" && "localStorage" in window && localStorage.getItem("loginNextUrl")) {
                let url = localStorage.getItem("loginNextUrl");
                router.push(url);
            } else {
                router.push('/');
            }
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
    const googleAuth = (auth, provider) => {
        signInWithPopup(auth, provider)
            .then((result) => {
                //    location.href('/');
                // router.push('/');
                // window.location.reload();
                setConfirmationEmail(result.user.email)
                setNewCredential(result.user);
                if (typeof window !== "undefined" && "localStorage" in window && localStorage.getItem("loginNextUrl")) {
                    let url = localStorage.getItem("loginNextUrl");
                    router.push(url);
                } else {
                    router.push('/');
                }

                // ...
            }).catch((error) => {
                console.log(error.message)
            });
    };
    const getUserInformation = async (email) => {
        let temp = [];
        let q = query(listCollectionRef, where("user_email", "==", email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            temp.push(doc.data());
        });
        if (temp.length != 0) {
            console.log("already")
            router.push('/');
            window.location.reload();
        }
        else {
            console.log("new")
            console.log(newCredential);
            addDoc(listCollectionRef, { user_email: newCredential.email, first_name: newCredential.displayName.split(" ")[0], profile_img: newCredential.photoURL, last_name: newCredential.displayName.split(" ")[1], nick_name: newCredential.displayName + " Rentals", user_phone: "", user_address: "" }).then(response => {
                router.push('/');
                window.location.reload();
            }).catch(error => {
                console.log(error.message)
            });
        }
    }

    useEffect(() => {
        confirmationEmail != "" && getUserInformation(confirmationEmail)
    }, [confirmationEmail])
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const date = new Date();
                setAuthenticated(true)
                setUserCredential(user);
                setImageUrl(user.photoURL);
                // user.getIdTokenResult().then((idTokenResult) => {
                //     // Make sure all the times are in milliseconds!
                //     const authTime = user.metadata.lastSignInTime;
                //     console.log(user)
                //     console.log(date.toUTCString(), authTime);
                //     const diffrence = timediff(new Date(authTime), new Date(), 's');
                //     console.log(diffrence);
                //     const sessionDuration = 1200000;
                //     const millisecondsUntilExpiration = sessionDuration - diffrence.milliseconds;
                //     console.log(millisecondsUntilExpiration)

                //     setTimeout(() => logOut(auth), millisecondsUntilExpiration);
                // });
            } 
            else 
            {
                setAuthenticated(false);
            }
        });
    }, []);
    useEffect(() => {
        console.log(email)
    }, [userCredential])
    const errorRemove = (error) => {
        setError(error);
    }

    return {
        imageUrl,
        authenticated,
        userCredential,
        signIn,
        logOut,
        googleAuth,
        createUser,
        error,
        errorRemove
    };
}