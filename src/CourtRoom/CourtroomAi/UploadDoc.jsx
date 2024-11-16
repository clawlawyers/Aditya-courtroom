import React, { useEffect, useState } from "react";
import Styles from "./UploadDoc.module.css";
import Devices from "../../components/UploadDoc/Devices";
import { motion } from "framer-motion";
import uploadImage from "../../assets/icons/upload.svg";
import { useNavigate } from "react-router-dom";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { setTutorial , setdevices, setinputCaseTutorial } from "../../features/sidebar/sidebarSlice";
import { useSelector, useDispatch } from "react-redux";
import LanguageSelectionModal from "../../components/UploadDoc/LanguageSelectModal"; // Import the modal

const UploadDoc = () => {
  const dispatch = useDispatch();
  const tutorial = useSelector((state) => state.sidebar.tutorial);
  const driveUpload = useSelector((state) => state.sidebar.inputCaseTutorial);
  const caseOverView = useSelector((state) => state.user.caseOverview);

  
  

  const driverObj = driver({
    showProgress: true,
    steps: [
      {
        element: "#docupload",
        popover: {
          title: "New Case",
          description: "Click this button to provide details of the case.",
          side: "left",
          align: "start",
        },
      },
    ],
  });

  const [inputText, setInputText] = useState("");
  const navigate = useNavigate();
  const [chooseDevice, setChooseDevice] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(false);
  const [error, setError] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false); // New state for language modal
  const [selectedLanguage, setSelectedLanguage] = useState(null); // New state for selected language

  const handleClick = () => {
    driverObj.destroy();
    setShowLanguageModal(true); // Show language modal on upload click
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setShowLanguageModal(false);
    setChooseDevice(true);
  };

  const handleModalClose = () => {
    setShowLanguageModal(false);
  };

  useEffect(() => {
    if (!tutorial) {
      if(!driveUpload){
        if (caseOverView == "NA" || caseOverView == "") {

          
          driverObj.drive();
        }
        dispatch(setdevices())
        // dispatch(setTutorial(true));
      }
    }
  }, [ tutorial, dispatch]);

  const handleSubmit = () => {
    if (!chooseDevice && !inputText) {
      setError(true);
    } else {
      console.log(uploadedFile);
      navigate("/courtroom-ai");
    }
  };

  const transition = { duration: 0.5 };
  const variants = {
    open: { height: "100%", width: "100%" },
    closed: { height: "40%", width: "70%" },
  };

  return (
    <section className={Styles.topContainer} style={{ padding: "20px" }}>
      {showLanguageModal && (
        <LanguageSelectionModal
          onClose={handleModalClose}
          onSelectLanguage={handleLanguageSelect}
        />
      )}
      {chooseDevice ? (
        <motion.div
          className={Styles.device}
          initial="closed"
          animate="open"
          exit="closed"
          variants={variants}
          transition={transition}
        >
          <Devices
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            languageArr={selectedLanguage}
          />
        </motion.div>
      ) : (
        <div
          id="docupload"
          onClick={handleClick}
          className={`${Styles.uploadButton} ${
            error ? Styles.errorBoundary : ""
          }`}
        >
          <img src={uploadImage} alt="Upload Document" />
        </div>
      )}
    </section>
  );
};

export default UploadDoc;
