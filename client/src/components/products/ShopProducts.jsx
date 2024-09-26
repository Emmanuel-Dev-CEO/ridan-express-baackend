import React from 'react';
import { AiFillHeart, AiOutlineShoppingCart } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import Ratings from '../Ratings';
import { useDispatch, useSelector } from 'react-redux';
import { add_to_card, add_to_wishlist } from "../../store/reducers/cardReducer";

const ShopProducts = ({ styles, products }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const add_wishlist = (pro) => {
    dispatch(
      add_to_wishlist({
        userId: userInfo?.id,
        productId: pro._id,
        name: pro.name,
        price: pro.price,
        image: pro.images[0],
        discount: pro.discount,
        rating: pro.rating,
        slug: pro.slug,
      })
    );
  };

  const add_card = (id) => {
    if (userInfo) {
      dispatch(
        add_to_card({
          userId: userInfo.id,
          quantity: 1,
          productId: id,
        })
      );
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="w-100% grid grid-cols-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products && products.length > 0 ? (
        products.map((p, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 bg-white group transition-all duration-500 hover:shadow-xl hover:-mt-2"
          >
            <div className="relative overflow-hidden">
              {/* Discount Badge */}
              {p.discount && (
                <div className="flex justify-center items-center absolute text-white w-[35px] h-[35px] rounded-full bg-red-500 font-semibold text-xs left-2 top-2">
                  {p.discount}%
                </div>
              )}

              {/* Product Image */}
              <img
                className="w-[100%] md:w-full h-[220px] md:h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                src={p.images[0]}
                alt="product image"
              />

              {/* Hover Actions */}
              <ul className="flex justify-center items-center gap-2 absolute bottom-[-40px] w-full opacity-0 group-hover:bottom-3 group-hover:opacity-100 transition-all duration-300">
                <li
                  onClick={() => add_wishlist(p)}
                  className="w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-red-500 hover:text-white transition-transform duration-500"
                >
                  <AiFillHeart />
                </li>
                <Link
                  to={`/product/details/${p.slug}`}
                  className="w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-blue-500 hover:text-white transition-transform duration-500"
                >
                  <FaEye />
                </Link>
                <li
                  onClick={() => add_card(p._id)}
                  className="w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-green-500 hover:text-white transition-transform duration-500"
                >
                  <AiOutlineShoppingCart />
                </li>
              </ul>
            </div>

            {/* Product Info */}
            <div className="py-3 px-2 text-gray-700">
              <h2 className="text-sm md:text-base font-semibold line-clamp-2">
                {p.name}
              </h2>

              {/* Ratings */}
              <div className="flex">
                <Ratings ratings={p.rating} />
              </div>

              {/* Pricing */}
              <div className="flex justify-start items-center gap-3">
                <div>
                  <span className="text-xl font-bold text-black">
                    NGN {p.price}
                  </span>
                  {p.originalPrice && (
                    <del className="text-gray-500 text-sm font-light ml-2">
                      NGN {p.originalPrice}
                    </del>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Products are out of Stock</p>
      )}
    </div>
  );
};

export default ShopProducts;
