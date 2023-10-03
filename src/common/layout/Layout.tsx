import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import NavBar from '../nav/Navbar';
import { getAuth } from 'firebase/auth';
import { app } from '../../firebase';
import AuthCheck from '../../hooks/Auth.hook';
const auth = getAuth(app); 

const Layout: React.FC = () => {
    const [user] = AuthCheck();
    const logout = () => {
      auth.signOut()
      .then(() => {
        // User is successfully logged out
        console.log('User logged out');
      })
      .catch((error) => {
        // Handle logout error
        console.error('Error logging out:', error);
      });
    }

    return (
        <>
        <header className="sticky top-0 inset-x-0 flex flex-wrap sm:justify-end sm:flex-nowrap z-[48] w-full bg-white border-b text-sm py-2.5 sm:py-4 lg:pl-64 dark:border-gray-700">
          <nav className="flex basis-full items-center w-full mx-auto px-4 sm:px-6 md:px-8" aria-label="Global">
            <div className="mr-5 lg:mr-0 lg:hidden">
              <a className="flex-none text-xl font-semibold dark:text-white" href="/" aria-label="Brand">
                <img src="/assets/images/logo.png" alt="logo"  width={120} height={50}/>
              </a>
            </div>
  
            <div className="w-full flex items-center justify-end ml-auto sm:gap-x-3 sm:order-3">
              {/* <div className="sm:hidden xs:hidden">
                <button type="button" className="inline-flex flex-shrink-0 justify-center items-center gap-2 h-[2.375rem] w-[2.375rem] rounded-full font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transition-all text-xs dark:bg-gray-800 dark:hover:bg-slate-800 dark:text-gray-400 dark:hover:text-white dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800">
                  <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                  </svg>
                </button>
              </div> */}
  
              <div className="flex flex-row items-center justify-end gap-2">
                <div className="hs-dropdown relative inline-flex [--placement:bottom-right]">
                  <button id="hs-dropdown-with-header" type="button" className="hs-dropdown-toggle inline-flex flex-shrink-0 justify-center items-center gap-2 h-[2.375rem] w-[2.375rem] rounded-full font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transition-all text-xs dark:bg-gray-800 dark:hover:bg-slate-800 dark:text-gray-400 dark:hover:text-white dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800" >
                    <i className="pi pi-user" style={{ fontSize: '2rem' }}></i>
                  </button>
  
                  <div className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-[15rem] bg-white shadow-md rounded-lg p-2  dark:border dark:border-gray-700" aria-labelledby="hs-dropdown-with-header">
                    <div className="py-3 px-5 -m-2 bg-gray-100 rounded-t-lg dark:bg-gray-700">
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user?.uid ? 'Signed in as' : 'Sign in' }</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-300">{user?.email}</p>
                    </div>
                    <div className="mt-2 py-2 first:pt-0 last:pb-0">
                      {user?.uid ?
                        <a onClick={logout} className="flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300" href="#">
                          <svg className="flex-none" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
                          </svg>
                          Logout
                        </a> :
                        <Link  to="/login" className="flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300" href="#">
                         <svg className="flex-none" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                           <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
                         </svg>
                         Login
                       </Link> 
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </header>
  
        <div className="sticky top-0 inset-x-0 z-20 bg-white border-y px-4 sm:px-6 md:px-8 lg:hidden dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center py-4">
  
            <button type="button" className="text-gray-500 hover:text-gray-600" data-hs-overlay="#application-sidebar" aria-controls="application-sidebar" aria-label="Toggle navigation">
              <span className="sr-only">Toggle Navigation</span>
              <svg className="w-5 h-5" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
              </svg>
            </button>
  
            {/* <ol className="ml-3 flex items-center whitespace-nowrap min-w-0" aria-label="Breadcrumb">
              <li className="flex items-center text-sm text-gray-800 dark:text-gray-400">
                Application Layout
                <svg className="flex-shrink-0 mx-3 overflow-visible h-2.5 w-2.5 text-gray-400 dark:text-gray-600" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 1L10.6869 7.16086C10.8637 7.35239 10.8637 7.64761 10.6869 7.83914L5 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
              </li>
              <li className="text-sm font-semibold text-gray-800 truncate dark:text-gray-400" aria-current="page">
                Dashboard
              </li>
            </ol> */}
  
          </div>
        </div>
  
        <div id="application-sidebar" className="hs-overlay hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform hidden fixed top-0 left-0 bottom-0 z-[60] w-64 bg-white border-r border-gray-200 pt-7 pb-10 overflow-y-auto scrollbar-y lg:block lg:translate-x-0 lg:right-auto lg:bottom-0 dark:scrollbar-y dark:bg-gray-800 dark:border-gray-700">
          <div className="px-6 flex justify-end lg:hidden">
            <a data-hs-overlay="#application-sidebar"> X </a>
          </div>
          <div className="px-6">
            <a className="flex-none text-xl font-semibold dark:text-white" href="#" aria-label="Brand">
             <img src="/assets/images/logo.png" alt="logo"  width={120} height={50}/>
            </a>
          </div>
  
          <NavBar />
        </div>
  
        <div className="w-full pt-10 px-4 sm:px-6 md:px-8 lg:pl-72">
             <Outlet />
        </div>
      </>
    )
}

export default Layout;