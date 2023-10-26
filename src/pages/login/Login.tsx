import React, { useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../firebase';
import { useNavigate } from "react-router-dom";
import { ToastHook } from '../../context/toastProvider';
import IsAdmin from '../../hooks/Admin.hook';

const auth = getAuth(app); 

const Login: React.FC = () => {
    const [userName, setUserName] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] =  React.useState(false);
    const { fireToast } = ToastHook();
    const navigate = useNavigate();
    const [,,user] = IsAdmin();

    const updateUserName = (e) => {
        setUserName(e?.target?.value)
    }

    const updatePassword = (e) => {
        setPassword(e?.target?.value)
    }

    useEffect(() => {
        if(user) {
            navigate("/");
        }
    }, [user])

    const login = () => {
        const memberId = parseInt(userName);

        if(!userName || !password) {
            alert('enter details');
            return;
        }
        
        if(isNaN(memberId)) {
            alert('Enter a Valid Phone Member id');
            return;
        }

        setLoading(true);
        const formatedMemberIdToEmail = `${memberId.toString()}@gmail.com`;
        signInWithEmailAndPassword(auth, formatedMemberIdToEmail, password)
        .then(() => {
          fireToast({ severity: 'success', summary: 'Login Successful', detail: 'You are now logged in!', life: 3000 })
          setLoading(false);
          navigate("/");
        })
        .catch((error) => {
            fireToast({ severity: 'error', summary: 'Error', detail: 'failed to login. try again with valid credentials', life: 3000 })
            setLoading(false);
            console.log(error);
        });
    }

    return (
        <main className="w-full max-w-md mx-auto p-6">
            <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <div className="p-4 sm:p-7">
                    <div className="mt-5">
                        <form>
                            <div className="grid gap-y-4">
                                <div>
                                    <label className="block text-sm mb-2 dark:text-white">Member Id</label>
                                    <div className="relative border rounded">
                                        <input onChange={updateUserName} value={userName} type="text" id="phone" name="phone" className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400" required aria-describedby="email-error" />
                                        <div className="hidden absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
                                            <svg className="h-5 w-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="hidden text-xs text-red-600 mt-2" id="email-error">Please include a valid email address so we can get back to you</p>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm mb-2 dark:text-white">Password</label>
                                    <div className="relative border rounded">
                                        <input onChange={updatePassword} value={password} type="password" id="password" name="password" className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400" required aria-describedby="password-error" />
                                        <div className="hidden absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
                                            <svg className="h-5 w-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="hidden text-xs text-red-600 mt-2" id="password-error">8+ characters required</p>
                                </div>

                                <button type="button" disabled={loading} onClick={login} className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">Login</button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </main>
    )
}

export default Login;
