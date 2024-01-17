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

const Register: React.FC = () => {
    const { fireToast } = ToastHook();
    const [userName, setUserName] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [place, setPlace] = React.useState("");
    const [memberId, setMemberId] = React.useState(0);
    const [name, setName] = React.useState("");
    const navigate = useNavigate();
    const {hideSpinner, showSpinner, loader} = LoaderHook();
    const [users, setUsers] = React.useState<ISelect[]>([]);
    const [careOf, setCareOf] = React.useState(null);

    const updateUserName = (e) => {
        setUserName(e?.target?.value)
    }

    const updatePassword = (e) => {
        setPassword(e?.target?.value)
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

    const updateCareOf = (e) => {
        setCareOf(e?.target?.value)
    }

    const setUser = async ({ email, uid, userNameToPhone }) => {
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


    const register = async () => {
        if (userName && name && password && memberId) {
            const userNameToPhone = parseInt(userName);
            if (isNaN(userNameToPhone)) {
                fireToast({ severity: 'error', summary: 'Failed', detail: 'Enter a Valid Phone Number', life: 3000 })
                return;
            }
            showSpinner();
            const formattedMemberId = `${memberId.toString()}@gmail.com`;
            const stream = await saveUser({ email: formattedMemberId, password, phoneNumber: userNameToPhone })
            const result = await stream?.json();

            if (!result.success) {
                const messageFormatted = result.message ? result.message.replace('email address', 'Member Id') : 'something went wrong';
                const codeFormatted = result.code ? result.code.replace('email', 'Member Id') : 'Error';
                fireToast({ severity: 'error', summary: codeFormatted, detail: messageFormatted, life: 3000 })
                hideSpinner();
                return false
            }

            if(result.success && result.user) {
                const {email, uid } = result.user
                const userResult = await setUser({email, uid, userNameToPhone});

                if(!userResult) {
                    fireToast({ severity: 'error', summary: 'Error', detail: 'failed to add user', life: 3000 })
                    hideSpinner();
                    return;
                }

                const roleResult = await setUserRole({uid}, 'user');
                if(!roleResult) {
                    fireToast({ severity: 'error', summary: 'Error', detail: 'failed to add user role', life: 3000 })
                    hideSpinner();
                    return;
                }
                // Success Save successful
                fireToast({ severity: 'success', summary: 'Success', detail: 'user has been added', life: 3000 })
                navigate('/users');
                hideSpinner();
            } else {
                hideSpinner();
                fireToast({ severity: 'error', summary: 'Error', detail: 'something went wrong', life: 3000 })  
            }
        } else {
            fireToast({ severity: 'error', summary: 'Failed', detail: 'Please Enter All details', life: 3000 })
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
        showSpinner();
        const customDocRef = collection(db, 'users');
        const usersRef = await getDocs(customDocRef);
        const users = usersRef.docs.map(x => {
            const data = x.data();
            return { name: data.memberId, code: data.memberId, userId: x.id, username: data.name }
        }) as ISelect[];
        hideSpinner();
        setUsers(users);
    }

    useEffect(() => {
        getUsers();
    }, [])

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
                                    <label htmlFor="name" className="block text-sm mb-2 dark:text-white">Care Of</label>
                                    <div className="relative border rounded">
                                        <Dropdown itemTemplate={itemTemplate}
                                        options={users}
                                        onChange={updateCareOf} optionLabel="name"
                                        placeholder="Select Care of" className="w-full md:w-14rem"/>
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
                                <button type="button" disabled={loader} onClick={register} className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">Sign up</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Register;
