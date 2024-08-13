import axios from "axios";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { IoMdClose } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyDropzone({ className }) {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      // Do something with the files
      // console.log(acceptedFiles);

      // console.log(rejectedFiles);

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
      // if (acceptedFiles?.length) {
      //   setFiles((previousFiles) => [
      //     ...previousFiles,
      //     ...acceptedFiles.map((file) =>
      //       Object.assign(file, { preview: URL.createObjectURL(file) })
      //     ),
      //   ]);
      // }

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

      if (newFiles?.length) {
        setFiles((previousFiles) => [
          ...previousFiles,
          ...newFiles.map((file) =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
          ),
        ]);
      }

      //   if (!fileSizeError && !fileCountError && !duplicateFileError) {
      //     toast.success("Files accepted successfully!");
      //   }

      // console.log(rejectedFiles);
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

  const removeFile = (name) => {
    setFiles((files) => files.filter((file) => file.name !== name));
  };

  //   const removeRejected = (name) => {
  //     setRejectedFiles((files) => files.filter(({ file }) => file.name !== name));
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files?.length) {
      toast.error("No files selected! Please add a file.");
      return;
    }

    // const processingToastId = toast.loading("Processing...");

    //! for single file upload from the end.
    // const formData = new FormData();
    // files.forEach((file) => formData.append("file", file));

    //* HERE IS THE axios POST REQUEST TO SEND ALL IMAGES TO CLOUD (Can change it to backend URL later)

    try {
      const URL = process.env.NEXT_PUBLIC_CLOUDINARY_URL;
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "agri-images");

        const response = await axios.post(URL, formData);
        // console.log(response.data); //! each file response data
      });

      await toast.promise(
        Promise.all(uploadPromises),
        {
          pending: "Uploading images...",
          success: "Images sent to Cloudinary successfully!",
          error: "Failed to send some images to Cloudinary!",
        },
        {
          autoClose: 2000,
        }
      );

      console.log("All images uploaded successfully!");

      //   const responses = await Promise.all(uploadPromises);
      //   console.log("All images uploaded succesfully!");

      //   toast.update(processingToastId, {
      //     render: "Images sent to Cloudinary successfully!",
      //     type: "success",
      //     isLoading: false,
      //     autoClose: 2000,
      //   });
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  const removeAllFiles = (e) => {
    e.preventDefault();
    setFiles([]);
  };

  //! check upload preset on cloudinary and file uploading format on the website of cloudinary
  // formData.append("upload_preset", "agri-images");

  // Debugging: Print all key-value pairs in FormData
  // for (let [key, value] of formData.entries()) {
  //   console.log(`${key}: ${value instanceof File ? value.name : value}`);
  // }

  // console.log(formData);

  // const URL = process.env.NEXT_PUBLIC_CLOUDINARY_URL;
  // console.log(URL);
  // const data = await axios
  //   .post(URL, formData)
  //   .then((res) => {
  //     toast.update(processingToastId, {
  //       render: "Images sent to Cloudinary successfully!",
  //       type: "success",
  //       isLoading: false,
  //       autoClose: 5000,
  //     });
  //     console.log(res.data);
  //   })
  //   .catch((error) => {
  //     toast.update(processingToastId, {
  //       render: "Failed to send images to Cloudinary!",
  //       type: "error",
  //       isLoading: false,
  //       autoClose: 5000,
  //     });
  //     console.log("File NOT sent to Cloudinary!", error);
  //   });

  // console.log(data);
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
        <h1 className="text-2xl border-b-2 pb-4 w-full">Accepted Files:</h1>
        <ul className="mt-6 grid grid-cols-3 md:grid-cols-4 xl:grid-cols-12 gap-10">
          {files.map((file) => (
            <li key={file.name} className="relative h-32 rounded-md shadow-lg">
              <Image
                className="h-full w-full object-cover rounded-md"
                src={file.preview}
                alt={file.name}
                width={100}
                height={100}
                onLoad={() => {
                  URL.revokeObjectURL(file.preview); //! to prevent any memory leak
                }}
              />
              <button
                type="button"
                className="w-7 h-7 border border-red-400 bg-red-400 rounded-full flex justify-center items-center absolute -top-3 -right-3 hover:bg-white transition-colors"
                onClick={() => removeFile(file.name)}
              >
                <IoMdClose className="w-5 h-5 fill-white hover:fill-red-400 transition-colors" />
              </button>
              <p className="mt-2 text-white text-[12px] font-medium">
                {file.name}
              </p>
            </li>
          ))}
        </ul>
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
