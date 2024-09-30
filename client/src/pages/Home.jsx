import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chatbot from '../components/Chatbot';
import Heders from '../components/Headers';
import Banner from '../components/Banner';
import Categorys from '../components/Categorys';
import FeatureProducts from '../components/products/FeatureProducts';
import LatestProduct from '../components/products/LatestProducts';
import Products from '../components/products/Products';
import Footer from '../components/Footer';
import { get_category, get_products } from '../store/reducers/homeReducer';

const Home = () => {
    const dispatch = useDispatch();

    // Extract products from state
    const { products, latest_product, topRated_product, discount_product } = useSelector(state => state.home);

    // Fetch products on component mount
    useEffect(() => {
        dispatch(get_products());
    }, [dispatch]);
    useEffect(() => {
        dispatch(get_category());
    }, [dispatch]);

    return (
        <div className='w-full bg-[#F5F5F5]'>
            <Heders />
            <Banner />
            <div className='mx-12'>
                <Categorys />
            </div>
            <div className='py-[35px] mx-12'>
                {products ? <LatestProduct products={products} /> : <p>Loading products...</p>}
            </div>

            <div className='py-[35px] mx-12'>
                {products ? <FeatureProducts products={products} /> : <p>Loading products...</p>}
            </div>

            {/* Ensure latest_product, topRated_product, and discount_product are defined before rendering Products */}
            <div className='py-10'>
                <div className='w-[85%] flex flex-wrap mx-auto'>
                    <div className="grid w-full grid-cols-3 md-lg:grid-cols-2 md:grid-cols-1 gap-7">

                        <div className='overflow-hidden'>
                            {latest_product ? (
                                <Products title='Latest Product' products={latest_product} />
                            ) : (
                                <p>Loading latest products...</p>
                            )}
                        </div>

                        <div className='overflow-hidden'>
                            {topRated_product ? (
                                <Products title='Top Rated Product' products={topRated_product} />
                            ) : (
                                <p>Loading top-rated products...</p>
                            )}
                        </div>

                        <div className='overflow-hidden'>
                            {discount_product ? (
                                <Products title='Discount Product' products={discount_product} />
                            ) : (
                                <p>Loading discount products...</p>
                            )}
                        </div>

                    </div>
                </div>
            </div>
            <Chatbot />
            <Footer />
        </div>
    );
};

export default Home;
