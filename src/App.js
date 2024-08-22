import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./App.css";
import CourtroomHome from "./components/Courtroom/Home";
import Footer from "./components/Footer/Footer";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header/Header";

function App() {
  const CourtRoomLayout = () => {
    return (
      <div className="">
        <div className="h-full ">
          <Outlet />
        </div>
        <Footer />
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
          element: <CourtroomHome />,
        },
      ],
    },
  ]);
  return (
    <div className="App">
      <RouterProvider router={router} />
      <Toaster />
    </div>
  );
}

export default App;
