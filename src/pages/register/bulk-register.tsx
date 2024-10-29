import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, db, doc, getDocs, setDoc } from '../../firebase';
import { ToastHook } from '../../context/toastProvider';
import { LoaderHook } from '../../context/loaderProvider';
import { Dropdown } from 'primereact/dropdown';

export type ISelect = {
    code: string;
    name: string
    userId?: string;
    username?: string
}

const BulkRegister: React.FC = () => {
    const navigate = useNavigate();


    const setUser = async ({ email, uid, userNameToPhone, careOf, place, memberId, name }) => {
        // Define the collection reference
        const customDocRef = doc(db, 'users', uid);
        // Add a document to the collection with the custom ID
        try {
             await setDoc(customDocRef, {
                email,
                name,
                memberId,
                place,
                phone: userNameToPhone,
                careOf: careOf
            })
            return true;
        } catch (e) {
            console.error(e)
            return null;
        }
    }

    const setUserRole = async ({ uid }, role) => {
        // Define the collection reference
        const customDocRef = doc(db, 'roles', uid);

        // Add a document to the collection with the custom ID
        try {
             await setDoc(customDocRef, {
                role
            });
            return true;
        } catch (e) {
            console.error(e)
            return null;
        }
    }

    const saveUser = async (data) => {
        const apiUrl = 'https://europe-west1-ariaclubindia.cloudfunctions.net/user/addUser';
        //'http://127.0.0.1:5001/ariaclubindia/europe-west1/user/addUser';
        //'https://europe-west1-ariaclubindia.cloudfunctions.net/user/addUser';
        // Create the request headers
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${sessionStorage.getItem('AUTH_TOKEN')}`)

        // Configure the request options
        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data), // Convert data to JSON string
        };

        try {
            return await fetch(apiUrl, requestOptions)
        } catch (e) {
            return e;
        }

    }


    const register = async ({ email, uid, userName, careOf, place, memberId, name, password }) => {
            const userNameToPhone = parseInt(userName);
            if (isNaN(userNameToPhone)) {
                // fireToast({ severity: 'error', summary: 'Failed', detail: 'Enter a Valid Phone Number', life: 3000 })
                return;
            }
            // showSpinner();
            const formattedMemberId = `${memberId.toString()}@gmail.com`;
            const stream = await saveUser({ email: formattedMemberId, password, phoneNumber: userNameToPhone })
            const result = await stream?.json();

            if (!result.success) {
                const messageFormatted = result.message ? result.message.replace('email address', 'Member Id') : 'something went wrong';
                const codeFormatted = result.code ? result.code.replace('email', 'Member Id') : 'Error';
                // fireToast({ severity: 'error', summary: codeFormatted, detail: messageFormatted, life: 3000 })
                // hideSpinner();
                return false
            }

            if(result.success && result.user) {
                const {email, uid } = result.user
                const userResult = await setUser({email, uid, userNameToPhone,  careOf, place, memberId, name});

                if(!userResult) {
                    // fireToast({ severity: 'error', summary: 'Error', detail: 'failed to add user', life: 3000 })
                    // hideSpinner();
                    return;
                }

                const roleResult = await setUserRole({uid}, 'user');
                if(!roleResult) {
                   // fireToast({ severity: 'error', summary: 'Error', detail: 'failed to add user role', life: 3000 })
                    // hideSpinner();
                    return;
                }
                // Success Save successful
                // fireToast({ severity: 'success', summary: 'Success', detail: 'user has been added', life: 3000 })
                // navigate('/users');
                // hideSpinner();
            } else {
               // hideSpinner();
                // fireToast({ severity: 'error', summary: 'Error', detail: 'something went wrong', life: 3000 })  
            }
        }
    

    const itemTemplate = (option) => {
        if(!option) return "Select an Option";
        return(
            <div className="custom-dropdown-item">
                <span className="custom-dropdown-label">{option?.name} ({option?.username})</span>
          </div>
        )
    }

    const getUsers = async () => {
        const customDocRef = collection(db, 'users');
        const usersRef = await getDocs(customDocRef);
        const users = usersRef.docs.map(x => {
            const data = x.data();
            return { name: data.memberId, code: data.memberId, userId: x.id, username: data.name }
        }) as ISelect[];
    }

    useEffect(() => {
        getUsers();
    }, [])

    return (
       <button>

       </button>
    )
}

export default BulkRegister;
