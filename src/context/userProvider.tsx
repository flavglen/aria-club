import  React, {useState,useEffect} from 'react';
import { getAuth, User } from 'firebase/auth';
import { db, doc, getDoc, app } from '../firebase';
const auth = getAuth(app);

export const UserContext = React.createContext<{isAdmin: boolean, auth: any, setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>} | undefined>(undefined);

type UserRole = {
    role: string;
}

const UserProvider = ({children}) => {
    const [_, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const fetchRole = async (uid: string) => {
       const customDocRef = doc(db, 'roles', uid);
       const userRole = (await getDoc(customDocRef)).data() as UserRole;
       setIsAdmin(userRole?.role === 'admin')
    }

    useEffect(() => {  
        const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
            if (authUser) {
                const token = await authUser.getIdToken();
                sessionStorage.setItem('AUTH_TOKEN', token);
                // User is signed in
                setUser(authUser);
                if(authUser?.uid) {
                    fetchRole(authUser?.uid)
                }
            } else {
                // User is signed out
                setUser(null);
                setIsAdmin(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{isAdmin,auth, setIsAdmin}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider;