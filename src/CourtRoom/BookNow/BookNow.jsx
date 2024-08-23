import React, { useEffect, useState } from "react";
import CalendarComponent from "../../components/DateTime/Calendar";
import styles from "../BookNow/BookNow.module.css";
import image from "../../assets/images/courtroomPhoto.png";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { NODE_API_ENDPOINT } from "../../utils/utils";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setBookingData } from "../../features/bookCourtRoom/bookingSlice";
import { motion } from "framer-motion";

const BookNow = () => {
  const dispatch = useDispatch();
  const [receipt, setReceipt] = useState(`receipt_${Date.now()}`);
  const [loading, setLoading] = useState(false);
  const [scheduledSlots, setScheduledSlots] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [errorData, setErrorData] = useState("");
  const [errorState, setErrorState] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    record: false, // Assuming 'record' checkbox state
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };

  console.log(scheduledSlots);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedBookings = scheduledSlots.map((booking) => {
      // Create a new Date object to avoid mutating the original date
      let date = new Date(booking.date);

      // Add one day
      date.setDate(date.getDate() + 1);

      // Format the date
      const formattedDate = date.toISOString().split("T")[0];

      // Extract the hour from the time string
      const hour = parseInt(booking.time[0].split(":")[0], 10);

      // Return the formatted booking
      return { date: formattedDate, hour };
    });

    const bookingData = {
      phoneNumber: formData.contact,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      recording: formData.record,
      slots: formattedBookings, // Add scheduledSlots to bookingData
    };
    console.log("Booking Data:", bookingData);
    const respos = await axios.post(
      `${NODE_API_ENDPOINT}/courtroom/book-courtroom-validation`,
      {
        ...bookingData,
      }
    );
    if (respos.data.data.data === "Slot can be book") {
      dispatch(setBookingData(bookingData));
      navigate("/confirm-booking");
      // loadRazorpay(bookingData);
    } else {
      setErrorState(true);
      setErrorData("same number or email not allowed at same time slot");
      toast.error("same number or email not allowed at same time slot");
    }
    // TODO : backend post request
  };

  const loadRazorpay = async (bookingData) => {
    setLoading(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onerror = () => {
      alert("Razorpay SDK failed to load. Are you online?");
    };
    script.onload = async () => {
      try {
        // const planeName = `${type}_${request}_${session}`;
        const result = await axios.post(
          `${NODE_API_ENDPOINT}/booking-payment/create-order`,
          {
            amount: scheduledSlots.length * 100,
            phoneNumber: formData.contact,
            currency: "INR",
            receipt: receipt,
            numberOfSlot: scheduledSlots.length,
          }
        );

        console.log(result);

        const { amount, id, currency } = result.data.razorpayOrder;
        const { _id } = result.data.createdOrder;
        const options = {
          key: "rzp_test_UWcqHHktRV6hxM",
          amount: String(amount),
          currency: currency,
          name: "CLAW LEGALTECH PRIVATE LIMITED",
          description: "Transaction",
          order_id: id,
          handler: async function (response) {
            const data = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              _id,
              bookingData,
              amount,
            };

            const result = await axios.post(
              `${NODE_API_ENDPOINT}/booking-payment/verifyPayment`,
              data
            );
            alert(result.data.status);
            //TODO: add a confirm booking page before calling razorpay API
            navigate("/login");
          },

          theme: {
            color: "#3399cc",
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };
    document.body.appendChild(script);
  };

  return (
    <div className={styles.topContainer}>
      <div className="p-5">
        <h1
          style={{
            fontWeight: 800,
            margin: "0",
          }}
        >
          Book your Court Room
        </h1>
      </div>
      <div className=" w-full h-full mt-14 md:mt-0">
        <CalendarComponent
          scheduledSlots={scheduledSlots}
          setScheduledSlots={setScheduledSlots}
        />
      </div>

      <div
        // className={styles.formContainer}
        className="w-full grid md:grid-cols-[30%_70%]"
      >
        <div className="">
          <img src={image} alt="" />
        </div>
        <div className="flex flex-col gap-5 justify-center  items-center">
          <h2 className="text-5xl font-bold ">Enter your Details</h2>
          <form
            // className={`${styles.forms} gap-4 lg:gap-5`}
            className="w-full px-5 flex flex-col justify-center gap-4"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="p-3 rounded text-black"
            />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="p-3 rounded text-black"
            />
            <div className="relative bg-white rounded">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="text-black bg-transparent w-full p-3 rounded"
              />
              <button
                type="button"
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  transform: "translateY(-50%)",
                  border: "1px",
                  background: "none",
                  cursor: "pointer",
                  width: "fit-content",
                }}
                onClick={() =>
                  showPassword ? setShowPassword(false) : setShowPassword(true)
                }
              >
                {showPassword ? (
                  <Visibility
                    sx={{
                      color: "black",
                    }}
                  />
                ) : (
                  <VisibilityOff
                    sx={{
                      color: "black",
                    }}
                  />
                )}
              </button>
            </div>
            <input
              type="text"
              id="contact"
              name="contact"
              placeholder="Enter your contact number"
              value={formData.contact}
              onChange={handleInputChange}
              required
              className="p-3 rounded text-black"
            />

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="record"
                name="record"
                checked={formData.record}
                onChange={handleInputChange}
              />
              <label htmlFor="record">Record the CourtRoom</label>
            </div>
            <motion.button
              whileTap={{ scale: "0.95" }}
              className=""
              type="submit"
              style={{
                background: "linear-gradient(100deg, #008080 0%, #15B3B3 100%)",
                color: "white",
                padding: "10px 20px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Proceed for Payment
            </motion.button>
          </form>
        </div>
        {errorState ? (
          <div
            className="absolute w-full h-full flex items-center justify-center"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(5px)",
            }}
          >
            <div className="border-2 border-red-500 rounded-lg bg-white flex flex-col ">
              <div className="flex justify-end p-2">
                <svg
                  onClick={() => {
                    setErrorState(false);
                    setErrorData("");
                  }}
                  style={{ cursor: "pointer" }}
                  width="24"
                  height="24"
                  stroke="red"
                  clip-rule="evenodd"
                  fill-rule="evenodd"
                  stroke-linejoin="round"
                  stroke-miterlimit="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 1.5c-4.69 0-8.497 3.807-8.497 8.497s3.807 8.498 8.497 8.498 8.498-3.808 8.498-8.498-3.808-8.497-8.498-8.497zm0 7.425 2.717-2.718c.146-.146.339-.219.531-.219.404 0 .75.325.75.75 0 .193-.073.384-.219.531l-2.717 2.717 2.727 2.728c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.384-.073-.53-.219l-2.729-2.728-2.728 2.728c-.146.146-.338.219-.53.219-.401 0-.751-.323-.751-.75 0-.192.073-.384.22-.531l2.728-2.728-2.722-2.722c-.146-.147-.219-.338-.219-.531 0-.425.346-.749.75-.749.192 0 .385.073.531.219z"
                    fill-rule="nonzero"
                  />
                </svg>
              </div>

              <p className="text-black text-lg font-semibold p-5">
                Same number or email not allowed at same time slot
              </p>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default BookNow;
