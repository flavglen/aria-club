import React, { useState, useRef, useEffect } from 'react';
import { collection, db, doc  } from '../../firebase';
import { getDocs, query, where, writeBatch } from 'firebase/firestore/lite';
import * as xlsx from "xlsx";
import { Button } from 'primereact/button';
import { DeletePayment } from '../delete-payment/delete-payment';

interface IBPayment {
    date: string
    amt: number | string
    memId:string
    mop:string
}

export const AddBulkPayment = () => {
    const [jsonData, setJsonData] = useState<IBPayment[]>([]);
    const ref = useRef(null)

    // Function to convert Excel date to JavaScript date
    function excelDateToJSDate(excelDate) {
        // Excel's epoch date is 1 Jan 1900
        const epoch = new Date(1899, 11, 30); // Excel incorrectly considers 1900 as a leap year, hence the offset
        return new Date(epoch.getTime() + excelDate * 86400000);
    }

    const saveBulkPayment = async (e) => {
        e.preventDefault()

        const userIds = jsonData.map(payment => payment.memId.toString());
        const BATCH_SIZE = 30;
        const allUsers: any[] = [];

        for (let i = 0; i < userIds.length; i += BATCH_SIZE) {
            const batchUserIds = userIds.slice(i, i + BATCH_SIZE);
            const userQuery = query(collection(db, 'users'), where('memberId', 'in', batchUserIds));
            const userDocSnapshot = await getDocs(userQuery);

            userDocSnapshot.forEach(async (userDoc) => { 
                const userData =  { ... userDoc.data(), uid: userDoc.id} ;
                allUsers.push(userData)
            });
        }

        // bulk payment insert
        const batch = writeBatch(db);
        let operationCounter = 0;
        const invalidUserIds:{userId:string, name: string, data: unknown}[] = [];

        console.log('allUsers', allUsers)

        allUsers.forEach(async (user) => {
            const paymentData = jsonData.find( d => d.memId.toString() === user.memberId )

            if(paymentData &&  user.uid) {
                    const paymentDataObj = {
                        amount: paymentData.amt,
                        bulkInsert: true,
                        bulkInsertDate: new Date().toISOString(),
                        careOf: null,
                        date: paymentData.date,
                        mode: { code:  paymentData.mop.toLowerCase(),  name:  paymentData.mop },
                        user: {
                            code: user.memberId,
                            name:  user.memberId,
                            userId:  user.uid,
                            username:  user.name
                        },
                        userId: user.uid
                }

                const paymentDocRef = doc(collection(db, 'payment'));
                batch.set(paymentDocRef, paymentDataObj);
                operationCounter++;
             }else {
                invalidUserIds.push({ userId: user.memberId,  name: user.name, data: user})
             }

        });

        console.log('INVALID_DATA', invalidUserIds);

        // Commit the batch if the limit is reached
        if (operationCounter <= 999) {
            await batch.commit();
            console.log('Batch committed.');
            //batch = writeBatch(db);
            operationCounter = 0;
        } else {
             alert('cannot insert more than 999 rows')
        }
    }


    const handleFileUpload = (event) => {
        const file = event.target.files[0];
    
        if (file) {
          const reader = new FileReader();
    
          reader.onload = (e) => {
            if(e?.target?.result) {
                const data = new Uint8Array(e.target.result as ArrayBuffer);
                const workbook = xlsx.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = xlsx.utils.sheet_to_json(worksheet, { raw: true }) as IBPayment[];

                if(!json.length) {
                    alert('You cannot import empty excel file');
                    ref.current.value = null;
                    return;
                }

                const keys = Object.keys(json[0])
                const requiredKeys = ['date', 'amount', 'id', 'name'];

                const allKeysPresent = requiredKeys.every(key => key in keys);



                if(!allKeysPresent) {
                    alert('Invalid Excel file, make sure you have column names (date	amt	memId, mop)');
                    return;
                }

                if(json.length > 999) {
                    alert('You can import Maximum of 999 records');
                    return;
                }
                
                // convert the  date
                json.forEach((r) => {
                    r.date = excelDateToJSDate(r.date).toISOString()
                });


                setJsonData(json);
            }
          };
    
          reader.readAsArrayBuffer(file);
        }
      };

    return (
        <div>
            <input type="file" accept=".xlsx" ref={ref} onChange={handleFileUpload} />


            <div className="mt-10" style={{ width: 50 }}>
                <Button  onClick={saveBulkPayment}>Save</Button>
            </div>

            {/* <DeletePayment /> */}

        </div>
    )
}