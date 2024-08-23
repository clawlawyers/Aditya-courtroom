import React from "react";
import "./verdict.css";
import Markdown from "react-markdown";
import logo from "../../assets/icons/clawlogo.png";
import verdictLogo from "../../assets/icons/verdict_logo.png";
import { motion } from "framer-motion";
import { NODE_API_ENDPOINT } from "../../utils/utils";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const DocumentViewer = ({ text }) => {
  const currentUser = useSelector((state) => state.user.user);

  const downloadVerdict = async () => {
    try {
      const response = await axios.post(
        `${NODE_API_ENDPOINT}/courtroom/api/download`,
        {
          // user_id: currentUser.userId,
          data: text,
          type: "Verdict",
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
          responseType: "blob", // Important
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `verdict_claw.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading case history:", error);
      toast.error("Error downloading case history");
    }
  };

  return (
    <div className="flex h-screen gap-5 px-40">
      <div className="flex flex-col items-center bg-[#7ebab2] my-3 w-full">
        <img src={verdictLogo} alt="verdict" className=" mt-4" /> {/* Added margin to top */}
        <img className="w-20 h-[5rem]" src={logo} alt="logo" />
        <div className="flex flex-col items-start justify-start px-5 h-full overflow-y-auto text-black pt-4"> {/* Added padding to top */}
          <Markdown>{text}</Markdown>
        </div>
        <div className="flex flex-row w-full justify-end items-center py-2 px-3">
          <motion.button
            whileTap={{ scale: "0.95" }}
            className="border-2 border-white p-2 rounded-lg"
            onClick={downloadVerdict}
          >
            Download
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
