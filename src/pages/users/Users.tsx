import React, { useEffect } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { collection, db, getDocs } from '../../firebase';
import { LoaderHook } from '../../context/loaderProvider';

type IUser = {
    name: string;
    email: string;
    phone: string;
}

const Users: React.FC = () => {
    const [users, setUsers] = React.useState<IUser[]>([]);
    const {hideSpinner, showSpinner} = LoaderHook();

    const getPayment = async () => {
        showSpinner();
        const customDocRef = collection(db, 'users');
        const paymentRef = await getDocs(customDocRef);
        const payment = paymentRef.docs.map(x => {
            return {...x.data()}
        }) as IUser[]
        setUsers(payment);
        hideSpinner();
    }

    useEffect(() => {
        getPayment();
    }, [])

    return (
        <DataTable  value={users} tableStyle={{ minWidth: '50rem' }}>
            <Column field="name" header="Name"></Column>
            <Column field="memberId" header="Member Id"></Column>
            <Column field="phone" header="Phone"></Column>
            <Column field="email" header="Email"></Column>
            <Column field="place" header="Place"></Column>
        </DataTable>
    )
}

export default Users;