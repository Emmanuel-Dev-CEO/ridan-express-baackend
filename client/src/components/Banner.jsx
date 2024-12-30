import React from "react";
import { Carousel as FlowbiteCarousel } from "flowbite-react";
import { get_banners } from "../store/reducers/homeReducer";
import { useEffect } from "react";
import { /* useSelector */ useDispatch } from "react-redux";

const Banner = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(get_banners());
  }, [dispatch]);

  return (
    <div className="flex item-center ml-[100px] md:ml-[5px] md:flex-wrap md:mt-[100px] mx-20 md:mx-1 max-w-screen-xl">
      {/* Carousel Section */}
      <div className="h-[365px] w-[800px] md:w-[100%] md:h-[180px] md:mt-4 mt-3 ml-[45px] md:ml-[14px] mx-4 rounded-xl bg-black overflow-hidden">
        <FlowbiteCarousel slideInterval={5000} indicators={true} arrows={true}>
          <img
            className="h-full"
            src="https://ng.jumia.is/cms/0-0-black-friday/2024/initiatives/Untitled-3.gif"
            alt="..."
          />
          <img
            className="h-full"
            src="https://ng.jumia.is/cms/0-0-black-friday/2024/User_need/home-deals/home-DesktopHomepageSlider_712x384.png"
            alt="..."
          />
          <img
            className="h-full"
            src="https://ng.jumia.is/cms/0-0-black-friday/2024/Artboard-1.gif"
            alt="..."
          />
          {/* <img
            className="h-full"
            src="../images/banner/White and Green Simple Christmas Sale Outdoor Banner.jpg"
            alt="..."
          /> */}

        </FlowbiteCarousel>
      </div>

      {/* Grid Section */}
      <div className="grid  grid-cols-2 mr-[50px] md:mr-[15px] md:grid-cols-4 gap-2 md:gap-1 m-3">
        <img
          className="object-cover rounded-lg w-[200px] h-[180px] md:h-[110px] md:w-full"
          src="https://www-konga-com-res.cloudinary.com/image/upload/w_300,f_auto,fl_lossy,dpr_1.0,q_auto/v1721217481/contentservice/box%20banner.png_6YtnUQEK6.png"
          alt="Grid 1"
        />
        <img
          className="object-cover rounded-lg  w-[200px] h-[180px]  md:h-[110px] md:w-full"
          src="https://www-konga-com-res.cloudinary.com/image/upload/w_300,f_auto,fl_lossy,dpr_1.0,q_auto/v1714910034/contentservice/access%20new.png_r19IQgHfC.png"
          alt="Grid 2"
        />
        <img
          className="object-cover rounded-lg  w-[200px] h-[180px] md:h-[110px] md:w-full"
          src="https://www-konga-com-res.cloudinary.com/image/upload/w_300,f_auto,fl_lossy,dpr_1.0,q_auto/v1724314744/contentservice/image%20%281%29.png_UzlEcf8H0.png"
          alt="Grid 3"
        />
        <img
          className="object-cover rounded-lg  w-[200px] h-[180px] md:h-[110px] md:w-full"
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
