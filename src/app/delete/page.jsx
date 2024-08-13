"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { IoLogIn } from "react-icons/io5";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
// import SignUp from "./Signup";
import { motion, AnimatePresence } from "framer-motion";

//! Zod form schema for validation
const formSchema = z.object({
  email: z.string().email({ message: "Invalid Email!" }),
  role: z.string().min(1, { message: "Role is required!" }),
});

const DeleteUser = () => {
  const [errorMsg, setErrorMsg] = useState("");

  //! in handleSubmit onSubmit function will be provided as an argument
  const {
    register,
    handleSubmit,
    //! for handling errors from backend server
    // setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data) => {
    // await new Promise((resolve) => setTimeout(resolve, 1000)); //! to disable the button while form data is submitting
    setErrorMsg("");
    console.log(data);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete`,
        data
      );
      if (response.status === 200) {
        console.log("User Deleted successfully!");
        reset();
      } else {
        console.log("User Deletion failed!");
      }
    } catch (error) {
      if (error.response && error.response.status === 410) {
        setErrorMsg(error.response.data.message);
      }
      console.log("User NOT Deleted!!", error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 h-screen bg-emerald">
        <div className="hidden lg:flex items-center justify-center p-8">
          <img
            src="https://s3-alpha-sig.figma.com/img/4560/b33c/894bdafa23d933ce1aecffb7afe67ed3?Expires=1722816000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ktjdznlo1rnFQwnIKYQnyuXaJKqAw8wqFpq9~jw64kH3npERsMXZGSacqHKGC3o6yY-QtVZ8nSrhXPQHx0oZU9tlLeAkRnyD98FDs~BexdUcC3wZOocUTGam17B43uI5rIV~80jy5Bdv0TXXzqutEWSdT7mSTRCY8i0vAFLT0Om265ZawwZl-PSsmVmnl4hNVegHtk1RvaC9EvJFVXI3tUE8ZyJuIYpQGx38b2le3lENjRTsn2vWYWPsB0avUB130yrVrdtZYkIML-y7ZFjT-Q~g7u8hod4uGhToiOxhKLjASiIZfRnv6hMUWbhmLH3MqTuOPWZ2mzvVqH2px7w-Ww__"
            alt="agri-img"
            className="w-full h-auto"
          />
        </div>
        <div className="pl-16 mt-40 text-mustard space-y-2">
          <h2 className="text-5xl font-bold">Delete User</h2>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid mr-20 space-y-6">
              <div className="relative">
                <Input
                  className="w-full"
                  type="email"
                  placeholder="Email Address"
                  {...register("email")}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center rounded-full text-3xl">
                  <IoLogIn />
                </div>
              </div>

              <AnimatePresence>
                {errors.email && (
                  <motion.div
                    initial={{
                      height: 0,
                      marginTop: 0,
                      marginBottom: 0,
                      opacity: 0,
                    }}
                    animate={{
                      height: 2,
                      marginTop: 12,
                      marginBottom: 12,
                      opacity: 1,
                    }}
                    exit={{
                      height: 0,
                      marginTop: 0,
                      marginBotton: 0,
                      opacity: 0,
                    }}
                    className="text-red-500"
                  >
                    {errors.email.message}
                  </motion.div>
                )}
              </AnimatePresence>

              <Input {...register("role")} type="text" placeholder="Role" />

              <AnimatePresence>
                {errors.role && (
                  <motion.div
                    initial={{
                      height: 0,
                      marginTop: 0,
                      marginBottom: 0,
                      opacity: 0,
                    }}
                    animate={{
                      height: 2,
                      marginTop: 12,
                      marginBottom: 12,
                      opacity: 1,
                    }}
                    exit={{
                      height: 0,
                      marginTop: 0,
                      marginBotton: 0,
                      opacity: 0,
                    }}
                    className="text-red-500"
                  >
                    {errors.role.message}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {errorMsg && (
                  <motion.div
                    initial={{
                      height: 0,
                      marginTop: 0,
                      marginBottom: 0,
                      opacity: 0,
                    }}
                    animate={{
                      height: 2,
                      marginTop: 12,
                      marginBottom: 12,
                      opacity: 1,
                    }}
                    exit={{
                      height: 0,
                      marginTop: 0,
                      marginBotton: 0,
                      opacity: 0,
                    }}
                    className="text-red-500"
                  >
                    {errorMsg}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-center">
                <Button
                  className="bg-emerald border-mustard text-mustard text-2xl justify-center p-6 font-semibold hover:text-emerald hover:bg-mustard duration-200 hover:duration-200"
                  variant="outline"
                  type="submit"
                >
                  {isSubmitting ? "Deleting User..." : "Delete User"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default DeleteUser;
