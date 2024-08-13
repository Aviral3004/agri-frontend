"use client";

import React from "react";
import RotatingText from "@/components/ui/rolltext.jsx";

const AnimateText = () => {
  return (
    <>
      <div className=" bg-black text-white w-full h-screen">
        <div className="p-20 flex gap-4 justify-stretch">
          <h1 className="text-5xl font-lato">Hello,</h1>
          <RotatingText />
        </div>
      </div>
    </>
  );
};

export default AnimateText;
