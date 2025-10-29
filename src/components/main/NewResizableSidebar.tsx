import React, { useState, useCallback } from "react";
import { useJsonContext } from "./../contexts/JsonContext";

const NewResizableSidebar = () => {
  const { activeJson, setActiveJson, validJson, setValidJson } =
    useJsonContext();
  const [width, setWidth] = useState(500);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const newWidth = e.clientX;
    if (newWidth > 200 && newWidth < window.innerWidth - 200) {
      setWidth(newWidth);
    }
  }, []);

  const handleMouseUp = () => {
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

  return (
    <div
      style={{ width: `${width}px` }}
      className=" bg-white relative flex-shrink-0 rounded-[20px] rounded-r-[0px] "
    >
      <div
        className="absolute top-0 right-0 h-full w-[3px] cursor-col-resize hover:bg-amber-600  rounded-tr-[20px] rounded-br-[20px]"
        onMouseDown={handleMouseDown}
      />
      <button
        onClick={handleBeautify}
        className={`absolute top-4 right-4  text-white p-2 rounded-md group ${validJson ? "bg-amber-500 transition-all duration-150 hover:scale-120 cursor-pointer" : "bg-gray-400 cursor-not-allowed"}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 "
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M8 12h12M12 18h8"
          />
        </svg>
      </button>
      <textarea
        value={activeJson}
        onChange={handleJsonChange}
        className="w-full h-full p-4 pr-0  resize-none outline-none text-sm font-mono text-gray-800 [scrollbar-width:thin] [scrollbar-color:rgb(156,163,175)_transparent]"
        placeholder="Paste or write your JSON here..."
      />
    </div>
  );
};

export default NewResizableSidebar;
