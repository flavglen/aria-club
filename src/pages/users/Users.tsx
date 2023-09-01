import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React from 'react';

const USERS = [
    {
        name: 'Melwin',
        username: 'user1',
        mobile: '2222242424',
        status: 1,
    },
    {
        name: 'Raj',
        username: 'user2',
        mobile: '1234567895',
        status: 1,
    },
    {
        name: 'Manoj',
        username: 'user3',
        mobile: '222242424',
        status: 1,
    }
]

const Users: React.FC = () => {

    const statusBodyTemplate = () => {
        return (
            <>
                <Button>Delete</Button>
                <Button>Edit</Button>
            </>
        )
    };

    return (
        <DataTable  value={USERS} tableStyle={{ minWidth: '50rem' }}>
            <Column field="name" header="Name"></Column>
            <Column field="username" header="UserName"></Column>
            <Column field="mobile" header="Phone"></Column>
            <Column field="status" header="Status"></Column>
            <Column header="Action" body={statusBodyTemplate}></Column>
        </DataTable>
    )
}

export default Users;