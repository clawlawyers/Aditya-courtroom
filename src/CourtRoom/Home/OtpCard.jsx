import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const OtpCard = () => {
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [getOtp, setGetOtp] = useState(false);
  const [otp, setOtp] = useState(null);

  const navigate = useNavigate();

  const handleOtpVerification = () => {
    // api call here

    navigate("/courtroom-ai");
  };
  return (
    <>
      {getOtp ? (
        <div className="flex flex-col gap-3 bg-[#1E1E1E] rounded border border-white p-3">
          <div className="flex justify-end">
            <svg
              onClick={() => setGetOtp(false)}
              className="w-5 h-5 cursor-pointer"
              stroke="#00AFAF"
              fill="#00AFAF"
              clip-rule="evenodd"
              fill-rule="evenodd"
              stroke-linejoin="round"
              stroke-miterlimit="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z" />
            </svg>
          </div>
          <h5 className="text-center">
            Log In to <span className="text-[#00AFAF]">AI Courtroom</span>
          </h5>
          <div className="flex justify-between items-center">
            <p className="m-0">
              OTP sent to:{" "}
              <span className="text-xl font-bold">{phoneNumber}</span>
            </p>
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
          <div className="flex gap-2">
            <input
              className="flex-1 p-3 rounded text-black"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={handleOtpVerification}
              className="py-2 px-4 max-w-fit rounded-full border border-white "
              style={{ background: "linear-gradient(90deg,#003333,#018585)" }}
            >
              Verify OTP
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 bg-[#1E1E1E] rounded border border-white p-3">
          <h5 className="text-center">
            Log In to <span className="text-[#00AFAF]">AI Courtroom</span>
          </h5>
          <input
            className="p-3 rounded text-black"
            placeholder="Enter Your Registered Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <div className="w-full flex justify-end">
            <button
              onClick={() => setGetOtp(true)}
              className="py-2 px-4 max-w-fit rounded-full border border-white "
              style={{ background: "linear-gradient(90deg,#003333,#018585)" }}
            >
              Send OTP
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default OtpCard;
