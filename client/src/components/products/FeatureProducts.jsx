import React, { useEffect } from "react";
import { AiFillHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Ratings from "../Ratings";
import {
  add_to_card,
  messageClear,
  add_to_wishlist,
} from "../../store/reducers/cardReducer";
import Skeleton from "@mui/material/Skeleton"; // Import Skeleton from Material UI

const FeatureProducts = ({ products }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { successMessage, errorMessage } = useSelector((state) => state.card);

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

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [dispatch, errorMessage, successMessage]);

  const add_wishlist = (pro) => {
    dispatch(
      add_to_wishlist({
        userId: userInfo.id,
        productId: pro._id,
        name: pro.name,
        price: pro.price,
        originalPrice: pro.originalPrice,
        image: pro.images[0],
        discount: pro.discount,
        rating: pro.rating,
        slug: pro.slug,
      })
    );
  };

  const isLoading = products.length === 0; // Loading state: Assuming if no products, data is loading

  return (
    <div className="w-11/12 md:w-full mx-8 bg-[#FFFFFF] flex flex-wrap mx-auto">
      <div className="w-full">
        <div className="text-center flex justify-between rounded-t-xl md:rounded-t-[5px] items-start bg-orange-500 md:bg-white flex-row p-2 text-xl md:text-lg text-white font-semibold relative">
          <h2 className="text-xl md:text-lg text-white md:text-orange-500 font-bold">
            Special For You
          </h2>
          <h2 className="text-[14px] md:text-sm px-3 font-bold md:font-semibold text-gray-300 md:text-gray-500">
            See All
          </h2>
        </div>
      </div>

      {/* Adjust the grid layout for mobile */}
      <div className="w-100% grid grid-cols-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-min p-4 md:p-2">
        {isLoading
          ? // Skeleton placeholders for loading state
            Array.from(new Array(12)).map((_, index) => (
              <div
                key={index}
                className="rounded-[15px] overflow-hidden shadow-lg bg-white group transition-all duration-500 hover:shadow-xl"
              >
                <Skeleton variant="rectangular" width={310} height={220} />
                <div className="py-3 px-2 text-gray-700">
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="50%" />
                </div>
              </div>
            ))
          : // Render products when loaded
            products.map((p, i) => (
              <div
                key={i}
                className="rounded-[15px] overflow-hidden shadow-lg bg-white group transition-all duration-500 hover:shadow-xl"
              >
                <div className="relative overflow-hidden">
                  {/* Discount Badge */}
                  {p.discount && (
                    <div className="flex m-1 justify-center z-99 items-center absolute text-white w-[35px] h-[30px] rounded-sm bg-orange-500 font-semibold text-xs right-0 top-0">
                      {p.discount}%
                    </div>
                  )}

                  {/* Product Image */}
                  <img
                    className="w-full h-[180px] object-cover transition-transform duration-300 hover:scale-105"
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
                  <h2 className="text-sm md:text-base font-semibold line-clamp-1">
                    {p.name}
                  </h2>

                  {/* Ratings */}
                  <div className="flex font-semibold">
                    <Ratings ratings={p.rating} />
                  </div>

                  {/* Pricing */}
                  <div className="flex flex-wrap items-center gap-2 md:gap-1 pt-2">
                    <span className="text-[14px] font-bold text-black">
                      NGN{" "}
                      {(
                        p.price -
                        p.price * (p.discount / 100)
                      ).toLocaleString()}
                    </span>

                    {p.discount && (
                      <del className="text-gray-500 text-[12px] font-light">
                        NGN {p.price.toLocaleString()}
                      </del>
                    )}
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default FeatureProducts;
