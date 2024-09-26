import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Categorys = () => {
  const { categorys = [] } = useSelector((state) => state.home);
  const navigate = useNavigate();
  const carouselRef = useRef(null); // Create a ref for the carousel container

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
          carousel.scrollTo({ left: 0, behavior: "smooth" }); // Go back to the start when reaching the end
        } else {
          carousel.scrollBy({ left: 210, behavior: "smooth" }); // Scroll right by 150px
        }
      }
    }, 3000); // Scroll every 3 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(autoScroll);
  }, []);

  return (
    <div className="w-13/14 mx-auto bg-[#FFFFFF] mx-8 md:p-6 rounded-lg shadow-sm">
      {/* Heading Section */}
      <div className="bg-[#191919] rounded-t-xl mb-8 p-2">
        <h2 className="text-xl md:text-xl text-white font-semibold">
          Shop by Category
        </h2>
      </div>

      {/* Scrollable Carousel Section */}
      <div
        ref={carouselRef} // Attach ref to the scrollable container
        className="flex overflow-x-scroll overflow-y-hidden m-4  no-scrollbar space-x-4"
      >
        {categorys.length > 0 ? (
          categorys.map((category) => (
            <div
              key={category.id}
              className="min-w-[160px] hover:bg-gray-200 mb-4 rounded-lg shadow-sm flex flex-col items-center justify-center cursor-pointer transition-transform transform hover:scale-105 hover:shadow-xl"
              onClick={() => handleSubmit(category)}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-29 h-29 md:w-20 md:h-20 object-cover rounded-lg mb-4"
              />
              <h5 className="text-[15px] md:text-base font-semibold text-gray-800 text-center">
                {category.name}
              </h5>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No categories available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Categorys;
