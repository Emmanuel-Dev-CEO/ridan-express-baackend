import React from "react";
import { Carousel as FlowbiteCarousel } from "flowbite-react";
// import Carousel from 'react-multi-carousel';
// import 'react-multi-carousel/lib/styles.css';
import { Link } from "react-router-dom";
import { get_banners } from "../store/reducers/homeReducer";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const Banner = () => {
  const dispatch = useDispatch();
  const { banners } = useSelector((state) => state.home);
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  useEffect(() => {
    dispatch(get_banners());
  }, []);

  return (
    <div className="flex md:flex-wrap md:mt-[100px] mx-auto max-w-screen-xl">
      {/* Carousel Section */}
      <div className="h-[360px] w-[80%] md:h-[170px] my-4 ml-[15px] mx-4 rounded-xl bg-black overflow-hidden">
        <FlowbiteCarousel slideInterval={5000} indicators={true} arrows={true}>
          <img
            className="h-full"
            src="https://www-konga-com-res.cloudinary.com/image/upload/w_1100,f_auto,fl_lossy,dpr_auto,q_auto/v1726645095/contentservice/back2school%20new%20banner.png_n-9hGKMCx.png"
            alt="..."
          />
          <img
            className="h-full"
            src="https://www-konga-com-res.cloudinary.com/image/upload/w_1100,f_auto,fl_lossy,dpr_auto,q_auto/v1727029760/contentservice/REV_bigi_water_KONGA_ad.jpg_hUgO96RlF.jpg"
            alt="..."
          />
          
        </FlowbiteCarousel>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 m-5">
        <img
          className="object-cover rounded-lg w-[250px] h-[170px] md:h-[110px] md:w-full"
          src="https://www-konga-com-res.cloudinary.com/image/upload/w_300,f_auto,fl_lossy,dpr_1.0,q_auto/v1721217481/contentservice/box%20banner.png_6YtnUQEK6.png"
          alt="Grid 1"
        />
        <img
          className="object-cover rounded-lg w-[250px] h-[170px] md:h-[110px] md:w-full"
          src="https://www-konga-com-res.cloudinary.com/image/upload/w_300,f_auto,fl_lossy,dpr_1.0,q_auto/v1714910034/contentservice/access%20new.png_r19IQgHfC.png"
          alt="Grid 2"
        />
        <img
          className="object-cover rounded-lg w-[250px] h-[170px] md:h-[110px] md:w-full"
          src="https://www-konga-com-res.cloudinary.com/image/upload/w_300,f_auto,fl_lossy,dpr_1.0,q_auto/v1724314744/contentservice/image%20%281%29.png_UzlEcf8H0.png"
          alt="Grid 3"
        />
        <img
          className="object-cover rounded-lg w-[250px] h-[170px] md:h-[110px] md:w-full"
          src="https://www-konga-com-res.cloudinary.com/image/upload/w_300,f_auto,fl_lossy,dpr_1.0,q_auto/v1693212058/contentservice/Bulky.jpg_ByGspCKTn.jpg"
          alt="Grid 4"
        />
      </div>
    </div>
  );
  // return (
  //     <div className='w-full md-lg:mt-6'>
  //         <div className='w-[85%] lg:w-[90%] mx-auto'>
  //             <div className='w-full flex flex-wrap md-lg:gap-8'>
  //                 <div className='w-full'>
  //                     <div className='my-8'>
  //                         <Carousel
  //                             autoPlay={true}
  //                             infinite={true}
  //                             arrows={true}
  //                             showDots={true}
  //                             responsive={responsive}
  //                         >
  //                             {
  //                                 banners.length > 0 && banners.map((b, i) => <Link className='lg-md:h-[440px] h-auto w-full block' key={i} to={`/product/details/${b.link}`}>
  //                                     <img src={b.banner} alt="" />
  //                                 </Link>)
  //                             }
  //                         </Carousel>
  //                     </div>
  //                 </div>
  //             </div>
  //         </div>
  //     </div>
  // )
};

export default Banner;
