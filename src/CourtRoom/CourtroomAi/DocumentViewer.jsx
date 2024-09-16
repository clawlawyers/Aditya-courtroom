import React, { useState } from "react";
import "./verdict.css";
import Markdown from "react-markdown";
import logo from "../../assets/icons/clawlogo.png";
import verdictLogo from "../../assets/icons/verdict_logo.png";
import { motion } from "framer-motion";
import { NODE_API_ENDPOINT } from "../../utils/utils";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { removeCaseLaws, retrieveCaseLaws } from "../../features/laws/lawSlice";
import { Link } from "react-router-dom";
import { Close } from "@mui/icons-material";
import loader from "../../assets/images/argumentLoading.gif";

const DocumentViewer = ({ text }) => {
  const currentUser = useSelector((state) => state.user.user);

  const [showRelevantCaseJudge, setRelevantCaseJudge] = useState(false);
  const [relevantCases, setRelevantCases] = useState("");
  const [relevantCasesData, setRelevantCasesData] = useState("");
  const [loadingRelevantCases, setLoadingRelevantCases] = useState(false);

  const dispatch = useDispatch();

  const downloadVerdict = async () => {
    try {
      const response = await axios.post(
        `${NODE_API_ENDPOINT}/specificLawyerCourtroom/api/download`,
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
      console.log(error);
      // if (error.response.data.error.explanation === "Please refresh the page") {
      //   toast.error("Please refresh the page");
      //   return;
      // }
      console.error("Error downloading case history:", error);
      toast.error("Error downloading case history");
    }
  };

  const handleshowcaseaijudge = async () => {
    setRelevantCaseJudge(true);
    setRelevantCases("");
    setLoadingRelevantCases(true);

    try {
      const res = await axios.post(
        `${NODE_API_ENDPOINT}/specificLawyerCourtroom/api/relevant_cases_judge_lawyer`,
        {
          text_input: text,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      // console.log(res);
      setRelevantCasesData(res.data.data.relevantCases.relevant_case_law);
      var data = res.data.data.relevantCases.relevant_case_law;
      console.log(data);
      data = data.replace(/\\n/g, "<br/>");
      data = data.replace(/\\n\\n/g, "<br/><br/>");
      data = data.replace(/\\/g, " ");
      setRelevantCases(data);
      setLoadingRelevantCases(false);
    } catch (error) {}
  };

  return (
    <div className="flex h-screen gap-5 px-40">
      <div className="flex flex-col items-center bg-[#7ebab2] my-3 w-full">
        <img src={verdictLogo} alt="verdict" className=" mt-4" />{" "}
        {/* Added margin to top */}
        <img className="w-20 h-[5rem]" src={logo} alt="logo" />
        <div className="flex flex-col items-start justify-start px-5 h-full overflow-y-auto text-black pt-4">
          {" "}
          {/* Added padding to top */}
          <Markdown>{text}</Markdown>
        </div>
        <div className="flex flex-row w-full justify-end items-center gap-2 py-2 px-3">
          <motion.button
            whileTap={{ scale: "0.95" }}
            className="border-2 border-white p-2 rounded-lg text-white"
            onClick={() => handleshowcaseaijudge()}
          >
            Relevant Case Laws
          </motion.button>
          <motion.button
            whileTap={{ scale: "0.95" }}
            className="border-2 border-white p-2 rounded-lg"
            onClick={downloadVerdict}
          >
            Download
          </motion.button>
        </div>
      </div>
      {showRelevantCaseJudge ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            left: "0",
            right: "0",
            top: "0",
            // backgroundColor: "rgba(0, 0, 0, 0.1)",
            // backdropFilter: "blur(3px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "50",
          }}
        >
          <div className="w-2/5 h-[90%] bg-white rounded p-3 border border-black">
            <div className="flex  flex-row justify-between items-start w-full">
              <div className="flex  flex-col justify-center items-start">
                <h1 className="px-10 text-xl font-semibold text-teal-700 text-left">
                  Relevant Cases Laws
                </h1>
              </div>
              <div
                className="cursor-pointer text-black"
                onClick={() => setRelevantCaseJudge(false)}
              >
                <Close />
              </div>
            </div>
            <div className="h-[90%] flex overflow-auto items-center justify-center px-10 py-3 ">
              {!loadingRelevantCases ? (
                <p
                  className="text-black text-sm h-[90%]"
                  dangerouslySetInnerHTML={{ __html: relevantCases }}
                ></p>
              ) : (
                <div className="h-full flex justify-center items-center">
                  {" "}
                  <img alt="loading" src={loader} className="w-28 h-28" />
                </div>
              )}
            </div>
            {!loadingRelevantCases && (
              <div className="flex justify-end">
                <Link to={"/courtroom-ai/caseLaws"}>
                  <button
                    onClick={() => {
                      dispatch(removeCaseLaws());
                      dispatch(
                        retrieveCaseLaws({
                          query: relevantCasesData,
                          token: currentUser.token,
                        })
                      );
                    }}
                    className="bg-[#003131] px-4 py-1 text-sm rounded text-white"
                  >
                    View Case Laws
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default DocumentViewer;
