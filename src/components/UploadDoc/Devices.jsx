import React, { useState } from "react";
import Drive from "../../assets/icons/drive.svg";
import DropBox from "../../assets/icons/dropbox.svg";
import pc from "../../assets/icons/local.svg";
import styles from "../../CourtRoom/CourtroomAi/UploadDoc.module.css";
import Dialog from "../ui/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";
import Lottie from "react-lottie";
import upload from "../../assets/icons/Animation - 1721365056046.json";
import { useNavigate } from "react-router-dom";
import analyze from "../../assets/icons/Animation - 1721467138603.json";
import axios from "axios";
import { NODE_API_ENDPOINT } from "../../utils/utils";
import { useDispatch } from "react-redux";
import { setOverview } from "../../features/bookCourtRoom/LoginReducreSlice";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import uploadImage from "../../assets/images/uploading.gif";
import analyzingImage from "../../assets/images/analyzing.gif";
const Devices = ({ uploadedFile, setUploadedFile }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.user);
  console.log(currentUser);

  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [caseOverview, setCaseOverview] = useState("");
  const [closed, setClosed] = useState(false);
  const [files, setFile] = useState(null);
  const [inputText, setInputText] = useState("");
  // console.log(inputText);

  const handleChange = (e) => {
    console.log("Textarea changed:", e.target.value);
    setCaseOverview(e.target.value);
  };

  const handleSave = async () => {
    // text save logic

    try {
      await axios.post(
        `${NODE_API_ENDPOINT}/courtroom/edit_case`,
        {
          // user_id: currentUser.userId,
          case_overview: inputText,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      dispatch(setOverview(inputText));
      setUploading(false);
      setAnalyzing(false);
      setUploadComplete(false);
      setPreviewContent("");
    } catch (error) {
      toast.error("Failed to save case overview");
    }
  };
  const handleClick = (source) => {
    switch (source) {
      case "local":
        handleUploadFromComputer();
        break;
      case "drive":
        handleUploadFromDrive();
        break;
      case "dropbox":
        handleUploadFromDropBox();
        break;
      default:
        break;
    }
  };

  const handleUploadFromComputer = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf,.doc,.docx,.txt,.jpg"; // Specify the accepted file types
    fileInput.multiple = true; // Allow multiple file selection
    fileInput.addEventListener("change", async (event) => {
      const files = Array.from(event.target.files);
      if (files.length > 0) {
        setUploading(true);

        const formData = new FormData();
        files.forEach((file, index) => {
          if (index === 0) {
            formData.append(`file`, file); // Append all files under the same key
          } else {
            formData.append(`file${index}`, file); // Append all files under the same key
          }
        });

        try {
          const response = await axios.post(
            `${NODE_API_ENDPOINT}/courtroom/newcase`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${currentUser.token}`,
              },
            }
          );

          // Handle response and update state
          setPreviewContent(response.data.data.case_overview.case_overview);
          setInputText(response.data.data.case_overview.case_overview);
          setUploading(false);
          setAnalyzing(true);

          setTimeout(() => {
            setAnalyzing(false);
            setUploadComplete(true);
            
          }, 3000);
        } catch (error) {
          console.log(error);
          toast.error("Error uploading file");
        }
      }
    });
    fileInput.click();
  };

  const handleUploadFromDrive = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setAnalyzing(true);
      setTimeout(() => {
        setAnalyzing(false);
        setUploadComplete(true);
        setPreviewContent(
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vehicula, est non blandit luctus, orci justo bibendum urna, at gravida ligula eros eget lectus."
        ); // Set preview content

        //dispatch function
        // dispatch(setOverview())
      }, 3000); // Simulate analyzing
    }, 3000); // Simulate upload
  };

  const handleUploadFromDropBox = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setAnalyzing(true);
      setTimeout(() => {
        setAnalyzing(false);
        setUploadComplete(true);
        setPreviewContent(
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vehicula, est non blandit luctus, orci justo bibendum urna, at gravida ligula eros eget lectus."
        ); // Set preview content

        //dispatch function
        // dispatch(setOverview())
      }, 3000); // Simulate analyzing
    }, 3000); // Simulate upload
  };

  const handleDialogClose = () => {
    dispatch(setOverview(""));
    setUploading(false);
    setAnalyzing(false);
    setUploadComplete(false);
    setPreviewContent("");
  };

  return (
    <motion.div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        // height: "100%",
        margin: "10px",
      }}
    >
      <section
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "100%",
          justifyContent: "space-evenly",
          alignItems: "center",
          padding: "30px",
        }}
      >
        <div
          className={`${styles.images} gap-10 `}
          onClick={() => handleClick("drive")}
        >
          <img className="p-5" src={Drive} alt="" />
          <h4 className="font-semibold text-neutral-500">Upload from Drive</h4>
        </div>
        <div className={styles.verticalLine}></div>
        <div
          className={`${styles.images} gap-10 `}
          onClick={() => handleClick("drive")}
        >
          <img className="p-5" src={DropBox} alt="" />
          <h4 className="font-semibold text-neutral-500">
            Upload from Drop Box
          </h4>
        </div>
        <div className={styles.verticalLine}></div>
        <div
          className={`${styles.images} gap-10 `}
          onClick={() => handleClick("local")}
        >
          <img className="p-5" src={pc} alt="" />
          <h4 className="font-semibold text-neutral-500">
            Upload from your PC
          </h4>
        </div>
      </section>
      <Dialog
        setOnChange={handleChange}
        open={uploading || analyzing || uploadComplete}
        onClose={handleDialogClose}
        title={
          uploading
            ? "Uploading Your Document"
            : analyzing
            ? "Analyzing the Document"
            : uploadComplete
            ? "Upload Complete"
            : ""
        }
        text={uploading || analyzing ? "" : previewContent}
        inputText={inputText}
        setInputText={setInputText}
        buttonText={`${uploadComplete ? "" : ""}`}
        onButtonClick={handleSave}
        image={uploading ? uploadImage : analyzing ? analyzingImage : ""}
      >
        {uploading && (
          <img className="h-20 w-20" src={uploadImage} alt="uploading" />
        )}
        {analyzing && (
          <img className="fit-content" src={analyzingImage} alt="uploading" />
        )}
        {uploadComplete && (
          <textarea
            className="w-full h-64  p-2.5 mb-4 text-black rounded-md "
            value={caseOverview}
            onChange={handleChange}
          />
        )}
      </Dialog>
    </motion.div>
  );
};

export default Devices;
