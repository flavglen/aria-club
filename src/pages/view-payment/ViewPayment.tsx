import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect } from 'react';
import { db, collection, getDocs, query } from '../../firebase';
import AddPayment, { ISelect, TYPE } from '../add-payment/AddPayment';
import { Dialog } from 'primereact/dialog';
import { LoaderHook } from '../../context/loaderProvider';
import { where } from 'firebase/firestore/lite';
import IsAdmin from '../../hooks/Admin.hook';

type Payment = {
    user: ISelect;
    careOf: ISelect
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
    const {hideSpinner, showSpinner} = LoaderHook();
    const [isAdmin,user] = IsAdmin();

    const getPayment = async () => {
        showSpinner();
        const customDocRef = collection(db, 'payment');
        const paymentRef = await getDocs(customDocRef);
        const payment = paymentRef.docs.map(x => {
            return { ...x.data(), id: x.id }
        }) as Payment[]
       setPayment(payment);
       hideSpinner();
    }

    const getUserPayment = async (userId) => {
        if(!userId) return;
        showSpinner();
        const collectionRef = collection(db, 'payment');
        const q = query(
            collectionRef,
            where('userId', '==', userId)
        );

      try{
        const data =  await getDocs(q);
        const result = data.docs.map(x => x.data()) as Payment[]
        setPayment(result) ;
        hideSpinner();
      } catch(e) {
        return null;
      }
    }

    useEffect(() => {
        if(isAdmin)
        getPayment();
        else 
        getUserPayment(user?.currentUser?.uid)
    }, [isAdmin, user?.currentUser?.uid])

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

    const onSaveMemo = React.useCallback(() => {
        setModalVisible(false);
        getPayment();
    }, [payment]);

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
                <Column field="user.name" header="Member Id"></Column>
                <Column field="user.username" header="Member Name"></Column>
                <Column field="careOf.username" header="Care of" body={(row) => <span> {row.careOf.code} ({row.careOf.username})</span> }></Column>
                <Column field="amount" header="Amount" body={(row) => `₹ ${row.amount}`}></Column>
                <Column field="date" header="Date"></Column>
                <Column field="amount" header="Mode of Payment" body={modeOfPaymentBody}></Column>
                {isAdmin && (
                <Column header="Action" body={statusBodyTemplate}></Column> 
                )}

            </DataTable>
            <Dialog visible={modalVisible} style={{ width: '50vw' }} onHide={() => setModalVisible(false)}>
                <AddPayment type={TYPE.EDIT} paymentDataForEdit={selectedRow} onSave={onSaveMemo} />
            </Dialog>
        </>
    )
}

export default React.memo(ViewPayment);