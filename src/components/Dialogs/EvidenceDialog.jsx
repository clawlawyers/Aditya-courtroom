import { Close, Send } from "@mui/icons-material";
import React, { useState } from "react";
import fileUpload from "../../assets/icons/fileUpload.svg";

const EvidenceDialog = ({ handleEvidenceClose }) => {
  const [evidence, setEvidence] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleChangeEvidence = (e) => {
    setEvidence(e.target.value);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleSubmit = () => {
    // Handle the submission of evidence and uploaded files
    console.log("Evidence:", evidence);
    console.log("Uploaded Files:", uploadedFiles);
  };

  return (
    <main className="w-full p-2 flex flex-col justify-center items-center">
      {/* //header */}
      <section className="flex flex-row justify-between items-start w-full">
        <div className="flex flex-col justify-center items-start">
          <h1 className="text-lg font-semibold text-teal-700 text-left">
            Add your Evidences
          </h1>
          <h3 className="text-xs font-light text-neutral-600">
            Add your evidence in textual form or upload your document
          </h3>
        </div>
        <div className="cursor-pointer" onClick={handleEvidenceClose}>
          <Close />
        </div>
      </section>
      {/* header ends */}

      <section className="w-full">
        <textarea
          required
          value={evidence}
          onChange={handleChangeEvidence}
          placeholder="Add your Evidence"
          rows={12}
          className="w-full resize-none bg-[#00808030] text-black rounded-md p-2"
        />
      </section>

      <section className="flex space-x-5 flex-row w-full items-center justify-end">
        <label htmlFor="file-upload" className="cursor-pointer">
          <img src={fileUpload} alt="fileUploadIcon" />
        </label>
        <input
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
        <Send className="text-teal-800 cursor-pointer" onClick={handleSubmit} />
      </section>
    </main>
  );
};

export default EvidenceDialog;
