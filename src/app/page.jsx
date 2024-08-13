"use client";

import Link from "next/link";

const Home = () => {
  return (
    <>
      <div className="flex justify-around items-center w-full h-screen bg-emerald text-mustard">
        <Link
          href="/login"
          className="text-2xl font-bold border-mustard border-2 p-2 rounded-2xl hover:bg-mustard hover:text-emerald duration-200 cursor-pointer"
        >
          Login
        </Link>
        <Link
          href="/delete"
          className="text-2xl font-bold border-mustard border-2 p-2 rounded-2xl hover:bg-mustard hover:text-emerald duration-200 cursor-pointer"
        >
          Delete User
        </Link>
        <Link
          href="/signup"
          className="text-2xl font-bold border-mustard p-2 rounded-2xl border-2 hover:text-emerald hover:bg-mustard duration-200 cursor-pointer"
        >
          Signup
        </Link>
        <Link
          href="/animate"
          className="text-2xl font-bold border-mustard p-2 rounded-2xl border-2 hover:text-emerald hover:bg-mustard duration-200 cursor-pointer"
        >
          Animate
        </Link>
      </div>
    </>
  );
};

export default Home;
