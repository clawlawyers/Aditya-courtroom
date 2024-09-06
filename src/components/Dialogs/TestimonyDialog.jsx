import { Close, Send } from "@mui/icons-material";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { NODE_API_ENDPOINT } from "../../utils/utils";
import { useSelector } from "react-redux";
import evidenceLoad from "../../assets/images/evidenceLoad.gif";

const TestimonyDialog = ({ handleTestimonyClose }) => {
  const [testimony, setTestimony] = useState("");
  const [testimonyGenerated, setTestimonyGenerated] = useState(false);
  const [testimonyRelevance, setTestimonyRelevance] = useState("");
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector((state) => state.user.user);

  const handleChangeTestimony = (e) => {
    setTestimony(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    console.log("Testimony:", testimony);
    try {
      const fetchData = await fetch(
        `${NODE_API_ENDPOINT}/specificLawyerCourtroom/api/testimony_questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
          body: JSON.stringify({
            testimony_statement: testimony,
          }),
        }
      );
      if (!fetchData.ok) {
        throw new Error("API request failed");
      }
      const data = await fetchData.json();
      console.log(
        "API response:",
        data.data.testimonyQuestions.testimony_questions
      );
      toast.success("Testimony submitted successfully");
      setTestimonyGenerated(true);
      setTestimonyRelevance(data.data.testimonyQuestions.testimony_questions);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error in submitting Testimony", error.message);
      toast.error("Error in submitting Testimony", error.message);
    }
  };

  return (
    <main className="w-full p-2 flex flex-col justify-center items-center">
      {!testimonyGenerated && !loading ? (
        <>
          {/* //header */}
          <section className="flex flex-row justify-between items-start w-full">
            <div className="flex flex-col justify-center items-start">
              <h1 className="text-lg font-semibold text-teal-700 text-left">
                Add Case Testimony
              </h1>
              <h3 className="text-xs font-light text-neutral-600">
                Add your testimony in textual form
              </h3>
            </div>
            <div className="cursor-pointer" onClick={handleTestimonyClose}>
              <Close />
            </div>
          </section>
          {/* header ends */}
          <section className="w-full">
            <textarea
              required
              value={testimony}
              onChange={handleChangeTestimony}
              placeholder="Add your Testimony..."
              rows={12}
              className="w-full resize-none bg-[#00808030] text-black rounded-md p-2"
            />
          </section>

          <section className="flex space-x-5 flex-row w-full items-center justify-end">
            {/* <label htmlFor="file-upload" className="cursor-pointer">
          <img src={fileUpload} alt="fileUploadIcon" />
        </label>
        <input
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileUpload}
          style={{ display: "none" }}
        /> */}
            <Send
              className="text-teal-800 cursor-pointer"
              onClick={handleSubmit}
            />
          </section>
        </>
      ) : (
        <>
          {!loading ? (
            <>
              <section className="flex flex-row justify-between items-start w-full">
                <div className="flex flex-col justify-center items-start">
                  <h1 className="text-lg font-semibold text-teal-700 text-left">
                    Add Case Testimony
                  </h1>
                </div>
                <div className="cursor-pointer" onClick={handleTestimonyClose}>
                  <Close />
                </div>
              </section>
              <section className="w-full">
                <textarea
                  required
                  readOnly
                  value={testimonyRelevance}
                  rows={12}
                  className="w-full resize-none bg-[#00808030] text-black rounded-md p-2"
                />
              </section>
            </>
          ) : (
            <>
              <section className="flex flex-row justify-between items-start w-full">
                <div className="flex flex-col justify-center items-start">
                  <h1 className="text-lg font-semibold text-teal-700 text-left">
                    Testimony Uploaded
                  </h1>
                </div>
                <div className="cursor-pointer" onClick={handleTestimonyClose}>
                  <Close />
                </div>
              </section>
              <section className="w-full flex items-center justify-center p-20">
                <img className="w-48 h-48" src={evidenceLoad} alt="loading" />
              </section>
            </>
          )}
        </>
      )}
    </main>
  );
};

export default TestimonyDialog;
