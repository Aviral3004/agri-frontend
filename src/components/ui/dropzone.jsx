import axios from "axios";
import Image from "next/image";
import React, { useCallback, useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { IoMdClose } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";

function MyDropzone({ className }) {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0); //! For progress bar
  const [retryAttempts, setRetryAttempts] = useState(0);
  //! Failed files array
  let failedFiles = [];
  const [retryingMessage, setRetryingMessage] = useState(""); //! For retrying message
  const [uploadMessage, setUploadMessage] = useState(""); //! For initial uploading messages (first upload)
  const [uploading, setUploading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0); //! Track number of files uploaded

  const initialFilesCount = useRef(0); // To keep track of the initial number of files
  const [finalFailedFiles, setFinalFailedFiles] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      //! for rejected files
      let fileSizeError = false;
      let fileCountError = false;
      let duplicateFileError = false;

      if (rejectedFiles?.length) {
        rejectedFiles.forEach(({ errors }) => {
          errors.forEach((error) => {
            if (error.code === "file-too-large") {
              fileSizeError = true;
            } else if (error.code === "too-many-files") {
              fileCountError = true;
            }
          });
        });

        if (fileSizeError && fileCountError) {
          toast.error("Too many files (max 15) and some files exceed 10MB!");
        } else if (fileSizeError) {
          toast.error("Some files exceed the maximum size of 10MB!");
        } else if (fileCountError) {
          toast.error("Too many files! You can only upload up to 15.");
        }
      }

      //! for accepted files
      //   if (acceptedFiles?.length) {
      //     setFiles((previousFiles) => [
      //       ...previousFiles,
      //       ...acceptedFiles.map((file) =>
      //         Object.assign(file, { preview: URL.createObjectURL(file) })
      //       ),
      //     ]);
      //   }

      const newFiles = acceptedFiles.filter((file) => {
        const isDuplicate = files.some(
          (existingFile) => existingFile.name === file.name
        );
        if (isDuplicate) {
          duplicateFileError = true;
          return false; //! skipped adding duplicate file
        }
        return true;
      });

      if (duplicateFileError) {
        toast.error("Duplicate files detected! They will not be inserted.");
      }

      //   if (newFiles?.length) {
      //     setFiles((previousFiles) => [
      //       ...previousFiles,
      //       ...newFiles.map((file) =>
      //         Object.assign(file, { preview: URL.createObjectURL(file) })
      //       ),
      //     ]);

      if (newFiles?.length) {
        setFiles((previousFiles) => [...previousFiles, ...newFiles]);
      }

      if (!fileSizeError && !fileCountError && !duplicateFileError) {
        toast.success(`${newFiles.length} file(s) accepted!`);
      }
    },
    [files]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpg": [".jpg"],
    },
    maxFiles: 15,
    maxSize: 1024 * 10000,
  });

  //! for removing files
  //   const removeFile = (name) => {
  //     setFiles((files) => files.filter((file) => file.name !== name));
  //   };

  //   const removeRejected = (name) => {
  //     setRejectedFiles((files) => files.filter(({ file }) => file.name !== name));
  //   };

  //! UploadAllFiles and uplodFile functions
  //* HERE IS THE axios POST REQUEST TO SEND ALL IMAGES TO CLOUD (Can change it to backend URL later)
  const URL = process.env.NEXT_PUBLIC_CLOUDINARY_URL;
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "agri-images");

    //! Introduce a random failure
    const shouldFail = Math.random() < 0.7; // 70% chance to fail

    if (shouldFail) {
      failedFiles = [...failedFiles, file];
      return;
    }

    try {
      await axios.post(URL, formData);
      setUploadedCount((prevCount) => {
        const newCount = prevCount + 1;
        console.log(
          "Progress calculation",
          newCount,
          initialFilesCount.current
        );

        setUploadProgress(
          Math.round((newCount / initialFilesCount.current) * 100)
        );

        return newCount;
      });
    } catch (error) {
      console.log("error in sending");
      failedFiles = [...failedFiles, file];
    }
  };

  const uploadAllFiles = async (filesToUpload) => {
    const uploadPromises = filesToUpload.map((file) => uploadFile(file));
    await Promise.all(uploadPromises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files?.length) {
      toast.error("No files selected! Please add a file.");
      return;
    }

    //! initial state
    initialFilesCount.current = files.length;
    setUploadProgress(0);
    setRetryAttempts(0);
    setRetryingMessage("");
    setUploadMessage("Uploading...");
    setUploading(true);
    setUploadedCount(0);

    // const processingToastId = toast.loading("Processing...");

    //! Initial upload with Retried attempts (3 attempts max) code

    let success = false;
    let currFiles = files;
    for (let i = 0; i < 4 && !success; i++) {
      console.log(i, " try");
      await uploadAllFiles(currFiles);
      console.log("length ", failedFiles.length);
      if (failedFiles.length === 0) {
        setUploadMessage("Uploaded successfully!");
        setTimeout(() => {
          setUploading(false);
        }, 5000);
        console.log("success!");
        success = true;
        setFiles([]);
      } else {
        if (i !== 3) {
          setUploadMessage("Initial Upload Failed. Reuploading...");
          setRetryingMessage(
            `Error uploading some files (Reuploading Attempt ${i + 1}/3)`
          );
        } else {
          setFinalFailedFiles(failedFiles);
          console.log(failedFiles);
          setUploadMessage("Final Upload Failed! Please Retry.");
          setTimeout(() => {
            setUploading(false);
          }, 5000);
          setFiles([]);
        }
        currFiles = [...failedFiles];
        failedFiles = [];
        setRetryAttempts(i + 1);
      }
    }
  };

  const removeAllFiles = (e) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error("No files to remove!");
      return;
    }
    setFiles([]);
    toast.success("All files removed!");
  };

  return (
    <>
      <div {...getRootProps({ className: className })}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <div className="flex flex-col justify-center items-center gap-4">
            <p>Drag 'n' drop some files here, or click to select files</p>
            <p>Please insert .jpg files only!</p>
          </div>
        )}
      </div>
      <form
        className="flex flex-col gap-10 p-10 items-center"
        onSubmit={handleSubmit}
      >
        {/* Preview Code */}
        <button
          type="submit"
          className="border-2 border-red-500 text-red-500 hover:text-white hover:bg-red-500 uppercase w-fit p-5 rounded-lg duration-200 font-lato hover:scale-110"
        >
          upload to cloudinary
        </button>
        <button
          className="border-2 border-red-500 text-red-500 hover:text-white hover:bg-red-500 uppercase w-fit p-5 rounded-lg duration-200 font-lato hover:scale-110"
          onClick={removeAllFiles}
        >
          remove all files
        </button>
        {/* Progress Bar */}
        {/* {uploadProgress > 0 && (
          <div className="flex flex-col items-center">
            <div className="w-64 bg-black rounded-full h-4 p-[2px] border-2 border-red-500 box-border">
              <div
                className="bg-red-500 h-full rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="mt-2 text-white">{uploadProgress}%</p>
          </div>
        )} */}
        <AnimatePresence>
          {uploading && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="w-64 bg-black rounded-full h-4 border-2 p-[2px] border-red-500 box-border">
                <motion.div
                  className="bg-red-500 h-full rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.5 }} // Duration of the animation
                />
              </div>
              <p className="mt-2 text-white">{uploadProgress}%</p>
              <motion.p
                className="mt-2 text-white"
                initial={{ opacity: 1 }}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                {uploading ? uploadMessage : ""}
              </motion.p>
              {/* //! Retry if upload fails (Reuploading message) */}
              {retryAttempts > 0 && retryAttempts <= 3 && (
                <motion.p
                  className="mt-2 text-white"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.5 }}
                >
                  {retryingMessage}
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        {/* //! For preview of Accepted Files */}
        {/* <h1 className="text-2xl border-b-2 pb-4 w-full">Accepted Files:</h1> */}
        {/* <ul className="mt-6 grid grid-cols-3 md:grid-cols-4 xl:grid-cols-12 gap-10">
          {files.map((file) => (
            <li key={file.name} className="relative h-32 rounded-md shadow-lg"> */}
        {/* <Image
                className="h-full w-full object-cover rounded-md"
                src={file.preview}
                alt={file.name}
                width={100}
                height={100}
                onLoad={() => {
                  URL.revokeObjectURL(file.preview); //! to prevent any memory leak
                }}
              /> */}
        {/* <button
                type="button"
                className="w-7 h-7 border border-red-400 bg-red-400 rounded-full flex justify-center items-center absolute -top-3 -right-3 hover:bg-white transition-colors"
                onClick={() => removeFile(file.name)}
              >
                <IoMdClose className="w-5 h-5 fill-white hover:fill-red-400 transition-colors" />
              </button> */}
        {/* <p className="mt-2 text-white text-[12px] font-medium">
                {file.name}
              </p> */}
        {/* </li>
          ))}
        </ul> */}
        {/* Rejected Files Code */}
        {/* <h1 className="text-2xl border-b-2 pb-4 pt-5">Rejected Files:</h1>
        <ul className="mt-6 flex flex-col">
          {rejectedFiles.map(({ file, errors }) => (
            <li key={file.name} className="flex items-start justify-between">
              <div>
                <p className="mt-2 text-neutral-500 text-sm font-medium">
                  {file.name}
                </p>
                <ul className="text-[12px] text-red-400">
                  {errors.map((error) => (
                    <li key={error.code}>{error.message}</li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                className="mt-1 py-1 text-[12px] uppercase tracking-wider font-bold text-red-500 border border-red-400 rounded-md px-3 hover:bg-red-400 hover:text-white transition-colors"
                onClick={() => removeRejected(file.name)}
              >
                remove
              </button>
            </li>
          ))}
        </ul> */}
        {/*//! Failed Files */}
        <AnimatePresence>
          {finalFailedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5 }}
              className="mt-4 text-red-500"
            >
              <h2>Failed to upload the following files:</h2>
              <ul>
                {finalFailedFiles.map((file) => (
                  <li key={file.name}>{file.name}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
      <ToastContainer
        position="bottom-center" // Set position to bottom center
        autoClose={2000} // Optional: Set the duration of the toast
        hideProgressBar={false} // Optional: Show or hide the progress bar
        newestOnTop={false} // Optional: Show the newest toast on top
        closeOnClick // Optional: Close the toast on click
        rtl={false} // Optional: Right-to-left support
        pauseOnFocusLoss // Optional: Pause toast when window loses focus
        draggable // Optional: Allow dragging to dismiss toast
        pauseOnHover // Optional: Pause toast on hover
        bodyClassName="font-lato" // Optional: Custom CSS class for the body element
      />
    </>
  );
}

export default MyDropzone;
