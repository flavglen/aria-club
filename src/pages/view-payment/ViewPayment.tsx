import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect } from 'react';
import { db, collection, getDocs } from '../../firebase';
import AddPayment, { ISelect, TYPE } from '../add-payment/AddPayment';
import { Dialog } from 'primereact/dialog';

type Payment = {
    user: ISelect;
    date: string;
    amount: number
    mode: ISelect,
    userId: string
    id?: string,
}

const ViewPayment: React.FC = () => {
    const [payment, setPayment] = React.useState<Payment[]>([]);
    const [selectedRow, setSelectedRow] = React.useState<Payment>();
    const [modalVisible, setModalVisible] = React.useState<boolean>(false);

    const getPayment = async () => {
        const customDocRef = collection(db, 'payment');
        const paymentRef = await getDocs(customDocRef);
        const payment = paymentRef.docs.map(x => {
            return { ...x.data(), id: x.id }
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

    const onEdit = (rowData) => {
        setModalVisible(true);
        setSelectedRow(rowData)
    }

    const onSave = () => {
        setModalVisible(false);
        getPayment();
    }

    const statusBodyTemplate = (rowData) => {
        return (
            <>
                <Button onClick={() => onEdit(rowData)}>Edit</Button>
            </>
        )
    };

    return (
        <>
            <DataTable paginator rows={5} rowsPerPageOptions={[5, 10, 15, 20]} value={payment} tableStyle={{ minWidth: '50rem' }}>
                <Column field="user.name" header="Member Id"></Column>\
                <Column field="user.username" header="Member Name"></Column>
                <Column field="amount" header="Amount" body={(row) => `₹ ${row.amount}`}></Column>
                <Column field="date" header="Date"></Column>
                <Column field="amount" header="Mode of Payment" body={modeOfPaymentBody}></Column>
                <Column header="Action" body={statusBodyTemplate}></Column>
            </DataTable>
            <Dialog visible={modalVisible} style={{ width: '50vw' }} onHide={() => setModalVisible(false)}>
                <AddPayment type={TYPE.EDIT} paymentDataForEdit={selectedRow} onSave={onSave} />
            </Dialog>
        </>
    )
}

export default ViewPayment;