import React, { useEffect, useRef, useState } from "react";
import logo from "../../assets/images/claw-login.png";
import Styles from "./AiSidebar.module.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, CircularProgress, Menu } from "@mui/material";
import { ArrowRight, Close, Download } from "@mui/icons-material";
import { ArrowLeft } from "@mui/icons-material";
import { MenuItem, IconButton } from "@mui/material";
import { Popover } from "@mui/material";
import {
  logout,
  setFirstDraftAction,
  setFirstDraftLoading,
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
import { MoreVert } from "@mui/icons-material";
import EvidenceDialog from "../../components/Dialogs/EvidenceDialog";
import TestimonyDialog from "../../components/Dialogs/TestimonyDialog";
import aiDrafter from "../../assets/sideMenubar/Ai.png";
import firstDraftLogo from "../../assets/sideMenubar/firstDraftImg.png";
import oldCaseLogo from "../../assets/sideMenubar/oldCase.png";
import newCaseLogo from "../../assets/sideMenubar/newCase.png";
import homeLogo from "../../assets/sideMenubar/homeLogo.png";
import exitLogo from "../../assets/sideMenubar/exitLogo.png";
import {
  removeDrafter,
  retrieveDrafterQuestions,
} from "../../features/laws/drafterSlice";
import {
  removeCaseLaws,
  retrieveCaseLaws,
  setCaseLaws,
} from "../../features/laws/lawSlice";
import evidenceLoad from "../../assets/images/evidenceLoad.gif";
import { decryptData, encryptData } from "../../utils/encryption";
import sendIcon from "../../assets/icons/Send.png";

const drafterQuestions = [
  { name: "Bail Application", value: "bail_application" },
  { name: "Civil Appeal", value: "civil_appeal" },
  { name: "Civil Petition", value: "civil_petition" },
  { name: "Criminal Appeal", value: "criminal_appeal" },
  { name: "Criminal Petition", value: "criminal_petition" },
];

const TimerComponent = React.memo(({ ExitToCourtroom }) => {
  const totalHours = useSelector((state) => state.user.user.totalHours);
  const totalHoursUsed = useSelector((state) => state.user.user.totalUsedHours);

  // Format totalHours and totalHoursUsed for display
  const formatHours = (hours) => {
    if (isNaN(hours) || typeof hours !== "number") {
      hours = 0;
    }
    const hrs = Math.floor(hours);
    const mins = Math.round((hours - hrs) * 60);
    return `${hrs} hr ${mins} min`;
  };

  // Calculate initial time in seconds for timer
  const initialTime = totalHoursUsed * 3600;

  const [time, setTime] = useState(initialTime);
  const [timeOver, setTimeOver] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (totalHours * 3600 <= parseInt(time)) {
      setTimeOver(true);
    }
  }, [totalHours, time]);

  const formatTime = (seconds) => {
    if (isNaN(seconds) || typeof seconds !== "number") {
      seconds = 0;
    }
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };
  return (
    <>
      <div className="flex justify-between items-center px-2 py-1 bg-[#C5C5C5] text-[#008080] border-2 rounded">
        <h1 className="text-xs m-0">Total Time:</h1>
        <h1 className="text-xs m-0 font-semibold">{totalHours} hr</h1>
      </div>
      <div className="flex justify-between items-center px-2 py-1 bg-[#C5C5C5] text-[#008080] border-2 rounded">
        <h1 className="text-xs m-0">Time Used Up:</h1>
        <h1 className="text-xs m-0 font-semibold">
          {/* {timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes} :{" "}
          {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds} */}
          {formatTime(time)}
        </h1>
      </div>
      {timeOver ? (
        <div
          style={{
            width: "100%",
            height: "100vh",
            position: "absolute",
            left: "0",
            right: "0",
            top: "0",
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
                onClick={() => ExitToCourtroom()}
                whileTap={{ scale: "0.95" }}
                className="border border-white rounded-lg py-2 px-8"
              >
                Go Back To Homepage
              </motion.button>
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
  // console.log(promptArr);
  const [askLegalGptPrompt, setAskLegalGptPrompt] = useState("");
  const [searchQuery, setSearchQuery] = useState(false);
  const [evidenceAnchorEl, setEvidenceAnchorEl] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [testimonyAnchorEl, setTestimonyAnchorEl] = useState(null);
  const [aiDrafterQuestions, setAiDrafterQuestions] = useState([]);
  const [showDrafterQuestions, setShowDrafterQuestions] = useState(false);
  const [caseSearchDialog, setCaseSearchDialog] = useState(false);
  const [caseSearchPrompt, setCaseSearchPrompt] = useState("");
  const [caseSearchLoading, setCaseSearchLoading] = useState(false);
  const [nextAppealLoading, setNextAppealLoading] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);

  const charsPerPage = 1000; // Define this value outside the function

  // Update inputText when pages change
  useEffect(() => {
    setInputText(pages.join(""));
  }, [pages]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  const handleEvidenceClick = (event) => {
    setEvidenceAnchorEl(event.currentTarget);
    handleMenuClose();
  };

  const handleEvidenceClose = () => {
    setEvidenceAnchorEl(null);
  };

  const handleTestimonyClick = (event) => {
    setTestimonyAnchorEl(event.currentTarget);
    handleMenuClose();
  };

  const handleTestimonyClose = () => {
    setTestimonyAnchorEl(null);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isApi, setisApi] = useState(false);
  const overViewDetails = useSelector((state) => state.user.caseOverview);
  const currentUser = useSelector((state) => state.user.user);
  const aiAssistantAccess = useSelector(
    (state) => state?.user?.user?.courtroomFeatures?.AiAssistant
  );
  const firstDraftAccess = useSelector(
    (state) => state?.user?.user?.courtroomFeatures?.FirstDraft
  );
  const relevantCaseLawsAccess = useSelector(
    (state) => state?.user?.user?.courtroomFeatures?.RelevantCaseLaws
  );
  const legalGptAccess = useSelector(
    (state) => state?.user?.user?.courtroomFeatures?.LegalGPT
  );
  const evidenceAccess = useSelector(
    (state) => state?.user?.user?.courtroomFeatures?.Evidences
  );
  const firstDraftDetails = useSelector((state) => state.user.firstDraft);
  const firstDraftLoading = useSelector(
    (state) => state.user.firstDraftLoading
  );
  const authKey = useSelector((state) => state.user.authKey);

  const [editDialog, setEditDialog] = useState(false);
  const [firstDraftDialog, setFirstDraftDialog] = useState(false);
  // const [firstDraftLoading, setFirsDraftLoading] = useState(false);
  const [text, setText] = useState("");
  const [aiIconHover, setAiIconHover] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [AiQuestions, setAiQuestions] = useState(null);
  const [aiAssistantLoading, setAiAssistantLoading] = useState(true);
  const [downloadCaseLoading, setDownloadCaseLoading] = useState(false);
  const [downloadSessionLoading, setDownloadSessionLoading] = useState(false);
  const [aiAccessHover, setAiAccessHover] = useState(false);
  const [draftAccessHover, setDraftAccessHover] = useState(false);
  const [relevantCaseAccessHover, setRelevantCaseAccessHover] = useState(false);
  const [legalGptAccessHover, setLegalGptAccessHover] = useState(false);
  const [showRelevantLaws, setShowRelevantLaws] = useState(false);
  const [relevantCaseLoading, setRelevantCaseLoading] = useState(false);
  const [relevantLawsArr, setRelevantLawsArr] = useState(null);
  const [relevantLawData, setRelevantLawData] = useState("");
  const [evidenceAccessHover, setEvidenceAccessHover] = useState(false);
  const [appealDialog, setAppealDialog] = useState(false);
  const [appealData, setAppealData] = useState("");

  const scrollRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom on component mount and whenever the content changes
    const element = scrollRef?.current;
    if (element) {
      element.scrollTop = element?.scrollHeight;
    }
  }, [promptArr]);

  useEffect(() => {
    setText(overViewDetails);
  }, [overViewDetails]);

  const formatText = (text) => {
    return text
      .replace(/\\n\\n/g, "<br/><br/>")
      .replace(/\\n/g, "  <br/>")
      .replace(/\\/g, " ");
  };

  const getReventCaseLaw = async () => {
    setRelevantCaseLoading(true);

    try {
      const fetchedData = await fetch(
        `${NODE_API_ENDPOINT}/specificLawyerCourtroom/api/relevant_case_law`,
        {
          method: "POST",
        }
      );

      if (!fetchedData.ok) {
        const errorMessage = await fetchedData.json();
        console.error(errorMessage.error.explanation);
        if (errorMessage.error.explanation === "Please refresh the page") {
          toast.error("Please refresh the page.");
          return;
        }
        toast.error("Failed to fetch relevant case laws");
        return;
      }

      const data = await fetchedData.json();
      const decryptedData = decryptData(
        data.data.relevantCases.relevant_case_law,
        authKey
      );
      const formattedData = formatText(decryptedData);
      setRelevantLawData(decryptedData);
      // console.log(decryptedData);
      setRelevantCaseLoading(false);
      setRelevantLawsArr(formattedData);
    } catch (error) {
      toast.error("Failed to fetch relevant case laws");
      console.error(error);
    }
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
      try {
        await axios.post(
          `${NODE_API_ENDPOINT}/specificLawyerCourtroom/api/end`,
          {
            userId: currentUser.userId,
          },
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
      } catch (error) {
        if (
          error.response.data.error.explanation === "Please refresh the page"
        ) {
          toast.error("Please refresh the page");
          return;
        }
        toast.error("Error in ending session");
        console.error("Error in ending session", error);
      }
    }

    dispatch(logout());

    navigate("/");
  };

  const saveHistory = async () => {
    setRelevantLawsArr(null);
    setShowRelevantLaws(false);
    dispatch(setOverview(""));
    dispatch(setFirstDraftAction({ draft: "" }));
    try {
      if (overViewDetails !== "NA") {
        await axios.post(
          `${NODE_API_ENDPOINT}/specificLawyerCourtroom/api/history`,
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
      if (error.response.data.error.explanation === "Please refresh the page") {
        toast.error("Please refresh the page");
        return;
      }
      // toast.error("Error in saving history");
      console.error("Error in saving history", error);
    }
  };

  const handleSave = async () => {
    try {
      await axios.post(
        `${NODE_API_ENDPOINT}/specificLawyerCourtroom/edit_case`,
        {
          // user_id: currentUser.userId,
          case_overview: encryptData(text, authKey),
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      dispatch(setOverview(text));
      setEditDialog(false);
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
      dispatch(setFirstDraftAction({ draft: "" }));
    } catch (error) {
      if (error.response.data.error.explanation === "Please refresh the page") {
        toast.error("Please refresh the page");
        return;
      }
      toast.error("Error in saving case");
      console.error("Error in saving case", error);
    }
  };

  const handleFirstDraft = async () => {
    // if (isApi) {
    //   setFirsDraftLoading(true);
    // }

    setFirstDraftDialog(true);
  };

  // const formatText = (text) => {
  //   return text.replace(/\\n\\n/g, "<br/><br/>").replace(/\\n/g, "  <br/>");
  // };

  // function escapeHTML(html) {
  //   const text = document.createTextNode(html);
  //   const div = document.createElement("div");
  //   div.appendChild(text);
  //   return div.innerHTML;
  // }

  const firstDraftApi = async () => {
    // dispatch(setFirstDraftLoading());
    try {
      const response = await axios.post(
        `${NODE_API_ENDPOINT}/specificLawyerCourtroom/api/draft`,
        {
          // user_id: currentUser.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      const decryptedData = decryptData(
        response?.data?.data?.draft?.detailed_draft,
        authKey
      );
      dispatch(
        setFirstDraftAction({
          draft: decryptedData,
        })
      );
      // dispatch(setFirstDraftLoading());
    } catch (error) {
      if (error.response.data.error.explanation === "Please refresh the page") {
        toast.error("Please refresh the page");
        return;
      }
      toast.error("Error in getting first draft");
      // dispatch(setFirstDraftLoading());
    }
  };
  useEffect(() => {
    if (overViewDetails !== "" || overViewDetails !== "NA") {
      firstDraftApi();
    }
  }, [overViewDetails]);

  useEffect(() => {
    setFirstDraft(firstDraftDetails);
  }, [firstDraftDetails]);

  const getAiQuestions = async () => {
    setAiAssistantLoading(true);
    try {
      const response = await axios.post(
        `${NODE_API_ENDPOINT}/specificLawyerCourtroom/api/hallucination_questions`,
        {
          // user_id: currentUser.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      // console.log(
      //   response.data.data.hallucinationQuestions.assistant_questions
      // );
      const decryptedText = decryptData(
        response.data.data.hallucinationQuestions.assistant_questions,
        authKey
      );
      setAiQuestions(decryptedText);
      setAiAssistantLoading(false);
    } catch (error) {
      if (error.response.data.error.explanation === "Please refresh the page") {
        toast.error("Please refresh the page");
        return;
      }
      console.error("Error fetching AI questions:", error);
      setAiAssistantLoading(false);
    }
  };

  useEffect(() => {
    const getOverview = async () => {
      try {
        const overView = await axios.post(
          `${NODE_API_ENDPOINT}/specificLawyerCourtroom/getCaseOverview`,
          {
            // user_id: currentUser.userId,
          },
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );

        // console.log(overView.data.data.case_overview);
        if (overView.data.data.case_overview === "NA") {
          dispatch(setOverview(""));
        } else {
          const decryptedData = decryptData(
            overView.data.data.case_overview,
            authKey
          );
          dispatch(setOverview(decryptedData));
        }
      } catch (error) {
        if (
          error.response.data.error.explanation === "Please refresh the page"
        ) {
          toast.error("Please refresh the page");
          return;
        }
        toast.error("Error in fetching case overview");
        console.error("Error fetching case overview", error);
      }
    };
    if (currentUser.userId) {
      getOverview();

      // console.log(currentUser.userId);
    }
  }, [currentUser.userId]);

  const downloadCaseHistory = async () => {
    setDownloadCaseLoading(true);
    try {
      await saveHistory();
      const response = await axios.post(
        `${NODE_API_ENDPOINT}/specificLawyerCourtroom/api/downloadCaseHistory`,
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
        `${NODE_API_ENDPOINT}/specificLawyerCourtroom/api/downloadSessionCaseHistory`,
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
        `${NODE_API_ENDPOINT}/specificLawyerCourtroom/api/downloadFirtDraft`,
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

  const getLegalGptResponse = async () => {
    try {
      setSearchQuery(true);
      const getResponse = await fetch(
        // `${NODE_API_ENDPOINT}/specificLawyerCourtroom/api/ask_query`,
        `${NODE_API_ENDPOINT}/specificLawyerCourtroom/api/consultant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
          body: JSON.stringify({
            // action: "Generate",
            query: askLegalGptPrompt,
          }),
        }
      );

      if (!getResponse.ok) {
        const errorMessage = await getResponse.json();
        console.error(errorMessage.error.explanation);
        if (errorMessage.error.explanation === "Please refresh the page") {
          toast.error("Please refresh the page.");
          return;
        }
        throw new Error(`Error: ${getResponse.statusText}`);
      }

      const responseData = await getResponse.json();

      // const decryptedData = decryptData(
      //   responseData.data.fetchedConsultant.Answer,
      //   authKey
      // );

      // const data = decryptedData;
      const data = responseData.data.fetchedConsultant.Answer;

      // console.log(data);

      setPromptArr([
        ...promptArr,
        {
          prompt: askLegalGptPrompt,
          promptResponse: data,
        },
      ]);
    } catch (error) {
      console.error("Error in getting response:", error);
      toast.error("Error in getting response");

      setSearchQuery(false);
      let newArr = promptArr;
      newArr.pop();
      setPromptArr(newArr);
    }
    // setAskLegalGptPrompt(null);
  };

  const tapAnimations = {
    true: { scale: 0.95 },
    false: {},
  };

  const hoverAnimations = {
    true: { scale: 1.01 },
    false: {},
  };

  const handleDrafterQuestions = (action) => {
    dispatch(removeDrafter());
    setShowDrafterQuestions(false);
    dispatch(
      retrieveDrafterQuestions({
        query: action,
        token: currentUser.token,
        key: authKey,
      })
    );
  };

  const handleCaseSearchPrompt = async () => {
    setCaseSearchLoading(true);
    try {
      const response = await fetch(
        `${NODE_API_ENDPOINT}/specificLawyerCourtroom/api/sidebar-casesearch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
          body: JSON.stringify({ context: caseSearchPrompt }),
        }
      );
      const data = await response.json();
      console.log(data);
      dispatch(removeCaseLaws());
      dispatch(setCaseLaws(data.data.FetchedSidebarCasesearch.relatedCases));
      setCaseSearchLoading(false);
      setCaseSearchDialog(false);
      setCaseSearchPrompt("");
      navigate("/courtroom-ai/caseLaws");
    } catch (error) {
      console.log(error);
      setCaseSearchLoading(false);
    }
  };

  const handleNextAppeal = async () => {
    setNextAppealLoading(true);
    try {
      const response = await fetch(
        `${NODE_API_ENDPOINT}/specificLawyerCourtroom/api/draft_next_appeal`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      const data = await response.json();
      // console.log(data);
      setNextAppealLoading(false);
      toast.success("Next appeal successfull");
      setAppealDialog(true);
      setAppealData(data.data.fetchedDraftNextAppeal.detailed_draft);
    } catch (error) {
      console.log(error);
      setNextAppealLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3 h-screen py-3 pl-3">
        {/* top container */}
        <div className="bg-[#008080] h-[30vh] pt-1 px-4 pb-3 border-2 border-black rounded gap-1 flex flex-col">
          <motion.div
            className="max-w-fit rounded-lg flex gap-2 items-center pt-2 cursor-pointer"
            whileTap={{ scale: "0.95" }}
            onClick={handleGoBack}
          >
            <svg
              className="h-5 w-5"
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
            <p className="m-0 text-xs">Go Back</p>
          </motion.div>
          <div className="flex-1  overflow-auto">
            <div className="flex flex-col">
              <div className="flex flex-row justify-between items-center">
                <p className="text-[#00FFA3] text-sm m-0">Case Details : </p>

                {/* <motion.button
                  whileTap={{ scale: "0.95" }}
                  onClick={() => setEditDialog(true)}
                  className="border-2 border-[#00FFA3] rounded-lg p-1 px-2"
                >
                  Edit
                </motion.button> */}
                <div>
                  <IconButton
                    sx={{ color: "white" }}
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={handleMenuOpen}
                  >
                    <MoreVert />
                  </IconButton>
                  <div className="absolute">
                    {evidenceAccessHover ? (
                      <h1 className="z-50 absolute text-xs -left-[180px] top-[40px] bg-[#033E40] p-2 rounded-lg border-2 border-[#00ffa3]">
                        To Enable It : Contact Sales
                      </h1>
                    ) : (
                      ""
                    )}
                    <Menu
                      id="long-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem
                        onClick={() => {
                          handleMenuClose();
                          setEditDialog(true);
                        }}
                      >
                        Edit
                      </MenuItem>
                      <MenuItem
                        onClick={evidenceAccess ? handleEvidenceClick : null}
                      >
                        <motion.p
                          className="m-0"
                          onHoverStart={() =>
                            !evidenceAccess ? setEvidenceAccessHover(true) : ""
                          }
                          onHoverEnd={() =>
                            !evidenceAccess ? setEvidenceAccessHover(false) : ""
                          }
                        >
                          Add Evidences
                        </motion.p>
                      </MenuItem>
                      <MenuItem onClick={handleTestimonyClick}>
                        Add Testimony
                      </MenuItem>
                    </Menu>
                  </div>

                  <Popover
                    open={Boolean(evidenceAnchorEl)}
                    anchorEl={evidenceAnchorEl}
                    onClose={handleEvidenceClose}
                    anchorOrigin={{
                      vertical: "center",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "center",
                      horizontal: "left",
                    }}
                    sx={{
                      "& .MuiPaper-root": {
                        width: "600px", // Adjust the width as needed
                        padding: "16px", // Adjust the padding as needed
                      },
                    }}
                  >
                    <EvidenceDialog handleEvidenceClose={handleEvidenceClose} />
                  </Popover>
                  <Popover
                    open={Boolean(testimonyAnchorEl)}
                    anchorEl={testimonyAnchorEl}
                    onClose={handleTestimonyClose}
                    anchorOrigin={{
                      vertical: "center",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "center",
                      horizontal: "left",
                    }}
                    sx={{
                      "& .MuiPaper-root": {
                        width: "600px", // Adjust the width as needed
                        padding: "16px", // Adjust the padding as needed
                      },
                    }}
                  >
                    <TestimonyDialog
                      handleTestimonyClose={handleTestimonyClose}
                    />
                  </Popover>
                </div>
              </div>
              <div className="h-[50px] overflow-auto">
                <h1 className="text-xs m-0 py-2">
                  <Markdown>{overViewDetails}</Markdown>
                </h1>
              </div>
            </div>
          </div>
          <TimerComponent ExitToCourtroom={ExitToCourtroom} />
        </div>
        {/* bottom container */}
        <div className="flex-1 overflow-auto border-2 border-black rounded flex flex-col relative px-4 py-4 gap-2 justify-between">
          <div className="">
            <motion.div
              onClick={firstDraftAccess ? handleFirstDraft : null}
              onHoverStart={() =>
                !firstDraftAccess ? setDraftAccessHover(true) : ""
              }
              onHoverEnd={() =>
                !firstDraftAccess ? setDraftAccessHover(false) : ""
              }
              whileTap={{ scale: "0.95" }}
              whileHover={{ scale: "1.01" }}
              className={`${
                overViewDetails === "NA" || overViewDetails === ""
                  ? "opacity-75 pointer-events-none cursor-not-allowed"
                  : ""
              }`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0px 10px",
                background: "#C5C5C5",
                color: "#008080",
                border: "2px solid white",
                borderRadius: "5px",
                marginBottom: "5px",
              }}
            >
              <div>
                <p className="text-xs m-0">View First Draft</p>
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
              {draftAccessHover ? (
                <h1 className="z-30 absolute text-xs right-7 -top-12 bg-[#033E40] p-2 rounded-lg border-2 border-[#00ffa3]">
                  To Enable It : Contact Sales
                </h1>
              ) : (
                ""
              )}
            </motion.div>
            <motion.div
              onClick={() => setShowDrafterQuestions(true)}
              whileTap={{ scale: "0.95" }}
              whileHover={{ scale: "1.01" }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0px 10px",
                background: "#C5C5C5",
                color: "#008080",
                border: "2px solid white",
                borderRadius: "5px",
                cursor: "pointer",
                marginBottom: "5px",
              }}
            >
              <div>
                <p className="text-xs m-0">Ai Drafter</p>
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
              className="relative"
              onClick={() => (legalGptAccess ? setShowAskLegalGPT(true) : null)}
              // onClick={() => setShowAskLegalGPT(true)}
              whileTap={tapAnimations[legalGptAccess ? "true" : "false"]}
              whileHover={hoverAnimations[legalGptAccess ? "true" : "false"]}
              onHoverStart={() =>
                !legalGptAccess ? setLegalGptAccessHover(true) : ""
              }
              onHoverEnd={() =>
                !legalGptAccess ? setLegalGptAccessHover(false) : ""
              }
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0px 10px",
                background: "#C5C5C5",
                color: "#008080",
                border: "2px solid white",
                borderRadius: "5px",
                cursor: "pointer",
                marginBottom: "5px",
              }}
            >
              <div>
                <p className="text-xs m-0">Ask LegalGPT</p>
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
              {legalGptAccessHover ? (
                <h1 className="z-30 absolute text-xs text-white left-7 -top-9 bg-[#033E40] p-2 rounded-lg border-2 border-[#00ffa3]">
                  To Enable It : Contact Sales
                </h1>
              ) : (
                ""
              )}
            </motion.div>
            <motion.div
              onClick={() => setCaseSearchDialog(true)}
              whileTap={{ scale: "0.95" }}
              whileHover={{ scale: "1.01" }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0px 10px",
                background: "#C5C5C5",
                color: "#008080",
                border: "2px solid white",
                borderRadius: "5px",
              }}
            >
              <div>
                <p className="text-xs m-0">Case Search</p>
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
          {aiAssistantAccess ? (
            <div className="flex justify-end cursor-pointer relative">
              <motion.img
                className={`${
                  overViewDetails === "NA" || overViewDetails === ""
                    ? "opacity-75 pointer-events-none cursor-not-allowed h-9 w-9"
                    : "h-9 w-9"
                }`}
                // className="h-9 w-9"
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
                <h1 className="absolute text-xs right-16 top-0 bg-[#033E40] p-2 rounded-lg border-2 border-[#00ffa3]">
                  CLAW AI Assistant
                </h1>
              ) : (
                ""
              )}
            </div>
          ) : (
            <div className="flex justify-end cursor-pointer relative">
              <motion.img
                className={`${
                  overViewDetails === "NA" || overViewDetails === ""
                    ? "opacity-75 pointer-events-none cursor-not-allowed h-3 w-3"
                    : "h-3 w-3"
                }`}
                // className="h-3 w-3"
                whileTap={{ scale: "0.95" }}
                alt="assistant"
                src={aiAssistant}
                onHoverStart={() => setAiAccessHover(true)}
                onHoverEnd={() => setAiAccessHover(false)}
              />
              {aiAccessHover ? (
                <h1 className="absolute text-xs right-16 top-1 bg-[#033E40] p-2 rounded-lg border-2 border-[#00ffa3]">
                  To Enable It : Contact Sales
                </h1>
              ) : (
                ""
              )}
            </div>
          )}
          <div className="flex flex-col w-full h-full justify-start items-center gap-2">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // margin: "40px 0px",
              }}
            >
              <img className="w-24" src={logo} alt="logo" />
            </div>
            <div className="h-full flex flex-col justify-evenly">
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
                  alignItems: "center",
                  gap: "10px",
                  position: "relative",
                  cursor: `${downloadSessionLoading ? "wait" : "pointer"}`,
                }}
              >
                <img
                  className="w-5 h-5"
                  src={firstDraftLogo}
                  alt="firstdraft"
                />
                <p className="m-0 text-xs text-white">
                  Download Session History
                </p>
              </motion.div>
              <motion.div
                className={`${
                  overViewDetails === "NA" || overViewDetails === ""
                    ? "opacity-75 pointer-events-none cursor-not-allowed px-1 flex items-center gap-[12px] relative"
                    : "px-1 flex items-center gap-[12px] cursor-pointer relative"
                }`}
                onClick={() => downloadCaseHistory()}
                whileTap={{ scale: "0.95" }}
                whileHover={{ scale: "1.01" }}
              >
                <img className="w-4" src={aiDrafter} alt="aiDrafter" />
                <p className="m-0 text-xs text-white">Download Case History</p>
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
                  gap: "12px",
                  cursor: "pointer",
                }}
              >
                <img src={oldCaseLogo} />
                <p className="m-0 text-xs text-white">Old Case Search</p>
              </motion.div>
              <Link to={"/courtroom-ai"}>
                <motion.div
                  whileTap={{ scale: "0.95" }}
                  whileHover={{ scale: "1.01" }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    cursor: "pointer",
                  }}
                >
                  <img src={newCaseLogo} />
                  <p
                    className="m-0 text-xs text-white"
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
                  gap: "12px",
                  cursor: "pointer",
                }}
              >
                <img className="h-4 w-4" src={homeLogo} alt="" />
                <p className="m-0 text-xs">Claw Home</p>
              </motion.div>
              <motion.div
                whileTap={{ scale: "0.95" }}
                whileHover={{ scale: "1.01" }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  cursor: "pointer",
                }}
              >
                <img className="h-4 w-4" src={exitLogo} />

                <p className="m-0 text-xs" onClick={() => ExitToCourtroom()}>
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
          {/* {firstDraftLoading ? (
            <div
              className="border-2 border-white rounded-lg w-1/6 h-fit p-2 flex flex-row justify-center items-center"
              style={{
                background: "linear-gradient(to right,#0e1118,#008080)",
              }}
            >
              <img className="h-40 w-40 my-10" src={loader} alt="loader" />
            </div>
          ) : ( */}
          <div
            className="h-fit w-2/3 rounded-md border-2 border-white"
            style={{
              background: "linear-gradient(to right,#0e1118,#008080)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <svg
                onClick={() => {
                  setFirstDraftDialog(false);
                }}
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
              <div className="flex h-full px-5 pb-3 flex-row justify-between items-center w-full gap-5">
                <div className="flex h-full  flex-col gap-2 justify-center w-full items-center">
                  {firstDraft !== "" ? (
                    <div className="flex flex-col w-full rounded-md bg-white text-black h-[75vh] overflow-y-auto">
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
                  ) : (
                    <div className="flex flex-col w-full justify-center items-center rounded-md bg-white text-black h-[75vh] overflow-y-auto">
                      <img
                        className="h-40 w-40 my-10"
                        src={loader}
                        alt="loader"
                      />
                    </div>
                  )}
                  <div className="w-full flex justify-end">
                    <button
                      onClick={handleNextAppeal}
                      className="px-4 py-1 rounded border"
                    >
                      {nextAppealLoading ? (
                        <CircularProgress size={15} color="inherit" />
                      ) : (
                        "Next Appeal"
                      )}
                    </button>
                  </div>
                </div>
                <div className="h-[75vh] w-1 bg-neutral-200/40" />
                <div className="flex flex-col justify-between h-full w-full gap-4 ">
                  {showRelevantLaws ? (
                    <div className="overflow-auto border-2 border-white rounded bg-white text-black p-2">
                      {relevantCaseLoading ? (
                        <div className="flex justify-center items-center">
                          <img
                            className="h-40 w-40 my-10"
                            src={loader}
                            alt="loader"
                          />
                        </div>
                      ) : (
                        <p
                          className="h-[55vh]"
                          dangerouslySetInnerHTML={{
                            __html: relevantLawsArr,
                          }}
                        />
                        // {relevantLawsArr}</p>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col w-full gap-2">
                      <img className="" src={logo} alt="logo" />
                      <h3 className=" text-center">Draft Preview</h3>
                    </div>
                  )}
                  {showRelevantLaws && !relevantCaseLoading && (
                    <div className="w-full flex justify-end">
                      <Link to={"/courtroom-ai/caseLaws"}>
                        <button
                          onClick={() => {
                            dispatch(removeCaseLaws());
                            dispatch(
                              retrieveCaseLaws({
                                query: relevantLawData,
                                token: currentUser.token,
                              })
                            );
                            setFirstDraftDialog(false);
                          }}
                          className="bg-[#003131] px-4 py-1 text-sm rounded text-white"
                        >
                          View Case Laws
                        </button>
                      </Link>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2 relative">
                    {showRelevantLaws ? (
                      <motion.button
                        disabled={!relevantLawsArr}
                        className="border border-white rounded-md py-1"
                        onClick={() => setShowRelevantLaws(false)}
                      >
                        Go Back
                      </motion.button>
                    ) : (
                      <motion.button
                        disabled={!relevantCaseLawsAccess}
                        onClick={() => {
                          setShowRelevantLaws(true);
                          getReventCaseLaw();
                        }}
                        className="border border-white rounded-md py-1"
                        onHoverStart={() =>
                          !relevantCaseLawsAccess
                            ? setRelevantCaseAccessHover(true)
                            : ""
                        }
                        onHoverEnd={() =>
                          !relevantCaseLawsAccess
                            ? setRelevantCaseAccessHover(false)
                            : ""
                        }
                      >
                        Relevant Case Laws
                      </motion.button>
                    )}
                    <button
                      onClick={() => dowloadFirstDraft()}
                      className="border border-white rounded-md py-1"
                    >
                      <Download /> Download
                    </button>
                    {relevantCaseAccessHover ? (
                      <h1 className="z-30 absolute text-xs left-7 -top-9 bg-[#033E40] p-2 rounded-lg border-2 border-[#00ffa3]">
                        To Enable It : Contact Sales
                      </h1>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* )} */}
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
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSearchQuery(true);
                  getLegalGptResponse();
                  setPromptArr([
                    ...promptArr,
                    {
                      prompt: askLegalGptPrompt,
                      promptResponse: null,
                    },
                  ]);
                  setAskLegalGptPrompt("");
                }}
                className="flex gap-2 p-3"
              >
                <input
                  className="flex-1 p-2 rounded text-black"
                  placeholder="Enter Your Query Here..."
                  value={askLegalGptPrompt}
                  onChange={(e) => setAskLegalGptPrompt(e.target.value)}
                />
                <motion.button
                  type="submit"
                  disabled={askLegalGptPrompt === ""}
                  whileTap={{ scale: "0.95" }}
                >
                  <img className="w-9 h-9" src={sendIcon} />
                </motion.button>
              </form>
            </div>
          ) : (
            <div className="h-screen flex flex-col border-2 border-white rounded w-2/4 bg-[#222222] justify-between">
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
              <div
                ref={scrollRef}
                className="flex-1 px-4 h-full flex flex-col overflow-auto"
              >
                <div className="">
                  {promptArr.length > 0 &&
                    promptArr.map((x, index) => (
                      <div
                        className="flex flex-col"
                        style={{
                          alignSelf: x.prompt ? "flex-start" : "flex-end",
                        }}
                        key={index}
                      >
                        <div className="flex gap-3">
                          {/* <svg
                              fill="white"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm7.753 18.305c-.261-.586-.789-.991-1.871-1.241-2.293-.529-4.428-.993-3.393-2.945 3.145-5.942.833-9.119-2.489-9.119-3.388 0-5.644 3.299-2.489 9.119 1.066 1.964-1.148 2.427-3.393 2.945-1.084.25-1.608.658-1.867 1.246-1.405-1.723-2.251-3.919-2.251-6.31 0-5.514 4.486-10 10-10s10 4.486 10 10c0 2.389-.845 4.583-2.247 6.305z" />
                            </svg> */}
                          {/* <p className="bg-[#D9D9D9]  text-black p-2 text-sm rounded-t-xl rounded-r-xl max-w-[75%]"> */}
                          <div className="w-full flex justify-end">
                            <div className="w-5/6 flex justify-end">
                              <p className=" bg-[#D9D9D9] p-2 text-sm text-black rounded-t-xl rounded-l-xl">
                                {x.prompt}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="w-full flex justify-start">
                          <div className="w-5/6 flex justify-start">
                            {x.promptResponse ? (
                              <p className=" bg-[#00C37B] p-2 text-sm text-black rounded-t-xl rounded-r-xl">
                                <Markdown>{x.promptResponse}</Markdown>
                              </p>
                            ) : (
                              <div className="bg-[#00C37B] p-2 text-sm text-black rounded-t-xl rounded-r-xl flex flex-col justify-end gap-1 w-14 mb-2">
                                <div className="w-full h-1 bg-slate-600 animate-pulse  rounded-full"></div>
                                <div className="w-[60%] h-1 bg-slate-600 animate-pulse  rounded-full"></div>
                                <div className="w-[40%] h-1 bg-slate-600 animate-pulse  rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSearchQuery(true);
                  getLegalGptResponse();
                  setPromptArr([
                    ...promptArr,
                    {
                      prompt: askLegalGptPrompt,
                      promptResponse: null,
                    },
                  ]);
                  setAskLegalGptPrompt("");
                }}
                className="px-4 flex gap-2 py-3 items-center"
              >
                <input
                  required
                  className="flex-1 p-2 rounded text-black"
                  placeholder="Enter Your Query Here..."
                  value={askLegalGptPrompt}
                  onChange={(e) => setAskLegalGptPrompt(e.target.value)}
                />
                <motion.button
                  type="submit"
                  disabled={askLegalGptPrompt === ""}
                  whileTap={{ scale: "0.95" }}
                >
                  <img className="w-9 h-9" src={sendIcon} />
                </motion.button>
              </form>
            </div>
          )}
        </div>
      ) : null}
      {showDrafterQuestions ? (
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
          <div className="w-2/5 h-[90%] bg-[#D9D9D9] rounded p-3">
            <div className="flex  flex-row justify-between items-start w-full">
              <div className="flex  flex-col justify-center items-start">
                <h1 className="px-2 text-xl font-semibold text-teal-700 text-left">
                  AI Drafter
                </h1>
              </div>
              <div
                className="cursor-pointer text-black"
                onClick={() => setShowDrafterQuestions(false)}
              >
                <Close />
              </div>
            </div>
            <div className="h-[90%] flex overflow-auto items-center justify-center py-3 ">
              <div className="h-[90%] w-full">
                {drafterQuestions.map((x, index) => (
                  <div
                    key={index}
                    className="flex justify-between gap-3 items-center m-1"
                  >
                    <p className="flex-1 text-black text-sm m-0 bg-[#00808034] px-3 py-2 rounded-md">
                      {x.name}
                    </p>
                    <Link to={"/courtroom-ai/aiDraft"}>
                      <button
                        onClick={() => handleDrafterQuestions(x.value)}
                        className="py-2 px-4 bg-[#008080] rounded-md text-sm text-white"
                      >
                        Create
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {caseSearchDialog && (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            left: "0",
            right: "0",
            top: "0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "10",
          }}
        >
          <main className="w-2/4 p-3 flex flex-col justify-center items-center bg-white rounded">
            <>
              {/* //header */}
              <section className="flex flex-row justify-between items-start w-full">
                <div className="flex flex-col justify-center items-start">
                  <h1 className="text-lg font-semibold text-teal-700 text-left">
                    Case Search
                  </h1>
                  <h3 className="text-xs font-light text-neutral-600">
                    Enter prompt to search for cases
                  </h3>
                </div>
                <div className="cursor-pointer text-teal-800">
                  <Close
                    onClick={() => {
                      setCaseSearchDialog(false);
                      setCaseSearchPrompt("");
                    }}
                  />
                </div>
              </section>
              {/* header ends */}
              {!caseSearchLoading ? (
                <>
                  <section className="w-full">
                    <textarea
                      required
                      value={caseSearchPrompt}
                      onChange={(e) => setCaseSearchPrompt(e.target.value)}
                      placeholder="Enter your search details here..."
                      rows={12}
                      className="w-full resize-none bg-[#00808030] text-black rounded-md p-2"
                    />
                  </section>

                  <section className="flex space-x-5 flex-row w-full items-center justify-end">
                    <button
                      onClick={() => handleCaseSearchPrompt()}
                      className="bg-teal-800 cursor-pointer py-1 px-3 rounded"
                    >
                      Search
                    </button>
                  </section>
                </>
              ) : (
                <section className="w-full flex items-center justify-center p-20">
                  <img className="w-48 h-48" src={evidenceLoad} alt="loading" />
                </section>
              )}
            </>
          </main>
        </div>
      )}
      {appealDialog && (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(3px)",
            left: "0",
            right: "0",
            top: "0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "10",
          }}
        >
          <div className="w-1/2 h-[90%] overflow-auto bg-white text-black p-3 rounded">
            <div className="flex justify-between">
              <p className="text-xl font-semibold">Next Appeal</p>
              <Close
                className="cursor-pointer"
                onClick={() => {
                  setAppealDialog(false);
                  setAppealData("");
                }}
              />
            </div>
            <div>
              <p>
                <Markdown>{appealData}</Markdown>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AiSidebar;
