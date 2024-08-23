import React, { useEffect, useState } from "react";
import logo from "../../assets/images/claw-login.png";
import Styles from "./AiSidebar.module.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import { ArrowRight, Download } from "@mui/icons-material";
import { ArrowLeft } from "@mui/icons-material";
import {
  logout,
  setOverview,
} from "../../features/bookCourtRoom/LoginReducreSlice";
import aiAssistant from "../../assets/images/aiAssistant.png";
import assistantLogo from "../../assets/images/virtualAssistant.gif";
import aiAssistantLoader from "../../assets/images/aiAssistantLoading.gif";
import assistantIcon2 from "../../assets/images/assistantIcon2.png";
import axios from "axios";
import { NODE_API_ENDPOINT } from "../../utils/utils";
import countDown from "../../assets/images/countdown.gif";
import Markdown from "react-markdown";
import toast from "react-hot-toast";
import loader from "../../assets/images/aiAssistantLoading.gif";

const dialogText =
  "n publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is availablen publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is availablen publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available";

const aiSuggestion =
  "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.";

const TimerComponent = React.memo(({ EndSessionToCourtroom }) => {
  const slotTimeInterval = useSelector((state) => state.user.user.slotTime);
  const [timeLeft, setTimeLeft] = useState({ minutes: 0, seconds: 0 });
  const [countdownOver, setCountDownOver] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const minutesLeft = 60 - now.getMinutes() - 1;
      const secondsLeft = 60 - now.getSeconds();
      setTimeLeft({ minutes: minutesLeft, seconds: secondsLeft });
    };

    calculateTimeLeft();

    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (slotTimeInterval < new Date().getHours()) {
      setCountDownOver(true);
    }
  });

  return (
    <>
      <div
        className="flex justify-between items-center p-2 bg-[#C5C5C5] text-[#008080] border-2 rounded"
        style={{ borderColor: timeLeft.minutes < 5 ? "red" : "white" }}
      >
        <h1 className="text-sm m-0">Time Remaining:</h1>
        <h1
          className="text-sm m-0 font-semibold"
          style={{ color: timeLeft.minutes < 5 ? "red" : "#008080" }}
        >
          {timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes} :{" "}
          {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
        </h1>
      </div>
      {countdownOver ? (
        <div
          style={{
            width: "100%",
            height: "100vh",
            position: "absolute",
            left: "0",
            right: "0",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(3px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "20",
          }}
        >
          <div
            className="flex flex-col justify-center gap-20 p-5"
            style={{
              background: "linear-gradient(to right,#0e1118,#008080)",
              height: "450px",
              width: "900px",
              border: "4px solid red",
              borderRadius: "10px",
            }}
          >
            <div className="flex flex-col justify-center items-center gap-10">
              <img className="w-28 h-28" alt="clock" src={countDown} />
              <h1 className="text-3xl">Your Courtroom Time is Over</h1>
            </div>
            <div className="flex justify-center">
              <motion.button
                onClick={() => EndSessionToCourtroom()}
                whileTap={{ scale: "0.95" }}
                className="border border-white rounded-lg py-2 px-8"
              >
                Go Back To Homepage
              </motion.button>
              {/* <Link to={"/courtroom-ai/verdict"}>
                <motion.button
                  onClick={() => setCountDownOver(false)}
                  whileTap={{ scale: "0.95" }}
                  className="border border-white rounded-lg py-2 px-8 text-white"
                >
                  View Verdict
                </motion.button>
              </Link> */}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
});

const AiSidebar = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [firstDraft, setFirstDraft] = useState("");
  const [inputText, setInputText] = useState(
    "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content."
  );

  const [showAskLegalGPT, setShowAskLegalGPT] = useState(false);
  const [promptArr, setPromptArr] = useState([]);
  const [askLegalGptPrompt, setAskLegalGptPrompt] = useState(null);
  const [searchQuery, setSearchQuery] = useState(false);

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
  // useEffect(() => {
  //   const newPages = getPages(inputText);
  //   setPages(newPages);
  //   setCurrentText(newPages[currentPage] || "");
  // }, [inputText]);

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
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isApi, setisApi] = useState(false);
  const overViewDetails = useSelector((state) => state.user.caseOverview);
  const currentUser = useSelector((state) => state.user.user);
  const slotTimeInterval = useSelector((state) => state.user.user.slotTime);

  const [editDialog, setEditDialog] = useState(false);
  const [firstDraftDialog, setFirstDraftDialog] = useState(false);
  const [firstDraftLoading, setFirsDraftLoading] = useState(false);
  const [text, setText] = useState("");
  const [aiIconHover, setAiIconHover] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [AiQuestions, setAiQuestions] = useState(null);
  const [aiAssistantLoading, setAiAssistantLoading] = useState(true);
  const [downloadCaseLoading, setDownloadCaseLoading] = useState(false);
  const [downloadSessionLoading, setDownloadSessionLoading] = useState(false);

  useEffect(() => {
    setText(overViewDetails);
  }, [overViewDetails]);

  const handleExit = () => {
    navigate("/court-room");
  };

  const ExitToCourtroom = async () => {
    localStorage.removeItem("hasSeenSplash");
    localStorage.setItem("FileUploaded", false);

    // await saveHistory();

    dispatch(logout());

    navigate("/");
  };

  const EndSessionToCourtroom = async () => {
    localStorage.removeItem("hasSeenSplash");
    localStorage.setItem("FileUploaded", false);

    // await saveHistory();
    if (overViewDetails !== "") {
      await axios.post(
        `${NODE_API_ENDPOINT}/courtroom/api/end`,
        {
          userId: currentUser.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
    }

    dispatch(logout());

    navigate("/");
  };

  const saveHistory = async () => {
    try {
      if (overViewDetails !== "NA") {
        await axios.post(
          `${NODE_API_ENDPOINT}/courtroom/api/history`,
          {
            // user_id: currentUser.userId,
          },
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
      }
    } catch (error) {
      toast.error("Error in saving history");
      console.error("Error in saving history", error);
    }
  };

  const handleSave = async () => {
    try {
      await axios.post(
        `${NODE_API_ENDPOINT}/courtroom/edit_case`,
        {
          // user_id: currentUser.userId,
          case_overview: text,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      dispatch(setOverview(text));
      setEditDialog(false);
    } catch (error) {
      toast.error("Error in saving case");
      console.error("Error in saving case", error);
    }
  };
  const handleFirstDraft = async () => {
    if (isApi) {
      setFirsDraftLoading(true);
    }

    setFirstDraftDialog(true);
  };

  useEffect(() => {
    if (overViewDetails !== "") {
      setisApi(true);
      const firstDraftApi = async () => {
        try {
          const response = await axios.post(
            `${NODE_API_ENDPOINT}/courtroom/api/draft`,
            {
              // user_id: currentUser.userId,
            },
            {
              headers: {
                Authorization: `Bearer ${currentUser.token}`,
              },
            }
          );

          console.log("response is ", response.data.data.draft.detailed_draft);
          setFirstDraft(response.data.data.draft.detailed_draft);
        } catch (error) {
          toast.error("Error in getting first draft");
        } finally {
          setFirsDraftLoading(false);
          setisApi(false);
        }
      };
      firstDraftApi();
    }
  }, [overViewDetails]);

  const getAiQuestions = async () => {
    setAiAssistantLoading(true);
    try {
      const response = await axios.post(
        `${NODE_API_ENDPOINT}/courtroom/api/hallucination_questions`,
        {
          // user_id: currentUser.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      console.log(
        response.data.data.hallucinationQuestions.assistant_questions
      );
      setAiQuestions(
        response.data.data.hallucinationQuestions.assistant_questions
      );
      setAiAssistantLoading(false);
    } catch (error) {
      console.error("Error fetching AI questions:", error);
      setAiAssistantLoading(false);
    }
  };

  useEffect(() => {
    const getOverview = async () => {
      try {
        const overView = await axios.post(
          `${NODE_API_ENDPOINT}/courtroom/getCaseOverview`,
          {
            // user_id: currentUser.userId,
          },
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );

        console.log(overView.data.data.case_overview);
        if (overView.data.data.case_overview === "NA") {
          dispatch(setOverview(""));
        } else {
          dispatch(setOverview(overView.data.data.case_overview));
        }
      } catch (error) {
        toast.error("Error in fetching case overview");
        console.error("Error fetching case overview", error);
      }
    };
    if (currentUser.userId) {
      getOverview();

      console.log(currentUser.userId);
    }
  }, [currentUser.userId]);

  const downloadCaseHistory = async () => {
    setDownloadCaseLoading(true);
    try {
      await saveHistory();
      const response = await axios.post(
        `${NODE_API_ENDPOINT}/courtroom/api/downloadCaseHistory`,
        {
          // user_id: currentUser.userId,
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
      link.setAttribute("download", `case_history_claw.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading case history:", error);
      toast.error("Error downloading case history");
    } finally {
      setDownloadCaseLoading(false);
    }
  };

  const downloadSessionCaseHistory = async () => {
    setDownloadSessionLoading(true);
    try {
      await saveHistory();

      const response = await axios.post(
        `${NODE_API_ENDPOINT}/courtroom/api/downloadSessionCaseHistory`,
        {
          // user_id: currentUser.userId,
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
      link.setAttribute("download", `case_session_history_claw.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading case history:", error);
      toast.error("Error downloading case history");
    } finally {
      setDownloadSessionLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const dowloadFirstDraft = async () => {
    try {
      const response = await axios.post(
        `${NODE_API_ENDPOINT}/courtroom/api/download`,
        {
          // user_id: currentUser.userId,
          data: firstDraft,
          type: "First Draft",
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
      link.setAttribute("download", `first_draft_claw.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading case history:", error);
      toast.error("Error downloading case history");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3 h-screen py-3 pl-3">
        {/* top container */}
        <div className="bg-[#008080] h-[30vh] pt-1 px-4 pb-4 border-2 border-black rounded gap-2 flex flex-col">
          <motion.div
            className="max-w-fit rounded-lg flex gap-2 items-center pt-2 cursor-pointer"
            whileTap={{ scale: "0.95" }}
            onClick={handleGoBack}
          >
            <svg
              className="h-7 w-7"
              fill="#C5C5C5"
              clip-rule="evenodd"
              fill-rule="evenodd"
              stroke-linejoin="round"
              stroke-miterlimit="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m10.978 14.999v3.251c0 .412-.335.75-.752.75-.188 0-.375-.071-.518-.206-1.775-1.685-4.945-4.692-6.396-6.069-.2-.189-.312-.452-.312-.725 0-.274.112-.536.312-.725 1.451-1.377 4.621-4.385 6.396-6.068.143-.136.33-.207.518-.207.417 0 .752.337.752.75v3.251h9.02c.531 0 1.002.47 1.002 1v3.998c0 .53-.471 1-1.002 1z"
                fill-rule="nonzero"
              />
            </svg>
            <p className="m-0">Go Back</p>
          </motion.div>
          <div className="flex-1  overflow-auto">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row justify-between items-center ">
                <p className="text-[#00FFA3] text-[18px] m-0">
                  Case Details :{" "}
                </p>

                <motion.button
                  whileTap={{ scale: "0.95" }}
                  onClick={() => setEditDialog(true)}
                  className="border-2 border-[#00FFA3] rounded-lg p-1 px-2"
                >
                  Edit
                </motion.button>
              </div>
              <div className="h-[50px] overflow-auto">
                <h1 className="text-sm m-0 py-2">
                  <Markdown>{overViewDetails}</Markdown>
                </h1>
              </div>
            </div>
          </div>
          <TimerComponent EndSessionToCourtroom={EndSessionToCourtroom} />
        </div>
        {/* bottom container */}
        <div className="flex-1 overflow-auto border-2 border-black rounded flex flex-col relative px-4 py-4 gap-2 justify-between">
          <div className="">
            <motion.div
              className={`${
                overViewDetails === "NA" || overViewDetails === ""
                  ? "opacity-75 pointer-events-none cursor-not-allowed"
                  : ""
              }`}
              onClick={() => downloadSessionCaseHistory()}
              whileTap={{ scale: "0.95" }}
              whileHover={{ scale: "1.01" }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "5px 20px",
                background: "#C5C5C5",
                color: "#008080",
                border: "2px solid white",
                borderRadius: "5px",
                marginBottom: "5px",
                cursor: `${downloadSessionLoading ? "wait" : "pointer"}`,
              }}
            >
              <div>
                <p style={{ fontSize: "15px", margin: "0" }}>
                  Download Session History
                </p>
              </div>
              <div style={{ width: "15px", margin: "0" }}>
                <svg
                  width="24"
                  height="24"
                  style={{ fill: "#008080", cursor: "pointer" }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                >
                  <path d="M14 4h-13v18h20v-11h1v12h-22v-20h14v1zm10 5h-1v-6.293l-11.646 11.647-.708-.708 11.647-11.646h-6.293v-1h8v8z" />
                </svg>
              </div>
            </motion.div>
            <motion.div
              className={`${
                overViewDetails === "NA" || overViewDetails === ""
                  ? "opacity-75 pointer-events-none cursor-not-allowed"
                  : ""
              }`}
              onClick={() => downloadCaseHistory()}
              whileTap={{ scale: "0.95" }}
              whileHover={{ scale: "1.01" }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "5px 20px",
                background: "#C5C5C5",
                color: "#008080",
                border: "2px solid white",
                borderRadius: "5px",
                cursor: `${downloadCaseLoading ? "wait" : "pointer"}`,
                marginBottom: "5px",
              }}
            >
              <div>
                <p style={{ fontSize: "15px", margin: "0" }}>
                  Download Case History
                </p>
              </div>
              <div style={{ width: "15px", margin: "0" }}>
                <svg
                  width="24"
                  height="24"
                  style={{ fill: "#008080", cursor: "pointer" }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                >
                  <path d="M14 4h-13v18h20v-11h1v12h-22v-20h14v1zm10 5h-1v-6.293l-11.646 11.647-.708-.708 11.647-11.646h-6.293v-1h8v8z" />
                </svg>
              </div>
            </motion.div>
            <motion.div
              onClick={() => setShowAskLegalGPT(true)}
              whileTap={{ scale: "0.95" }}
              whileHover={{ scale: "1.01" }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "5px 20px",
                background: "#C5C5C5",
                color: "#008080",
                border: "2px solid white",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              <div>
                <p style={{ fontSize: "15px", margin: "0" }}>Ask LegalGPT</p>
              </div>
              <div style={{ width: "15px", margin: "0" }}>
                <svg
                  width="24"
                  height="24"
                  style={{ fill: "#008080", cursor: "pointer" }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                >
                  <path d="M14 4h-13v18h20v-11h1v12h-22v-20h14v1zm10 5h-1v-6.293l-11.646 11.647-.708-.708 11.647-11.646h-6.293v-1h8v8z" />
                </svg>
              </div>
            </motion.div>
          </div>
          <div className="flex justify-end cursor-pointer relative">
            <motion.img
              className="h-11 w-11"
              whileTap={{ scale: "0.95" }}
              alt="assistant"
              src={showAssistant ? assistantIcon2 : aiAssistant}
              onHoverStart={() => setAiIconHover(true)}
              onHoverEnd={() => setAiIconHover(false)}
              onClick={() => {
                setShowAssistant(true);
                getAiQuestions();
              }}
            />
            {aiIconHover ? (
              <h1 className="absolute text-xs right-16 top-1 bg-[#033E40] p-2 rounded-lg border-2 border-[#00ffa3]">
                CLAW AI Assistant
              </h1>
            ) : (
              ""
            )}
          </div>
          <div className="flex flex-col w-full h-full justify-start items-center gap-2">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // margin: "40px 0px",
              }}
            >
              <img className="w-28" src={logo} alt="logo" />
            </div>
            <div className="h-full flex flex-col justify-evenly">
              <motion.div
                onClick={handleFirstDraft}
                whileTap={{ scale: "0.95" }}
                whileHover={{ scale: "1.01" }}
                className={`${
                  overViewDetails === "NA" || overViewDetails === ""
                    ? "opacity-75 pointer-events-none cursor-not-allowed"
                    : ""
                }`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 17 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.2188 13.125H4.78125C4.42901 13.125 4.0912 13.0098 3.84212 12.8047C3.59305 12.5995 3.45313 12.3213 3.45312 12.0313V1.96875C3.45313 1.67867 3.59305 1.40047 3.84212 1.19535C4.0912 0.990236 4.42901 0.875002 4.78125 0.875002H9.65281C9.82734 0.874745 10.0002 0.90282 10.1616 0.95762C10.3229 1.01242 10.4696 1.09287 10.5931 1.19438L13.1591 3.3075C13.2823 3.40926 13.38 3.53003 13.4466 3.6629C13.5131 3.79578 13.5472 3.93815 13.5469 4.08188V12.0313C13.5469 12.3213 13.4069 12.5995 13.1579 12.8047C12.9088 13.0098 12.571 13.125 12.2188 13.125ZM4.78125 1.3125C4.56991 1.3125 4.36722 1.38164 4.21777 1.50471C4.06833 1.62778 3.98438 1.7947 3.98438 1.96875V12.0313C3.98438 12.2053 4.06833 12.3722 4.21777 12.4953C4.36722 12.6184 4.56991 12.6875 4.78125 12.6875H12.2188C12.4301 12.6875 12.6328 12.6184 12.7822 12.4953C12.9317 12.3722 13.0156 12.2053 13.0156 12.0313V4.08188C13.0154 3.90789 12.9314 3.74108 12.7819 3.61813L10.2159 1.505C10.0666 1.3819 9.86409 1.31265 9.65281 1.3125H4.78125Z"
                    fill="white"
                  />
                  <path
                    d="M11.9531 4.15625H10.8906C10.5384 4.15625 10.2006 4.04102 9.9515 3.8359C9.70243 3.63078 9.5625 3.35258 9.5625 3.0625V2.1875C9.5625 2.12948 9.59049 2.07384 9.6403 2.03282C9.69011 1.9918 9.75768 1.96875 9.82812 1.96875C9.89857 1.96875 9.96614 1.9918 10.016 2.03282C10.0658 2.07384 10.0938 2.12948 10.0938 2.1875V3.0625C10.0938 3.23655 10.1777 3.40347 10.3271 3.52654C10.4766 3.64961 10.6793 3.71875 10.8906 3.71875H11.9531C12.0236 3.71875 12.0911 3.7418 12.141 3.78282C12.1908 3.82384 12.2188 3.87948 12.2188 3.9375C12.2188 3.99552 12.1908 4.05116 12.141 4.09218C12.0911 4.1332 12.0236 4.15625 11.9531 4.15625ZM8.5 3.28125H5.57812C5.50768 3.28125 5.44011 3.2582 5.3903 3.21718C5.34049 3.17616 5.3125 3.12052 5.3125 3.0625C5.3125 3.00448 5.34049 2.94884 5.3903 2.90782C5.44011 2.8668 5.50768 2.84375 5.57812 2.84375H8.5C8.57045 2.84375 8.63801 2.8668 8.68783 2.90782C8.73764 2.94884 8.76562 3.00448 8.76562 3.0625C8.76562 3.12052 8.73764 3.17616 8.68783 3.21718C8.63801 3.2582 8.57045 3.28125 8.5 3.28125ZM9.29688 4.8125H5.57812C5.50768 4.8125 5.44011 4.78945 5.3903 4.74843C5.34049 4.70741 5.3125 4.65177 5.3125 4.59375C5.3125 4.53573 5.34049 4.48009 5.3903 4.43907C5.44011 4.39805 5.50768 4.375 5.57812 4.375H9.29688C9.36732 4.375 9.43489 4.39805 9.4847 4.43907C9.53451 4.48009 9.5625 4.53573 9.5625 4.59375C9.5625 4.65177 9.53451 4.70741 9.4847 4.74843C9.43489 4.78945 9.36732 4.8125 9.29688 4.8125ZM11.4219 6.34375H5.57812C5.50768 6.34375 5.44011 6.3207 5.3903 6.27968C5.34049 6.23866 5.3125 6.18302 5.3125 6.125C5.3125 6.06698 5.34049 6.01134 5.3903 5.97032C5.44011 5.9293 5.50768 5.90625 5.57812 5.90625H11.4219C11.4923 5.90625 11.5599 5.9293 11.6097 5.97032C11.6595 6.01134 11.6875 6.06698 11.6875 6.125C11.6875 6.18302 11.6595 6.23866 11.6097 6.27968C11.5599 6.3207 11.4923 6.34375 11.4219 6.34375ZM11.4219 7.875H5.57812C5.50768 7.875 5.44011 7.85195 5.3903 7.81093C5.34049 7.76991 5.3125 7.71427 5.3125 7.65625C5.3125 7.59823 5.34049 7.54259 5.3903 7.50157C5.44011 7.46055 5.50768 7.4375 5.57812 7.4375H11.4219C11.4923 7.4375 11.5599 7.46055 11.6097 7.50157C11.6595 7.54259 11.6875 7.59823 11.6875 7.65625C11.6875 7.71427 11.6595 7.76991 11.6097 7.81093C11.5599 7.85195 11.4923 7.875 11.4219 7.875ZM11.4219 9.40625H5.57812C5.50768 9.40625 5.44011 9.3832 5.3903 9.34218C5.34049 9.30116 5.3125 9.24552 5.3125 9.1875C5.3125 9.12948 5.34049 9.07384 5.3903 9.03282C5.44011 8.9918 5.50768 8.96875 5.57812 8.96875H11.4219C11.4923 8.96875 11.5599 8.9918 11.6097 9.03282C11.6595 9.07384 11.6875 9.12948 11.6875 9.1875C11.6875 9.24552 11.6595 9.30116 11.6097 9.34218C11.5599 9.3832 11.4923 9.40625 11.4219 9.40625ZM11.4219 10.9375H5.57812C5.50768 10.9375 5.44011 10.9145 5.3903 10.8734C5.34049 10.8324 5.3125 10.7768 5.3125 10.7188C5.3125 10.6607 5.34049 10.6051 5.3903 10.5641C5.44011 10.523 5.50768 10.5 5.57812 10.5H11.4219C11.4923 10.5 11.5599 10.523 11.6097 10.5641C11.6595 10.6051 11.6875 10.6607 11.6875 10.7188C11.6875 10.7768 11.6595 10.8324 11.6097 10.8734C11.5599 10.9145 11.4923 10.9375 11.4219 10.9375Z"
                    fill="white"
                  />
                </svg>

                <p className="m-0 text-sm text-white">View first Draft</p>
              </motion.div>
              <motion.div
                className={`${
                  overViewDetails === "NA" || overViewDetails === ""
                    ? "opacity-75 pointer-events-none cursor-not-allowed"
                    : ""
                }`}
                whileTap={{ scale: "0.95" }}
                whileHover={{ scale: "1.01" }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="white"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 12c0 1.042-.154 2.045-.425 3h-2.101c.335-.94.526-1.947.526-3 0-4.962-4.037-9-9-9-1.706 0-3.296.484-4.654 1.314l1.857 2.686h-6.994l2.152-7 1.85 2.673c1.683-1.049 3.658-1.673 5.789-1.673 6.074 0 11 4.925 11 11zm-6.354 7.692c-1.357.826-2.944 1.308-4.646 1.308-4.963 0-9-4.038-9-9 0-1.053.191-2.06.525-3h-2.1c-.271.955-.425 1.958-.425 3 0 6.075 4.925 11 11 11 2.127 0 4.099-.621 5.78-1.667l1.853 2.667 2.152-6.989h-6.994l1.855 2.681zm-3.646-7.692v-6h-2v8h7v-2h-5z" />
                </svg>
                <p className="m-0 text-sm text-white">Old Case Search</p>
              </motion.div>
              <Link to={"/courtroom-ai"}>
                <motion.div
                  whileTap={{ scale: "0.95" }}
                  whileHover={{ scale: "1.01" }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    fill="white"
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                    stroke-linejoin="round"
                    stroke-miterlimit="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="m11 11h-7.25c-.414 0-.75.336-.75.75s.336.75.75.75h7.25v7.25c0 .414.336.75.75.75s.75-.336.75-.75v-7.25h7.25c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-7.25v-7.25c0-.414-.336-.75-.75-.75s-.75.336-.75.75z"
                      fill-rule="nonzero"
                    />
                  </svg>
                  <p
                    className="m-0 text-sm text-white"
                    onClick={() => saveHistory()}
                  >
                    New Case Input
                  </p>
                </motion.div>
              </Link>
              <motion.div
                whileTap={{ scale: "0.95" }}
                whileHover={{ scale: "1.01" }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                >
                  <path d="M22 11.414v12.586h-20v-12.586l-1.293 1.293-.707-.707 12-12 12 12-.707.707-1.293-1.293zm-6 11.586h5v-12.586l-9-9-9 9v12.586h5v-9h8v9zm-1-7.889h-6v7.778h6v-7.778z" />
                </svg>
                <p className="m-0 text-sm">Claw Home</p>
              </motion.div>
              <motion.div
                whileTap={{ scale: "0.95" }}
                whileHover={{ scale: "1.01" }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                >
                  <path d="M11 21h8.033v-2l1-1v4h-9.033v2l-10-3v-18l10-3v2h9.033v5l-1-1v-3h-8.033v18zm-1 1.656v-21.312l-8 2.4v16.512l8 2.4zm11.086-10.656l-3.293-3.293.707-.707 4.5 4.5-4.5 4.5-.707-.707 3.293-3.293h-9.053v-1h9.053z" />
                </svg>

                <p className="m-0 text-sm" onClick={() => ExitToCourtroom()}>
                  Exit Courtroom
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {firstDraftDialog ? (
        <div
          style={{
            width: "100%",
            height: "100vh",
            position: "absolute",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(3px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "3",
            overflow: "auto",
          }}
        >
          {firstDraftLoading ? (
            <div
              className="border-2 border-white rounded-lg w-2/6 h-fit p-2 flex flex-row justify-center items-center"
              style={{
                background: "linear-gradient(to right,#0e1118,#008080)",
              }}
            >
              <img className="h-40 w-40 my-10" src={loader} alt="loader" />
            </div>
          ) : (
            <div
              className="h-fit w-2/3 rounded-md border-2 border-white"
              style={{
                background: "linear-gradient(to right,#0e1118,#008080)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <svg
                  onClick={() => setFirstDraftDialog(false)}
                  style={{ margin: "20px", cursor: "pointer" }}
                  width="30"
                  height="30"
                  fill="white"
                  stroke="white"
                  clip-rule="evenodd"
                  fill-rule="evenodd"
                  stroke-linejoin="round"
                  stroke-miterlimit="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 1.5c-4.69 0-8.497 3.807-8.497 8.497s3.807 8.498 8.497 8.498 8.498-3.808 8.498-8.498-3.808-8.497-8.498-8.497zm0 7.425 2.717-2.718c.146-.146.339-.219.531-.219.404 0 .75.325.75.75 0 .193-.073.384-.219.531l-2.717 2.717 2.727 2.728c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.384-.073-.53-.219l-2.729-2.728-2.728 2.728c-.146.146-.338.219-.53.219-.401 0-.751-.323-.751-.75 0-.192.073-.384.22-.531l2.728-2.728-2.722-2.722c-.146-.147-.219-.338-.219-.531 0-.425.346-.749.75-.749.192 0 .385.073.531.219z"
                    fill-rule="nonzero"
                  />
                </svg>
              </div>
              <div className="m-0 h-2/3 flex flex-column justify-center items-center">
                <div className="flex h-full px-5 pb-5 flex-row justify-between items-center w-full gap-5">
                  <div className="flex h-full  flex-row justify-center w-full items-center">
                    <div className="flex flex-col w-full rounded-md bg-white text-black h-[80vh] overflow-y-auto">
                      <div className="w-full px-2 h-fit my-2 items-center flex flex-row ">
                        <p className="uppercase font-bold my-2 w-full ">
                          First Draft Preview
                        </p>
                        <div className="flex flex-row w-full items-center">
                          <div className="h-1 bg-neutral-900 w-2/3" />
                          <div className="bg-neutral-900 rounded-md">
                            <img
                              className="w-[5vw] h-[29px]"
                              src={logo}
                              alt="logo"
                            />
                          </div>
                        </div>
                      </div>
                      <textarea
                        className="w-full h-full p-2.5 mb-4 text-black resize-none outline-none"
                        value={firstDraft}
                        onChange={(e) => setFirstDraft(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="h-[80vh] w-1 bg-neutral-200/40" />
                  <div className="flex flex-col justify-between h-[80vh] py-32 w-full gap-4 ">
                    <div className="flex flex-col w-full gap-2">
                      <img className="" src={logo} alt="logo" />
                      <h3 className=" text-center">Draft Preview</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="border border-white rounded-md py-1">
                        Relevant Case Laws
                      </button>
                      <button
                        onClick={() => dowloadFirstDraft()}
                        className="border border-white rounded-md py-1"
                      >
                        <Download /> Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}
      {editDialog ? (
        <div
          style={{
            width: "100%",
            height: "100vh",
            position: "absolute",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(3px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "3",
            overflow: "auto",
          }}
        >
          <div
            className="h-fit w-2/3 rounded-md border-2 border-white"
            style={{
              background: "linear-gradient(to right,#0e1118,#008080)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <svg
                onClick={() => setEditDialog(false)}
                style={{ margin: "20px", cursor: "pointer" }}
                width="30"
                height="30"
                fill="white"
                stroke="white"
                clip-rule="evenodd"
                fill-rule="evenodd"
                stroke-linejoin="round"
                stroke-miterlimit="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 1.5c-4.69 0-8.497 3.807-8.497 8.497s3.807 8.498 8.497 8.498 8.498-3.808 8.498-8.498-3.808-8.497-8.498-8.497zm0 7.425 2.717-2.718c.146-.146.339-.219.531-.219.404 0 .75.325.75.75 0 .193-.073.384-.219.531l-2.717 2.717 2.727 2.728c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.384-.073-.53-.219l-2.729-2.728-2.728 2.728c-.146.146-.338.219-.53.219-.401 0-.751-.323-.751-.75 0-.192.073-.384.22-.531l2.728-2.728-2.722-2.722c-.146-.147-.219-.338-.219-.531 0-.425.346-.749.75-.749.192 0 .385.073.531.219z"
                  fill-rule="nonzero"
                />
              </svg>
            </div>
            {/* <div className="m-0 flex flex-column justify-center items-center"> */}
            <div className="grid grid-cols-2  px-5 pb-3 justify-between items-center w-full gap-5">
              <div className="flex flex-row justify-center w-full items-center">
                <div
                  className={`${
                    isEditing ? "border-4  border-teal-400" : "border-none"
                  } rounded-md delay-150 flex flex-col w-[30rem] bg-white text-black h-[70vh] overflow-y-auto`}
                >
                  <div className="w-full px-2 h-fit my-2 items-center flex flex-row ">
                    <p className="uppercase font-bold my-2 w-full ">
                      Edit Your Document
                    </p>
                    <div className="flex flex-row w-full items-center">
                      <div className="h-1 bg-neutral-900 w-2/3" />
                      <div className="bg-neutral-900 rounded-md">
                        <img
                          className="w-[5vw] h-[29px]"
                          src={logo}
                          alt="logo"
                        />
                      </div>
                    </div>
                  </div>
                  <textarea
                    className="w-full h-full p-2.5 mb-4 text-black resize-none outline-none"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>
              </div>
              {/* <div className="h-5/6 w-1 bg-neutral-200/40" /> */}
              <div className="flex flex-col justify-between py-20  w-full gap-4 ">
                <div className="flex flex-col w-full gap-4">
                  <img className="" src={logo} alt="logo" />
                  <h1 className="uppercase text-center font-bold text-4xl">
                    {" "}
                    Edit Your Document
                  </h1>
                </div>
                <div className="flex flex-col w-full  justify-between">
                  <div className="flex flex-col w-full justify-center items-center gap-4">
                    <div className="flex flex-row justify-center gap-2 w-full">
                      <Button
                        className="lowercase border-2 text-sm border-white text-white"
                        variant="outlined"
                        onClick={handleSave} // Modify if needed
                      >
                        Save
                      </Button>
                      <Button
                        className="text-white text-sm border-2 border-white"
                        variant="outlined"
                        onClick={handleEditToggle}
                      >
                        {isEditing ? "Save Changes" : "Edit current document"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* </div> */}
          </div>
        </div>
      ) : null}
      {showAssistant ? (
        <div
          // md:left-[28rem] md:top-32
          // bg-[#eeeeee]
          className="absolute flex  h-screen items-center left-1/4 overflow-auto z-10
              "
        >
          <div className="bg-[#eeeeee] border-8 border-white rounded-xl shadow-inner">
            <div className="flex justify-between gap-14 items-center shadow-md">
              <div className="flex items-center">
                <img alt="logo" className="h-20 w-20" src={assistantLogo} />
                <h1 className="m-0 text-2xl font-semibold text-[#008080]">
                  CLAW AI Assistant
                </h1>
              </div>
              <div className="pr-5">
                <svg
                  onClick={() => setShowAssistant(false)}
                  width="35"
                  height="35"
                  fill="#008080"
                  clip-rule="evenodd"
                  fill-rule="evenodd"
                  stroke-linejoin="round"
                  stroke-miterlimit="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 8.933-2.721-2.722c-.146-.146-.339-.219-.531-.219-.404 0-.75.324-.75.749 0 .193.073.384.219.531l2.722 2.722-2.728 2.728c-.147.147-.22.34-.22.531 0 .427.35.75.751.75.192 0 .384-.073.53-.219l2.728-2.728 2.729 2.728c.146.146.338.219.53.219.401 0 .75-.323.75-.75 0-.191-.073-.384-.22-.531l-2.727-2.728 2.717-2.717c.146-.147.219-.338.219-.531 0-.425-.346-.75-.75-.75-.192 0-.385.073-.531.22z"
                    fill-rule="nonzero"
                  />
                </svg>
              </div>
            </div>
            {aiAssistantLoading ? (
              <div className="flex justify-center items-center p-[5em]">
                <img
                  className="h-32 w-32"
                  alt="loader"
                  src={aiAssistantLoader}
                />
              </div>
            ) : (
              <div className="m-4">
                <textarea
                  readOnly
                  className="w-full h-[350px] p-2 bg-transparent text-black focus:outline-none cursor-default"
                  value={AiQuestions}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
      {showAskLegalGPT ? (
        <div
          style={{
            width: "100%",
            height: "100vh",
            position: "absolute",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(3px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "3",
            overflow: "auto",
          }}
        >
          {promptArr.length === 0 ? (
            <div className="h-screen flex flex-col justify-between border-2 border-white rounded w-2/4 bg-[#222222]">
              <div
                className="flex justify-end p-3 cursor-pointer"
                onClick={() => {
                  setShowAskLegalGPT(false);
                  setPromptArr([]);
                }}
              >
                <svg
                  className="w-7 h-7"
                  fill="white"
                  clip-rule="evenodd"
                  fill-rule="evenodd"
                  stroke-linejoin="round"
                  stroke-miterlimit="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 1.5c-4.69 0-8.497 3.807-8.497 8.497s3.807 8.498 8.497 8.498 8.498-3.808 8.498-8.498-3.808-8.497-8.498-8.497zm0 7.425 2.717-2.718c.146-.146.339-.219.531-.219.404 0 .75.325.75.75 0 .193-.073.384-.219.531l-2.717 2.717 2.727 2.728c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.384-.073-.53-.219l-2.729-2.728-2.728 2.728c-.146.146-.338.219-.53.219-.401 0-.751-.323-.751-.75 0-.192.073-.384.22-.531l2.728-2.728-2.722-2.722c-.146-.147-.219-.338-.219-.531 0-.425.346-.749.75-.749.192 0 .385.073.531.219z"
                    fill-rule="nonzero"
                  />
                </svg>
              </div>
              <div className="flex flex-col justify-center items-center gap-3">
                <h4>Have A Query?</h4>
                <h1 className="font-bold">
                  Ask {"  "}
                  <span
                    style={{
                      padding: 3,
                      borderLeft: `4px solid #00FFA3`,
                      background: `linear-gradient(to right, rgba(0,128,128,0.75), rgba(0,128,128,0) 100%)`,
                    }}
                  >
                    LegalGPT
                  </span>
                </h1>
                <p className="px-[70px] text-center">
                  Drop your queries here and let LegalGPT assist you with all
                  your questions and queries
                </p>
              </div>
              <div className="flex gap-2 p-3">
                <input
                  className="flex-1 p-2 rounded text-black"
                  placeholder="Enter Your Query Here"
                  value={askLegalGptPrompt}
                  onChange={(e) => setAskLegalGptPrompt(e.target.value)}
                />
                <motion.button
                  whileTap={{ scale: "0.95" }}
                  onClick={() => {
                    setSearchQuery(true);
                    setPromptArr([
                      ...promptArr,
                      {
                        prompt: askLegalGptPrompt,
                        promptResponse: null,
                        // promptResponse:
                        //   "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.",
                      },
                    ]);
                    setAskLegalGptPrompt(null);
                  }}
                  className="px-3 rounded"
                  style={{
                    background: "linear-gradient(180deg, #008080,#001A1A)",
                  }}
                >
                  Send
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="h-screen flex flex-col border-2 border-white rounded w-2/4 bg-[#222222]">
              <div className="flex justify-between">
                <div className="flex gap-2 py-3 px-4">
                  <h3 className="text-xl text-[#00FFA3]">LegalGPT</h3>
                  <p className="text-xs">by Claw</p>
                </div>

                <div
                  className="flex justify-end p-3 cursor-pointer"
                  onClick={() => {
                    setShowAskLegalGPT(false);
                    setPromptArr([]);
                  }}
                >
                  <svg
                    className="w-7 h-7"
                    fill="white"
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                    stroke-linejoin="round"
                    stroke-miterlimit="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 1.5c-4.69 0-8.497 3.807-8.497 8.497s3.807 8.498 8.497 8.498 8.498-3.808 8.498-8.498-3.808-8.497-8.498-8.497zm0 7.425 2.717-2.718c.146-.146.339-.219.531-.219.404 0 .75.325.75.75 0 .193-.073.384-.219.531l-2.717 2.717 2.727 2.728c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.384-.073-.53-.219l-2.729-2.728-2.728 2.728c-.146.146-.338.219-.53.219-.401 0-.751-.323-.751-.75 0-.192.073-.384.22-.531l2.728-2.728-2.722-2.722c-.146-.147-.219-.338-.219-.531 0-.425.346-.749.75-.749.192 0 .385.073.531.219z"
                      fill-rule="nonzero"
                    />
                  </svg>
                </div>
              </div>
              <div className="px-4 h-full flex flex-col justify-between">
                <div>
                  {promptArr.length > 0 &&
                    promptArr.map((x, index) => (
                      <div key={index}>
                        <div className="flex flex-col">
                          <div className="flex gap-3">
                            <svg
                              fill="white"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm7.753 18.305c-.261-.586-.789-.991-1.871-1.241-2.293-.529-4.428-.993-3.393-2.945 3.145-5.942.833-9.119-2.489-9.119-3.388 0-5.644 3.299-2.489 9.119 1.066 1.964-1.148 2.427-3.393 2.945-1.084.25-1.608.658-1.867 1.246-1.405-1.723-2.251-3.919-2.251-6.31 0-5.514 4.486-10 10-10s10 4.486 10 10c0 2.389-.845 4.583-2.247 6.305z" />
                            </svg>
                            <p>{x.prompt}</p>
                          </div>
                          {x.promptResponse ? (
                            <p className="border-2 border-white rounded bg-[#008080] p-2 text-sm">
                              {x.promptResponse}
                            </p>
                          ) : (
                            <div className="h-full w-full flex flex-col gap-2">
                              <div className="w-full h-3 bg-slate-600 animate-pulse  rounded-full"></div>
                              <div className="w-full h-3 bg-slate-600 animate-pulse  rounded-full"></div>
                              <div className="w-[60%] h-3 bg-slate-600 animate-pulse  rounded-full"></div>
                              <div className="w-[40%] h-3 bg-slate-600 animate-pulse  rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
                <div className="flex gap-2 py-3">
                  <input
                    className="flex-1 p-2 rounded text-black"
                    placeholder="Enter Your Query Here"
                    value={askLegalGptPrompt}
                    onChange={(e) => setAskLegalGptPrompt(e.target.value)}
                  />
                  <motion.button
                    whileTap={{ scale: "0.95" }}
                    onClick={() => {
                      setSearchQuery(true);
                      setPromptArr([
                        ...promptArr,
                        {
                          prompt: askLegalGptPrompt,
                          promptResponse: null,
                        },
                      ]);
                      setAskLegalGptPrompt(null);
                    }}
                    className="px-3 rounded"
                    style={{
                      background: "linear-gradient(180deg, #008080,#001A1A)",
                    }}
                  >
                    Send
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
};

export default AiSidebar;
