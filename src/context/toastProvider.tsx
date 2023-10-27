import  React, {useRef, useContext} from 'react';
import { Toast } from 'primereact/toast';
import PropTypes from 'prop-types';
/* eslint-disable */
export const ToastContext = React.createContext<any|null>(null);
//const [toast, setToast] = useState<{severity:'success', summary: 'Success', detail:'Message Content', life: 3000} | null>(null);

const ToastProvider = ({children}) => {
    const toastBR = useRef<Toast>(null);
    const fireToast = (message) => {
        if(toastBR.current && message) {
            toastBR.current.show(message)
        }
    }
   
    return (
        <ToastContext.Provider value={{fireToast}}>
            <Toast ref={toastBR} />
            {children}
        </ToastContext.Provider>
    )
}

ToastProvider.propTypes = {
    children: PropTypes.node, // Validate children as a node
};


export const ToastHook = () => useContext(ToastContext);

export default ToastProvider;
