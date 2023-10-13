import React from 'react';
import { Carousel } from 'primereact/carousel';
import { Card } from 'primereact/card';
import { Link } from 'react-router-dom';
import "./prize.css";
import Winners from '../winners/winners';

const Prize: React.FC = () => {
    const responsiveOptions = [
        {
            breakpoint: '1199px',
            numVisible: 1,
            numScroll: 1
        },
        {
            breakpoint: '680px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    const prize = [{
        id: '1000',
        name: 'Scooter',
        description: 'Product Description',
        image: 'scooter.jpeg',
    },{
        id: '1000',
        name: 'Fridge',
        description: 'Product Description',
        image: 'fridge.jpeg',
    },
    {
        id: '1000',
        name: 'Mobile',
        description: 'Product Description',
        image: 'mobile.jpeg',
    },
    {
        id: '1000',
        name: 'Television',
        description: 'Product Description',
        image: 'tv.jpeg',
    },
    {
        id: '1000',
        name: 'Gold Coin',
        description: 'Product Description',
        image: 'gold.jpeg',
    }
]

    const productTemplate = (product) => {
        return (
            <div className="border-1 surface-border border-round m-2 text-center py-5 px-3">
                <div className="mb-3 car-wrapper">
                    <img src={`/assets/images/${product.image}`} alt={product.name} className="shadow-2 car-item" />
                </div>
                <div>
                    <h4 className="mb-1">{product.name}</h4>
                </div>
            </div>
        );
    };


    return (
        <>
            <Card title="Aira Lucky Scheme">
                <Carousel value={prize} numVisible={1} numScroll={1} responsiveOptions={responsiveOptions} itemTemplate={productTemplate} />
                <Link className='text-right' to='/prizes'><b>View More Prizes</b></Link>
            </Card>

            <Card style={{marginTop: 20}}>
                <Winners />
            </Card>
       </>

    );
}

export default Prize;
