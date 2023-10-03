import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { doc, getDoc, db } from '../firebase';
import AuthCheck from './Auth.hook';

type User = {
    role: string;
}

const IsAdmin = () => {
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [auth] = AuthCheck()
    const fetchRole = async (uid: string) => {
       const customDocRef = doc(db, 'roles', uid);
       const userRole = (await getDoc(customDocRef)).data() as User;
       setIsAdmin(userRole?.role === 'admin')
    }

    useEffect(() => {
        if(auth?.uid)
         fetchRole(auth?.uid)
    }, [auth?.uid]);

    return [isAdmin]

}

export default IsAdmin;