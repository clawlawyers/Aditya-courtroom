import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NODE_API_ENDPOINT } from "../../utils/utils";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  auth,
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
  signInWithPhoneNumber,
} from "../../utils/firebase";
import { motion } from "framer-motion";

const ConfirmBooking = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  // const [hasFilled, setHasFilled] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [receipt, setReceipt] = useState(`receipt_${Date.now()}`);
  const bookingData = useSelector((state) => state?.booking?.bookingData);
  const slots = bookingData?.slots;
  const [verificationId, setVerificationId] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [proceedToPayment, setProceedToPayment] = useState(false);
  const [paymentGatewayLoading, setPaymentGatewayLoading] = useState(false);

  // console.log(bookingData.phoneNumber);

  const handlePayment = async () => {
    setPaymentGatewayLoading(true);
    await loadRazorpay(bookingData);
    setPaymentGatewayLoading(false);
  };

  const loadRazorpay = async (bookingData) => {
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
            amount: slots.length * 100,
            phoneNumber: bookingData.phoneNumber,
            currency: "INR",
            receipt: receipt,
            numberOfSlot: slots.length,
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
        // setLoading(false);
      }
    };
    document.body.appendChild(script);
  };

  // const [phoneNumber, setPhoneNumber] = useState('');

  const handleDisableButton = () => {
    if (isDisabled) return;

    setIsDisabled(true);
    setTimeout(() => {
      setIsDisabled(false);
    }, 30000);
  };

  const handleSendOTP = () => {
    handleDisableButton();
    console.log("sendOTP");
    const recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
      },
      auth
    );

    signInWithPhoneNumber(
      auth,
      "+91" + bookingData?.phoneNumber,
      recaptchaVerifier
    )
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
        alert("OTP sent!");
      })
      .catch((error) => {
        console.error("Error during OTP request:", error);
      });
  };

  const handleVerifyOTP = () => {
    const credential = PhoneAuthProvider.credential(verificationId, otp);
    localStorage.setItem("loginOtp", otp);

    signInWithCredential(auth, credential)
      .then((userCredential) => {
        const user = userCredential.user;
        alert("Phone number verified successfully!");
        setProceedToPayment(true);
      })
      .catch((error) => {
        console.error("Error during OTP verification:", error);
        setProceedToPayment(false);
      });
  };

  return (
    <div className="flex flex-col p-5 w-full gap-2">
      <div className="md:mx-32 p-1 flex flex-col md:flex-row  justify-between items-center bg-[#303030] rounded border-2 border-[#018585]">
        <div className="py-2 flex items-center gap-2">
          <p className="m-0">OTP sent to :</p>
          <h2 className="font-bold m-0">{bookingData?.phoneNumber}</h2>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2">
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="p-2 rounded text-black"
          />
          <div className="flex items-center gap-2 cursor-pointer">
            <svg
              className="w-5 h-5"
              stroke="#018585"
              fill="#018585"
              clip-rule="evenodd"
              fill-rule="evenodd"
              stroke-linejoin="round"
              stroke-miterlimit="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m3.508 6.726c1.765-2.836 4.911-4.726 8.495-4.726 5.518 0 9.997 4.48 9.997 9.997 0 5.519-4.479 9.999-9.997 9.999-5.245 0-9.553-4.048-9.966-9.188-.024-.302.189-.811.749-.811.391 0 .715.3.747.69.351 4.369 4.012 7.809 8.47 7.809 4.69 0 8.497-3.808 8.497-8.499 0-4.689-3.807-8.497-8.497-8.497-3.037 0-5.704 1.597-7.206 3.995l1.991.005c.414 0 .75.336.75.75s-.336.75-.75.75h-4.033c-.414 0-.75-.336-.75-.75v-4.049c0-.414.336-.75.75-.75s.75.335.75.75z"
                fill-rule="nonzero"
              />
            </svg>
            <p className="m-0">Retry in 30 seconds</p>
          </div>
        </div>
        <div className="flex gap-2 m-2">
          <motion.button
            whileTap={{ scale: "0.95" }}
            disabled={isDisabled}
            className="border-2 rounded p-2"
            style={{
              borderColor: isDisabled ? "black" : "white",
              color: isDisabled ? "black" : "white",
              cursor: isDisabled ? "not-allowed" : "pointer",
            }}
            onClick={handleSendOTP}
          >
            Send OTP
          </motion.button>
          <button
            className="text-white bg-gradient-to-r from-[#008080] to-[#003131] rounded p-2"
            onClick={() => handleVerifyOTP()}
          >
            Verify OTP
          </button>
          <div id="recaptcha-container"></div>
        </div>
      </div>
      {/* Card Section */}
      <section className="w-full h-max grid md:grid-cols-2 justify-center items-center  md:items-start gap-10 md:px-28">
        {/* Card 1 */}
        <div className="p-4 border border-white h-max rounded-md bg-card-gradient flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold">Confirm your booking</h3>
            <div className="h-0.5 bg-white w-full" />
          </div>
          <div className="mx-2">
            <h3 className="font-semibold">CLAW courtroom</h3>
            <p className="text-neutral-200 text-sm">
              Access to AI Powered CLAW courtroom
            </p>

            <p>
              UserId: <span className="font-bold">{bookingData.name}</span>
            </p>
            <p>
              Email: <span className="font-bold">{bookingData.email}</span>
            </p>
            <p>
              Phone Number:{" "}
              <span className="font-bold">{bookingData.phoneNumber}</span>
            </p>
          </div>
          <div className="h-0.5 bg-white w-full" />
          {/* Time Slot */}
          <div className="flex flex-col gap-3 w-full px-2">
            <p>Timer Slot: </p>
            <div className="flex flex-row flex-wrap justify-between items-center gap-2 w-full h-full">
              {slots?.map((idx) => (
                <div
                  key={idx}
                  className="bg-slot-gradient flex flex-row flex-wrap  p-3 items-center align-baseline rounded-lg justify-center px-3 text-black font-bold text-xs"
                >
                  {idx?.date}
                  {" ,"}
                  {idx?.hour}:00
                </div>
              ))}
            </div>
            <div className="w-full flex flex-row justify-end">
              <button
                onClick={() => navigate("/book-now")}
                className="border-2 font-semibold border-white rounded-md p-2"
              >
                Reschedule
              </button>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-4 border border-white rounded-md bg-card-gradient flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">Payment Details</h3>
            <div className="h-0.5 bg-white w-full" />
          </div>
          <div className="mx-2 gap-2">
            <h3 className="font-bold text-lg">
              Price per slot: <span className="text-lg">Rs. 100</span> /-
            </h3>
            <h3 className="font-bold text-lg">
              No. of slots booked: {slots?.length}
            </h3>
          </div>
          <div className="h-0.5 bg-white w-full" />
          <br />
          {/* Amount to Pay */}
          <div className="flex flex-col w-full px-2">
            <p className="text-xl font-bold">
              Amount to Pay: {100 * slots?.length}
            </p>
            <div className="flex flex-row w-full justify-end">
              <motion.button
                whileTap={{ scale: "0.95" }}
                // disabled={!proceedToPayment}
                onClick={handlePayment}
                className="border-2 font-semibold border-white rounded-md p-2"
                // style={{
                //   borderColor: !proceedToPayment ? "grey" : "white",
                //   color: !proceedToPayment ? "grey" : "white",
                //   cursor: !proceedToPayment ? "not-allowed" : "pointer",
                // }}
              >
                {paymentGatewayLoading ? (
                  <svg
                    className="animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    stroke="white"
                    fill="white"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23 12c0 1.042-.154 2.045-.425 3h-2.101c.335-.94.526-1.947.526-3 0-4.962-4.037-9-9-9-1.706 0-3.296.484-4.655 1.314l1.858 2.686h-6.994l2.152-7 1.849 2.673c1.684-1.049 3.659-1.673 5.79-1.673 6.074 0 11 4.925 11 11zm-6.354 7.692c-1.357.826-2.944 1.308-4.646 1.308-4.962 0-9-4.038-9-9 0-1.053.191-2.06.525-3h-2.1c-.271.955-.425 1.958-.425 3 0 6.075 4.925 11 11 11 2.127 0 4.099-.621 5.78-1.667l1.853 2.667 2.152-6.989h-6.994l1.855 2.681z" />
                  </svg>
                ) : (
                  "Proceed to Payment"
                )}
              </motion.button>
            </div>
            <br />
            <div className="h-0.5 bg-white w-full" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ConfirmBooking;
