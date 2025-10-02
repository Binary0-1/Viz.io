import React, { useRef, useState } from "react";
import { useJsonContext } from "./../contexts/JsonContext";

const InputSidebar = () => {
  const { activeJson, setActiveJson, validJson, setValidJson } =
    useJsonContext();

  const draggingRef = useRef(false);
  const inputRef = useRef<HTMLDivElement | null>(null);
  const offset = useRef({ x: 0, y: 0 });
  const positionRef = useRef({ x: 100, y: 100 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLTextAreaElement) {
      return;
    }
    document.body.style.userSelect = "none";
    draggingRef.current = true;
    const rect = inputRef.current!.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggingRef.current || !inputRef.current) return;
    const newX = e.clientX - offset.current.x;
    const newY = e.clientY - offset.current.y;

    const element = inputRef.current;
    const elementWidth = element.offsetWidth;
    const elementHeight = element.offsetHeight;

    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    const clampedX = Math.min(Math.max(0, newX), windowWidth - elementWidth);
    const clampedY = Math.min(Math.max(0, newY), windowHeight - elementHeight);

    positionRef.current = { x: clampedX, y: clampedY };
    inputRef.current.style.left = `${clampedX}px`;
    inputRef.current.style.top = `${clampedY}px`;
  };

  const handleMouseUp = () => {
    draggingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setActiveJson(val);

    try {
      JSON.parse(val);
      setValidJson(true);
    } catch (err) {
      setValidJson(false);
    }
  };

  const handleBeautify = () => {
    if (!activeJson || !validJson) {
      alert("Not a Valid Json ");
      return;
    }

    try {
      const parsed = JSON.parse(activeJson);
      const beutified = JSON.stringify(parsed, null, 2);
      setActiveJson(beutified);
    } catch (e) {
      alert("Invalid JSON. Please correct it before beautifying.");
    }
  };

  const computedTitle =
    activeJson?.length === 0
      ? "JSON Formatter"
      : validJson
      ? "JSON Formatter"
      : "Invalid JSON";

  return (
    <div
      ref={inputRef}
      onMouseDown={handleMouseDown}
      className="absolute w-[500px] h-[600px] border border-gray-300 shadow-xl rounded-xl bg-white z-50 overflow-hidden"
      style={{
        cursor: draggingRef.current ? "grabbing" : "grab",
      }}
    >
      <div className="bg-gray-100 px-4 py-3 text-sm font-medium border-b border-gray-200 flex justify-between items-center">
        <span className="text-gray-800">{computedTitle}</span>

        <div className="flex items-center gap-2">
          {validJson !== null && (
            <span
              className={`w-3 h-3 rounded-full ${
                validJson ? "bg-green-500" : "bg-red-500"
              }`}
            />
          )}
          <button
            className="px-2 py-1 text-white font-medium rounded-sm bg-gradient-to-r from-pink-500 to-blue-500 hover:brightness-110 transition-all cursor-pointer hover:scale-105"
            onClick={handleBeautify}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M8 12h12M12 18h8"
              />
            </svg>
          </button>
        </div>
      </div>

      <textarea
        value={activeJson}
        onChange={handleJsonChange}
        className="w-full h-[500px] p-4 resize-none outline-none text-sm font-mono"
        placeholder="Paste or write your JSON here..."
      />
    </div>
  );
};

export default InputSidebar;
