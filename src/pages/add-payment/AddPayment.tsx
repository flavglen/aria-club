import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Card } from 'primereact/card';
import React, { useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { collection, db, doc, getDoc, getDocs, setDoc } from '../../firebase';
import AuthCheck from '../../hooks/Auth.hook';


export type ISelect = {
    code: string;
    name: string
}

type PaymentData = {
    user: ISelect;
    amount: number;
    mode: ISelect;
    date: string;
    userId: string | undefined;
}

type IAddPayment = {
    type: string
}

const AddPayment: React.FC<IAddPayment> = ({type = 'add'}) => {
    const [user] = AuthCheck();
    const [users, setUsers] = React.useState<ISelect[]>([]);
    const [paymentData, setPaymentData] = React.useState<PaymentData>({
        user: { name: '', code: ''},
        amount: 0,
        mode: { name: '', code: ''},
        date: '',
        userId: user?.uid
    });

    const modeOfPayment = [
        { name: 'Cash', code: 'cash' },
        { name: 'Cheque', code: 'cheque' },
        { name: 'Card', code: 'card' }
    ]

    const getUsers = async () => {
        const customDocRef = collection(db, 'users');
        const usersRef = await getDocs(customDocRef);
        const users = usersRef.docs.map(x => {
            const data = x.data();
            return { name: data.name, code: data.name }
        }) as ISelect[]
        console.log('USER', users);
        setUsers(users);
    }

    const saveData = (e) => {
        e.preventDefault();
        const paymentPayload= {...paymentData};
        if(paymentPayload.date) {
            paymentPayload.date = paymentPayload.date.toLocaleString()
        }
       const customDocRef = doc(db, 'payment', new Date().getTime().toString());
       setDoc(customDocRef, paymentPayload)
       .then(() => {
            console.log('saved');
       })
       .catch((error) => {
            console.error('Error adding document:', error);
       });
    }

    const onChange = (e, key: string) => {
        const value =  e.target.value;
        setPaymentData(prev => ({
            ...prev,
            [key]:value
        }))
    }

    useEffect(() => {
        getUsers();
    }, [])

    return (
        <Card title="Add Payment">
            <form>
                <div className="flex flex-column gap-2 flex-col">
                    <label htmlFor="customer">Customer:</label>
                    <Dropdown options={users} value={paymentData.user} onChange={(e) => onChange(e, 'user')} optionLabel="name"
                        placeholder="Select a Customer" className="w-full md:w-14rem" />
                </div>

                <div className="flex flex-column gap-2 flex-col">
                    <label htmlFor="amount">Amount:</label>
                    <InputText id="amount" value={paymentData.amount.toString()} onChange={(e) => onChange(e, 'amount')} aria-describedby="amount-help" type='number' />
                </div>

                <div className="flex flex-column gap-2 flex-col">
                    <label htmlFor="amount">Date:</label>
                    <Calendar dateFormat="dd-mm-yy" value={paymentData.date} showIcon onChange={(e) => onChange(e, 'date')} />
                </div>

                <div className="flex flex-column gap-2 flex-col">
                    <label htmlFor="customer">Mode of Payment:</label>
                    <Dropdown value={paymentData.mode} options={modeOfPayment} optionLabel="name" onChange={(e) => onChange(e, 'mode')}
                        placeholder="Select a Mode of payment" className="w-full md:w-14rem" />
                </div>

                <div className="mt-10" style={{ width: 50 }}>
                    <Button onClick={saveData}>Save</Button>
                </div>
            </form>
        </Card>
    )
}

export default AddPayment;