import React, { useContext, useState } from 'react';

export const LoaderContext = React.createContext<any | null>(null);
//const [toast, setToast] = useState<{severity:'success', summary: 'Success', detail:'Message Content', life: 3000} | null>(null);

const LoaderProvider = ({ children }) => {
    const [loader, setLoader] = useState(false);

    const showSpinner = () => {
        setLoader(true);
      };
    
      const hideSpinner = () => {
        setLoader(false);
      };

    return (
        <LoaderContext.Provider value={{ loader, showSpinner, hideSpinner }}>
            {children}
        </LoaderContext.Provider>
    )
}

export const LoaderHook = () => useContext(LoaderContext);

export default LoaderProvider;
