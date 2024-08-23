import React from "react";

const NewLayout = () => {
  return (
    // <div className="h-screen m-0 overflow-hidden">
    <div className="flex flex-col h-screen p-3">
      <div className="h-[35vh] overflow-auto bg-red-300">
        <p>Top Content</p>
      </div>
      <div className="flex-1 overflow-auto bg-blue-300">
        <p>Middle Content</p>
      </div>
      <div className="h-[10vh] overflow-auto bg-green-300">
        <p>Bottom Content</p>
      </div>
    </div>
    // </div>
  );
};

export default NewLayout;
