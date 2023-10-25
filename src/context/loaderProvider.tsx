import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';

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

LoaderProvider.propTypes = {
  children: PropTypes.node, // Validate children as a node
};


export const LoaderHook = () => useContext(LoaderContext);

export default LoaderProvider;
