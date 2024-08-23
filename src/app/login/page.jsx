"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { IoLogIn } from "react-icons/io5";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
// import SignUp from "./Signup";

//! Zod form schema for validation
const formSchema = z.object({
  email: z.string().email({ message: "Invalid Email!" }),
  password: z.string().min(1, { message: "Password is required!" }),
  role: z.string().min(1, { message: "Role is required!" }),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  //! in handleSubmit onSubmit function will be provided as an argument
  const {
    register,
    handleSubmit,
    //! for handling errors from backend server
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data) => {
    // await new Promise((resolve) => setTimeout(resolve, 1000)); //! to disable the button while form data is submitting
    console.log(data);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`,
        data
      );
      if (response.status === 200) {
        console.log("User logged in succesfully!");
        reset();
      } else {
        console.log("User login failed!");
      }
    } catch (error) {
      if (error.response && error.response.status === 405) {
        setError("email", {
          type: "manual",
          message: error.response.data.message, // Use the message from the server response
        });
      } else if (error.response && error.response.status === 401) {
        setError("password", {
          type: "manual",
          message: error.response.data.message, // Use the message from the server response
        });
      } else if (error.response && error.response.status === 403) {
        setError("role", {
          type: "manual",
          message: error.response.data.message, // Use the message from the server response
        });
      } else {
        console.log("Could not login due to unknown reason!", error);
      }
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 w-full h-screen bg-emerald">
        <div className="hidden lg:flex lg:col-span-7 items-center justify-center overflow-hidden">
            <img
              src="https://s3-alpha-sig.figma.com/img/4560/b33c/894bdafa23d933ce1aecffb7afe67ed3?Expires=1724630400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=GCo9RcTRTPV~ojhjIZENhB6eOFyoMQ0h6RHslDGTmSVR8ULp~dPR80N9h55DFMv4AdPwWdH600bPpVKsQSBHD3rCa~KevDHeq~UYR70beJbwfipE~4jB7SupPyeJPGjvxTvtal6mozBXIlDgf~~WQ5KjePj2lft18biq~X1ude~1jkrQPrZ~0iN99eNvblFw0IDR5aPt7nhAMhjTE2k4rk3oYiLHUx0ihDsUxMzTkom01Ypkl7i2AHsOt94E8PH7QUtkY1LGwG0spPgh8mDlxmAAhg6NErSnZ00-0GeIBR8UULEDbNACewEYizGS1HqJP3BwzCT3HcAtp3prJd3OLw__"
              alt="agri-img"
              className="w-full h-full object-cover p-4"
            />
        </div>
        <div className="lg:col-span-5 pl-10 mt-40 text-mustard space-y-2">
          <h2 className="text-5xl font-bold">Login</h2>
          <h3 className="mr-20">
            Thank you for getting back, please login to your account
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid mr-20 space-y-6">
              {/* <Input type="email" placeholder="Email Address" /> */}
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

              <div className="relative">
                <Input
                  {...register("password")}
                  className="w-full"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer rounded-full text-3xl select-none"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                </div>
              </div>

              <AnimatePresence>
                {errors.password && (
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
                    {errors.password.message}
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

              <div className="w-full flex items-center justify-between">
                <label className="flex items-center select-none">
                  <Checkbox className="h-5 w-5 border-mustard" />
                  <span className="ml-2 text-sm text-white hover:font-bold hover:duration-200 duration-200 cursor-pointer">
                    Keep me logged in
                  </span>
                </label>
                {/* Need Navlink here for forgot password */}
                <a
                  href="#"
                  className="text-white hover:font-bold hover:duration-200 duration-200 hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="flex justify-center">
                <Button
                  className="bg-emerald border-mustard text-mustard text-2xl justify-center p-6 font-semibold hover:text-emerald hover:bg-mustard duration-200 hover:duration-200"
                  variant="outline"
                  type="submit"
                >
                  {isSubmitting ? "Logging In..." : "Login"}
                </Button>
              </div>
            </div>
          </form>
          <div className="flex justify-center items-center pt-6 mr-20">
            <p>Don't have an account.</p>
            {/* Need NavLink here for sign up */}
            <Link
              href="/signup"
              className="text-xl p-2 font-semibold hover:underline hover:scale-110 hover:duration-200 duration-200"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
