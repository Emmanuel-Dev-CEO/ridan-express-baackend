import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Headers from '../components/Headers';
import toast from 'react-hot-toast';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
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

      <section className="bg-gray-100 md:mt-20">
        <div className="container mx-auto px-4 md:px-0 py-8">
          {card_products.length > 0 || outofstock_products.length > 0 ? (
            <div className="flex flex-row md:flex-col lg:flex-row gap-4">
              {/* Cart Items Section */}
              <div className="w-full ">
                <div className="bg-white p-4 rounded-md shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Products in Cart ({buy_product_item})
                  </h2>
                  {card_products.map((p, i) => (
                    <div key={i} className="bg-gray-50 p-4 mb-4 border rounded-md shadow-sm">
                      <h3 className="text-sm font-medium text-gray-600">{p.shopName}</h3>
                      {p.products.map((pt, index) => (
                        <div key={index} className="flex items-center  border-b p-2 justify-between mt-3">
                          <div >
                            <div className="flex items-center gap-4">
                              <img
                                src={pt?.productInfo?.images?.[0] || "/path/to/placeholder.jpg"}
                                alt="product"
                                className="w-20 h-20 object-cover rounded"
                              />
                              <div>
                                <h4 className="text-sm font-medium text-gray-700">{pt?.productInfo?.name || 'Unknown Product'}</h4>
                                <div className='flex justify-start item-center gap-1 hidden md:block'>
                                  <p className="text-base font-semibold text-gray-800">
                                    NGN {(pt?.productInfo?.price - Math.floor((pt?.productInfo?.price * pt?.productInfo?.discount) / 100)).toLocaleString()}
                                  </p>
                                  <p className="text-xs text-gray-500 line-through">NGN {(pt?.productInfo?.price).toLocaleString()}</p>
                                </div>
                                <p className="text-xs text-gray-500">Brand: {pt?.productInfo?.brand || 'Unknown'}</p>
                              </div>
                            </div>
                            <div className='flex gap-16 w-[100%]'>
                              <button
                                onClick={() => dispatch(delete_card_product(pt._id))}
                                className="flex items-center justify-center text-red-500 text-sm mt-2 p-2 rounded-md hover:bg-red-100 transition ease-in-out duration-150"
                              >
                                <DeleteOutlineOutlinedIcon className="mr-1" />
                                REMOVE
                              </button>

                              <div className="m-3 flex hidden md:block">
                                <button onClick={() => dec(pt.quantity, pt._id)} className="px-1 font-semibold w-[35px] h-[35px] border active:bg-red-400 border-red-200 rounded-lg"><RemoveOutlinedIcon /></button>
                                <span className="px-4 h-[35px]">{pt.quantity}</span>
                                <button onClick={() => inc(pt.quantity, pt?.productInfo?.stock || 0, pt._id)} className="px-1 w-[35px] h-[35px] active:bg-red-400 border border-red-200 rounded-lg"><AddOutlinedIcon /></button>
                              </div>
                            </div>
                          </div>
                          <br />
                          <div className="text-end md:hidden">
                            <p className="text-base font-semibold md:hidden text-gray-800">
                              NGN {(pt?.productInfo?.price - Math.floor((pt?.productInfo?.price * pt?.productInfo?.discount) / 100)).toLocaleString()}
                            </p>
                            <p className="text-xs md:hidden text-gray-500 line-through">NGN {(pt?.productInfo?.price).toLocaleString()}</p>
                            <p className="text-xs text-red-500 bg-red-100 p-1  ml-auto w-[35px] rounded-lg">-{pt?.productInfo?.discount}% </p>
                            <div className="m-3">
                              <button onClick={() => dec(pt.quantity, pt._id)} className="px-1 font-semibold w-[35px] h-[35px] border active:bg-red-400 border-red-200 rounded-lg"><RemoveOutlinedIcon /></button>
                              <span className="px-4 h-[35px]">{pt.quantity}</span>
                              <button onClick={() => inc(pt.quantity, pt?.productInfo?.stock || 0, pt._id)} className="px-1 w-[35px] h-[35px] active:bg-red-400 border border-red-200 rounded-lg"><AddOutlinedIcon /></button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                  {/* Out of Stock Section */}
                  {outofstock_products.length > 0 && (
                    <div className="bg-white p-4 rounded-md shadow-sm mt-4">
                      <h2 className="text-md font-semibold text-red-500">Out of Stock ({outofstock_products.length})</h2>
                      {outofstock_products.map((p, i) => (
                        <div key={i} className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-4">
                            <img
                              src={p?.products?.[0]?.images?.[0] || "/path/to/placeholder.jpg"}
                              alt="product"
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div>
                              <h4 className="text-sm font-medium text-gray-700">{p?.products?.[0]?.name || 'Unknown Product'}</h4>
                              <p className="text-xs text-gray-500">Brand: {p?.products?.[0]?.brand || 'Unknown'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-800">
                              NGN {p?.products?.[0]?.price - Math.floor((p?.products?.[0]?.price * p?.products?.[0]?.discount) / 100)}
                            </p>
                            <p className="text-xs text-gray-500 line-through">NGN {p?.products?.[0]?.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary Section */}
              <div className="lg:w-1/3 w-[50%] md:w-[100%]">
                <div className="bg-white p-4 rounded-md shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">Order Summary</h2>
                  <div className="flex justify-between text-sm text-gray-600 py-2">
                    <span>Price ({buy_product_item} items)</span>
                    <span>NGN {(price).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 py-2">
                    <span>Shipping Fee</span>
                    <span>NGN {(shipping_fee).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-800 font-bold py-2">
                    <div>
                      <span>Subtotal</span>
                      <p className='text-sm text-gray-500 font-normal'>Delivery fee has not been added yet</p>
                    </div>
                    <span>NGN {(price + shipping_fee).toLocaleString()}</span>
                  </div>
                  <button onClick={redirect} className="w-full bg-orange-500 text-white py-2 mt-4 rounded-sm font-medium hover:bg-orange-600">
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-md shadow-md text-center">
              <p className="text-lg font-semibold text-gray-800">Your cart is empty!</p>
              <p className="text-sm text-gray-500 mt-2">Browse our categories and discover our best deals!</p>
              <Link to="/">
                <button className="mt-4 px-4 py-2 bg-orange-500 text-white font-medium rounded hover:bg-orange-600">
                  START SHOPPING
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* <Footer /> */}
    </div>
  );
};

export default Card;
