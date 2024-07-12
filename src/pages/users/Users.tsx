import React, { useEffect } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { collection, db, getDocs, orderBy, query } from '../../firebase';
import { LoaderHook } from '../../context/loaderProvider';
import { FilterMatchMode, FilterOperator } from 'primereact/api';

type IUser = {
    name: string;
    email: string;
    phone: string;
}

const Users: React.FC = () => {
    const [users, setUsers] = React.useState<IUser[]>([]);
    const {hideSpinner, showSpinner} = LoaderHook();

    const [filters, setFilters] = React.useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'careOf.username': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        memberId: { value: null, matchMode: FilterMatchMode.IN },
        phone: { value: null, matchMode: FilterMatchMode.EQUALS },
        email: { value: null, matchMode: FilterMatchMode.EQUALS },
        place: { value: null, matchMode: FilterMatchMode.EQUALS }
    });

    const getUsers = async () => {
        showSpinner();
        const customDocRef = collection(db, 'users');
        const q = query(customDocRef, orderBy('memberId'));
        const usersRef = await getDocs(q);
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
        <DataTable  filters={filters} value={users} paginator rows={25} rowsPerPageOptions={[25, 50, 75, 100]} tableStyle={{ minWidth: '50rem' }}>
            <Column filter field="name" header="Name"></Column>
            <Column filter field="careOf.username" header="Care of" body={(row) => row.careOf && <span> {row.careOf.code} ({row.careOf.username})</span> }></Column>
            <Column filter field="memberId" header="Member Id"></Column>
            <Column filter field="phone" header="Phone"></Column>
            <Column filter field="email" header="Email"></Column>
            <Column filter field="place" header="Place"></Column>
        </DataTable>
    )
}

export default Users;