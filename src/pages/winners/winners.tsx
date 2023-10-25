import React, {useEffect,useRef} from 'react';
import { collection, db, getDocs, limit, orderBy, query, ref, imageDB, updateDoc, doc } from '../../firebase';
import { getDownloadURL } from '@firebase/storage';
import { IWinner } from '../add-winner/AddWinner';
import { SelectButton } from 'primereact/selectbutton';
import IsAdmin from '../../hooks/Admin.hook';
import { LoaderHook } from '../../context/loaderProvider';

type winnerStatus = {
  first: string;
  second: string;
}

const Winners: React.FC = () => {
    const [winnerOne, setWinnerOne] = React.useState<IWinner | undefined>();
    const [winnerTwo, setWinnerTwo] = React.useState<IWinner | undefined>();
    const [isAdmin] = IsAdmin();
    const {loader, hideSpinner, showSpinner} = LoaderHook();

    useEffect(() => {
      fetchWinners();
    }, [isAdmin]);

    const getImage = async (imageName) => {
      const storageRef = ref(imageDB, imageName)
      return await getDownloadURL(storageRef);
    }

    const updateWinnerStatusOne = (e, id) => {
      const value = e.target.value;
      const winnerOneCopy = {...winnerOne as IWinner};
      setWinnerOne({...winnerOneCopy, active: value === 'On'? true : false});
      if(winnerOne?.id)
        updateActiveWinnerStatus(winnerOne?.id, {active: value === 'On'? true : false});
    }

    const updateWinnerStatusTwo = (e, id) => {
      const value = e.target.value;
      const winnerTwoCopy = {...winnerTwo as IWinner};
      setWinnerTwo({...winnerTwoCopy, active: value === 'On'? true : false});
      if(winnerTwo?.id)
        updateActiveWinnerStatus(winnerTwo?.id, {active: value === 'On'? true : false});
    }

    const fetchWinners = async () => {
      const winnerData:IWinner[] = []; 
      showSpinner();
      const collectionRef = collection(db, 'winners');
      const q = query(collectionRef, orderBy('timestamp', 'desc'), limit(2));

      const querySnapshot = await getDocs(q);
      const promises = querySnapshot.docs.map(async (doc) => {
        const latestRecord = {...doc.data(), id: doc.id} as IWinner;
        // fetch image from fireStore
        latestRecord.imgSrc = await getImage(latestRecord.photo);
        winnerData.push(latestRecord);
      });

      await Promise.all(promises);
      const winnerDataCopy = isAdmin ? winnerData : winnerData.filter((d) => d.active );
      const firstPrize =  winnerDataCopy?.find((winner:IWinner) => winner.type.code === 1);
      const secondPrize =  winnerDataCopy?.find((winner:IWinner) => winner.type.code === 2);
      hideSpinner();
      setWinnerOne(firstPrize);
      setWinnerTwo(secondPrize);
    }


    const updateActiveWinnerStatus = (docId: string, updatedData) => {
      const documentRef = doc(db, 'winners', docId);
      updateDoc(documentRef, updatedData)
      .then(() => {
        console.log('Document updated successfully');
      })
      .catch((error) => {
        console.error('Error updating document:', error);
      });
    }

    if(!loader && !winnerOne || !winnerTwo) {
      return (
        <span> Winners are yet to be announced...</span>
      )
    }

    const getDate =  winnerOne?.date ? new Date(winnerOne.date).toDateString() : '';

    return (
      <>
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
            <h2 className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white">Winners ({getDate}) </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-8 md:gap-12">
            <div className="text-center">
                <h3>1st prize</h3>
                <div className="pt-5" style={{width: 150, height: 150, margin: '0 auto'}}>
                  <img src={winnerOne?.imgSrc} alt="second prize photo"  />
                </div>
              <div className="mt-2 sm:mt-4">
                <h3 className="text-sm font-medium text-gray-800 sm:text-base lg:text-lg dark:text-gray-200 pb-5">
                    {winnerOne?.user.name}
                </h3>
                {isAdmin && <div>
                 <SelectButton value={winnerOne?.active ? 'On': 'Off'} options={['Off', 'On']} onChange={(e) => updateWinnerStatusOne(e,  winnerOne?.id)} />
                </div> }
              </div>
            </div>
            <div className="text-center">
             <h3>2nd prize</h3>
               <div  className="pt-5" style={{width: 150, height: 150, margin: '0 auto'}}>
                  <img src={winnerTwo?.imgSrc} alt="second prize photo" />
              </div>
              <div className="mt-2 sm:mt-4">
                <h3 className="text-sm font-medium text-gray-800 sm:text-base lg:text-lg dark:text-gray-200 pb-5">
                 {winnerTwo?.user.name}
                </h3>
                {isAdmin && <div>
                 <SelectButton  value={winnerTwo?.active ? 'On': 'Off'} options={['Off', 'On']} onChange={(e) => updateWinnerStatusTwo(e,  winnerTwo?.id)}/>
                </div>}
              </div>
            </div>
          </div>
        </div>
      </>
    )
}


export default React.memo(Winners);