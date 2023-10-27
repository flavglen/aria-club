import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import React, { useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { collection, db, doc, getDocs, setDoc, updateDoc } from '../../firebase';
import { Toast } from 'primereact/toast';
import { LoaderHook } from '../../context/loaderProvider';
import { ToastHook } from '../../context/toastProvider';

export enum TYPE  {
    ADD = 'Add',
    EDIT = 'Edit'
}

export type ISelect = {
    code: string;
    name: string
    userId?: string;
    username?: string
}

type PaymentData = {
    user: ISelect;
    careOf: ISelect;
    amount: number;
    mode: ISelect;
    date: string;
    userId: string | undefined;
    id?: string;
}
type onSaveType = (type: boolean) => void;

type IAddPayment = {
    type?: TYPE
    paymentDataForEdit?: PaymentData | undefined
    onSave?: onSaveType
}

const AddPayment: React.FC<IAddPayment> = ({type =  TYPE.ADD , paymentDataForEdit, onSave}) => {
    const navigate = useNavigate();
    const [users, setUsers] = React.useState<ISelect[]>([]);
    const toast = useRef<Toast>(null);
    const {hideSpinner, showSpinner, loader} = LoaderHook();
    const { fireToast } = ToastHook();

    const initPaymentData = () => {
        if(!paymentDataForEdit) {
                return {
                user: { name: '', code: '', userId: '', username: ''},
                careOf: { name: '', code: '', userId: '', username: ''},
                amount: 0,
                mode: { name: '', code: ''},
                date: '',
                userId: ''
            } 
        }
        return paymentDataForEdit; 
    }

    useEffect(() => {
        // Perform the action you want to do after state update here
        console.log('State has been updated. New count:', paymentDataForEdit);
        if(users.length > 0 ) {
            setPaymentData(prev => ({
                ...prev,
                user: paymentDataForEdit?.user || { name: '', code: '', userId: '', username: ''}
            }))
        }
      }, [users]); // The effect depends on the 'count' state
    

    const [paymentData, setPaymentData] = React.useState<PaymentData>(initPaymentData());

    const modeOfPayment = [
        { name: 'Cash', code: 'cash' },
        { name: 'Cheque', code: 'cheque' },
        { name: 'UPI', code: 'upi' }
    ]

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

    const saveData = (e) => {
        e.preventDefault();
        const paymentPayload= {...paymentData};
        if(type === TYPE.EDIT && !paymentPayload?.id) return;

        if(paymentPayload.date) {
            paymentPayload.date = paymentPayload.date.toLocaleString()
        }

       paymentPayload.userId = paymentPayload.user.userId;
       const customDocRef = doc(db, 'payment', type ===  TYPE.ADD ? new Date().getTime().toString() : paymentPayload.id || '');
       const updateOrAdd = type === TYPE.ADD ? setDoc : updateDoc;
       showSpinner();
       updateOrAdd(customDocRef, paymentPayload)
       .then(() => {
            fireToast({severity:'success', summary: 'Success', detail:'Payment has been saved', life: 3000});
            onSave && onSave(true);
            hideSpinner();
            navigate('/view-payment');
       })
       .catch((error) => {
            hideSpinner();
            onSave && onSave(false);
            fireToast({severity:'error', summary: 'Error', detail:'Failed to save data, please try again', life: 3000})
            console.error(error);
       });
    }

    const onChange = (e, key: string) => {
        const value =  e.target.value;
        setPaymentData(prev => ({
            ...prev,
            [key]:value
        }))
    }

    const itemTemplate = (option) => {
        if(!option) return "Select an Option";
        return(
            <div className="custom-dropdown-item">
                <span className="custom-dropdown-label">{option?.name} ({option?.username})</span>
          </div>
        )
    }

    const selectedItemTemplate = (option, props) => {
        if(!option) return "Select an Option";
        return(
            <div className="custom-dropdown-item">
                <span className="custom-dropdown-label">{option?.name} ({option?.username})</span>
          </div>
        )
    }

    useEffect(() => {
        getUsers();
    }, [])

    return (
        <Card title={`${type} Payment`}>
            <form>
                <div className="flex flex-column gap-2 flex-col">
                    <label htmlFor="customer">Member Id:</label>
                    <Dropdown valueTemplate={selectedItemTemplate}  itemTemplate={itemTemplate} options={users} value={paymentData.user} disabled={type ===  TYPE.EDIT} onChange={(e) => onChange(e, 'user')} optionLabel="name"
                        placeholder="Select a Member Id" className="w-full md:w-14rem"/>
                </div>

                <div className="flex flex-column gap-2 flex-col">
                    <label htmlFor="customer">Care of:</label>
                    <Dropdown  valueTemplate={selectedItemTemplate}  itemTemplate={itemTemplate} options={users} value={paymentData.careOf} disabled={type ===  TYPE.EDIT} onChange={(e) => onChange(e, 'careOf')} optionLabel="name"
                        placeholder="Select Care of" className="w-full md:w-14rem"/>
                </div>

                <div className="flex flex-column gap-2 flex-col">
                    <label htmlFor="amount">Amount:</label>
                    <InputText id="amount" value={paymentData.amount.toString()} onChange={(e) => onChange(e, 'amount')} aria-describedby="amount-help" type='number' />
                </div>

                <div className="flex flex-column gap-2 flex-col">
                    <label htmlFor="amount">Date:</label>
                    <Calendar dateFormat="dd-mm-yy" value={type ===  TYPE.ADD ? paymentData.date : new Date(paymentData.date)} showIcon onChange={(e) => onChange(e, 'date')} />
                </div>

                <div className="flex flex-column gap-2 flex-col">
                    <label htmlFor="customer">Mode of Payment:</label>
                    <Dropdown value={paymentData.mode} options={modeOfPayment} optionLabel="name" onChange={(e) => onChange(e, 'mode')}
                        placeholder="Select a Mode of payment" className="w-full md:w-14rem" />
                </div>

                <div className="mt-10" style={{ width: 50 }}>
                    <Button disabled={!users.length || loader} onClick={saveData}>Save</Button>
                </div>
            </form>
            <Toast ref={toast} />
        </Card>
    )
}

export default AddPayment;