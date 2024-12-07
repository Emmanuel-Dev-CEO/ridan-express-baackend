import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Categorys = () => {
  const { categorys = [] } = useSelector((state) => state.home);
  const navigate = useNavigate();
  const carouselRef = useRef(null);

  const handleSubmit = (category) => {
    navigate(`/products?category=${category.name}`);
  };

  // Auto-scroll logic
  useEffect(() => {
    const carousel = carouselRef.current;

    // Set auto-scroll interval
    const autoScroll = setInterval(() => {
      if (carousel) {
        const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
        if (carousel.scrollLeft >= maxScrollLeft) {
          carousel.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          carousel.scrollBy({ left: 210, behavior: "smooth" });
        }
      }
    }, 3000);

    return () => clearInterval(autoScroll);
  }, []);

  return (
    <div className="w-11/12 md:w-full overflow-x-scroll overflow-y-hidden mx-auto bg-white mx-8 md:p-1 rounded-lg shadow-sm">
      <div className="text-center flex justify-between rounded-t-xl md:rounded-t-[5px] items-start bg-[#191919] md:bg-white flex-row p-2 text-xl md:text-lg text-white font-semibold relative">
        <h2 className="text-lg md:text-lg text-white md:text-orange-500 font-semibold">Shop By Category</h2>
      </div>

      <div
        ref={carouselRef}
        className="flex custom-scrollbar m-4 md:m-1 space-x-2"
      >
        {categorys.length > 0 ? (
          categorys.map((category) => (
            <div
              key={category.id}
              className="w-[150px] h-[170px] md:w-[120px] md:h-[130px] flex-shrink-0 flex flex-col items-center justify-center rounded-lg shadow-sm cursor-pointer"
              onClick={() => handleSubmit(category)}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-[125px] h-[125px] md:h-[70px] md:w-[70px] object-cover rounded-full transition-transform transform hover:scale-105 hover:shadow-xl"
              />
              <h5 className="text-[15px] md:text-[12px] font-semibold text-gray-600 text-center mt-2">
                {category.name}
              </h5>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            Loading..
          </p>
        )}
      </div>

    </div>
  );
};

export default Categorys;
