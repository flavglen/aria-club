import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect } from 'react';
import { db, collection, getDocs } from '../../firebase';
import { ISelect } from '../add-payment/AddPayment';

enum PaymentMode {
    CASH = 1,
    CARD = 2,
    CHEQUE = 3,
}

type Payment = {
    user: ISelect;
    date: string;
    amount: number
    mode: ISelect
}

const ViewPayment: React.FC = () => {
    const [payment, setPayment] = React.useState<Payment[]>([]);
    const getPayment = async () => {
        const customDocRef = collection(db, 'payment');
        const paymentRef = await getDocs(customDocRef);
        const payment = paymentRef.docs.map(x => {
            return {...x.data()}
        }) as Payment[]
        setPayment(payment);
    }

    useEffect(() => {
        getPayment();
    }, [])

    const modeOfPaymentBody = (rowData: Payment) => {
        return (
            <>
                {rowData.mode.name}
            </>
        )
    };

    const onEdit = () => {
        
    }

    const statusBodyTemplate = () => {
        return (
            <>
                <Button onClick={onEdit}>Edit</Button>
            </>
        )
    };

    return (
        <DataTable value={payment} tableStyle={{ minWidth: '50rem' }}>
            <Column field="user.name" header="Name"></Column>
            <Column field="amount" header="Amount" body={(row) => `₹ ${row.amount}`}></Column>
            <Column field="date" header="Date"></Column>
            <Column field="amount" header="Mode of Payment" body={modeOfPaymentBody}></Column>
            <Column header="Action" body={statusBodyTemplate}></Column>
        </DataTable>
    )
}

export default ViewPayment;