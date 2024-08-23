import React, { useState } from "react";
import Styles from "./UploadDoc.module.css";
import fight from "../../assets/images/fightYourself.png";
import draft from "../../assets/images/draft.png";
import Devices from "../../components/UploadDoc/Devices";
import { motion } from "framer-motion";
import uploadImage from "../../assets/icons/upload.svg";
import { useNavigate } from "react-router-dom";
const UploadDoc = () => {
  const [inputText, setInputText] = useState("");
  const navigate = useNavigate();
  const handleInputChange = (event) => {
    event.preventDefault();
    setInputText(event.target.value);
    console.log(inputText);
  };
  const [ChooseDevice, setChooseDevice] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(false);
  const [error, setError] = useState(false);
  const handleClick = () => {
    setChooseDevice(true);
  };

  const handleSubmit = () => {
    if (!ChooseDevice && !inputText) {
      setError(true);
    } else {
      console.log(uploadedFile);
      navigate("/courtroom-ai");
    }
  };
  console.log(uploadedFile);
  const transition = { duration: 0.5 };
  const variants = {
    open: { height: "100%", width: "100%" },
    closed: { height: "40%", width: "70%" },
  };

  return (
    <section className={Styles.topContainer} style={{ padding: "20px" }}>
      {ChooseDevice ? (
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
          />
        </motion.div>
      ) : (
        <div
          onClick={handleClick}
          className={` ${Styles.uploadButton} ${
            error ? Styles.errorBoundary : ""
          }`}
        >
          <img src={uploadImage} alt="" />
        </div>
      )}

     
    </section>
  );
};

export default UploadDoc;
