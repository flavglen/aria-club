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

    const getUsers = async () => {
        showSpinner();
        const customDocRef = collection(db, 'users');
        const usersRef = await getDocs(customDocRef);
        const users = usersRef.docs.map(x => {
            return {...x.data()}
        }) as any[];
        console.log(users);
        setUsers(users);
        hideSpinner();
    }

    useEffect(() => {
        getUsers();
    }, [])

    return (
        <DataTable  value={users} tableStyle={{ minWidth: '50rem' }}>
            <Column field="name" header="Name"></Column>
            <Column field="careOf.username" header="Care of" body={(row) => row.careOf && <span> {row.careOf.code} ({row.careOf.username})</span> }></Column>
            <Column field="memberId" header="Member Id"></Column>
            <Column field="phone" header="Phone"></Column>
            <Column field="email" header="Email"></Column>
            <Column field="place" header="Place"></Column>
        </DataTable>
    )
}

export default Users;