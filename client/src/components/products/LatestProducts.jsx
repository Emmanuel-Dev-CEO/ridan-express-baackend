import React, { useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { AiFillHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Ratings from "../Ratings";
import { add_to_card, messageClear, add_to_wishlist } from "../../store/reducers/cardReducer";

const LatestProduct = ({ products }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { successMessage, errorMessage } = useSelector((state) => state.card);

  const add_card = (id) => {
    if (userInfo) {
      dispatch(add_to_card({ userId: userInfo.id, quantity: 1, productId: id }));
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
  }, [errorMessage, successMessage, dispatch]);

  const add_wishlist = (pro) => {
    if (userInfo) {
      dispatch(add_to_wishlist({ userId: userInfo.id, productId: pro._id, name: pro.name, price: pro.price, image: pro.images[0], discount: pro.discount, rating: pro.rating, slug: pro.slug }));
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="mx-8 bg-[#FFFFFF] flex flex-wrap mx-auto">
      <div className="w-full">
        <div className="text-center flex justify-between rounded-t-xl items-start bg-[#191919] flex-row p-2 text-xl md:text-xl text-white font-semibold relative">
          <h2>Latest Products</h2>
          <h2 className="text-[14px] md:text-[10px] px-3 font-light">SEE ALL</h2>
        </div>
      </div>
      <div className="w-100% grid grid-cols-5 sm:grid-cols-2 p-4 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {products.map((p, i) => (
          <div key={i} className="rounded-lg shadow-xl bg-white group transition-all duration-500 hover:shadow-xl hover:-mt-2">
            <div className="relative overflow-hidden">
              {p.discount && (
                <div className="flex justify-center items-center absolute text-white w-[35px] h-[35px] rounded-full bg-red-500 font-semibold text-xs left-2 top-2">
                  {p.discount}%
                </div>
              )}
              <img className="w-[220px] md:w-full h-[220px] md:h-auto object-cover transition-transform duration-300 group-hover:scale-105" src={p.images[0]} alt={p.name} />
              <ul className="flex justify-center items-center gap-2 absolute bottom-[-40px] w-full opacity-0 group-hover:bottom-3 group-hover:opacity-100 transition-all duration-300">
                <li onClick={() => add_wishlist(p)} className="w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-red-500 hover:text-white transition-transform duration-500">
                  <AiFillHeart />
                </li>
                <Link to={`/product/details/${p.slug}`} className="w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-blue-500 hover:text-white transition-transform duration-500">
                  <FaEye />
                </Link>
                <li onClick={() => add_card(p._id)} className="w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-green-500 hover:text-white transition-transform duration-500">
                  <AiOutlineShoppingCart />
                </li>
              </ul>
            </div>
            <div className="py-3 px-2 text-gray-700">
              <h2 className="text-sm md:text-base font-semibold line-clamp-2">{p.name}</h2>
              <div className="flex"><Ratings ratings={p.rating} /></div>
              <div className="flex justify-start items-center gap-3">
                <div>
                  <span className="text-[14px] font-bold text-black">NGN {p.price}</span>
                  {p.originalPrice && <del className="text-gray-500 text-[14px] font-light ml-2">NGN {p.originalPrice}</del>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Define prop types
LatestProduct.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      originalPrice: PropTypes.number,
      images: PropTypes.arrayOf(PropTypes.string).isRequired,
      discount: PropTypes.number,
      rating: PropTypes.number.isRequired,
      slug: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default LatestProduct;
