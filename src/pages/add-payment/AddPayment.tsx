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

const AddPayment: React.FC = () => {

   
    return (
        <>COMING SOON</>
    )
}

export default AddPayment;