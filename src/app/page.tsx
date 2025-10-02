"use client";
import React from "react";
import Reactflowmain from "@/components/main/Reactflowmain";
import "@xyflow/react/dist/style.css";
import InputSidebar from "@/components/main/InputSidebar";

export default function App() {
  return (
    <div className="w-full min-h-screen relative  flex max-h-screen ">
      <InputSidebar />
      <Reactflowmain />
    </div>
  );
}
