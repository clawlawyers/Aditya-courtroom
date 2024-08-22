import React from "react";

const OtpCard = () => {
  return (
    <div className="flex flex-col gap-3 bg-[#1E1E1E] rounded border border-white p-3">
      {/* <div className="flex justify-end">
        <svg
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
      </div> */}
      <h1 className="text-center">
        Log In to <span className="text-[#00AFAF]">AI Courtroom</span>
      </h1>
      <input
        className="p-3 rounded "
        placeholder="Enter Your Registered Number"
      />
      <div className="w-full flex justify-end">
        <button
          className="py-2 px-4 max-w-fit rounded-full border border-white "
          style={{ background: "linear-gradient(90deg,#003333,#018585)" }}
        >
          Send OTP
        </button>
      </div>
    </div>
  );
};

export default OtpCard;
