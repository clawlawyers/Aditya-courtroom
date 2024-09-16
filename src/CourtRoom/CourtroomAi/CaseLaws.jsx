import React, { useState } from "react";
import Styles from "./CaseLaws.module.css";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { NODE_API_ENDPOINT } from "../../utils/utils";
import { CircularProgress, Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";

const courtIdMapping = [
  { name: "Supreme Court of India", id: "1bgi-zbCWObiTNjkegNXryni4ZJzZyCFV" },
  { name: "Chattisgarh High Court", id: "10WjvWkkE5P9AZJTdBuK3rOB3FBfSuPON" },
  { name: "Sikkim High Court", id: "1LRcl09Lc2psq3kFjZ92oYEBV54Bgdr4q" },
  { name: "Uttarakhand High Court", id: "16ghA911ENkOJ5GDa-317ncVA_egwsy6J" },
  { name: "Calcutta High Court", id: "1CTxPb31Kvj-iyUxef5THaTL7pzJpXsE0" },
  { name: "Kerela High Court", id: "1ss5iK8rcrEzjWUjUl5Cg2qhKunTQX4II" },
  { name: "Karnataka High Court", id: "1k8EEGMnzCbdyTKsNVGxboa4wqRiW2SNi" },
  {
    name: "Jammu and Kashmir High Court",
    id: "15PrnIvUGB4OdKzSjvGtdpyVLLPlBEZ2M",
  },
  { name: "Jharkhand High Court", id: "1cKhGvZGPJpVVA5KFW1MH0PTgSTjlPV_5" },
  { name: "Delhi High Court", id: "1-4KMCL-J2HDD6RllAZbARzBJccxQPTYC" },
  { name: "Delhi District Court", id: "1PSrAbXpBsoUvqjV_ssoca3Xzzk71qP4a" },
  {
    name: "Madhya Pradesh High Court",
    id: "1exastQPw80VSb359G8xournBF1MPShdn",
  },
  { name: "Allahabad High Court", id: "1qpWWufkZ4ciCskmJ3xPHLe72Z8oKWjcO" },
  { name: "Gujarat High Court", id: "1NyOxx5lBZ-rFy3wtwdOlepTog668HUwJ" },
  { name: "Rajasthan High Court", id: "153TCPW0SuDtXQzlgLUtqES3uwVUkaMtu" },
];

const CaseLaws = () => {
  const caseLaws = useSelector((state) => state.laws.caseLaws);
  const currentUser = useSelector((state) => state.user.user);

  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documentData, setDocumentData] = useState("");

  const handleOpen = async (court, caseId) => {
    setModalOpen(true);
    setLoading(true);
    const findFileId = courtIdMapping.find(
      (x) =>
        x.name.split(" ").join("").toLowerCase() ===
        court.split(" ").join("").toLowerCase()
    );
    const fieldId = findFileId.id.toString();
    try {
      const props = await fetch(
        `${NODE_API_ENDPOINT}/specificLawyerCourtroom/api/view_document`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
          body: JSON.stringify({ folder_id: fieldId, case_id: caseId }),
        }
      );
      const parsedProps = await props.json();
      console.log(parsedProps);
      setDocumentData(parsedProps.data.viewDocument.content);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setModalOpen(false);
  };
  const handleNavigation = () => {
    navigate(-1);
  };

  return (
    <div className="p-3 h-screen">
      <div className="p-2 bg-[#d9d9d92d] h-full rounded-md">
        <div className="flex justify-between items-center">
          <p className="m-0 py-2 pl-2 text-xl font-bold text-white">
            Case Law Links
          </p>
          <Close
            onClick={handleNavigation}
            className="text-white cursor-pointer"
          />
        </div>
        {caseLaws.length > 0 ? (
          <div className="flex flex-col gap-2 h-[90%] overflow-auto">
            {caseLaws.map((x, index) => (
              <div
                key={index}
                className={Styles.backdrop}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  gap: 10,
                  alignItems: "center",
                  padding: 16,
                  backgroundColor: "#008080",
                  borderRadius: 10,
                }}
              >
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: 23, fontWeight: 700 }}>{x.Title}</h2>
                  <div style={{ fontSize: 13, color: "#DBD8D8" }}>
                    <span>{x.Date}</span>,<span>{" " + x.court}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#DBD8D8", margin: 0 }}>
                    Number of citations- {x.num_cites}
                  </p>
                </div>

                <button
                  onClick={() => {
                    handleOpen(x.court, x.case_id);
                  }}
                  style={{
                    border: "none",
                    padding: "10px 12px",
                    minWidth: "fit-content",
                    backgroundColor: "white",
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: 14,
                    textDecoration: "none",
                    color: "black",
                    backgroundImage: "none",
                  }}
                >
                  View document
                </button>

                <Modal
                  open={modalOpen}
                  onClose={handleClose}
                  aria-labelledby="child-modal-title"
                >
                  <div
                    className={Styles.scrollable}
                    style={{
                      backgroundColor: "white",
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: "80%",
                      height: "90%",
                      color: "black",
                      borderRadius: 10,
                      // overflowY: "scroll",
                      padding: 10,
                      transform: "translate(-50%, -50%)",
                      boxShadow: 24,
                    }}
                  >
                    <div
                      style={{ position: "sticky", top: 0, display: "flex" }}
                    >
                      <div style={{ flex: 1 }} />
                      <button
                        onClick={handleClose}
                        style={{
                          border: "none",
                          backgroundColor: "transparent",
                        }}
                      >
                        <Close style={{ fontSize: 30, color: "black" }} />
                      </button>
                    </div>
                    <div className="h-[90%] overflow-auto border border-black p-3">
                      {loading ? (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <CircularProgress style={{ color: "black" }} />
                        </div>
                      ) : (
                        <div
                          style={{
                            whiteSpace: "pre-line",
                            alignItems: "center",
                            width: "100%",
                            fontSize: 16,
                            fontWeight: 500,
                            fontFamily: "serif",
                          }}
                        >
                          {documentData}
                        </div>
                      )}
                    </div>
                  </div>
                </Modal>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col gap-2">
            <div
              className="animate-pulse"
              style={{
                display: "flex",
                padding: 50,
                backgroundColor: "grey",
                borderRadius: 10,
              }}
            ></div>
            <div
              className="animate-pulse"
              style={{
                display: "flex",
                padding: 50,
                backgroundColor: "grey",
                borderRadius: 10,
              }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseLaws;
