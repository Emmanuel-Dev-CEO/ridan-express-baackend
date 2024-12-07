import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chatbot from '../components/Chatbot';
import Heders from '../components/Headers';
import Banner from '../components/Banner';
import Categorys from '../components/Categorys';
import FeatureProducts from '../components/products/FeatureProducts';
import Products from '../components/products/Products';
import PublishedProductsPage from '../components/products/PublishedProducts';
import Footer from '../components/Footer';
import { get_category, get_products } from '../store/reducers/homeReducer';



const Home = () => {
    const dispatch = useDispatch();

    // Extract products from state
    const { products, latest_product, topRated_product } = useSelector(state => state.home);

    // Fetch products on component mount
    useEffect(() => {
        dispatch(get_products());
    }, [dispatch]);
    useEffect(() => {
        dispatch(get_category());
    }, [dispatch]);

    return (
        <div className=' bg-[#F5F5F5]'>
            <Heders />
            <Banner />
            <div className='mx-12 md:mx-2'>
                <Categorys />
            </div>

            <div className='py-[10px] mx-12 md:mx-2'>
                {products ? <FeatureProducts products={products} /> : <p>Loading products...</p>}
            </div>
            <div className='py-[10px] mx-12 md:mx-2 overflow-hidden'>
                {topRated_product ? (
                    <Products title='Top Rated Products' products={topRated_product} />
                ) : (
                    <p>Loading top-rated products...</p>
                )}
            </div>
            <div className='py-[10px] mx-12 md:mx-2 overflow-hidden'>
                {latest_product ? (
                    <PublishedProductsPage title='Sponsored Product' products={latest_product} />
                ) : (
                    <p>Loading latest products...</p>
                )}
            </div>

            <Chatbot />
            <Footer />
        </div>
    );
};

export default Home;
