import React from "react";
import { StackedCarouselSlideProps } from "react-stacked-center-carousel";
import "./Slide.css";
import testImg from "../../assets/images/testimonials.png";

export const Slide = React.memo(function (StackedCarouselSlideProps) {
  const { data, dataIndex, isCenterSlide, swipeTo, slideIndex } =
    StackedCarouselSlideProps;

  const coverImage = data[dataIndex].image;
  const text = data[dataIndex].text;

  console.log(coverImage);
  return (
    <div className="card-card" draggable={false}>
      <div className={`cover fill ${isCenterSlide ? "off" : "on"}`}>
        <div
          className="card-overlay fill"
          onClick={() => {
            if (!isCenterSlide) swipeTo(slideIndex);
          }}
        />
      </div>
      <div
        className=" p-2 w-full flex flex-col rounded border-2 border-white"
        style={{
          background: "linear-gradient(90deg, #018585, #0e5156 40%)",
        }}
      >
        <div className="grid grid-cols-2 ">
          <div className="flex flex-col gap-1 p-2">
            <h5 className="m-0 text-white font-bold">Aditya Goel</h5>
            <p className="m-0 text-xs text-white">Lawyer, Delhi High Court</p>
          </div>
          <div className="flex justify-end items-end p-2">
            {[1, 2, 3, 4, 5].map((x, index) => (
              <div key={index}>
                <svg
                  className="w-5 h-5"
                  fill="yellow"
                  clip-rule="evenodd"
                  fill-rule="evenodd"
                  stroke-linejoin="round"
                  stroke-miterlimit="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="m11.322 2.923c.126-.259.39-.423.678-.423.289 0 .552.164.678.423.974 1.998 2.65 5.44 2.65 5.44s3.811.524 6.022.829c.403.055.65.396.65.747 0 .19-.072.383-.231.536-1.61 1.538-4.382 4.191-4.382 4.191s.677 3.767 1.069 5.952c.083.462-.275.882-.742.882-.122 0-.244-.029-.355-.089-1.968-1.048-5.359-2.851-5.359-2.851s-3.391 1.803-5.359 2.851c-.111.06-.234.089-.356.089-.465 0-.825-.421-.741-.882.393-2.185 1.07-5.952 1.07-5.952s-2.773-2.653-4.382-4.191c-.16-.153-.232-.346-.232-.535 0-.352.249-.694.651-.748 2.211-.305 6.021-.829 6.021-.829s1.677-3.442 2.65-5.44z"
                    fill-rule="nonzero"
                  />
                </svg>
              </div>
            ))}
          </div>
        </div>
        <hr
          style={{
            margin: "2px",
            height: "0px",
            border: "none",
            borderTop: "2px solid white",
          }}
        />
        <div className="w-full flex justify-center items-center">
          <img src={testImg} />
        </div>
      </div>
    </div>
  );
});
