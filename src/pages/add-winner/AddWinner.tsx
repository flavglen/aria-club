import React, {useEffect} from 'react';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { ISelect } from '../add-payment/AddPayment';
import { collection, db, doc, getDocs, setDoc, imageDB, ref, uploadBytes, serverTimestamp } from '../../firebase';
import { UploadResult  } from "firebase/storage";
import { ToastHook } from '../../context/toastProvider';
import { useNavigate } from "react-router-dom";

export type IWinner = {
    user: {code: string, name: string, userId: string},
    date: string,
    type: { code: number, name: string}
    photo?: object
    active: boolean,
    timestamp?: any , // eslint-disable-line
    imgSrc?: string;
    id?: string;
} 

const AddWinner: React.FC = () => {
    const [winner, setWinner] = React.useState<IWinner>({
        user: {code: '', name: '', userId: ''},
        date: '',
        type: { code: 0, name: ''},
        active: true,
        timestamp: serverTimestamp()
    });
    const [users, setUsers] = React.useState<ISelect[]>([]);
    const [selectedImage, setSelectedImage] = React.useState(null);
    const [imagePreview, setImagePreview] = React.useState(null);
    const fileUploadRef = React.useRef(null);
    const {fireToast} = ToastHook();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);

    const onChange = (e, field: string) => {
        const value =  e.target.value;
        setWinner(prev => ({
            ...prev,
            [field]:value
        }));
    }

    const getUsers = async () => {
        const customDocRef = collection(db, 'users');
        const usersRef = await getDocs(customDocRef);
        const users = usersRef.docs.map(x => {
            const data = x.data();
            return { name: data.name, code: data.name, userId: x.id }
        }) as ISelect[]
        setUsers(users);
    }

    const customBase64Uploader = async (event) => {
        console.log('cxccxx', event)
        // convert file to base64 encoded
        const file = event.files[0];

         // Preview the selected image
        const reader = new FileReader();
        reader.onload = () => {
         setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        setSelectedImage(file);
        // 'file' comes from the Blob or File API
       /* const storageRef = ref(imageDB, file.name);
        uploadBytes(storageRef, file).then((snapshot) => {
            console.log('Uploaded a blob or file!', snapshot);
        });*/
    };

    const saveImage = async (file) => {
        const storageRef = ref(imageDB, file.name);
        try {
            return await uploadBytes(storageRef, file) as UploadResult;
        }
        catch(e) {
            return null;
        }
    }

    
    useEffect(() => {
        getUsers();
    }, [])

    const clearFileUpload = () => {
        if (fileUploadRef.current) {
          fileUploadRef.current?.clear();
          setImagePreview(null);
        }
    };


    const saveData = async () => {
        const winnerDataCopy = {...winner};
        if(winnerDataCopy.date) {
            winnerDataCopy.date = winnerDataCopy.date.toLocaleString()
        }
        setLoading(true);
        const imageMeta = await saveImage(selectedImage);

        if(!imageMeta) {
           alert('Failed to save data');
           return;
        }

        const winnerDocRef = doc(db, 'winners', new Date().getTime().toString());
        try {
         await setDoc(winnerDocRef, {...winnerDataCopy, photo: imageMeta.ref.name} );
            fireToast({severity:'success', summary: 'Success', detail:'Data has been saved', life: 3000});
            setLoading(false)
            navigate("/");
        } catch(e) {
            fireToast({severity:'error', summary: 'Failed', detail:'Failed to Save Data', life: 3000})
            setLoading(false);
        }
    }

    return (
        <Card>
             <div className="flex flex-column gap-2 flex-col">
                <label htmlFor="customer">Winner Type:</label>
                <Dropdown options={[{name: '1st', code: 1}, {name:'2nd', code: 2}]} value={winner.type}  onChange={(e) => onChange(e, 'type')} optionLabel="name"
                    placeholder="Select winner Type" className="w-full md:w-14rem"/>
            </div>
            <div className="flex flex-column gap-2 flex-col">
                <label htmlFor="customer">Date:</label>
               <Calendar dateFormat="dd-mm-yy" showIcon onChange={(e) => onChange(e, 'date')} />
            </div>

            <div className="flex flex-column gap-2 flex-col">
                <label htmlFor="customer">Winner:</label>
                <Dropdown options={users} value={winner.user}  onChange={(e) => onChange(e, 'user')} optionLabel="name"
                    placeholder="Select a winner" className="w-full md:w-14rem"/>
            </div>

            <div className="flex flex-column gap-2 flex-col">
                <label htmlFor="customer">Winner Photo:</label>
                <FileUpload ref={fileUploadRef} previewWidth={50} mode="basic" name="demo[]" accept="image/*" maxFileSize={1000000}  onSelect={customBase64Uploader} customUpload  />
            </div>

            <div className="flex flex-column gap-2 flex-col">
                {imagePreview && (
                       <div className="flex  gap-2 flex-row pt-5">
                            <img
                            src={imagePreview}
                            alt="Selected Image Preview"
                            style={{ maxWidth: '100px' }}
                            />
                            <i className="pi pi-times" style={{ fontSize: '1rem' }} onClick={clearFileUpload}></i>
                        </div>
                )}
              
            </div>

            <div className="flex flex-column gap-2 flex-col w-20 mt-10">
                <Button onClick={saveData} disabled={loading}> Save </Button>
            </div>
        </Card>
    )
}

export default AddWinner;