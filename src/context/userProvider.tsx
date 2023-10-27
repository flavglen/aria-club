import  React, {useState,useEffect} from 'react';
import PropTypes from 'prop-types';
import { getAuth, User } from 'firebase/auth';
import { db, doc, getDoc, app } from '../firebase';
const auth = getAuth(app);
/* eslint-disable */
export const UserContext = React.createContext<{isAdmin: boolean, user:any,  auth: any, setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>} | undefined>(undefined);

type UserRole = {
    role: string;
}

const UserProvider = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
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
                console.log('AUTh', authUser)
                // User is signed in
                setUser(authUser);
                if(authUser?.uid) {
                    fetchRole(authUser?.uid)
                }
            } else {
                // User is signed out
                setUser(null);
                setIsAdmin(false);
                sessionStorage.removeItem('AUTH_TOKEN');
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{isAdmin,auth, setIsAdmin, user}}>
            {children}
        </UserContext.Provider>
    )
}

UserProvider.propTypes = {
    children: PropTypes.node, // Validate children as a node
  };
  

export default UserProvider;
