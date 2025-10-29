"use client";
import React from "react";
import Reactflowmain from "@/components/main/Reactflowmain";
import "@xyflow/react/dist/style.css";
import NewResizableSidebar from "@/components/main/NewResizableSidebar";

export default function App() {
  return (
    <div className="w-full h-full relative flex max-h-[calc(100vh - 40px)] p-[20px] bg-amber-100 gap-x-[10px]">
      <NewResizableSidebar />
      {/* <div className="flex-grow border h-full w-full"> */}
        <Reactflowmain />
      {/* </div> */}
    </div>
  );
}
