import { User, getAuth } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { app } from '../firebase';
const auth = getAuth(app);

const AuthCheck = () => {

const [user, setUser] = useState<User|null>(null);

    useEffect(() => {
    // Add an authentication state listener
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
        if (authUser) {
            // User is signed in
            setUser(authUser);
        } else {
            // User is signed out
            setUser(null);
        }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
    }, []);

    return [user, setUser]

}

export default AuthCheck;