import React, { useEffect, useState } from "react";
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

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

import {
  setFightingSideModal,
  setOverview,
} from "../../features/bookCourtRoom/LoginReducreSlice";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import uploadImage from "../../assets/images/uploading.gif";
import analyzingImage from "../../assets/images/analyzing.gif";
import { decryptData, encryptData } from "../../utils/encryption";
import "./Devices.css";

const Devices = ({ uploadedFile, setUploadedFile }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.user);
  console.log(currentUser);

  const multilingualSupport = useSelector(
    (state) => state?.user?.user?.courtroomFeatures?.MultilingualSupport
  );

  const authKey = useSelector((state) => state.user.authKey);

  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [caseOverview, setCaseOverview] = useState("");
  const [closed, setClosed] = useState(false);
  const [files, setFile] = useState(null);
  const [inputText, setInputText] = useState("");
  const [toBeUploadedFiles, setToBeUploadedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedSuccessFully, setUploadedSuccessFully] = useState([]);
  const [open, setOpen] = useState(false);
  const [content, setconetnt] = useState("");
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    height: "90%",
    width: "50%",
  };
 
  // console.log(inputText);


  

  const handleChange = (e) => {
    console.log("Textarea changed:", e.target.value);
    setCaseOverview(e.target.value);
  };

  const handleSave = async () => {
    // text save logic

    const encryptedText = encryptData(inputText, authKey);

    try {
      await axios.post(
        `${NODE_API_ENDPOINT}/specificLawyerCourtroom/edit_case`,
        {
          // user_id: currentUser.userId,
          case_overview: encryptedText,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      dispatch(setOverview(inputText));
      dispatch(setFightingSideModal(true));
      setUploading(false);
      setAnalyzing(false);
      setUploadComplete(false);
      setPreviewContent("");
      await axios.post(
        `${NODE_API_ENDPOINT}/specificLawyerCourtroom/api/case_summary`,
        {
          // user_id: currentUser.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
      if (error.response.data.error.explanation === "Please refresh the page") {
        toast.error("Please refresh the page");
        return;
      }
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
    fileInput.accept = ".pdf,.docx,.txt"; // Specify the accepted file types
    fileInput.multiple = true; // Allow multiple file selection
    fileInput.addEventListener("change", async (event) => {
      const files = Array.from(event.target.files);
      setFile(event.target.files[0]);
      if (files.length > 0) {
        const maxFileSize = 15 * 1024 * 1024; // 15 MB in bytes
        const validFiles = [];

        for (const file of files) {
          if (file.size <= maxFileSize) {
            validFiles.push(file);
          } else {
            toast.error(
              `File uploaded exceeds the 15 MB limit.Please try another file`
            );
          }
        }

        if (validFiles.length === 0) {
          return; // No valid files, exit the function
        } else {
          setToBeUploadedFiles(validFiles);
        }
        // setUploading(true);

        // const formData = new FormData();
        // validFiles.forEach((file, index) => {
        //   formData.append(`file${index === 0 ? "" : index}`, file); // Append files under the same key
        // });
        // formData.append("isMultilang", multilingualSupport);
        // try {
        //   const response = await axios.post(
        //     `${NODE_API_ENDPOINT}/specificLawyerCourtroom/newcase`,
        //     formData,
        //     {
        //       headers: {
        //         "Content-Type": "multipart/form-data",
        //         Authorization: `Bearer ${currentUser.token}`,
        //       },
        //     }
        //   );
        //   const decryptedText = decryptData(
        //     response.data.data.case_overview.case_overview,
        //     authKey
        //   );
        //   console.log(decryptedText);
        //   setPreviewContent(decryptedText);
        //   setInputText(decryptedText);
        //   setUploading(false);
        //   setAnalyzing(true);

        //   setTimeout(() => {
        //     setAnalyzing(false);
        //     setUploadComplete(true);
        //   }, 3000);
        // } catch (error) {
        //   if (
        //     error.response.data.error.explanation === "Please refresh the page"
        //   ) {
        //     toast.error("Please refresh the page");
        //     return;
        //   }
        //   console.log(error);
        //   toast.error("Error uploading file");
        // }
      }
    });
    fileInput.click();
  };

  useEffect(() => {
    const uploadFiles = async () => {
      for (const file of toBeUploadedFiles) {
        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("isMultilang", true);

          const response = await axios.post(
            `${NODE_API_ENDPOINT}/specificLawyerCourtroom/fileUpload`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${currentUser.token}`,
              },
            }
          );
          // console.log(response.data);
          uploadFileWithProgress(
            response.data.data.uploadUrl,
            file,
            response.data.data.fileName
          );
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
        }
      }
    };

    if (toBeUploadedFiles.length > 0) {
      uploadFiles();
    }
  }, [toBeUploadedFiles]);

  const uploadFileWithProgress = async (url, file, fileId) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded * 100) / event.total);
        setUploadProgress((prevProgress) => ({
          ...prevProgress,
          [fileId]: progress,
        }));
      }
    };

    xhr.open("PUT", url, true);
    xhr.setRequestHeader("Content-Type", file.type);

    // Send the file
    xhr.send(file);

    xhr.onload = () => {
      if (xhr.status === 200) {
        console.log("File uploaded successfully!");
        setUploadProgress((prevProgress) => {
          const newProgress = { ...prevProgress };
          delete newProgress[fileId];
          return newProgress;
        });
        // setUploadedSuccessFully([...uploadedSuccessFully, fileId]);
        setUploadedSuccessFully((prevSuccessfullyUploaded) => [
          ...prevSuccessfullyUploaded,
          fileId,
        ]);
      } else {
        console.error("Error uploading file:", xhr.responseText);
      }
    };
  };

  useEffect(() => {
    if (
      uploadedSuccessFully.length > 0 &&
      toBeUploadedFiles.length === uploadedSuccessFully.length
    ) {
      console.log("here");
      callOverView();
    }
  }, [uploadedSuccessFully]);

  const callOverView = async () => {
    setAnalyzing(true);
    try {
      const response = await axios.post(
        `${NODE_API_ENDPOINT}/specificLawyerCourtroom/getoverview-formfilename`,
        {
          // user_id: currentUser.userId,
          fileNameArray: uploadedSuccessFully,
          isMultilang: true,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      toast.success("Overview fetched successfully!");
      console.log(response.data);
      setPreviewContent(response.data.data.case_overview);
      setInputText(response.data.data.case_overview);
      setAnalyzing(false);
      setUploadComplete(true);
    } catch (error) {
      setAnalyzing(false);
      toast.error("Failed to load case overview");
    } finally {
      setToBeUploadedFiles([]);
      setUploadProgress({});
      setUploadedSuccessFully([]);
    }
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
    setOpen(true)
    // setUploading(true);
    // setTimeout(() => {
    //   setUploading(false);
    //   setAnalyzing(true);
    //   setTimeout(() => {
    //     setAnalyzing(false);
    //     setUploadComplete(true);
    //     setPreviewContent(
    //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vehicula, est non blandit luctus, orci justo bibendum urna, at gravida ligula eros eget lectus."
    //     ); // Set preview content

    //     //dispatch function
    //     // dispatch(setOverview())
    //   }, 3000); // Simulate analyzing
    // }, 3000); // Simulate upload
  };

  const handleDialogClose = () => {
    dispatch(setOverview(""));
    setUploading(false);
    setAnalyzing(false);
    setUploadComplete(false);
    setPreviewContent("");
  };
  const handleTextInputUpload = async () => {
    setUploading(true);
    setOpen(false);
    try {
      let data = JSON.stringify({
        case_overview: content,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${NODE_API_ENDPOINT}/courtroom/api/new_case/text`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        data: data,
      };

      const response = await axios.request(config);
      // const response = await axios.post(
      //   `${NODE_API_ENDPOINT}/courtroom/api/new_case/text`,
      //   data,
      //   {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //       Authorization: `Bearer ${currentUser.token}`,
      //     },
      //   }
      // );

      // Handle response and update state
      console.log(response);
      setPreviewContent(response.data.data.fetchedOverview.case_overview);
      setInputText(response.data.data.fetchedOverview.case_overview);
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
  };

  return (
    <>
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
          onClick={() => handleClick("dropbox")}
        >
          <img className="p-5" src={DropBox} alt="" />
          <h4 className="font-semibold text-neutral-500">
            Write your own text
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
        open={analyzing || uploadComplete}
        onClose={handleDialogClose}
        title={
          analyzing
            ? "Analyzing the Document"
            : uploadComplete
            ? "Upload Complete"
            : ""
        }
        text={analyzing ? "" : previewContent}
        inputText={inputText}
        setInputText={setInputText}
        buttonText={`${uploadComplete ? "" : ""}`}
        onButtonClick={handleSave}
        image={analyzing ? analyzingImage : ""}
      >
        {/* {uploading && (
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
        )} */}
      </Dialog>
      <div className="absolute right-5 bottom-10 h-screen overflow-auto flex flex-col-reverse gap-2">
        {Object.entries(uploadProgress).map(([fileId, progress], index) => (
          <div className="w-60 bg-white text-black rounded-lg p-2" key={fileId}>
            <p className="m-0 text-xs text-[#008080]">
              Uploading File : {index + 1}
            </p>
            <div className="flex gap-2 items-center">
              <progress value={progress} style={{ color: "blue" }} max="100">
                {progress}%
              </progress>
              <p className="m-0 text-[#008080]">{progress}%</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
      <Modal
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} className="overflow-scroll  gap-6 flex flex-col">
        <textarea
          id="content"
          className="p-2 border-2"
          name="w3review"
          rows="20"
          cols="50"
          value={content}
          placeholder="Write your own Content..."
          onChange={(e) => {
            setconetnt(e.target.value);
          }}
        ></textarea>

        <button
          onClick={handleTextInputUpload}
          className="bg-[#008080] text-white rounded-md shadow-lg px-4 py-2 w-[30%]"
        >
          Upload
        </button>
      </Box>
    </Modal>
    </>
  );
};

export default Devices;
