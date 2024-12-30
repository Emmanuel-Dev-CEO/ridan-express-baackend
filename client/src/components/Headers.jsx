import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { GrMail } from "react-icons/gr";
import { Dropdown, Button, HR } from "flowbite-react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import {
  FaLinkedinIn,
  FaFacebookF,
  FaUser,
  FaLock,
  FaSearch,
  FaBars,
  FaShoppingCart,
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
    <div className="w-full bg-orange-500 md:bg-green-500">
      <div className="header-top bg-none md-lg:hidden">
        <div className="w-[85%] lg:w-[90%] mx-auto">
          <div className="flex w-full justify-between items-center h-[35px] text-white font-semibold">
            <ul className="flex justify-start text-[12px] items-center gap-8">
              <li className="flex relative justify-center items-center gap-2 text-[12px] after:absolute after:h-[18px] after:w-[1px] after:bg-[#afafaf] after:-right-[16px]">
                <span>
                  <GrMail />
                </span>
                <span>Sell on ridan</span>
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
        <div >
          <div className="w-[75%] lg:w-[90%] mx-auto">
            <div className="h-[50px] md:h-[70px] flex justify-around items-center flex-wrap">
              <div className="md-lg:w-full flex justify-between w-3/10">
                <div className="flex items-center">
                  <div
                    className="justify-center items-center w-[30px] h-[40px] text-white rounded-sm cursor-pointer lg:hidden md-lg:flex xl:hidden hidden"
                    onClick={() => setShowShidebar(false)}
                  >
                    <span className="text-black">
                      <FaBars />
                    </span>
                  </div>
                  <Link to="/">
                    <img
                      src="http://localhost:3000/images/logo.png"
                      className="h-[33px] md:h-[29px]"
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
                        <span className="text-xl tex-black">
                          <FaUser />
                        </span>
                      </Link>
                    ) : (
                      <Link
                        to="/login"
                        className="flex cursor-pointe justify-center items-center gap-2 text-sm"
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
                      <span className="text-xl text-black">
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
                <div className="flex justify-between md-lg:justify-center items-center flex-wrap">
                  <div className="w-9/12 md-lg:pl-0 md-lg:w-full ">
                    <div className="flex flex-wrap w-full justify-between items-center md-lg:gap-6">
                      <div className="w-8/12 md-lg:w-full">
                        <div className="relative flex items-center">
                          {/* Text input for text-based search */}
                          <input
                            className="w-full px-2 py-2 border rounded-lg md:rounded-full focus:outline-none"
                            type="text"
                            placeholder="Search product, categories and brands"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                          />

                          {/* Search button for text search */}
                          <button
                            onClick={search}
                            className="absolute right-2 bg-orange-400 text-white px-4 py-2 rounded-lg"
                          >
                            <FaSearch />
                          </button>
                        </div>

                      </div>
                      <div className="w-4/12 flex gap-4 block md-lg:hidden pl-12 md-lg:w-full md-lg:pl-0">
                        <Dropdown className="rounded-xl shadow-xl text-orange-500 w-[170px] " color={"orange"} label="Support">
                          <Dropdown.Item as={Link} to="/dashboard">
                            Help center
                          </Dropdown.Item>
                          <Dropdown.Item as={Link} to="/contact">
                            Contact us
                          </Dropdown.Item>
                          <Dropdown.Item as={Link} to="/track-orders">
                            Track my Orders
                          </Dropdown.Item>
                          <Dropdown.Item as={Link} to="/return-policy">
                            Ridan return policy
                          </Dropdown.Item>
                          <Dropdown.Item as={Link} to="/faqs">
                            FAQs
                          </Dropdown.Item>
                        </Dropdown>



                        {userInfo ? (
                          <Dropdown className="rounded-xl shadow-xl w-[170px]" label="Account">
                            <Dropdown.Header>
                              <span className="block text-sm">Hi,</span>
                              <span className="block truncate text-sm font-medium">{userInfo.name}</span>
                            </Dropdown.Header>
                            <Link to="/dashboard"><Dropdown.Item>Dashboard</Dropdown.Item></Link>
                            <Dropdown.Item>Settings</Dropdown.Item>
                            <Dropdown.Item>Track Orders</Dropdown.Item>
                            <Dropdown.Divider />
                            <button className="bg-[#191919] text-center text-bold w-[90%] rounded-lg m-2"><Dropdown.Item className="text-orange-500">Sign out</Dropdown.Item></button>
                          </Dropdown>
                        ) : (
                          <Link
                            to="/login"
                            className="flex cursor-pointer justify-center items-center gap-2 text-sm"
                          >
                            <div className="flex cursor-pointer justify-center items-center gap-2 text-sm">
                              <Button color="dark">Login</Button>
                            </div>
                          </Link>
                        )}


                      </div>
                    </div>
                  </div>
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
            <div className="flex justify-start flex-col gap-1">
              <Link to="/">
                <img
                  src="http://localhost:3000/images/logo.png"
                  className="h-[33px] mt-5"
                  alt="logo"
                />
              </Link>
              <HR />
              <span className="font-bold text-lg pb-4">Popular Category</span>

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

              <span className="font-bold pb-4">Profile</span>

              <div className="flex justify-star items-center gap-10">
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
        <div className="w-[95%] lg:w-[90%] mx-auto">

        </div>
      </div>
    </div>
  );
};

export default Headers;
