import React, { useEffect, useRef, useState } from "react";
import aiJudge from "../../assets/images/aiJudge.png";
import aiLawyer from "../../assets/images/aiLawyer.png";
import userIcon from "../../assets/images/userArgument.png";
import Styles from "./CourtroomArgument.module.css";
import { motion } from "framer-motion";
import loader from "../../assets/images/argumentLoading.gif";
import axios from "axios";
import { NODE_API_ENDPOINT } from "../../utils/utils";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Markdown from "react-markdown";
import toast from "react-hot-toast";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

// const userArgument = [
//   "I feel your pain. This is such a simple function and yet they make it so amazingly complicated. I find the same nonsense with adding a simple border to an object. They have 400 ways to shade the color of a box, but not even 1 simple option for drawing a line around the box. I get the feeling the Figma designers don’t ever use their product",
//   "I get the feeling the Figma designers don’t ever use their product",
//   "I find the same nonsense with adding a simple border to an object. They have 400 ways to shade the color of a box, but not even 1 simple option for drawing a line around the box. I get the feeling the Figma designers don’t ever use their product",
//   "This is such a simple function and yet they make it so amazingly complicated.",
//   "This is such a simple function and yet they make it so amazingly complicated.",
//   "This is such a simple function and yet they make it so amazingly complicated.",
//   "This is such a simple function and yet they make it so amazingly complicated.",
//   "This is such a simple function and yet they make it so amazingly complicated.",
//   "This is such a simple function and yet they make it so amazingly complicated.",
//   "This is such a simple function and yet they make it so amazingly complicated.",
//   "This is such a simple function and yet they make it so amazingly complicated.",
//   "This is such a simple function and yet they make it so amazingly complicated.",
// ];

// const aiLawyerArr = [
//   "This is such a simple function and yet they make it so amazingly complicated.",
// ];

const CourtroomArgument = () => {
  const navigate = useNavigate();

  const [dialogContent, setDialogContent] = useState(
    "I find the same nonsense with adding a simple border to an object. They have 400 ways to shade the color of a box, but not even 1 simple option for drawing a line around the box. I get the feeling the Figma designers don’t ever use their product"
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [lawyerArgument, setLawyerArgument] = useState("");
  const [userArgument, setUserArgument] = useState([]);
  const [judgeArgument, setJudgeArgument] = useState("");
  const [selectedUserArgument, setSelectedUserArgument] = useState(null);
  const [flag, setFlag] = useState(false);
  const [selectedUserArgumentContent, setSelectedUserArgumentContent] =
    useState(null);
  const [aiJudgeLoading, setAiJudgeLoading] = useState(false);
  const [aiLawyerLoading, setAiLawyerLoading] = useState(false);
  const [addArgumentInputText, setAddArgumentInputText] = useState(null);
  const [potentialObjections, setPotentialObjections] = useState("");
  const [objectionIndex, setObjectionIndex] = useState("");

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const currentUser = useSelector((state) => state.user.user);
  const lastItemRef = useRef(null);
  const editItemRef = useRef(null);

  const dialogRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dialogRef.current && !dialogRef.current.contains(event.target)) {
      closeDialog();
    }
  };

  useEffect(() => {
    if (isDialogOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDialogOpen]);

  const handleEdit = (e, index) => {
    e.stopPropagation();
    setEditIndex(index);
    setEditValue(userArgument[index]);
  };

  const handleEditArgumentText = (e) => {
    setEditValue(e.target.value);
  };

  const handleSave = async (index) => {
    if (userArgument[index] === editValue) {
      console.log("No change in argument");
      setEditIndex(null);
      setEditValue("");
      return;
    }
    const updatedArguments = [...userArgument];
    updatedArguments[index] = editValue;
    setUserArgument(updatedArguments);
    setEditIndex(null);

    const inserUserArgument = await axios.post(
      `${NODE_API_ENDPOINT}/courtroom/user_arguemnt`,
      {
        // user_id: currentUser.userId,
        argument: editValue,
        argument_index: index,
      },
      {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      }
    );

    setEditValue("");

    await GenerateDetails(index);
  };

  const handleSwap = async () => {
    try {
      const swapedData = await axios.post(
        `${NODE_API_ENDPOINT}/courtroom/api/change_states`,
        {
          // user_id: currentUser.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      console.log(swapedData);
      const newUserArgument = swapedData.data.data.changeState.argument; // in array format
      const newLawyerArgument =
        swapedData.data.data.changeState.counter_argument; // in array format
      console.log(newUserArgument, newLawyerArgument);

      if (selectedUserArgument !== null) {
        //swap user arguments a/c to selected index
        const userArguments = [...userArgument];
        userArguments[selectedUserArgument] =
          newUserArgument[selectedUserArgument];

        //swap lawyer argument a/c to selected index
        const swapLawyerArgument = newLawyerArgument[selectedUserArgument];

        setUserArgument(userArguments);
        setLawyerArgument(swapLawyerArgument);
      } else {
        // const swapArgument = newUserArgument[newUserArgument.length - 1];
        // const updatedArguments = [...userArgument];
        // updatedArguments[updatedArguments.length - 1] = swapArgument;
        setUserArgument(newUserArgument);

        const swapLawyerArgument =
          newLawyerArgument[newLawyerArgument.length - 1];
        setLawyerArgument(swapLawyerArgument);
      }
      setSelectedUserArgument(null);
      setSelectedUserArgumentContent(null);
    } catch (error) {
      console.error(error);
      toast.error("Error in saving the argument");
    }
  };

  const RetieveDetails = async (index) => {
    try {
      setAiLawyerLoading(true);
      const laywerArgument1 = await axios.post(
        `${NODE_API_ENDPOINT}/courtroom/api/lawyer`,
        {
          // user_id: currentUser.userId,
          action: "Retrieve",
          argument_index: index,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      const laywerArgument =
        laywerArgument1.data.data.lawyerArguemnt.counter_argument;
      const objection =
        laywerArgument1.data.data.lawyerArguemnt.potential_objection;
      setLawyerArgument(laywerArgument);
      setPotentialObjections(objection);
      setAiLawyerLoading(false);

      setAiJudgeLoading(true);

      let judgeArgument = await axios.post(
        `${NODE_API_ENDPOINT}/courtroom/api/judge`,
        {
          // user_id: currentUser.userId,
          action: "Retrieve",
          argument_index: index,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      judgeArgument = judgeArgument.data.data.judgeArguemnt.judgement;
      setJudgeArgument(judgeArgument);

      setAiJudgeLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Error in retrieving the argument");
    }
  };

  const handleArgumentSelect = async (index, x) => {
    setSelectedUserArgument(index);
    setSelectedUserArgumentContent(x);
    await RetieveDetails(index);

    // api call here
  };
  // const openDialog = (e) => {
  //   e.stopPropagation();
  //   setIsDialogOpen(true);
  // };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleVerdict = () => {
    //verdict api call

    navigate("/courtroom-ai/verdict");
  };

  const GenerateDetails = async (index) => {
    try {
      setAiLawyerLoading(true);

      const laywerArgument1 = await axios.post(
        `${NODE_API_ENDPOINT}/courtroom/api/lawyer`,
        {
          // user_id: currentUser.userId,
          action: "Generate",
          argument_index: index,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      const laywerArgument =
        laywerArgument1.data.data.lawyerArguemnt.counter_argument;
      const objection =
        laywerArgument1.data.data.lawyerArguemnt.potential_objection;
      setLawyerArgument(laywerArgument);
      setPotentialObjections(objection);
      setAiLawyerLoading(false);

      setAiJudgeLoading(true);

      let judgeArgument = await axios.post(
        `${NODE_API_ENDPOINT}/courtroom/api/judge`,
        {
          // user_id: currentUser.userId,
          action: "Generate",
          argument_index: index,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      judgeArgument = judgeArgument.data.data.judgeArguemnt.judgement;
      setJudgeArgument(judgeArgument);
      setAiJudgeLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Error in generating details");
    }
  };

  const handleAddArgument = async () => {
    try {
      setUserArgument([...userArgument, addArgumentInputText]);
      //api calls here

      setAiJudgeLoading(true);
      setAiLawyerLoading(true);

      const inserUserArgument = await axios.post(
        `${NODE_API_ENDPOINT}/courtroom/user_arguemnt`,
        {
          // user_id: currentUser.userId,
          argument: addArgumentInputText,
          argument_index: "NA",
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      // console.log(inserUserArgument.data.data.argumentIndex.argument_index);

      setAiJudgeLoading(true);
      setAiLawyerLoading(true);

      await GenerateDetails(
        inserUserArgument.data.data.argumentIndex.argument_index
      );

      // console.log(laywerArgument, judgeArgument);

      setAiJudgeLoading(false);
      setAiLawyerLoading(false);

      //clear input text
      setAddArgumentInputText(null);
    } catch (error) {
      console.error(error);
      toast.error("Error in adding argument");
    }
  };

  useEffect(() => {
    const getHistory = async () => {
      try {
        const history = await axios.get(
          `${NODE_API_ENDPOINT}/courtroom/getHistory`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );

        setUserArgument(history.data.data.caseHistory.argument);
        const lawyerArrLen =
          history.data.data.caseHistory.counter_argument.length;
        setLawyerArgument(
          history.data.data.caseHistory.counter_argument[lawyerArrLen - 1]
        );

        const judgeArrLen = history.data.data.caseHistory.judgement.length;
        setJudgeArgument(
          history.data.data.caseHistory.judgement[judgeArrLen - 1]
        );
      } catch (error) {
        console.error(error);
        toast.error("Error in fetching case history");
      }
    };

    if (currentUser.userId) {
      getHistory();
    }
  }, [currentUser.userId]);

  useEffect(() => {
    if (lastItemRef.current) {
      lastItemRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    } else if (editItemRef.current) {
      editItemRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [userArgument]);

  useEffect(() => {
    if (editItemRef.current) {
      editItemRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [userArgument]);

  return (
    <div className="flex flex-col p-3 h-screen gap-2">
      {/* top container */}
      <div className="grid grid-cols-2 h-[35vh] gap-2">
        {/* top left Cont */}
        {aiJudgeLoading ? (
          <div
            className="bg-[#033E40] overflow-auto border border-black"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "10px",
            }}
          >
            <img alt="laoding" src={loader} className="w-28 h-28" />
          </div>
        ) : (
          <div
            className="bg-[#033E40] overflow-auto border border-black"
            style={{
              display: "flex",
              flexDirection: "column",
              borderRadius: "10px",
            }}
          >
            <div className="px-3 pt-2 flex gap-2">
              <img
                style={{ width: "25px", height: "25px" }}
                src={aiJudge}
                alt="judge-icon"
              />
              <h1 style={{ fontSize: "20px", margin: "0" }}>AI Judge</h1>
            </div>
            <div
              className="flex-1"
              style={{
                margin: "10px",
                overflow: "auto",
              }}
            >
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: "20px",
                  wordSpacing: "4px",
                  padding: "0px 10px",
                }}
              >
                <Markdown>{judgeArgument}</Markdown>
              </p>
            </div>
          </div>
        )}
        {/* top right cont */}
        {aiLawyerLoading ? (
          <div
            className="bg-[#033E40] overflow-auto border border-black"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "10px",
            }}
          >
            <img alt="laoding" src={loader} className="w-28 h-28" />
          </div>
        ) : (
          <div className="flex flex-col bg-[#033E40] rounded-lg overflow-auto border border-black">
            <div
              className="h-[5vh]"
              style={{ padding: "10px", display: "flex", gap: "10px" }}
            >
              <img
                style={{ width: "25px", height: "25px" }}
                src={aiLawyer}
                alt="judge-icon"
              />
              <h1 style={{ fontSize: "20px", margin: "0" }}>AI Lawyer</h1>
            </div>
            <div
              className="flex-1 overflow-auto"
              style={{
                margin: "15px",
                overflow: "hidden",
                overflowY: "scroll",
              }}
            >
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: "20px",
                  wordSpacing: "4px",
                  padding: "0px 10px",
                }}
              >
                <Markdown>{lawyerArgument}</Markdown>
              </p>
            </div>
            <motion.div
              className="h-[5vh]"
              onClick={handleSwap}
              whileTap={{ scale: "0.98" }}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <svg
                width="20"
                height="20"
                stroke="white"
                fill="white"
                clip-rule="evenodd"
                fill-rule="evenodd"
                stroke-linejoin="round"
                stroke-miterlimit="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m21.897 13.404.008-.057v.002c.024-.178.044-.357.058-.537.024-.302-.189-.811-.749-.811-.391 0-.715.3-.747.69-.018.221-.044.44-.078.656-.645 4.051-4.158 7.153-8.391 7.153-3.037 0-5.704-1.597-7.206-3.995l1.991-.005c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-4.033c-.414 0-.75.336-.75.75v4.049c0 .414.336.75.75.75s.75-.335.75-.75l.003-2.525c1.765 2.836 4.911 4.726 8.495 4.726 5.042 0 9.217-3.741 9.899-8.596zm-19.774-2.974-.009.056v-.002c-.035.233-.063.469-.082.708-.024.302.189.811.749.811.391 0 .715-.3.747-.69.022-.28.058-.556.107-.827.716-3.968 4.189-6.982 8.362-6.982 3.037 0 5.704 1.597 7.206 3.995l-1.991.005c-.414 0-.75.336-.75.75s.336.75.75.75h4.033c.414 0 .75-.336.75-.75v-4.049c0-.414-.336-.75-.75-.75s-.75.335-.75.75l-.003 2.525c-1.765-2.836-4.911-4.726-8.495-4.726-4.984 0-9.12 3.654-9.874 8.426z"
                  fill-rule="nonzero"
                />
              </svg>
              <h1 style={{ margin: "5px", fontSize: "15px" }}>
                Swap with AI Lawyer
              </h1>
            </motion.div>
          </div>
        )}
      </div>
      {/* mid container */}
      <div
        className="flex-1  overflow-auto border border-black relative"
        style={{
          background: "#033E40",
          borderRadius: "10px",
        }}
      >
        <div className="flex flex-col ">
          <div className="p-3 flex gap-2">
            <img
              style={{ width: "25px", height: "25px" }}
              src={userIcon}
              alt="user-icon"
            />
            <h1 style={{ fontSize: "20px", margin: "0" }}>User Argument</h1>
          </div>
          <div className="flex-1 overflow-auto ">
            <div className="w-full flex flex-row-reverse pr-3 items-center   ">
              <div
                className=""
                style={{
                  width: "100%",
                  margin: "10px",
                  overflow: "hidden",
                  overflow: "auto",
                }}
              >
                {userArgument.map((x, index) => (
                  <div
                    className=""
                    onClick={() => {
                      handleArgumentSelect(index, x);
                    }}
                    key={index}
                    ref={index === userArgument.length - 1 ? lastItemRef : null}
                    style={{
                      width: "99%",
                      display: "flex",

                      alignItems: "center",
                      gap: "4px",
                      justifyContent: "space-between",
                      pointerEvents: "all",
                      border:
                        selectedUserArgument === index
                          ? "1px solid #00ffa3"
                          : "1px solid white",
                      borderRadius: "10px",
                      padding: "5px",
                      margin: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <div className="flex items-center w-full pointer-events-auto">
                      {editIndex === index ? (
                        <textarea
                          ref={index === editIndex ? editItemRef : null}
                          className="text-black"
                          style={{
                            margin: "0",
                            fontSize: "15px",
                            padding: "15px",
                            borderRadius: "10px",
                            width: "100%",
                            lineHeight: "20px",
                            wordSpacing: "4px",
                          }}
                          value={editValue}
                          onClick={(e) => e.stopPropagation()}
                          onChange={handleEditArgumentText}
                        />
                      ) : (
                        <p
                          style={{
                            margin: "0",
                            fontSize: "15px",
                            padding: "15px",
                            lineHeight: "20px",
                            width: "100%",
                            wordSpacing: "4px",
                          }}
                        >
                          {x}
                        </p>
                      )}
                      {editIndex === index ? (
                        <motion.button
                          whileTap={{ scale: "0.95" }}
                          className="border-2 border-[#00ffa3] rounded-lg p-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSave(index);
                          }}
                          style={{ margin: "5px" }}
                        >
                          Save
                        </motion.button>
                      ) : (
                        <div
                          onClick={(e) =>
                            editIndex !== index && handleEdit(e, index)
                          }
                        >
                          <motion.svg
                            whileTap={{ scale: "0.95" }}
                            style={{
                              cursor: "pointer",
                              width: "24px",
                              height: "24px",
                            }}
                            fill="white"
                            clip-rule="evenodd"
                            fill-rule="evenodd"
                            stroke-linejoin="round"
                            stroke-miterlimit="2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="m11.25 6c.398 0 .75.352.75.75 0 .414-.336.75-.75.75-1.505 0-7.75 0-7.75 0v12h17v-8.749c0-.414.336-.75.75-.75s.75.336.75.75v9.249c0 .621-.522 1-1 1h-18c-.48 0-1-.379-1-1v-13c0-.481.38-1 1-1zm1.521 9.689 9.012-9.012c.133-.133.217-.329.217-.532 0-.179-.065-.363-.218-.515l-2.423-2.415c-.143-.143-.333-.215-.522-.215s-.378.072-.523.215l-9.027 8.996c-.442 1.371-1.158 3.586-1.264 3.952-.126.433.198.834.572.834.41 0 .696-.099 4.176-1.308zm-2.258-2.392 1.17 1.171c-.704.232-1.274.418-1.729.566zm.968-1.154 7.356-7.331 1.347 1.342-7.346 7.347z"
                              fill-rule="nonzero"
                            />
                          </motion.svg>
                        </div>
                      )}
                    </div>

                    {selectedUserArgument === index && (
                      <div className="flex items-center ">
                        <button
                          className="bg-red-500 text-white w-5 h-5  rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsDialogOpen(true);
                            setObjectionIndex(index);
                            setAnchorEl(e.currentTarget);
                          }}
                          // onClick={handleClick}
                        ></button>

                        {isDialogOpen && index === objectionIndex && (
                          // <div
                          //   ref={dialogRef}
                          //   className="absolute flex items-center justify-end top-0 w-72  right-16 h-52 bg-white z-50 p-4 rounded shadow-lg"
                          // >
                          //   <button className="top-0 h-full overscroll-none overflow-y-auto scroll-smooth p-2 right-0 mt-2 mr-2 text-neutral-800 font-semibold text-sm text-left">
                          //     {aiLawyerLoading ? (
                          //       <p>Loading</p>
                          //     ) : (
                          //       <p className="">{potentialObjections}</p>
                          //     )}
                          //   </button>
                          // </div>
                          <Popover
                            sx={
                              {
                                // width: "450px",
                                // height: "250px",
                              }
                            }
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "right",
                            }}
                          >
                            {aiLawyerLoading ? (
                              <Typography sx={{ p: 3 }}>Loading</Typography>
                            ) : (
                              <Typography
                                sx={{ p: 3, width: "300px", height: "300px" }}
                              >
                                {potentialObjections}
                              </Typography>
                            )}
                          </Popover>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* bottom container */}
      <div className="w-full grid grid-cols-[65%_35%] items-center">
        <div className="pr-2">
          <input
            value={addArgumentInputText !== null ? addArgumentInputText : ""}
            disabled={aiJudgeLoading || aiLawyerLoading}
            onChange={(e) => setAddArgumentInputText(e.target.value)}
            className="w-full text-black"
            style={{
              border: "2px solid #00ffa3",
              borderRadius: "20px",
              padding: "10px",
              // width: "600px",
              cursor: "pointer",
            }}
            placeholder="Input Your Case Into The Courtroom"
          />
        </div>
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: "0.95" }}
            onClick={handleAddArgument}
            disabled={
              addArgumentInputText === null || aiJudgeLoading || aiLawyerLoading
            }
            className="flex-1 my-2"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "5px",
              border: "2px solid #00ffa3",
              borderRadius: "20px",
              background: "#008080",
              padding: "10px",
              cursor: "pointer",
              color: "white",
            }}
          >
            <h2 style={{ fontSize: "15px", margin: "0" }}>Add Argument</h2>
          </motion.button>
          <motion.button
            whileTap={{ scale: "0.95" }}
            onClick={handleVerdict}
            className="flex-1 my-2"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "5px",
              border: "2px solid #00ffa3",
              borderRadius: "20px",
              background: "#008080",
              padding: "10px",
              cursor: "pointer",
              color: "white",
            }}
          >
            <h2 style={{ fontSize: "15px", margin: "0" }}>Rest Your Case</h2>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default CourtroomArgument;
