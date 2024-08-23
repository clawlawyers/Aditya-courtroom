import React, { useEffect, useState } from "react";
import axios from "axios";
import { NODE_API_ENDPOINT } from "../../utils/utils";
import { useSelector } from "react-redux";
import LoadingDialog from "../../components/LoadingDialog";
import DocumentViewer from "./DocumentViewer";

const Verdict = () => {
  const currentUser = useSelector((state) => state.user.user);
  const [verdict, setVerdict] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getVerdict = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${NODE_API_ENDPOINT}/courtroom/api/rest`,
          {
            // user_id: currentUser.userId,
          },
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        const verdictText = response.data.data.restDetail.verdict;
        console.log("verdict text is", verdictText);
        setVerdict(verdictText);
      } catch (error) {
        console.error("Error fetching verdict:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser.userId) {
      getVerdict();
    }
  }, [currentUser.userId]);

  return (
    <main className="flex flex-row justify-center items-center h-full w-full space-x-4">
      {loading ? (
        <div className="flex justify-center items-center h-full w-full">
          <LoadingDialog />
        </div>
      ) : (
        <div className="h-full">
          <DocumentViewer className="text-black" text={verdict} />
        </div>
      )}
    </main>
  );
};

export default Verdict;
