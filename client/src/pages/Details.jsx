import React, { useEffect, useState } from "react";
import Headers from "../components/Headers";
import { Link, useParams, useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import { Breadcrumb, HR } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import "react-multi-carousel/lib/styles.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useDispatch, useSelector } from "react-redux";
import "swiper/css/pagination";
import { Pagination } from "swiper";
import Ratings from "../components/Ratings";
import Reviews from "../components/Reviews";
import { get_product } from "../store/reducers/homeReducer";
import { Button, Modal } from "flowbite-react";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { FormControl, InputLabel, Select, MenuItem, Box, CircularProgress } from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import axios from 'axios';

import {
  add_to_card,
  messageClear,
  add_to_wishlist,
} from "../store/reducers/cardReducer";
import toast from "react-hot-toast";

const Details = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { product, relatedProducts, moreProducts } = useSelector(
    (state) => state.home
  );
  const [openModal, setOpenModal] = useState(true);
  const { userInfo } = useSelector((state) => state.auth);
  const { errorMessage, successMessage } = useSelector((state) => state.card);
  const [nameLimit, setNameLimit] = useState(null);

  const [states, setStates] = useState([]);
  const [towns, setTowns] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedTown, setSelectedTown] = useState('');
  const [loadingTowns, setLoadingTowns] = useState(false);

  // Fetch states on mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(`/api/states`);
        console.log("API response:", response);
        if (response.data && response.data.states) {
          setStates(response.data.states);
        } else {
          setStates(['']); // Set an empty array if no states are returned
        }
      } catch (error) {
        console.error("Error fetching states:", error);
        setStates([]); // Set an empty array if there's an error
      }
    };
    fetchStates();
  }, []);

  // Fetch towns when a state is selected
  const handleStateChange = async (event) => {
    const state = event.target.value;
    setSelectedState(state);
    setSelectedTown(''); // Reset town when a new state is selected
    setLoadingTowns(true);

    try {
      // Replace `{state_code}` with `state`
      const response = await axios.get(`/api/${state}/towns`);
      if (response.data && response.data.towns) {
        setTowns(response.data.towns);
      } else {
        setTowns([]); // Set an empty array if no towns are returned
      }
    } catch (error) {
      console.error("Error fetching towns:", error);
      setTowns([]); // Set an empty array if there's an error
    } finally {
      setLoadingTowns(false);
    }
  };

  const handleTownChange = (event) => {
    setSelectedTown(event.target.value);
  };


  const [image, setImage] = useState("");
  const [state, setState] = useState("reviews");
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 5,
    },
    mdtablet: {
      breakpoint: { max: 991, min: 464 },
      items: 5,
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 5,
    },
    smmobile: {
      breakpoint: { max: 640, min: 0 },
      items: 4,
    },
    xsmobile: {
      breakpoint: { max: 440, min: 0 },
      items: 4,
    },
  };

  const [quantity, setQuantity] = useState(1);

  const inc = () => {
    if (quantity >= product.stock) {
      toast.error("Out of stock");
    } else {
      setQuantity(quantity + 1);
    }
  };

  const dec = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const add_card = () => {
    if (userInfo) {
      dispatch(
        add_to_card({
          userId: userInfo.id,
          quantity,
          productId: product._id,
        })
      );
    } else {
      navigate("/login");
    }
  };

  const add_wishlist = () => {
    if (userInfo) {
      dispatch(
        add_to_wishlist({
          userId: userInfo.id,
          productId: product._id,
          name: product.name,
          price: product.price,
          whatsapp: product.whatsapp,
          location: product.location,
          image: product.images[0],
          discount: product.discount,
          rating: product.rating,
          slug: product.slug,
        })
      );
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    dispatch(get_product(slug));
  }, [dispatch, slug]);
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
  }, [dispatch, errorMessage, successMessage]);

  const buy = () => {
    let price = 0;
    if (product.discount !== 0) {
      price =
        product.price - Math.floor((product.price * product.discount) / 100);
    } else {
      price = product.price;
    }
    const obj = [
      {
        sellerId: product.sellerId,
        shopName: product.shopName,
        shopImage: product.shopImage,
        price: quantity * (price - Math.floor((price * 5) / 100)),
        products: [
          {
            quantity,
            productInfo: product,
          },
        ],
      },
    ];
    navigate("/shipping", {
      state: {
        products: obj,
        price: price * quantity,
        shipping_fee: 85,
        items: 1,
      },
    });
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setNameLimit(10);
      } else {
        setNameLimit(null);
      }
    };


    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const productName = product?.name || "";

  // Function to generate product URL
  const generateProductUrl = (product) => {
    const baseDomain = "http://localhost:3000"; // Replace with your actual domain
    const productCategory = encodeURIComponent(product.category);
    const productName = encodeURIComponent(product.name);
    const productId = product._id;

    // Base URL
    const baseUrl = `${baseDomain}/${productCategory}/${productName}-${productId}.html`;

    // Query parameters
    const page = 1;
    const pos = 1;
    const adsPerPage = 23;
    const adsCount = 56742;
    const lid = "sampleListingId";
    const indexPosition = product.indexPosition || 1;

    // Construct the full URL with query parameters
    const fullUrl = `${baseUrl}?page=${page}&pos=${pos}&ads_per_page=${adsPerPage}&ads_count=${adsCount}&lid=${lid}&indexPosition=${indexPosition}`;

    return fullUrl;
  };

  const openWhatsApp = () => {
    const phoneNumber = `+234${product.whatsapp}`;
    const productName = product.name;
    const productPrice = product.price;
    const productLink = generateProductUrl(product); // Generate product URL

    const message = encodeURIComponent(
      `Hello! I got your contact from *Ridan Express* and I want to order the following product:\n\n` +
      `*Product Name:* ${productName}\n` +
      `*Product Name:* ${productPrice}\n` +
      `*Product Link:* ${productLink}`
    );

    // URL to open in WhatsApp app
    const appUrl = `whatsapp://send?phone=${phoneNumber}&text=${message}`;

    const webUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    const isAppOpened = window.open(appUrl, "_blank");

    if (!isAppOpened) {
      window.open(webUrl, "_blank");
    }
  };

  return (
    <div className="bg-gray-100 md:mt-[110px]">
      <Headers />
      <div className="bg-slate-100 py-2 mb-5 md:mb-1">
        <div className="w-[85%] md:w-[100%] sm:w-[100%] lg:w-[100%] h-full mx-auto md:mx-0">
          <Breadcrumb aria-label="breadcrumb" className="px-5 dark:bg-gray-800">
            <Breadcrumb.Item href="/">
              <HiHome className="text-orange-400 mr-1 text-lg" /> Home
            </Breadcrumb.Item>
            <Breadcrumb.Item href="#">{product?.category || "Unknown Category"}</Breadcrumb.Item>
            <Breadcrumb.Item>
              {/* Only truncate on mobile screens */}
              {nameLimit && productName.length > nameLimit
                ? `${productName.substring(0, nameLimit)}...`
                : productName}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <section>
        <div className="w-[85%] md:w-[100%] sm:w-[100%] lg:w-[90%] mx-auto md:mx-0 pb-8 md:pb-1">
          <div className="grid grid-cols-3 md:grid-cols-1">
            <div className="w-full h-[400px] ">
              <div className=" bg-white p-2 h-[400px]">
                <img
                  className="rounded-[15px] h-full w-full h-full object-cover"
                  src={image ? image : product.images?.[0]}
                  alt={product.name}
                />
              </div>
              <div className="md:py-3 bg-white md:mx-auto md:w-[90%]">
                {product.images && (
                  <Carousel
                    autoPlay={true}
                    infinite={true}
                    swipeable={true}
                    draggable={true}
                    responsive={responsive}
                    transitionDuration={200}
                    className="mt-2"
                  >
                    {product.images.map((img, i) => {
                      return (
                        <div className="my-2 ml-2 border border-orange-400 rounded-[10px] md:rounded-full md:my-0" key={i} onClick={() => setImage(img)}>
                          <img
                            className="h-[60px] w-full md:h-[80px] rounded-[10px] md:rounded-full cursor-pointer object-cover"
                            src={img}
                            alt=""
                          />
                        </div>
                      );
                    })}
                  </Carousel>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-5 md:mt-20 bg-white p-6 md:p-6 ">
              <div className="flex flex-col gap-2 md:mt-5">
                <h1 className="text-lg font-light text-[#191919]">
                  {product.name}
                </h1>
                <h3 className="font-light">Brand: <span className="text-orange-400 font-normal">{product.brand}</span></h3>
                <div className="text-lg text-[#191919] font-semibold">
                  {product.discount !== 0 ? (
                    <>
                      NGN {(product.price -
                        Math.floor((product.price * product.discount) / 100)).toLocaleString()}
                      <span className="text-sm line-through font-light text-gray-500 ml-2">
                        NGN {product.price}
                      </span>
                      <span className="text-sm text-orange-500 font-light bg-orange-100 p-1 rounded-sm ml-2">
                        -{product.discount}%
                      </span>
                    </>
                  ) : (
                    <>₦{product.price}</>
                  )}
                </div>
                {product.discount !== 0 && (
                  <div className="text-sm text-green-600">
                    Save {product.discount}% today!
                  </div>
                )}
              </div>
              <p className=" text-sm text-gray-600">{product.description}</p>
              <p className=" text-sm font-semibold text-gray-600">
                Delivery from: <span>{product.location}</span>
              </p>
              <div className="flex items-center gap-2">
                <Ratings ratings={product.rating} />
                <span className="text-green-400 text-sm">(Product review)</span>
              </div>
              <div className="text-gray-600 flex items-center gap-3 font-medium">
                <span>Availability:</span>
                {product.stock > 0 ? (
                  <span className="text-green-400 ml-2">In stock ({product.stock})</span>
                ) : (
                  <span className="text-red-500 ml-2">Out of stock</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex w-[100%] items-center bg-white border border-gray-400 p-2 rounded-full">
                  <button
                    className=" w-[100%] h-[100%] font-xl border-r-2 ml-1 border-gray-400 text-black"
                    onClick={dec}
                  >
                    -
                  </button>
                  <span className="px-4">{quantity}</span>
                  <button
                    className=" w-[100%] h-[100%] border-l-2 ml-1 border-gray-400 text-black"
                    onClick={inc}
                  >
                    +
                  </button>
                </div>
                <button
                  className=" rounded-full bg-white p-3 border border-red-400 active:bg-pink-500"
                  onClick={add_card}
                >
                  <ShoppingCartCheckoutIcon />
                </button>
                <button
                  className=" rounded-full bg-white p-3 border border-red-400 active:bg-pink-500"
                  onClick={add_wishlist}
                >
                  <FavoriteBorderIcon className="text-red-400" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                {product.stock ? (
                  <button
                    onClick={buy}
                    className="px-2 py-3 h-fit cursor-pointer rounded-full w-full bg-orange-400 md:text-sm text-white"
                  >
                    Buy Now
                  </button>
                ) : (
                  ""
                )}
                <Link
                  to={`/dashboard/chat/${product.sellerId}`}
                  className="px-2 py-3 h-fit cursor-pointer rounded-full md:text-sm w-full text-center bg-green-500 text-white block"
                >
                  Chat Seller
                </Link>

                <button onClick={openWhatsApp} className=" rounded-full bg-white p-3 text-green-500 border border-gray-400 active:bg-green-100">
                  <WhatsAppIcon />
                </button>

              </div>
            </div>
            <div className=" w-[400px] md:w-full ml-5 md:ml-0 h-[100%]">
              <div className="bg-white p-4 rounded-md mb-1">
                <h2 className="text-sm font-light md:font-semibold text-[#191919]"> DELIVERY POLICY </h2>
                <HR />
                <p className="text-[#191919] text-sm">
                  Free delivery on thousands of products in Lagos, Anambra, Ibadan & Abuja <a className="text-sm text-orange-400 hover:cursor-pointer" onClick={() => setOpenModal(true)}>Details</a>
                </p>
                <Modal className="md:mt-20" show={openModal} onClose={() => setOpenModal(false)}>
                  <Modal.Header>Terms of Service</Modal.Header>
                  <Modal.Body>
                    <div className="space-y-6 ">
                      <h2 className="font-bold flex item-center text-gray-500">NOTE <WarningAmberOutlinedIcon /></h2>
                      <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                        With less than a month to go before the European Union enacts new consumer privacy laws for its citizens,
                        companies around the world are updating their terms of service agreements to comply.
                      </p>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button onClick={() => setOpenModal(false)}>I Understand</Button>
                  </Modal.Footer>
                </Modal>
              </div>

              <div className="bg-white p-4 rounded-md">
                <h2 className="text-sm font-light md:font-semibold text-[#191919]">Choose Your Location</h2>
                <br />

                <Box display="flex" flexDirection="column" gap={2} width="300px">
                  {/* State Dropdown */}
                  <FormControl fullWidth>
                    <InputLabel id="state-label">Choose State</InputLabel>
                    <Select
                      labelId="state-label"
                      id="state"
                      value={selectedState}
                      label="Choose State"
                      onChange={handleStateChange}
                    >
                      {states.length > 0 ? (
                        states.map((state) => (
                          <MenuItem key={state} value={state}>
                            {state}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No states available</MenuItem>
                      )}
                    </Select>
                  </FormControl>

                  {/* Town Dropdown */}
                  <FormControl fullWidth disabled={!selectedState}>
                    <InputLabel id="town-label">Choose Town</InputLabel>
                    <Select
                      labelId="town-label"
                      id="town"
                      value={selectedTown}
                      label="Choose Town"
                      onChange={handleTownChange}
                    >
                      {loadingTowns ? (
                        <MenuItem disabled>
                          <CircularProgress size={24} />
                        </MenuItem>
                      ) : towns.length > 0 ? (
                        towns.map((town) => (
                          <MenuItem key={town} value={town}>
                            {town}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No towns available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Box>
                <HR />
                <h2 className="text-sm font-light md:font-semibold text-[#191919]">PICKUP DETAILS <a className="text-orange-400" href="#">Details</a></h2>
                <br />
                <ul>

                  <div className="flex gap-2 mb-4">
                    <div className="border boder-1 border-orange-200 rounded-full h-fit p-3">
                      <LocalShippingOutlinedIcon className=" text-orange-400 " />
                    </div>
                    <div className="flex flex-col ">
                      <li className="text-stone-600 flex item-center gap- mb-1 text-sm"> Delivery fee: <b>NGN 850</b></li>
                      <li className="text-stone-600 text-sm">Arival will depend on the <b>seller</b>, Do well to message the <b>product seller</b>.
                      </li>
                    </div>
                  </div>
                  <div className="flex gap-2 mb-4">
                    <div className="border boder-1 border-orange-200 rounded-full h-fit p-3">
                      <LocalShippingOutlinedIcon className=" text-orange-400 " />
                    </div>
                    <div className="flex flex-col">
                      <li className="text-stone-600 flex item-center gap- mb-1 text-sm"> Delivery fee: <b>NGN 850</b></li>
                      <li className="text-stone-600 text-sm">Arival will depend on the <b>seller</b>, Do well to message the <b>product seller</b>.
                      </li>
                    </div>
                  </div>

                </ul>

              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container bg-white p-3 md:px-5 rounded-xl md:rounded-none mx-auto w-[85%] md:w-[100%] lg:w-[90%] h-fit pb-16">
          <div className="flex flex-wrap">
            {/* Left Section */}
            <div className="w-[72%] md-lg:w-full mb-8">
              <div className="pr-4 md-lg:pr-0">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {/* Reviews Button */}
                  <button
                    onClick={() => setState("reviews")}
                    className={`py-2 px-5 text-sm font-semibold transition duration-300 rounded-md ${state === "reviews"
                      ? "bg-green-600 text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-green-500 hover:text-white"
                      }`}
                  >
                    Reviews
                  </button>
                  {/* Description Button */}
                  <button
                    onClick={() => setState("description")}
                    className={`py-2 px-5 text-sm font-semibold transition duration-300 rounded-md ${state === "description"
                      ? "bg-green-600 text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-green-500 hover:text-white"
                      }`}
                  >
                    Description
                  </button>
                </div>

                {/* Content Section */}
                <div>
                  {state === "reviews" ? (
                    <Reviews product={product} />
                  ) : (
                    <p className="py-5 text-gray-600">{product.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="w-[28%] md-lg:w-full mb-8">
              <div className="pl-4 md-lg:pl- bg-white p-3 rounded-lg">
                {/* Seller Title */}
                <h2 className="text-sm font-light md:font-semibold mb-1 text-orange-500"> ABOUT THE SELLER</h2>

                {/* Seller Name and Logo */}
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full mr-4 bg-gray-200 flex items-center justify-center text-lg font-semibold text-white">
                    {product?.shopImage ? (
                      <img
                        src={product.shopImage}
                        alt={`${product.name || 'Seller'} Logo`}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-800">{product?.shopName?.charAt(0).toUpperCase() || 'S'}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-700 text-md">{product.shopName}</p>
                    <p className="text-sm text-gray-500">Joined: {product.joinedDate}</p>
                  </div>
                </div>

                {/* Seller Ratings */}
                <div className="flex items-center mb-4">
                  <Ratings ratings={product.rating} />
                  <span className="ml-2 text-gray-700 font-semibold">
                    {product.rating} / 5.0 ({product.totalReviews} Reviews)
                  </span>
                </div>

                {/* Seller Contact Button */}
                <a
                  onClick={openWhatsApp}
                  className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out"
                >
                  <WhatsAppIcon className="mr-2 text-lg" />
                  Contact on WhatsApp
                </a>

                {/* Location & Response Time */}
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2"><span className="font-semibold">Location:</span> {product.location}</p>
                  <p className="text-sm text-gray-500"><span className="font-semibold">Response Time:</span> {product.responseTime} hrs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >
      {/* 
      Related Products Section
      <section>
        <div className="container mx-auto w-[85%] sm:w-[90%] lg:w-[90%] h-full">
          <h2 className="text-2xl py-8 text-gray-700">Related Products</h2>
          <Swiper
            slidesPerView="auto"
            breakpoints={{
              1280: { slidesPerView: 3 },
              565: { slidesPerView: 2 },
            }}
            spaceBetween={25}
            loop={true}
            pagination={{ clickable: true, el: ".custom_bullet" }}
            modules={[Pagination]}
            className="mySwiper"
          >
            {relatedProducts.map((p, i) => (
              <SwiperSlide key={i}>
                <Link className="block">
                  <div className="relative h-[270px] group">
                    <img className="w-full h-full object-cover rounded-md" src={p.images[0]} alt={p.name} />
                    <div className="absolute inset-0 bg-black bg-opacity-25 group-hover:bg-opacity-50 transition duration-300"></div>
                    {p.discount !== 0 && (
                      <div className="absolute top-2 left-2 w-[38px] h-[38px] flex items-center justify-center bg-red-500 text-white rounded-full font-semibold text-xs">
                        -{p.discount}%
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col gap-1">
                    <h2 className="text-gray-700 text-lg font-semibold">{p.name}</h2>
                    <div className="flex gap-3 items-center">
                      <h2 className="text-blue-500 text-lg font-bold">${p.price}</h2>
                      <Ratings ratings={p.rating} />
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="w-full flex justify-center items-center py-10">
            <div className="custom_bullet flex gap-3"></div>
          </div>
        </div>
      </section> */}

    </div >
  );
};

export default Details;
