import React from "react";
import { motion } from "framer-motion";
import { CircularProgress } from "@mui/material";
import aiAssistantLoader from "../assets/images/aiAssistantLoading.gif";

const LoadingDialog = () => {
  return (
    <div className="fixed inset-0 w-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-gradient-to-r from-[#0e1118] to-[#008080] h-[50vh] w-[30%] border border-white rounded-md p-4 relative">
        <div className="flex flex-col h-full w-full justify-center items-center">
          <img className="h-40 w-40" src={aiAssistantLoader} alt="loader" />
        </div>
      </div>
    </div>
  );
};

export default LoadingDialog;
