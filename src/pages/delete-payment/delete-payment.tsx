import { collection, getDocs, query, where, writeBatch } from "firebase/firestore/lite";
import { Button } from "primereact/button";
import { db } from "../../firebase";
import React from "react"

export const DeletePayment = () => {
    const deleteRecords = (e) => {
        e.preventDefault()
        const collectionRef = collection(db, 'payment');
        deleteRecordsByCondition(collectionRef, 'bulkInsert', '==', true);
    }

   async function deleteRecordsByCondition(collectionRef, field, condition, value) {
    try {
        const q = query(collectionRef, where(field, condition, value));
        const querySnapshot = await getDocs(q);
        const batch = writeBatch(db);

        querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        console.log("Documents successfully deleted!");
    } catch (error) {
        console.error("Error deleting documents: ", error);
    }
}


    return (
        <Button onClick={deleteRecords}> Delete</Button>
    )
}