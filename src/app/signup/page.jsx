"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { IoLogIn } from "react-icons/io5";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

//! Zod form schema for validation
const formSchema = z
  .object({
    email: z.string().email({ message: "Invalid Email!" }),
    password: z
      .string()
      .min(8, { message: "Password must be atleast 8 characters long!" }),
    confirmPassword: z.string(),
    role: z.string().min(1, { message: "Role is required!" }),
  }) //! below is the refine method for zod to write custom validation (confirm password matching)
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match!",
    path: ["confirmPassword"], //! To Specify that the error path is confirmPassword
  });

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordVisibilitConfirm = () => {
    setConfirmPassword(!confirmPassword);
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

  //   {
  //     defaultValues: {
  //         email: "test@email.com"
  //     }
  //   } put this inside useForm() for giving defaultValues if email is not given

  const onSubmit = async (data) => {
    // await new Promise((resolve) => setTimeout(resolve, 1000)); //! to disable the button while form data is submitting
    const { confirmPassword, ...filteredData } = data;
    console.log(filteredData);
    // reset();

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/register`,
        filteredData
      );
      if (response.status === 201) {
        console.log("User created succesfully!!");
        reset();
      } else {
        console.log("User creation failed!");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // If the server responds with a 409 status, set the error for the email field
        setError("email", {
          type: "manual",
          message: error.response.data.message, // Use the message from the server response
        });
        console.log("Data NOT saved to db as this email already exists!");
      } else {
        console.log("Data NOT sent to db!!", error);
        // throw error;
      }
    }
  };

  //! For validating data before sending it to useForm
  //   const parsedData = formSchema.safeParse(data);
  //   if (!parsedData.success) {
  //     console.log(parsedData.error.errors);
  //   } else {
  //     console.log("Valid Data: ", parsedData.data);
  //   }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 h-screen bg-emerald">
        <div className="hidden lg:flex items-center justify-center p-8">
          <img
            src="https://s3-alpha-sig.figma.com/img/4560/b33c/894bdafa23d933ce1aecffb7afe67ed3?Expires=1724630400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=GCo9RcTRTPV~ojhjIZENhB6eOFyoMQ0h6RHslDGTmSVR8ULp~dPR80N9h55DFMv4AdPwWdH600bPpVKsQSBHD3rCa~KevDHeq~UYR70beJbwfipE~4jB7SupPyeJPGjvxTvtal6mozBXIlDgf~~WQ5KjePj2lft18biq~X1ude~1jkrQPrZ~0iN99eNvblFw0IDR5aPt7nhAMhjTE2k4rk3oYiLHUx0ihDsUxMzTkom01Ypkl7i2AHsOt94E8PH7QUtkY1LGwG0spPgh8mDlxmAAhg6NErSnZ00-0GeIBR8UULEDbNACewEYizGS1HqJP3BwzCT3HcAtp3prJd3OLw__"
            alt="agri-img"
            className="w-full h-auto"
          />
        </div>
        <div className="pl-16 mt-40 text-mustard space-y-2">
          <h2 className="text-5xl font-bold">Sign Up</h2>
          <h3>Thank you for choosing us, please enter your details</h3>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid mr-20 space-y-6">
              <div className="relative">
                <Input
                  {...register("email")}
                  className="w-full"
                  type="email"
                  placeholder="Email Address"
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
                  placeholder="Enter New Password"
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

              <div className="relative">
                <Input
                  {...register("confirmPassword")}
                  className="w-full"
                  type={confirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer rounded-full text-3xl select-none"
                  onClick={togglePasswordVisibilitConfirm}
                >
                  {confirmPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                </div>
              </div>

              <AnimatePresence>
                {errors.confirmPassword && (
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
                    {errors.confirmPassword.message}
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
                  <p className="ml-2 text-sm text-white hover:font-bold hover:duration-200 duration-200 cursor-pointer">
                    Keep me signed in
                  </p>
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Loading..." : "Sign Up"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
