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

  return (
    <div
      style={{ width: `${width}px` }}
      className=" bg-white shadow-md relative flex-shrink-0 border-r-[5px] border-amber-400 rounded-[20px]"
    >
      <div
        className="absolute top-0 right-0 h-full w-2 cursor-col-resize "
        onMouseDown={handleMouseDown}
      />
      <textarea
        value={activeJson}
        onChange={handleJsonChange}
        className="w-full h-full p-4 resize-none outline-none text-sm font-mono"
        placeholder="Paste or write your JSON here..."
      />
    </div>
  );
};

export default NewResizableSidebar;
