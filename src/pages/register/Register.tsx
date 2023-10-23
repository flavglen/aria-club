import React from 'react';
import { Link } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app,  db, doc, setDoc } from '../../firebase';
import { useNavigate } from "react-router-dom";
import IsAdmin from '../../hooks/Admin.hook';

const auth = getAuth(app); // Use your Firebase App instance here

const Register: React.FC = () => {
    const [userName, setUserName] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [cPassword, setCPassword] = React.useState("");
    const [place, setPlace] = React.useState("");
    const [memberId, setMemberId] = React.useState(0);
    const [name, setName] = React.useState("");
    const [loading, setLoading] =  React.useState(false);
    const [isAdmin] = IsAdmin();
    const navigate = useNavigate();

    if(!isAdmin) {
        alert('Only admins can access this page');
        navigate('/');
    }

    const updateUserName = (e) => {
        setUserName(e?.target?.value)
    }

    const updatePassword = (e) => {
        setPassword(e?.target?.value)
    }

    const updateCPassword = (e) => {
        setCPassword(e?.target?.value)
    }

    const updateName = (e) => {
        setName(e?.target?.value)
    }

    const updateMemberNumber = (e) => {
        setMemberId(e?.target?.value)
    }

    const updatePlace = (e) => {
        setPlace(e?.target?.value)
    }

    const setUser = async ({email, uid, name,userNameToPhone}) => {
       // Define the collection reference
       const customDocRef = doc(db, 'users', uid);

        // Add a document to the collection with the custom ID
       return  await setDoc(customDocRef, {
            email,
            name,
            memberId,
            place,
            phone: userNameToPhone
        })
        // .then(() => {
        //      console.log('Document added with custom ID:', uid);
        // })
        // .catch((error) => {
        //      console.error('Error adding document:', error);
        // });
    }

    const setUserRole = async ({uid}, role) => {
       // Define the collection reference
       const customDocRef = doc(db, 'roles', uid);

        // Add a document to the collection with the custom ID
       return await setDoc(customDocRef, {
            role
        })
        // .then(() => {
        //      console.log('Document added with custom ID:', uid);
        //      setLoading(false);
        //      // navigate to sign in page
        //      navigate('/register')
        // })
        // .catch((error) => {
        //      console.error('Error adding document:', error);
        // });
    }
    

    const register = () => {
        if(userName && name && password && cPassword === password && memberId) {
            const userNameToPhone = parseInt(userName);
            if(isNaN(userNameToPhone)) {
                alert('Enter a Valid Phone Number');
                return;
            }
            setLoading(true);
            const formattedMemberId = `${memberId.toString()}@gmail.com`;

            createUserWithEmailAndPassword(auth, formattedMemberId, password)
            .then(async (userCredential) => {
                const {user: {email, uid}} = userCredential;
                //TODO check status of below updates
                await setUser({email, uid, name, userNameToPhone});
                await setUserRole({uid}, 'user');
                setLoading(false)
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
        } else {
            alert('Please Enter All details');
        }
    }

    return (
        <main className="w-full max-w-md mx-auto p-6">
            <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <div className="p-4 sm:p-7">
                    <div className="text-center">
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?
                            <Link className="text-blue-600 decoration-2 hover:underline font-medium" to="/login">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                    <div className="mt-5">
                        <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-[1_1_0%] before:border-t before:border-gray-200 before:mr-6 after:flex-[1_1_0%] after:border-t after:border-gray-200 after:ml-6 dark:text-gray-500 dark:before:border-gray-600 dark:after:border-gray-600">Or</div>
                        <form>
                            <div className="grid gap-y-4">
                                <div>
                                    <label className="block text-sm mb-2 dark:text-white">Phone:</label>
                                    <div className="relative border rounded">
                                        <input onChange={updateUserName} type="text" id="phone" name="phone" className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400" required aria-describedby="email-error" />
                                        <div className="hidden absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
                                            <svg className="h-5 w-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="hidden text-xs text-red-600 mt-2" id="email-error">Please include a valid email address so we can get back to you</p>
                                </div>
                                <div>
                                    <label htmlFor="name" className="block text-sm mb-2 dark:text-white">Name</label>
                                    <div className="relative border rounded">
                                        <input onChange={updateName} type="text" id="name" name="name" className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400" required aria-describedby="password-error" />
                                        <div className="hidden absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
                                            <svg className="h-5 w-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="hidden text-xs text-red-600 mt-2" id="password-error">8+ characters required</p>
                                </div>
                                <div>
                                    <label htmlFor="name" className="block text-sm mb-2 dark:text-white">Member Number</label>
                                    <div className="relative border rounded">
                                        <input onChange={updateMemberNumber} type="number" id="name" name="name" className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400" required aria-describedby="password-error" />
                                        <div className="hidden absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
                                            <svg className="h-5 w-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="name" className="block text-sm mb-2 dark:text-white">Place</label>
                                    <div className="relative border rounded">
                                        <input onChange={updatePlace} type="text" id="name" name="name" className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400" required aria-describedby="password-error" />
                                        <div className="hidden absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
                                            <svg className="h-5 w-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm mb-2 dark:text-white">Password</label>
                                    <div className="relative border rounded">
                                        <input onChange={updatePassword} type="password" id="password" name="password" className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400" required aria-describedby="password-error" />
                                        <div className="hidden absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
                                            <svg className="h-5 w-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="hidden text-xs text-red-600 mt-2" id="password-error">8+ characters required</p>
                                </div>
                                <div>
                                    <label className="block text-sm mb-2 dark:text-white">Confirm Password</label>
                                    <div className="relative border rounded">
                                        <input onChange={updateCPassword} type="password" id="confirm-password" name="confirm-password" className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400" required aria-describedby="confirm-password-error" />
                                        <div className="hidden absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
                                            <svg className="h-5 w-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="hidden text-xs text-red-600 mt-2" id="confirm-password-error">Password does not match the password</p>
                                </div>
                                <button type="button" disabled={loading} onClick={register} className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">Sign up</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Register;
