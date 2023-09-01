import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React from 'react';

enum PaymentMode  {
    CASH = 1,
    CARD = 2
}

type Payment = {
    name: string;
    date: string;
    amount: number
    paymentMode: PaymentMode
}

const PAYMENT: Payment[]  = [
    {
        name: 'Melwin',
        date: '10/08/2023',
        amount: 1000,
        paymentMode: PaymentMode.CARD
    },
    {
        name: 'Ganesh',
        date: '10/08/2023',
        amount: 5000,
        paymentMode: PaymentMode.CASH
    },
    {
        name: 'manoj',
        date: '10/08/2023',
        amount: 2000,
        paymentMode: PaymentMode.CARD
    }
]

const ViewPayment: React.FC = () => {

    const modeOfPaymentBody = (rowData: Payment) => {
        return (
            <>
              {rowData.paymentMode === PaymentMode.CARD ? 'CARD' : 'CASH'}
            </>
        )
    };

    return (
        <DataTable value={PAYMENT} tableStyle={{ minWidth: '50rem' }}>
            <Column field="name" header="Name"></Column>
            <Column field="date" header="Date"></Column>
            <Column field="amount" header="Amount"></Column>
            <Column field="PaymentMode" header="Mode of Payment" body={modeOfPaymentBody}></Column>
        </DataTable>
    )
}

export default ViewPayment;