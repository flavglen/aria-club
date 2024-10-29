import React, { useState, useRef } from 'react';
import { collection, db, doc  } from '../../firebase';
import { deleteDoc, writeBatch } from 'firebase/firestore/lite';
import * as xlsx from "xlsx";

export const BulkAddUsers = () => {
    const [jsonData, setJsonData] = useState<unknown[] | null>(null);

    const deleteDocumentById = async (collectionName?: string, docId?: string) => {
      
      if(!collectionName || !docId) {
        alert('fAILED');
        return;
      }

      try {
        const docRef = doc(db, collectionName, docId);
        await deleteDoc(docRef);
        console.log(`Document with ID ${docId} deleted successfully.`);
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    };

    const setUser = async (usersToInsert: any[] = []) => {
      if(!usersToInsert.length) return;
      const batch = writeBatch(db);
      const collectionRef = collection(db, 'users');
      console.log('usersToInsert', usersToInsert);
      usersToInsert.forEach((docData) => {
        const newDocRef = doc(collectionRef, docData.uid);
        const memberId =  docData.email.split('@')[0];

        const newDocData = {
          ...docData,
          memberId,
          careOf: null,
          place: "",
          dateCreated: new Date().toISOString()
        }

        console.log('newDocData', newDocData);
        batch.set(newDocRef, newDocData);
      });

      try {
        await batch.commit();
        console.log('Documents successfully written!');
      } catch (error) {
        console.error('Error writing documents: ', error);
      }
  }

  const setUserRole = async (usersToInsert: any[] = []) => {
    if(!usersToInsert.length) return;

    const batch = writeBatch(db);
    const collectionRef = collection(db, 'roles');
 
    usersToInsert.forEach((docData) => {
      console.log('HERE', docData)
      const newDocRef = doc(collectionRef, docData.uid);
      batch.set(newDocRef, {role: 'user'});
    })

    try {
      await batch.commit();
      console.log('Documents successfully written!');
    } catch (error) {
      console.error('Error writing documents: ', error);
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
                const json = xlsx.utils.sheet_to_json(worksheet);
                setJsonData(json);
            }
          };
    
          reader.readAsArrayBuffer(file);
        }
      };

    const addUsers = async () => {
        const apiUrl = 'http://127.0.0.1:5001/ariaclubindia/europe-west1/user/bulkUsers';
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${sessionStorage.getItem('AUTH_TOKEN')}`)

        // Configure the request options
        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(jsonData), // Convert data to JSON string
        };

        try {
            const stream =  await fetch(apiUrl, requestOptions);
            const resultData = await stream?.json();
            if(resultData.success && resultData.response) {
              await setUser(resultData.response.successfulImports)
              await setUserRole(resultData.response.successfulImports)
              console.log('RESULT', resultData)
            }
        } catch (e) {
            return e;
        }
    }

    const collectionRef = useRef<HTMLInputElement>(null)
    const documentIdRef = useRef<HTMLInputElement>(null)
    

    return (
        <div>
          <input type="file" accept=".xlsx" onChange={handleFileUpload} />
          {jsonData && (
            <pre>{JSON.stringify(jsonData, null, 2)}</pre>
          )}

          <button className='primary' onClick={addUsers}> Upload</button>

          <div className='flex'>
              <input ref={collectionRef} placeholder='collection'/>
              <input ref={documentIdRef} placeholder='doc id'/>

              <button onClick={() => deleteDocumentById(collectionRef?.current?.value, documentIdRef?.current?.value) }>Delete</button>
          </div>
        </div>
      );
}