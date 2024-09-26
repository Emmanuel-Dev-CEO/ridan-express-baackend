import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { GrMail } from "react-icons/gr";
import { IoIosCall } from "react-icons/io";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import {
  FaLinkedinIn,
  FaFacebookF,
  FaUser,
  FaLock,
  FaSearch,
  FaBars,
  FaShoppingCart,
  FaTwitter,
} from "react-icons/fa";
import { AiOutlineTwitter, AiFillGithub, AiFillHeart } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  get_card_products,
  get_wishlist_products,
} from "../store/reducers/cardReducer";

const Headers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categorys } = useSelector((state) => state.home);
  const { userInfo } = useSelector((state) => state.auth);
  const { card_product_count, wishlist_count } = useSelector(
    (state) => state.card
  );
 
  const { pathname } = useLocation();
  const [showShidebar, setShowShidebar] = useState(true);
  const [categoryShow, setCategoryShow] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [category, setCategory] = useState("");

  const search = () => {
    navigate(`/products/search?category=${category}&&value=${searchValue}`);
  };
  const redirect_card_page = () => {
    if (userInfo) {
      navigate(`/card`);
    } else {
      navigate(`/login`);
    }
  };


  useEffect(() => {
    if (userInfo) {
      dispatch(get_card_products(userInfo.id));
      dispatch(get_wishlist_products(userInfo.id));
    }
  }, [userInfo]);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="w-full h-[100%] bg-[#F2F2F2] py-1 md:bg-[#F5F5F5]">
      <div className="header-top bg-none md-lg:hidden">
        <div className="w-[85%] lg:w-[90%] mx-auto">
          <div className="flex w-full justify-between items-center h-[30px] text-black">
            <ul className="flex justify-start text-[12px] items-center gap-8">
              <li className="flex relative justify-center items-center gap-2 text-[12px] after:absolute after:h-[18px] after:w-[1px] after:bg-[#afafaf] after:-right-[16px]">
                <span>
                  <GrMail />
                </span>
                <span>ridanexpress@gmail.com</span>
              </li>
              <span>Powered by Ridan</span>
            </ul>
            <div>
              <div className="flex justify-center items-center gap-10">
                <div className="flex justify-center items-center gap-4">
                  <a href="#">
                    <FaFacebookF />
                  </a>
                  <a href="#">
                    <AiOutlineTwitter />
                  </a>
                  <a href="#">
                    <FaLinkedinIn />
                  </a>
                  <a href="#">
                    <AiFillGithub />
                  </a>
                </div>
                <div className="flex group cursor-pointer text-slate-800 text-sm justify-center items-center gap-1 relative after:h-[18px] after:w-[1px] after:bg-bg-[#F5F5F5] after:-right-[16px] after:absolute before:absolute before:h-[18px] before:bg-[#F5F5F5] before:w-[1px] before:-left-[20px]">
                  <img src="images/language.png" alt="" />
                  <span>
                    <MdOutlineKeyboardArrowDown />
                  </span>
                  <ul className="absolute invisible transition-all text-[12px] to-12 rounded-sm duration-200 text-white p-2 w-[100px] flex flex-col gap-3 group-hover:visible group-hover:top-6 group-hover:bg-black z-10">
                    <li>UK English</li>
                    <li>English</li>
                  </ul>
                </div>
                {userInfo ? (
                  <Link
                    className="flex cursor-pointer justify-center items-center gap-2 text-sm"
                    to="/dashboard"
                  >
                    <span>
                      <FaUser />
                    </span>
                    <span>{userInfo.name}</span>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="flex cursor-pointer justify-center items-center gap-2 text-sm"
                  >
                    <span>
                      <FaLock />
                    </span>
                    <span className="text-[12px]">Login</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`${scrolled
          ? "bg-white fixed shadow-lg top-0 py-5"
          : "md:fixed top-0 py-3 bg-white"
          }   z-[9999] w-full`}
      >
        <div className="w-white">
          <div className="w-[85%] lg:w-[90%] mx-auto">
            <div className="h-[40px] md:h-[17px] flex justify-between items-center flex-wrap">
              <div className="md-lg:w-full flex justify-between w-3/12 md-lg:pt-2">
                <div className="flex items-center">
                  <div
                    className="justify-center items-center w-[30px] h-[40px] text-white rounded-sm cursor-pointer lg:hidden md-lg:flex xl:hidden hidden"
                    onClick={() => setShowShidebar(false)}
                  >
                    <span>
                      <FaBars />
                    </span>
                  </div>
                  <Link to="/">
                    <img
                      src="http://localhost:3001/images/logo.png"
                      className="h-[33px] md:h-[19px]"
                      alt="logo"
                    />
                  </Link>
                </div>
                <div className="flex hidden lg:block md:block justify-center items-center gap-1">
                  <div className="flex justify-center gap-1">
                    {userInfo ? (
                      <Link
                        className="flex cursor-pointer justify-center items-center gap-2 text-sm"
                        to="/dashboard"
                      >
                        <span className="text-xl text-orange-500">
                          <FaUser />
                        </span>
                        <span className="md:hidden text-[12px]">{userInfo.name}</span>
                      </Link>
                    ) : (
                      <Link
                        to="/login"
                        className="flex cursor-pointer justify-center items-center gap-2 text-sm"
                      >
                        <div className="flex cursor-pointer justify-center items-center gap-2 text-sm">
                          <span>
                            <FaLock className="text-xl text-orange-500" />
                          </span>
                          <span>Login</span>
                        </div>
                      </Link>
                    )}
                    <div
                      onClick={redirect_card_page}
                      className="relative flex justify-center items-center cursor-pointer w-[35px] h-[35px] rounded-full"
                    >
                      <span className="text-xl text-orange-500">
                        <FaShoppingCart />
                      </span>
                      {card_product_count !== 0 && (
                        <div className="w-[20px] h-[20px] absolute bg-green-500 rounded-full text-white flex justify-center items-center -top-[3px] -right-[5px]">
                          {card_product_count}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="md-lg:w-full w-9/12">
                <div className="flex justify-between md-lg:justify-center items-center flex-wrap pl-8">
                  <ul className="flex justify-start items-start gap-8 text-[14px] font-semibold md-lg:hidden">
                    <li>
                      <Link
                        to="/"
                        className={`p-2 block ${pathname === "/"
                          ? "text-black"
                          : "text-black text-opacity-95"
                          }`}
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/shops"
                        className={`p-2 block ${pathname === "/shop"
                          ? "text-black"
                          : "text-black text-opacity-95 rounded-full"
                          }`}
                      >
                        All products
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/blog"
                        className={`p-2 block ${pathname === "/blog"
                          ? "text-black"
                          : "text-black text-opacity-95"
                          }`}
                      >
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/about"
                        className={`p-2 block ${pathname === "/about"
                          ? "text-black"
                          : "text-black text-opacity-95"
                          }`}
                      >
                        About
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/contact"
                        className={`p-2 block ${pathname === "/contact"
                          ? "text-black"
                          : "text-black text-opacity-95"
                          }`}
                      >
                        Contact
                      </Link>
                    </li>
                  </ul>
                  <div className="flex md-lg:hidden justify-center items-center gap-5">
                    <div className="flex justify-center gap-5">
                      <div
                        onClick={() =>
                          navigate(
                            userInfo ? "/dashboard/my-wishlist" : "/login"
                          )
                        }
                        className="relative flex justify-center items-center cursor-pointer w-[35px] h-[35px] rounded-full bg-[#e2e2e2]"
                      >
                        <span className="text-xl text-red-500">
                          <AiFillHeart />
                        </span>
                        {wishlist_count !== 0 && (
                          <div className="w-[20px] h-[20px] absolute bg-green-500 rounded-full text-white flex justify-center items-center -top-[3px] -right-[5px]">
                            {wishlist_count}
                          </div>
                        )}
                      </div>
                      <div
                        onClick={redirect_card_page}
                        className="relative flex justify-center items-center cursor-pointer w-[35px] h-[35px] rounded-full bg-[#e2e2e2]"
                      >
                        <span className="text-xl text-orange-500">
                          <FaShoppingCart />
                        </span>
                        {card_product_count !== 0 && (
                          <div className="w-[20px] h-[20px] absolute bg-green-500 rounded-full text-white flex justify-center items-center -top-[3px] -right-[5px]">
                            {card_product_count}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden md-lg:block">
          <div
            onClick={() => setShowShidebar(true)}
            className={`fixed duration-200 transition-all ${showShidebar ? "invisible" : "visible"
              } hidden md-lg:block w-screen h-screen bg-[rgba(0,0,0,0.5)] top-0 left-0 z-20`}
          ></div>
          <div
            className={`w-[300px] z-[9999] transition-all duration-200 fixed  ${showShidebar ? "-left-[300px]" : "left-0"
              } top-0 overflow-y-auto bg-white h-screen  px-2`}
          >
            <div className="flex justify-start flex-col gap-6">
              <Link to="/">
                <img src="http://localhost:3001/images/logo.png" alt="logo" />
              </Link>
              <span className="font-bold mt-4">Popular Category</span>

              <ul className=" text-slate-600 font-medium h-full overflow-auto">
                {categorys.map((c, i) => {
                  return (
                    <li
                      key={i}
                      className="flex justify-start mb-3 items-center gap-2 "
                    >
                      <img
                        src={c.image}
                        className="w-[35px] h-[35px] rounded-full overflow-hidden"
                        alt={c.name}
                      />
                      <Link
                        to={`/products?category=${c.name}`}
                        className="text-sm block"
                      >
                        {c.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <span className="font-bold mt-4">Profile</span>

              <div className="flex justify-star items-center gap-10">
                <div className="flex group cursor-pointer text-slate-800 text-sm justify-center items-center gap-1 relative after:h-[18px] after:w-[1px] after:bg-[#afafaf] after:-right-[16px] after:absolute">
                  <img src="http://localhost:3001/images/language.png" alt="" />
                  <span>
                    <MdOutlineKeyboardArrowDown />
                  </span>
                  <ul className="absolute invisible transition-all to-12 rounded-sm duration-200 text-white p-2 w-[100px] flex flex-col gap-3 group-hover:visible group-hover:top-6 group-hover:bg-black z-10">
                    <li>UK English</li>
                    <li>English</li>
                  </ul>
                </div>
                {userInfo ? (
                  <Link
                    className="flex cursor-pointer justify-center items-center gap-2 text-sm"
                    to="/dashboard"
                  >
                    <span>
                      <FaUser />
                    </span>
                    <span>{userInfo.name}</span>
                  </Link>
                ) : (

                  <Link
                    className="flex cursor-pointer justify-center items-center gap-2 text-sm"
                    to="/login">
                    <div className="flex cursor-pointer justify-center items-center gap-2 text-sm">
                      <span>
                        <FaLock />
                      </span>
                      <span>Login</span>
                    </div>

                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-[85%] lg:w-[90%] mx-auto">
          <div className="flex w-full flex-wrap md-lg:gap-8">
            <div className="w-3/12 ">
              <div className="bg-none md:hidden relative">
                <div
                  onClick={() => setCategoryShow(!categoryShow)}
                  className="h-[40px] rounded-full bg-black text-white text-opacity-95 flex justify-center md-lg:justify-between font-semibold md-lg:px-6 mt-4 items-center gap-3 md:gap-1 text-[15px] text-md cursor-pointer"
                >
                  <div className="flex justify-center items-center gap-3">
                    <span>
                      <FaBars />
                    </span>
                    <span>All Categories</span>
                  </div>
                  <span className="pt-1">
                    <MdOutlineKeyboardArrowDown />
                  </span>
                </div>
                <div
                  className={`${categoryShow ? "h-0" : "h-[400px]"
                    } overflow-hidden mt-3 rounded-xl transition-all md-lg:relative duration-500 absolute z-[99999] bg-white w-full border-x`}
                >
                  <ul className="py-2 text-slate-600 font-medium h-full overflow-auto">
                    {categorys.map((c, i) => {
                      return (
                        <li
                          key={i}
                          className="flex justify-start items-center gap-2 px-[24px] py-[6px]"
                        >
                          <img
                            src={c.image}
                            className="w-[35px] h-[35px] rounded-full overflow-hidden"
                            alt={c.name}
                          />
                          <Link
                            to={`/products?category=${c.name}`}
                            className="text-sm block"
                          >
                            {c.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
            <div className="w-9/12 pl-8 md-lg:pl-0 md-lg:w-full ">
              <div className="flex flex-wrap w-full justify-between items-center md-lg:gap-6">
                <div className="w-8/12 md-lg:w-full">
                  <div className="relative flex mt-4 items-center">
                    {/* Text input for text-based search */}
                    <input
                      className="w-full px-4 py-2 border rounded-full focus:outline-none"
                      type="text"
                      placeholder="Trending Cloths"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />                    

                    {/* Search button for text search */}
                    <button
                      onClick={search}
                      className="absolute right-2 bg-black text-white p-2 rounded-full"
                    >
                      <FaSearch />
                    </button>
                  </div>

                </div>
                <div className="w-4/12 block md-lg:hidden pl-2 md-lg:w-full md-lg:pl-0">
                  <div className="w-full flex justify-end md-lg:justify-start gap-3 items-center">
                    <div className="w-[48px] h-[48px] rounded-full flex text-white bg-[#191919] justify-center items-center">
                      <span>
                        <IoIosCall />
                      </span>
                    </div>
                    <div className="flex justify-end flex-col gap-1">
                      <h2 className="text-[12px] font-medium text-black text-opacity-95">
                        +234 803 378 4107
                      </h2>
                      <span className="text-[12px] text-black text-opacity-95">
                        support 24/7 time
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Headers;
