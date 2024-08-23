import React from "react";
import {
  StackedCarousel,
  ResponsiveContainer,
} from "react-stacked-center-carousel";
import "./Slide.css";
import { Slide } from "./Slider";

// const data = [1, 2, 3, 4, 5, 6];

const data = [
  {
    image: "https://picsum.photos/200/300/?random=1",
    text: "hello",
  },
  {
    image: "https://picsum.photos/200/300/?random=12",
    text: "lel",
  },
  {
    image: "https://picsum.photos/200/300/?random=13",
    text: "kak",
  },
  {
    image: "https://picsum.photos/200/300/?random=15",
    text: "kk",
  },
  {
    image: "https://picsum.photos/200/300/?random=10",
    text: "hello",
  },
];

const TestimonialCard = () => {
  const ref = React.useRef();
  return (
    <div className="card" style={{ background: "transparent", border: "none" }}>
      <div style={{ position: "relative" }}>
        <ResponsiveContainer
          carouselRef={ref}
          render={(parentWidth, carouselRef) => {
            let currentVisibleSlide = 5;
            if (parentWidth <= 1440) currentVisibleSlide = 5;
            else if (parentWidth <= 1080) currentVisibleSlide = 3;
            return (
              <StackedCarousel
                ref={carouselRef}
                slideComponent={Slide}
                slideWidth={450}
                height={400}
                carouselWidth={parentWidth}
                data={data}
                maxVisibleSlide={5}
                disableSwipe
                currentVisibleSlide={currentVisibleSlide}
                // customScales={[1, 0.85, 0.7, 0.55]}
                // transitionTime={450}
              />
            );
          }}
        />
        <svg
          className="card-button left cursor-pointer"
          onClick={() => ref.current?.goBack()}
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
        </svg>
        <svg
          className="card-button right cursor-pointer"
          onClick={() => ref.current?.goNext()}
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z" />
        </svg>
      </div>
    </div>
  );
};

export default TestimonialCard;
