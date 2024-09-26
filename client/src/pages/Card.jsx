import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import Headers from '../components/Headers';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { get_card_products, delete_card_product, messageClear, quantity_inc, quantity_dec } from '../store/reducers/cardReducer';

const Card = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { card_products, successMessage, price, buy_product_item, shipping_fee, outofstock_products } = useSelector((state) => state.card);

  const redirect = () => {
    navigate('/shipping', {
      state: {
        products: card_products,
        price,
        shipping_fee,
        items: buy_product_item,
      },
    });
  };

  useEffect(() => {
    if (userInfo?.id) {
      dispatch(get_card_products(userInfo.id));
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      if (userInfo?.id) {
        dispatch(get_card_products(userInfo.id));
      }
    }
  }, [successMessage, dispatch, userInfo]);

  // Safeguarding stock value
  const inc = (quantity, stock = 0, card_id) => {
    const newQuantity = quantity + 1;
    if (newQuantity <= stock) {
      dispatch(quantity_inc(card_id));
    }
  };

  const dec = (quantity, card_id) => {
    const newQuantity = quantity - 1;
    if (newQuantity > 0) {
      dispatch(quantity_dec(card_id));
    }
  };

  return (
    <div>
      <Headers />
      <section className='bg-[url("http://localhost:3000/images/banner/card.jpg")] h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left'>
        <div className='absolute left-0 top-0 w-full h-full bg-[#2422228a]'>
          <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto'>
            <div className='flex flex-col justify-center gap-1 items-center h-full w-full text-white'>
              <h2 className='text-3xl font-bold'>Shop.my</h2>
              <div className='flex justify-center items-center gap-2 text-2xl w-full'>
                <Link to='/'>Home</Link>
                <span className='pt-2'>
                  <MdOutlineKeyboardArrowRight />
                </span>
                <span>Card</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='bg-[#eeeeee]'>
        <div className='w-[85%] lg:w-[90%] md:w-[90%] sm:w-[90%] mx-auto py-16'>
          {card_products.length > 0 || outofstock_products.length > 0 ? (
            <div className='flex flex-wrap'>
              <div className='w-[67%] md-lg:w-full'>
                <div className='pr-3 md-lg:pr-0'>
                  <div className='flex flex-col gap-3'>
                    <div className='bg-white p-4'>
                      <h2 className='text-md text-green-500 font-semibold'>
                        Stock Products {card_products.length}
                      </h2>
                    </div>
                    {card_products.map((p, i) => (
                      <div key={i} className='flex bg-white p-4 flex-col gap-2'>
                        <div className='flex justify-start items-center'>
                          <h2 className='text-md text-slate-600'>{p.shopName}</h2>
                        </div>
                        {p.products.map((pt, index) => (
                          <div key={index} className='w-full flex flex-wrap'>
                            <div className='flex sm:w-full gap-2 w-7/12'>
                              <div className='flex gap-2 justify-start items-center'>
                                <img
                                  className='w-[80px] h-[80px]'
                                  src={pt?.productInfo?.images?.[0] || "/path/to/placeholder.jpg"}
                                  alt='product'
                                />
                                <div className='pr-4 text-slate-600'>
                                  <h2 className='text-md'>{pt?.productInfo?.name || 'Unknown Product'}</h2>
                                  <span className='text-sm'>Brand: {pt?.productInfo?.brand || 'Unknown'}</span>
                                </div>
                              </div>
                            </div>
                            <div className='flex justify-between w-5/12 sm:w-full sm:mt-3'>
                              <div className='pl-4 sm:pl-0'>
                                <h2 className='text-lg text-orange-500'>
                                  $
                                  {pt?.productInfo?.price &&
                                    pt?.productInfo?.price -
                                      Math.floor(
                                        (pt?.productInfo?.price * pt?.productInfo?.discount) / 100
                                      )}
                                </h2>
                                <p className='line-through'>{pt?.productInfo?.price}</p>
                                <p>-{pt?.productInfo?.discount}%</p>
                              </div>
                              <div className='flex gap-2 flex-col'>
                                <div className='flex bg-slate-200 h-[30px] justify-center items-center text-xl'>
                                  <div onClick={() => dec(pt.quantity, pt._id)} className='px-3 cursor-pointer'>
                                    -
                                  </div>
                                  <div className='px-3'>{pt.quantity}</div>
                                  <div
                                    onClick={() =>
                                      inc(pt.quantity, pt?.productInfo?.stock || 0, pt._id)
                                    }
                                    className='px-3 cursor-pointer'
                                  >
                                    +
                                  </div>
                                </div>
                                <button
                                  onClick={() => dispatch(delete_card_product(pt._id))}
                                  className='px-5 py-[3px] bg-red-500 text-white'
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                    {outofstock_products.length > 0 && (
                      <div className='flex flex-col gap-3'>
                        <div className='bg-white p-4'>
                          <h2 className='text-md text-red-500 font-semibold'>
                            Out of Stock {outofstock_products.length}
                          </h2>
                        </div>
                        <div className='bg-white p-4'>
                          {outofstock_products.map((p, i) => (
                            <div key={i} className='w-full flex flex-wrap'>
                              <div className='flex sm:w-full gap-2 w-7/12'>
                                <div className='flex gap-2 justify-start items-center'>
                                  <img
                                    className='w-[80px] h-[80px]'
                                    src={p?.products?.[0]?.images?.[0] || "/path/to/placeholder.jpg"}
                                    alt='product'
                                  />
                                  <div className='pr-4 text-slate-600'>
                                    <h2 className='text-md'>{p?.products?.[0]?.name || 'Unknown Product'}</h2>
                                    <span className='text-sm'>Brand : {p?.products?.[0]?.brand || 'Unknown'}</span>
                                  </div>
                                </div>
                              </div>
                              <div className='flex justify-between w-5/12 sm:w-full sm:mt-3'>
                                <div className='pl-4 sm:pl-0'>
                                  <h2 className='text-lg text-orange-500'>
                                    $
                                    {p?.products?.[0]?.price &&
                                      p?.products?.[0]?.price -
                                        Math.floor(
                                          (p?.products?.[0]?.price * p?.products?.[0]?.discount) / 100
                                        )}
                                  </h2>
                                  <p className='line-through'>{p?.products?.[0]?.price}</p>
                                  <p>-{p?.products?.[0]?.discount}%</p>
                                </div>
                                <div className='flex gap-2 flex-col'>
                                  <div className='flex bg-slate-200 h-[30px] justify-center items-center text-xl'>
                                    <div className='px-3 cursor-pointer'>-</div>
                                    <div className='px-3'>{p?.products?.[0]?.quantity || 0}</div>
                                    <div className='px-3 cursor-pointer'>+</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing and summary section */}
              <div className='w-[33%] md-lg:w-full'>
                <div className='bg-white p-4'>
                  <h2 className='text-xl text-center text-slate-600 font-semibold'>Order Summary</h2>
                  <div className='flex justify-between py-4'>
                    <span className='text-sm text-slate-600'>Price ({buy_product_item} items)</span>
                    <span className='text-sm text-slate-600'>$ {price}</span>
                  </div>
                  <div className='flex justify-between py-4'>
                    <span className='text-sm text-slate-600'>Shipping Fee</span>
                    <span className='text-sm text-slate-600'>$ {shipping_fee}</span>
                  </div>
                  <div className='flex justify-between py-4'>
                    <span className='text-sm text-slate-600'>Total</span>
                    <span className='text-sm text-slate-600'>
                      $ {price && price + shipping_fee}
                    </span>
                  </div>
                  <div className='flex justify-center'>
                    <button
                      onClick={redirect}
                      className='w-full py-[6px] bg-blue-500 text-white hover:bg-blue-600'
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) :
          
          
           (
            <div className=" bg-white rounded-md py-10 flex flex-col items-center justify-center gap-5 shadow-xl px-4">
            <p className="text-sm font-semibold">Your cart is empty!</p>
            <p className="text-xs text-center">
              Browse our categories and discover our best deals!
            </p>
            <Link to="/">
              <button className="bg-[#191919] rounded-md text-sm font-semibold text-white p-4 hover:bg-[#E07E1B] shadow-lg">
                START SHOPPING
              </button>
            </Link>
          </div>
          )
          
          }
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Card;
