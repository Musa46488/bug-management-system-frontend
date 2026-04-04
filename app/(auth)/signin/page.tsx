"use client";
import Image from "next/image";
import Link from "next/link";
import { EmailIcon, LockIcon } from "@/Icons";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/context/UserRoleContext";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();
  const { setRole } = useUserRole();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const { data, access_token, message } = await response.json();

      if (response.ok) {
        const userData = {
          id: data.id,
          name: data.name,
          role: data.role,
        };

        setRole(data.role);

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("access_token", access_token);

        document.cookie = `access_token=${access_token}; path=/`;

        router.push("/dashboard/projects");
      } else {
        setError(message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setError("Network error. Please try again.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-full h-full max-h-132.5 max-w-110.75 flex flex-col gap-7.5 px-2.5 sm:px-0">
        <p className="text-[1.75rem] font-bold text-[#2f3367]">Login</p>
        <p className="text-base font-medium text-[#8692a6]">
          Please enter your login details
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col w-full h-full gap-6"
        >
          <div className="group max-h-16 h-full w-full flex rounded-md flex-1 focus-within:border-2 focus-within:border-[#80befc]">
            <div className="max-w-12.5 h-full flex flex-1 items-center justify-center bg-[#f5f5f7] transition-all duration-300 rounded-l-md group-focus-within:bg-white">
              <EmailIcon className="max-w-6 max-h-6 fill-[#8b8fa8] transition-all duration-300 group-focus-within:fill-[#3c4071]" />
            </div>
            <input
              className="flex-1 h-full w-full px-4 text-base font-medium bg-[#f5f5f7] text-[#8b8fa8] rounded-r-md transition-all duration-300 border-none outline-none group-focus-within:bg-white group-focus-within:text-[#3c4071]"
              type="email"
              name="email"
              id="email"
              placeholder="E-mail"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative group max-h-16 h-full w-full flex rounded-md flex-1 focus-within:border-2 focus-within:border-[#80befc]">
            <div className="max-w-12.5 h-full w-full flex flex-1 items-center justify-center bg-[#f5f5f7] transition-all duration-300 rounded-l-md group-focus-within:bg-white">
              <LockIcon className="max-w-6 max-h-6 fill-[#8b8fa8] transition-all duration-300 group-focus-within:fill-[#3c4071]" />
            </div>
            <input
              className="flex-1 h-full w-full px-4 text-base font-medium bg-[#f5f5f7] text-[#8b8fa8] rounded-r-md transition-all duration-300 border-none outline-none group-focus-within:bg-white group-focus-within:text-[#3c4071]"
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b8fa8] cursor-pointer"
            >
              {isPasswordVisible ? (
                <AiFillEyeInvisible size={24} />
              ) : (
                <AiFillEye size={24} />
              )}
            </button>
          </div>
          <button
            type="submit"
            className="max-w-44 w-full min-h-17.5 rounded-lg bg-[#007dfa] flex items-center justify-between px-5"
            disabled={isLoading}
          >
            <p className="text-[1.4rem] font-semibold text-white">Login</p>
            <Image
              alt="Arrow Icon"
              src="/icons/chevron-right.png"
              width={33}
              height={33}
            />
          </button>
        </form>
        {error && (
          <div className="text-[#d9534f] bg-[#f8d7da] border border-[#f5c6cb] p-2.5 rounded-md font-bold text-center">
            {error}
          </div>
        )}
        <div className="w-full pt-4 flex flex-col sm:flex-row items-center sm:items-stretch sm:justify-between border-t border-[#ececf0]">
          <p className="text-base text-[#8692a6] font-medium">
            Don&rsquo;t have an account account?
          </p>
          <Link
            href="/signup"
            className="text-base text-[#007dfa] font-semibold"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
