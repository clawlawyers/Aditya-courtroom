import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import logo from "../../assets/icons/clawlogo.png";
import { Button } from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// Adjust the import path accordingly
import { setOverview } from "../../features/bookCourtRoom/LoginReducreSlice";

const Dialog = ({
  open,
  onClose,
  title,
  text,
  buttonText,
  onButtonClick,
  image,
  inputText,
  setInputText,
  currentUser,
  NODE_API_ENDPOINT,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [currentText, setCurrentText] = useState("");
  const dialogRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const charsPerPage = 1000; // Define this value outside the function

  // Function to split text into pages
  const getPages = (text) => {
    const pages = [];
    for (let i = 0; i < text.length; i += charsPerPage) {
      pages.push(text.slice(i, i + charsPerPage));
    }
    return pages;
  };

  // Update pages when inputText changes
  useEffect(() => {
    const newPages = getPages(inputText);
    setPages(newPages);
    setCurrentText(newPages[currentPage] || "");
  }, [inputText]);

  // Update inputText when pages change
  useEffect(() => {
    setInputText(pages.join(""));
  }, [pages]);

  const handlePrevious = () => {
    if (currentPage > 0) {
      setPages((pages) => {
        const updatedPages = [...pages];
        updatedPages[currentPage] = currentText;
        return updatedPages;
      });
      setCurrentPage(currentPage - 1);
      setCurrentText(pages[currentPage - 1] || "");
    }
  };

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setPages((pages) => {
        const updatedPages = [...pages];
        updatedPages[currentPage] = currentText;
        return updatedPages;
      });
      setCurrentPage(currentPage + 1);
      setCurrentText(pages[currentPage + 1] || "");
    }
  };

  const handleTextChange = (e) => {
    setCurrentText(e.target.value);
    setInputText(e.target.value);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      setUploading(true);
      await axios.post(`${NODE_API_ENDPOINT}/courtroom/edit_case`, {
        user_id: currentUser.userId,
        case_overview: inputText,
      });
      dispatch(setOverview(inputText));
      setUploading(false);
      setAnalyzing(false);
      setUploadComplete(false);
      setPreviewContent("");
      navigate("/courtroom-ai/");
    } catch (error) {
      toast.error("Failed to save case overview");
      setUploading(false);
    }
  };

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.style.width = "auto";
      dialogRef.current.style.height = "auto";
      const rect = dialogRef.current.getBoundingClientRect();
      if (rect.width > window.innerWidth * 0.8) {
        dialogRef.current.style.width = "90vw";
      }
      if (rect.height > window.innerHeight * 0.8) {
        dialogRef.current.style.height = "90vh";
      }
    }
  }, [open, inputText, text, image, pages]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 w-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div
        ref={dialogRef}
        className="bg-gradient-to-r from-[#0e1118] scale-90 to-[#008080] w-auto border border-white rounded-md p-4 relative"
      >
        {/* Close Button */}
        <div className="absolute top-2 right-2">
          <svg
            onClick={onClose}
            className="cursor-pointer"
            width="30"
            height="30"
            fill="white"
            stroke="white"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </div>

        {/* Dialog Content */}
        <div className="text-center w-full">
          <h1 className="text-2xl text-white font-bold">{title}</h1>
          {text && (
            <div className="grid grid-cols-2 justify-between items-center w-full gap-5">
              <div className="flex flex-row justify-center w-full items-center">
                <button
                  onClick={handlePrevious}
                  className="p-2 mx-2 bg-white text-black rounded-full"
                  style={{
                    visibility: currentPage === 0 ? "hidden" : "visible",
                  }}
                  disabled={currentPage === 0}
                >
                  <ArrowLeft />
                </button>
                <div
                  className={`${
                    isEditing ? "border-4  border-teal-400" : "border-none"
                  } rounded-md delay-150 flex flex-col w-[30rem] bg-white text-black h-[65vh] overflow-y-auto`}
                >
                  <div className="w-full px-2 h-fit my-2 items-center flex flex-row ">
                    <p className="uppercase font-bold my-2 w-full ">
                      Document Preview
                    </p>
                    <div className="flex flex-row w-full items-center">
                      <div className="h-1 bg-neutral-900 w-2/3" />
                      <div className="bg-neutral-900 rounded-md">
                        <img
                          className="w-[44px] h-[29px]"
                          src={logo}
                          alt="logo"
                        />
                      </div>
                    </div>
                  </div>
                  <textarea
                    className="w-full h-full p-2.5 mb-4 text-black resize-none border-none"
                    value={currentText}
                    onChange={handleTextChange}
                    readOnly={!isEditing}
                  />
                  <div className="text-right p-1 mx-2 font-semibold">
                    Page {currentPage + 1}
                  </div>
                </div>
                <button
                  onClick={handleNext}
                  className={`p-2 mx-2 bg-white text-black rounded-full`}
                  style={{
                    visibility:
                      currentPage === pages.length - 1 ? "hidden" : "visible",
                  }}
                  disabled={currentPage === pages.length - 1}
                >
                  <ArrowRight />
                </button>
              </div>
              {/* <div className="h-[70vh] w-1 bg-neutral-200/40" /> */}
              <div className="flex flex-col w-full">
                <div className="w-full h-fit flex flex-row justify-center items-center">
                  <img src={logo} className="h-72 w-72" alt="logo" />
                </div>
                <div className="flex flex-col w-full justify-center items-center space-y-4">
                  <div className="flex flex-row justify-between space-x-2">
                    <Button
                      className="lowercase border-2 text-sm border-white text-white"
                      variant="outlined"
                      onClick={onClose} // Modify if needed
                    >
                      Upload a Document
                    </Button>
                    <Button
                      className="text-white text-sm border-2 border-white"
                      variant="outlined"
                      onClick={handleEditToggle}
                    >
                      {isEditing ? "Save Changes" : "Edit current document"}
                    </Button>
                  </div>
                  <Button
                    className="text-white text-sm w-full border-2 border-white"
                    variant="outlined"
                    onClick={onButtonClick}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          )}
          {image && (
            <div className="flex flex-row w-full h-max justify-center items-center align-middle">
              <img className="max-content" src={image} alt="" />
            </div>
          )}
        </div>

        {/* Action Button */}
        {buttonText && (
          <div className="flex justify-center">
            <motion.button
              whileTap={{ scale: "0.95" }}
              className="bg-white text-black rounded-md px-4 py-2 font-semibold"
              onClick={onButtonClick}
            >
              {buttonText}
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dialog;
