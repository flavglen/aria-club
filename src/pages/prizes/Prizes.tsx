import React from 'react';
import { Timeline } from 'primereact/timeline';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import './Prizes.css'

const Prizes: React.FC = () => {
    const events = [
        { date: '15/10/2020 10:30', image: 'assets/images/gold.jpeg', draw: 1, firstPrizeAmount: '10000', secondPrizeAmount: '5000' , firstPrize: 'GOLD',  secondPrize: 'GOLD'},
        { date: '15/10/2020 14:00', draw: 2, image: 'assets/images/gold.jpeg', firstPrizeAmount: '11000', secondPrizeAmount: '5000' , firstPrize: 'GOLD',  secondPrize: 'GOLD'},
        { date: '15/10/2020 16:15', draw: 3, image: 'assets/images/gold.jpeg', firstPrizeAmount: '12000', secondPrizeAmount: '5000' , firstPrize: 'GOLD',  secondPrize: 'GOLD'},
        { date: '16/10/2020 10:00', draw: 4, image: 'assets/images/gold.jpeg', firstPrizeAmount: '13000', secondPrizeAmount: '5,000' , firstPrize: 'GOLD',  secondPrize: 'GOLD'},
        { date: '16/10/2020 10:00', draw: 5, image: 'assets/images/gold.jpeg', firstPrizeAmount: '14000', secondPrizeAmount: '5000' , firstPrize: 'GOLD',  secondPrize: 'GOLD'},
        { date: '16/10/2020 10:00', draw: 6, image: 'assets/images/gold.jpeg', firstPrizeAmount: '15000', secondPrizeAmount: '7500' , firstPrize: 'GOLD',  secondPrize: 'GOLD'},
        { date: '16/10/2020 10:00', draw: 7, image: 'assets/images/gold.jpeg', firstPrizeAmount: '16000', secondPrizeAmount: '7500' , firstPrize: 'GOLD',  secondPrize: 'GOLD'},
        { date: '16/10/2020 10:00', draw: 8, image: 'assets/images/gold.jpeg', firstPrizeAmount: '17000', secondPrizeAmount: '7500', firstPrize: 'GOLD',  secondPrize: 'GOLD' },
        { date: '16/10/2020 10:00', draw: 9, image: 'assets/images/mobile.jpeg', firstPrizeAmount: 'SAMSUNG', secondPrizeAmount: '10500', firstPrize: 'MOBILE',  secondPrize: 'GOLD' },
        { date: '16/10/2020 10:00', draw: 10, image: 'assets/images/tv.jpeg', firstPrizeAmount: 'SAMSUNG', secondPrizeAmount: '12500', firstPrize: 'TV',  secondPrize: 'GOLD' },
        { date: '16/10/2020 10:00', draw: 11, image: 'assets/images/fridge.jpeg', firstPrizeAmount: 'SAMSUNG', secondPrizeAmount: '15000', firstPrize: 'FRIDGE',  secondPrize: 'GOLD' },
        { date: '16/10/2020 10:00', draw: 12, image: 'assets/images/scooter.jpeg', firstPrizeAmount: 'HONDA', secondPrizeAmount: '20000', firstPrize: 'SCOOTER',  secondPrize: 'GOLD' }
    ];

    const customizedMarker = (item) => {
        return (
            <i className="pi pi-gift p-overlay-badge" style={{ fontSize: '2rem' }}>
                <Badge value={item.draw}></Badge>
            </i>
        );
    };

    const customizedContent = (item) => {
        return (
            <Card title={`${item.draw} Draw`}>
                <div className='flex flex-row gap-3 prize-wrapper'>
                    <div className="w-full h-full bg-white shadow-lg rounded-lg p-5">
                        <div className="flex items-center gap-x-4 mb-3">
                            <div className="inline-flex justify-center items-center w-[62px] h-[62px] rounded-full border-4 border-blue-50 bg-blue-100 dark:border-blue-900 dark:bg-blue-800">
                                <img src={item.image} alt="prize item" />
                            </div>
                            <div className="flex-shrink-0">
                                <h3 className="block text-lg font-semibold text-gray-800 dark:text-white">{item.firstPrize}</h3>
                                <small>1st prize</small>
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-left">{Number.isNaN(parseInt(item.firstPrizeAmount)) ? item.firstPrizeAmount : `Worth ₹ ${item.firstPrizeAmount}`}</p>
                    </div>

                    <div className="w-full h-full bg-white shadow-lg rounded-lg p-5">
                        <div className="flex items-center gap-x-4 mb-3">
                            <div className="inline-flex justify-center items-center w-[62px] h-[62px] rounded-full border-4 border-blue-50 bg-blue-100 dark:border-blue-900 dark:bg-blue-800">
                                <img src="assets/images/gold.jpeg" />
                            </div>
                            <div className="flex-shrink-0">
                                <h3 className="block text-lg font-semibold text-gray-800 dark:text-white">{item.secondPrize}</h3>
                                <small>2nd prize</small>
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-left">{Number.isNaN(parseInt(item.secondPrizeAmount)) ? item.secondPrizeAmount : `Worth ₹ ${item.secondPrizeAmount}`}</p>
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <div className="card">
            <Timeline value={events} align="alternate" className="customized-timeline" marker={customizedMarker} content={customizedContent} />
        </div>
    )
}

export default Prizes;