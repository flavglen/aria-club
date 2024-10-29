import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';
import { db, collection, getDocs, query } from '../../firebase';
import AddPayment, { ISelect, TYPE } from '../add-payment/AddPayment';
import { Dialog } from 'primereact/dialog';
import { LoaderHook } from '../../context/loaderProvider';
import { deleteDoc, doc, orderBy, where } from 'firebase/firestore/lite';
import IsAdmin from '../../hooks/Admin.hook';
import { format } from 'date-fns';
import { Message } from 'primereact/message';
import { FilterMatchMode } from 'primereact/api';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ToastHook } from '../../context/toastProvider';

type Payment = {
    user: ISelect;
    careOf: ISelect
    date:  Date;
    amount: number
    mode: ISelect,
    userId: string
    id?: string,
    uid?: string
}

const ViewPayment: React.FC = () => {
    const { fireToast } = ToastHook();
    const [payment, setPayment] = React.useState<Payment[]>([]);
    const [confirmVisible, setConfirmVisible] = React.useState<boolean>(false);
    const [selectedRow, setSelectedRow] = React.useState<Payment>();
    const [modalVisible, setModalVisible] = React.useState<boolean>(false);
    const {hideSpinner, showSpinner} = LoaderHook();
    const [isAdmin,user] = IsAdmin();
    const [totalAmount, setTotalAmount] = React.useState(0)
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        'user.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'user.username': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'date': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'amount': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });

    let totalAmountC = 0;

    const getPayment = async () => {
        showSpinner();
        const paymentRef = collection(db, 'payment');
        const q = query(
            paymentRef,
            orderBy('date')
        )

        const data =  await getDocs(q);
        const paymentData = data.docs.map(x => {
            return { ...x.data(), id:  x.id }
        }) as Payment[]
        

        let payment:Payment[] = paymentData.map((payment) => {
            totalAmountC += +payment.amount;

                return {
                    ...payment,
                    date:  payment.date ? new Date(payment.date) : new Date() // to fix
                }
        })

        setTotalAmount(totalAmountC)

        payment =  payment.sort((a: Payment,b: Payment) => b.date.getTime() - a.date.getTime())

       setPayment(payment);
       hideSpinner();
    }

    const getUserPayment = async (userId) => {
        if(!userId) return;
        showSpinner();
        const collectionRef = collection(db, 'payment');
        const q = query(
            collectionRef,
            where('userId', '==', userId),
            orderBy('date')
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

    const onDelete = async (id) => {
        await deleteDoc(doc(db, "payment", id));
        fireToast({severity:'success', summary: 'Success', detail:'Payment has been Deleted', life: 3000});
        getPayment()
    }

    const accept = (id) => {
        onDelete(id)
    }
     
    const reject = () => {
        setConfirmVisible(false)
    }

    const deleteConfirm = (id: string | number) => {
        setConfirmVisible(true)
        confirmDialog({
            message: 'Are you sure you want to delete?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: accept.bind(null, id),
            reject
        });
    };

    const onSaveMemo = React.useCallback(() => {
        setModalVisible(false);
        getPayment();
    }, [payment]);

    const statusBodyTemplate = (rowData) => {
        return (
            <>
                <Button onClick={() => onEdit(rowData)}>Edit</Button>
                <Button onClick={() => deleteConfirm(rowData.id)}>Delete</Button>
            </>
        )
    };

    return (
        <>  
            { 
            isAdmin && 
              <>
                <div> 
                    <Message text= {"TOTAL RECORDS TILL DATE: " + payment.length }  />
                </div>
                <div className='mt-3 mb-3'>
                    <Message text= {"TOTAL AMOUNT RECEIVED TIL DATE: " + totalAmount }  />
                </div>
             </>
             }

            <DataTable dataKey="id"  globalFilterFields={['user.name', 'user.username', 'date', 'amount']} filters={filters} filterDisplay="row"  paginator  rows={25} rowsPerPageOptions={[25, 50, 75, 100]} value={payment} tableStyle={{ minWidth: '50rem' }}>
                <Column filter  field="user.name" header="Member Id"></Column>
                <Column filter field="user.username" header="Member Name"></Column>
                <Column field="careOf.username" header="Care of" body={(row) =>  row?.careOf?.code ? <span> {row.careOf.code} ({row.careOf.username})</span>: <></> }></Column>
                <Column filter filterField="amount" field="amount" header="Amount" body={(row) => `₹ ${row.amount}`}></Column>
                <Column  field="date"  header="Date" body={(row) => <span>{format(row?.date, 'dd-MMM-yyyy')} </span>}></Column>
                <Column  field="amount" header="Mode of Payment" body={modeOfPaymentBody}></Column>
                {isAdmin && (
                <Column header="Action" body={statusBodyTemplate}></Column> 
                )}

            </DataTable>
            <Dialog visible={modalVisible} style={{ width: '50vw' }} onHide={() => setModalVisible(false)}>
                <AddPayment type={TYPE.EDIT} paymentDataForEdit={selectedRow} onSave={onSaveMemo} />
            </Dialog>

            <ConfirmDialog visible={confirmVisible} />
        </>
    )
}

export default React.memo(ViewPayment);