import React from 'react';

const Winners: React.FC = () => {

    return (
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
            <h2 className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white">Winners (October 2023) </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-8 md:gap-12">
            <div className="text-center">
                <small>1st prize</small>
                <div>
                  <i className="pi pi-user" style={{ fontSize: '4.5rem' }}></i>
                </div>
              <div className="mt-2 sm:mt-4">
                <h3 className="text-sm font-medium text-gray-800 sm:text-base lg:text-lg dark:text-gray-200">
                    Manoj
                </h3>
                <p className="text-xs text-gray-600 sm:text-sm lg:text-base dark:text-gray-400">
                 Mangalore
                </p>
              </div>
            </div>
            <div className="text-center">
             <small>2nd prize</small>
             <div>
                  <i className="pi pi-user" style={{ fontSize: '4.5rem' }}></i>
                </div>
              <div className="mt-2 sm:mt-4">
                <h3 className="text-sm font-medium text-gray-800 sm:text-base lg:text-lg dark:text-gray-200">
                  Sheela
                </h3>
                <p className="text-xs text-gray-600 sm:text-sm lg:text-base dark:text-gray-400">
                 Udupi
                </p>
              </div>
            </div>
          </div>
        </div>
    )
}


export default Winners;