import React from 'react';
import { Carousel } from 'primereact/carousel';
import { Card } from 'primereact/card';
import Winners from '../winners/winners';

const Prize: React.FC = () => {
    const responsiveOptions = [
        {
            breakpoint: '1199px',
            numVisible: 1,
            numScroll: 1
        },
        {
            breakpoint: '991px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    const prize = [{
        id: '1000',
        name: 'Scooter',
        description: 'Product Description',
        image: 'DeluxeYellow.png',
    },{
        id: '1000',
        name: 'Fridge',
        description: 'Product Description',
        image: 'fridge.png',
    },
    {
        id: '1000',
        name: 'Mobile',
        description: 'Product Description',
        image: 'mobile.jpg',
    },
    {
        id: '1000',
        name: 'Television',
        description: 'Product Description',
        image: 'tv.jpg',
    },
    {
        id: '1000',
        name: 'Gold Coin',
        description: 'Product Description',
        image: 'gold.png',
    }
]

    const productTemplate = (product) => {
        return (
            <div className="border-1 surface-border border-round m-2 text-center py-5 px-3">
                <div className="mb-3" style={{height: 300, width: 300}}>
                    <img src={`/assets/images/${product.image}`} alt={product.name} className="shadow-2"/>
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
                <Carousel value={prize} numVisible={3} numScroll={3} responsiveOptions={responsiveOptions} itemTemplate={productTemplate} />
            </Card>

            <Card style={{marginTop: 20}}>
                <Winners />
            </Card>
       </>

    );
}

export default Prize;
