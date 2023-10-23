import  React, {useState,useEffect} from 'react';
import { getAuth, User } from 'firebase/auth';
import AuthCheck from '../hooks/Auth.hook';
import { db, doc, getDoc, app } from '../firebase';
const auth = getAuth(app);

export const UserContext = React.createContext<{isAdmin: boolean, auth: any, setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>} | undefined>(undefined);

type UserRole = {
    role: string;
}

const UserProvider = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    //const [auth] = AuthCheck()
   
    const fetchRole = async (uid: string) => {
       const customDocRef = doc(db, 'roles', uid);
       const userRole = (await getDoc(customDocRef)).data() as UserRole;
       console.log('xxxxxxxxxxx', userRole?.role)
       setIsAdmin(userRole?.role === 'admin')
    }

    useEffect(() => {  
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
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
