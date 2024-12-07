import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { get_order } from '../../store/reducers/orderReducer';

const Order = () => {
    const { orderId } = useParams();
    const dispatch = useDispatch();
    const { myOrder } = useSelector((state) => state.order);
    const { userInfo } = useSelector((state) => state.auth);
    const { product } = useSelector((state) => state.home);

    useEffect(() => {
        if (orderId) {
            dispatch(get_order(orderId));
        }
    }, [orderId, dispatch]);

    return (
        <div className="bg-white p-5">
            {myOrder ? (
                <>
                    <h2 className="text-slate-600 font-semibold">
                        #{myOrder._id} , <span className="pl-1">{myOrder.date}</span>
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-slate-600 font-semibold">Deliver to: {myOrder.shippingInfo?.name}</h2>
                            <p>
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Home</span>
                                <span className="text-slate-600 text-sm">
                                    {`${myOrder.shippingInfo?.address}, ${myOrder.shippingInfo?.province}, ${myOrder.shippingInfo?.city}, ${myOrder.shippingInfo?.area}`}
                                </span>
                            </p>
                            <p className="text-slate-600 text-sm font-semibold">Email: {userInfo.email}</p>
                        </div>
                        <div className="text-slate-600">
                            <h2>Price: ${myOrder.price} (including shipping)</h2>
                            <p>
                                Payment status: 
                                <span className={`py-[1px] text-xs px-3 ${myOrder.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} rounded-md`}>
                                    {myOrder.payment_status}
                                </span>
                            </p>
                            <p>
                                Order status: 
                                <span className={`py-[1px] text-xs px-3 ${myOrder.delivery_status === 'paid' ? 'bg-indigo-100 text-indigo-800' : 'bg-red-100 text-red-800'} rounded-md`}>
                                    {myOrder.delivery_status}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="mt-3">
                        <h2 className="text-slate-600 text-lg pb-2">Products</h2>
                        <div className="flex gap-5 flex-col">
                            {myOrder.products?.map((product, index) => (
                                <div key={index} className="flex gap-5 justify-start items-center text-slate-600">
                                    <div className="flex gap-2">
                                        <img className="w-[55px] h-[55px]" src={product.images[0]} alt={product.name} />
                                        <div className="flex text-sm flex-col justify-start items-start">
                                            <Link to={`/product/${product._id}`}>{product.name}</Link>
                                            <p>
                                                <span>Brand: {product.brand}</span>
                                                <span>Quantity: {product.quantity}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="pl-4">
                                        <h2 className="text-md text-orange-500">
                                            ₦{product.price - Math.floor((product.price * product.discount) / 100)}
                                        </h2>
                                        <p className="line-through">₦{product.price}</p>
                                        <p className="text-sm text-gray-500">-{product.discount}%</p>
                                    </div>
                                </div>
                            ))}
                            <Link
                                to={`/dashboard/chat/${product.sellerId}`}
                                className="px-8 py-3 rounded-lg h-[50px] cursor-pointer hover:shadow-lg hover:shadow-green-500/40 bg-black text-white block"
                            >
                                Chat Seller
                            </Link>
                        </div>
                    </div>
                </>
            ) : (
                <p className="text-slate-600">Loading order details...</p>
            )}
        </div>
    );
};

export default Order;
