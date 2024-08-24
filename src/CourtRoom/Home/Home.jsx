import React, { useState } from "react";
import courtroom from "../../assets/images/Courtroom.png";
import feature1 from "../../assets/images/image 2.png";
import feature2 from "../../assets/images/image 3.png";
import feature3 from "../../assets/images/image 4.png";
import laptop from "../../assets/images/image 1.png";
import submitCase from "../../assets/images/SubmitYourCase.mp4";
import argumentDraft from "../../assets/images/GetArgument.mp4";
import frameCase from "../../assets/images/FrameYourCase.mp4";
import mainIntro from "../../assets/images/mainIntro.mp4";
import plus from "../../assets/images/Group 53.png";
import Styles from "./CourtRoomHome.module.css";
import arrw from "../../assets/images/Vector 1.png";
import { Link, useNavigate } from "react-router-dom";

import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TestimonialCard from "./Testimonial";
import OtpCard from "./OtpCard";
import { useSelector } from "react-redux";

function SampleNextArrow(props) {
  const { className, style } = props;
  return <div className={className} style={{ ...style, display: "none" }} />;
}

function SamplePrevArrow(props) {
  const { className, style } = props;
  return <div className={className} style={{ ...style, display: "none" }} />;
}

function Home() {
  const user = useSelector((state) => state.user.user);
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();

  if (user) {
    navigate("/courtroom-ai/");
  }

  return (
    <motion.div
      // whileHover="hover"
      // onHoverStart={() => setSubmitHover(true)}
      // onHoverEnd={() => setSubmitHover(false)}
      className={Styles.mainContainer}
    >
      {/* top container */}
      <div className="grid md:grid-cols-2 my-20">
        <div className="pl-40 flex flex-col items-end">
          <h1 className="text-2xl text-start">
            Welcome to{" "}
            <span className="text-3xl font-bold"> Aditya Goel's</span>
          </h1>
          <h1 className="text-6xl font-bold text-[#00AFAF]">AI Courtroom</h1>
          <p className="text-gray-400 font-semibold pl-64">
            Powered By <span className="text-white font-bold"> CLAW</span>
          </p>
        </div>
        <div className=" px-28">
          <OtpCard />
        </div>
      </div>

      {/* 3rd container       */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-center gap-[345px] md:gap-[700px]">
          <img alt="plus" src={plus} style={{ width: 20, height: 20 }} />
          <img alt="plus" src={plus} style={{ width: 20, height: 20 }} />
        </div>
        <div className="flex justify-center items-center">
          <div
            className="relative md:h-[400px] w-max"
            // style={{ height: "400px", width: "max-content" }}
          >
            <img
              alt="courtRoom Preiview"
              src={laptop}
              style={{ borderRadius: 0, width: "100%", height: "100%" }}
            />
            <video
              className="absolute -top-[0.85rem] md:-top-5 w-full h-full flex justify-center items-center p-[1.5rem] md:p-9 rounded-xl"
              src={mainIntro}
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </div>
        <div className="flex justify-center gap-[345px] md:gap-[700px]">
          <img alt="plus" src={plus} style={{ width: 20, height: 20 }} />
          <img alt="plus" src={plus} style={{ width: 20, height: 20 }} />
        </div>
      </div>

      <div className="w-full flex justify-center items-center">
        <img
          alt="arrow"
          src={arrw}
          style={{ borderRadius: 0, width: "40%", height: "100%" }}
        />
      </div>

      <motion.div
        // whileHover="hover"
        // onHoverStart={() => setSubmitHover(true)}
        // onHoverEnd={() => setSubmitHover(false)}
        className="flex flex-col-reverse gap-3 md:flex-row mt-[150px] mx-10 items-center"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <motion.h1
            initial={{ y: -60 }}
            // variants={{
            //   view: { y: 0 },
            // }}
            whileInView={{ y: 0 }}
            transition={{
              y: { type: "tween", duration: 0.8 },
            }}
          >
            SUBMIT YOUR CASE
          </motion.h1>
          <motion.h5
            className="text-[#B7B2B2]"
            initial={{ opacity: 0 }}
            // variants={{
            //   hover: { opacity: 1 },
            // }}
            whileInView={{ opacity: 1 }}
            transition={{
              x: { type: "slide", duration: 1 },
            }}
          >
            Add case details in the format of courtroom judgement , statement of
            claim, statement of defence, filed application or details from
            client's perspective.
          </motion.h5>
        </div>
        <motion.div
          initial={{ x: "50%" }}
          // variants={{
          //   hover: { x: "0%" },
          // }}
          whileInView={{ x: "0%" }}
          transition={{ type: "spring", stiffness: 120, damping: 10 }}
        >
          <div
            className="flex justify-center items-center"
            // style={{ display: "grid", placeItems: "center", cursor: "pointer" }}
          >
            <div className="relative md:h-[400px] md:w-max">
              <img
                alt="courtRoom Preiview"
                src={laptop}
                style={{ borderRadius: 0, width: "100%", height: "100%" }}
              />
              <video
                className="absolute -top-[0.85rem] md:-top-5 w-full h-full flex justify-center items-center p-[1.5rem] md:p-9 rounded-xl"
                src={submitCase}
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div className="flex flex-col gap-3 md:flex-row mt-[150px] mx-10 items-center">
        <motion.div
          initial={{ x: "-50%" }}
          whileInView={{ x: "0%" }}
          transition={{ type: "spring", stiffness: 120, damping: 10 }}
        >
          <div className="flex justify-center items-center">
            <div className="relative md:h-[400px] md:w-max">
              <img
                alt="courtRoom Preiview"
                src={laptop}
                style={{ borderRadius: 0, width: "100%", height: "100%" }}
              />
              <video
                className="absolute -top-[0.85rem] md:-top-5 w-full h-full flex justify-center items-center p-[1.5rem] md:p-9 rounded-xl"
                src={argumentDraft}
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>
        </motion.div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <motion.h1
            initial={{ y: -60 }}
            whileInView={{ y: 0 }}
            transition={{
              y: { type: "tween", duration: 0.8 },
            }}
          >
            GET THE ARGUMENT'S DRAFT
          </motion.h1>
          <motion.h5
            style={{ color: "#B7B2B2" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{
              x: { type: "slide", duration: 1 },
            }}
          >
            Get a first draft of arguments, potential counter arguments,
            judgement scores and explanations and verdict from 4 different Point
            of Views
          </motion.h5>
        </div>
      </motion.div>

      <motion.div className="flex flex-col-reverse gap-3 md:flex-row mt-[150px] mx-10 items-center">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <motion.h1
            initial={{ y: -60 }}
            whileInView={{ y: 0 }}
            transition={{
              y: { type: "tween", duration: 0.8 },
            }}
          >
            FRAME YOUR CASE AND WIN
          </motion.h1>
          <motion.h5
            style={{ color: "#B7B2B2" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{
              x: { type: "slide", duration: 1 },
            }}
          >
            Frame and finetune your arguments to turn the weights in your favor
            until you are able to crack the verdict of your choice
          </motion.h5>
        </div>
        <motion.div
          initial={{ x: "50%" }}
          whileInView={{ x: "0%" }}
          transition={{ type: "spring", stiffness: 120, damping: 10 }}
        >
          <div className="flex justify-center items-center">
            <div className="relative md:h-[400px] md:w-max">
              <img
                alt="courtRoom Preiview"
                src={laptop}
                style={{ borderRadius: 0, width: "100%", height: "100%" }}
              />
              <video
                className="absolute -top-[0.85rem] md:-top-5 w-full h-full flex justify-center items-center p-[1.5rem] md:p-9 rounded-xl"
                src={frameCase}
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className={Styles.whyCourtRoom}>
        <div>
          <h1 style={{ fontWeight: "700" }}>Why Claw Courtroom ?</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-[100px]">
          <div>
            <h1
              style={{
                fontWeight: "700",
                fontSize: "5rem",
                letterSpacing: "0.016rem",
              }}
            >
              25000+
            </h1>
            <h3
              style={{
                color: "#B7B2B2",
                fontSize: "16px",
                textAlign: "center",
              }}
            >
              Indian Legal Documents
            </h3>
          </div>
          <div>
            <h1
              style={{
                fontWeight: "700",
                fontSize: "5rem",
                letterSpacing: "0.016rem",
                textAlign: "center",
              }}
            >
              50+
            </h1>
            <h3
              style={{
                color: "#B7B2B2",
                fontSize: "16px",
                textAlign: "center",
                width: "300px",
              }}
            >
              Trusted by 50+ lawyers from Supreme court and High courts
            </h3>
          </div>
          <div>
            <h1
              style={{
                fontWeight: "700",
                fontSize: "5rem",
                letterSpacing: "0.016rem",
                textAlign: "center",
              }}
            >
              1 Cr +
            </h1>
            <h3
              style={{
                color: "#B7B2B2",
                fontSize: "16px",
                textAlign: "center",
              }}
            >
              Indian Judgements
            </h3>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          placeItems: "center",
          marginTop: "80px",
          paddingBottom: "80px",
        }}
      >
        <motion.div
          className={Styles.third}
          style={{
            width: "75%",
            position: "relative",
            overflow: "hidden",
          }}
          whileHover="hover"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <motion.div
            variants={{
              hover: { x: "100%" },
            }}
            initial={{ x: "0%" }}
            transition={{ type: "tween", duration: 0.5 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 1,
              background: "white",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "linear-gradient(to right, #00ffa3, #008080)",
              zIndex: 0,
            }}
          />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center">
            <div style={{ width: "50%" }}>
              <h1
                style={{
                  color: "#008080",
                  fontWeight: 800,
                  textWrap: "wrap",
                }}
              >
                Experience the AI Courtroom
              </h1>
            </div>
            <Link to={"/contact"}>
              <button
                style={{
                  backgroundColor: isHovered ? "white" : "#008080",
                  color: isHovered ? "#008080" : "white",
                  margin: "15px",
                  padding: "12px 40px",
                  borderRadius: 10,
                  border: "none",
                  fontSize: 27,
                }}
              >
                Contact us
              </button>
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col justify-center items-center gap-1">
          <h1 className="font-bold text-5xl md:text-6xl">Testimonials</h1>
          <p className="text-lg md:text-xl">
            Get to know what the professionals got to say
          </p>
        </div>
        <TestimonialCard />
        <br />
      </div>
    </motion.div>
  );
}

export default Home;
