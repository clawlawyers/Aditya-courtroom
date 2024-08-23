import "./App.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Toaster } from "react-hot-toast";
import { retrieveAuth } from "./features/auth/authSlice";
import NotFound from "./NotFound/index.jsx";
import axios from "axios";
import { useSelector } from "react-redux";
import { NODE_API_ENDPOINT } from "../src/utils/utils.js";

import CourtRoom from "./CourtRoom/CourtRoom.jsx";
import LoginToCourtRoom from "./CourtRoom/Login/LoginToCourtRoom.jsx";
import BookNow from "./CourtRoom/BookNow/BookNow.jsx";

import CourtroomAiHome from "./CourtRoom/CourtroomAi/CourtroomAiHome.jsx";
import CourtRoomAiLayout from "./CourtRoom/CourtroomAi/CourtRoomAiLayout.jsx";
import CourtroomArgument from "./CourtRoom/CourtroomAi/CourtroomArgument.jsx";
import UploadDoc from "./CourtRoom/CourtroomAi/UploadDoc.jsx";
import Verdict from "./CourtRoom/CourtroomAi/Verdict.jsx";
import Contact from "./CourtRoom/ContactUs/Contact.jsx";
import { retrieveCourtroomAuth } from "./features/bookCourtRoom/LoginReducreSlice.js";
import FooterBanner from "./FooterBanner/FooterBanner.jsx";
import ConfirmBooking from "./CourtRoom/BookNow/ConfirmBooking.jsx";
import NewLayout from "./CourtRoom/CourtroomAi/NewLayout.jsx";
import Admin from "./CourtRoom/admin/Admin.jsx";
import AdminLayout from "./CourtRoom/admin/AdminLayout.jsx";
import CourtRoomUsers from "./CourtRoom/admin/Admin.jsx";
import AllowedBooking from "./CourtRoom/admin/AllowedBooking.jsx";
import AllowedLogin from "./CourtRoom/admin/AllowedLogin.jsx";

function App() {
  const BATCH_INTERVAL = 60 * 1000;
  const currentUser = useSelector((state) => state.auth.user);

  const currentUserRef = useRef(currentUser);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  const updateEngagementTime = useCallback(async (engagementData) => {
    try {
      await axios.post(
        `${NODE_API_ENDPOINT}/cron/engagement/time`,
        engagementData
      );
    } catch (error) {
      console.error("Error updating engagement time:", error);
    }
  }, []);

  const flushQueue = useCallback(() => {
    const user = currentUserRef.current;
    if (user) {
      updateEngagementTime([
        {
          phoneNumber: user.phoneNumber,
          engagementTime: 60,
          timestamp: Date.now(),
        },
      ]);
    }
  }, [updateEngagementTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      flushQueue();
    }, BATCH_INTERVAL);

    return () => {
      clearInterval(interval);
      flushQueue();
    };
  }, [flushQueue]);

  // this should be run only once per application lifetime
  useEffect(() => {
    // store.dispatch(retrieveAuth());
    store.dispatch(retrieveCourtroomAuth());
  }, []);

  const CourtRoomLayout = () => {
    return (
      <div className="">
        <div className="h-full ">
          <Outlet />
        </div>
        <FooterBanner />
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <CourtRoomLayout />,
      children: [
        {
          path: "",
          element: <CourtRoom />,
        },
        {
          path: "/admin",
          element: <AdminLayout />,
          children: [
            {
              path: "/admin/court-room",
              element: <CourtRoomUsers />,
            },
            {
              path: "/admin/allowed-booking",
              element: <AllowedBooking />,
            },
            {
              path: "/admin/allowed-login",
              element: <AllowedLogin />,
            },
          ],
        },
        {
          path: "/login",
          element: <LoginToCourtRoom />,
        },
        {
          path: "/book-now",
          element: <BookNow />,
        },
        {
          path: "/confirm-booking",
          element: <ConfirmBooking />,
        },
        {
          path: "/contact",
          element: <Contact />,
        },
      ],
    },
    {
      path: "courtroom-ai",
      element: <CourtRoomAiLayout />,
      children: [
        {
          path: "",
          element: <UploadDoc />,
        },
        // {
        //   path: "",
        //   element: <CourtroomAiHome />,
        // },
        {
          path: "/courtroom-ai/arguments",
          element: <CourtroomArgument />,
        },
        {
          path: "/courtroom-ai/verdict",
          element: <Verdict />,
        },
        // {
        //   path: "/courtroom-ai/verdict",
        //   element: <NewLayout />,
        // },
      ],
    },

    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
      <Toaster />
    </div>
  );
}

const WrappedApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default WrappedApp;
