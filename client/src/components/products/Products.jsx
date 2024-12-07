import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';
import Ratings from "../Ratings";

const Products = ({ title, products }) => {
    const [isLoading, setIsLoading] = useState(true);

    // Simulate loading completion when products are passed
    useEffect(() => {
        if (products && products.length > 0) {
            setIsLoading(false); // Stop loading when products are available
        }
    }, [products]);

    return (
        <div className="w-11/12 md:w-full mx-auto bg-[#FFFFFF]">
            <div className="w-full">
                <div className="text-center flex justify-center rounded-t-xl md:rounded-t-[5px] items-start bg-[#191919] md:bg-white flex-row p-2 text-xl md:text-lg text-white font-semibold relative">
                    <h2 className="text-xl md:text-lg text-white md:text-[#191919] font-semibold">{title} <span className='text-orange-500'>On Ridan</span></h2>
                </div>
            </div>

            {/* Responsive grid layout for products */}
            <div className="grid grid-cols-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
                {isLoading ? Array.from(new Array(5)).map((_, index) => (
                    <div
                        key={index}
                        className="rounded-[15px] md:h-fit overflow-hidden shadow-lg bg-white group transition-all duration-500 hover:shadow-xl"
                    >
                        <Skeleton variant="rectangular" width={310} height={220} />
                        <div className="py-3 px-2 text-gray-700">
                            <Skeleton variant="text" width="80%" />
                            <Skeleton variant="text" width="60%" />
                            <Skeleton variant="text" width="50%" />
                        </div>
                    </div>
                )) :
                    products.map((p, i) => (
                        p.map((pl, j) => (
                            <Link key={j} className='flex justify-start items-start' to='#'>
                                <div className="w-full h-[250px] md:h-fit flex flex-col rounded-[15px] overflow-hidden shadow-lg bg-white group transition-all duration-500 hover:shadow-xl">
                                    <img className="w-full h-[70%] object-cover transition-transform duration-300 hover:scale-105"
                                        src={pl.images[0]}
                                        alt="product" />
                                    <div className='px-3 py-2 flex flex-col justify-between text-slate-600'>
                                        <h2 className="text-sm md:text-base font-semibold line-clamp-1">{pl.name}</h2>
                                        <div className="flex">
                                            <Ratings ratings={pl.rating} />
                                        </div>
                                        <span className='text-[14px] py-2 font-bold text-black'>
                                            NGN {pl.price.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ))
                }
            </div>
        </div>
    )
}

export default Products;
