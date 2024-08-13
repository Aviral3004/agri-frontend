"use client"
import React from "react";
import MyDropzone from "@/components/ui/dropzone";

export default function Upload() {
    return (
        <>
        <div className="w-full h-screen bg-black text-white overflow-scroll">
            <div className="flex flex-col justify-center items-center p-10 content-center">
                <h1 className="text-3xl md:text-8xl font-lato">Upload Images</h1>
                <MyDropzone className="p-16 mt-10 border-4 border-dashed rounded-lg border-red-400 cursor-pointer hover:scale-110 duration-300 font-lato"/>
            </div>
        </div>
        </>
    );
}