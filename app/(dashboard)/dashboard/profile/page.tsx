"use client";

import { ProfileIcon, MobileIcon, EmailIcon } from "@/Icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

const ProfilePage = () => {
  const router = useRouter();
  const { user, setUser, logout } = useUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile_number, setMobileNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user.id) return;

    const fetchUserDetails = async () => {
      const accessToken = localStorage.getItem("access_token");

      try {
        const res = await fetch(`http://localhost:5000/api/users/${user.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const { data, message } = await res.json();
        if (!res.ok) throw new Error(message);

        setName(data.name || "");
        setEmail(data.email || "");
        setMobileNumber(data.mobile_number || "");
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [user.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const accessToken = localStorage.getItem("access_token");

    try {
      const res = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name, email, mobile_number }),
      });

      const { data, emailChanged, message } = await res.json();

      if (!res.ok) {
        setError(message || "Update failed");
        return;
      }

      if (emailChanged) {
        alert("Email changed. Please login again.");
        logout();
        router.push("/");
        return;
      }

      const updatedUser = {
        ...user,
        name: data.name,
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Profile updated successfully!");
    } catch {
      setError("Network error. Please try again.");
    }
  };

  if (isLoading) {
    return <p style={{ padding: 20 }}>Loading profile...</p>;
  }

  return (
    <>
      <div className="mt-7.5 flex flex-col items-center justify-center sm:justify-normal w-full h-full flex-1 px-2.5 sm:px-0">
        <p className="text-4xl font-bold text-black sm:max-w-287.5 sm:w-full flex-1 max-h-18">
          Profile Settings
        </p>

        <div className="mt-7.5 max-w-287.5 w-full max-h-115.5 flex flex-col items-center">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 max-w-110.75 w-full"
          >
            <div className="group h-16 w-full flex rounded-md focus-within:border-2 focus-within:border-[#2979ff]">
              <div className="max-w-12.5 h-full flex flex-1 items-center justify-center bg-[#f5f5f7] transition-all duration-300 rounded-l-md group-focus-within:bg-white">
                <ProfileIcon className="max-w-6 max-h-6 fill-[#8b8fa8] transition-all duration-300 group-focus-within:fill-[#3c4071]" />
              </div>
              <input
                className="flex-1 h-full w-full px-4 text-base font-medium bg-[#f5f5f7] text-[#8b8fa8] rounded-r-md transition-all duration-300 border-none outline-none group-focus-within:bg-white group-focus-within:text-[#3c4071]"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="group h-16 w-full flex rounded-md focus-within:border-2 focus-within:border-[#2979ff]">
              <div className="max-w-12.5 h-full w-full flex flex-1 items-center justify-center bg-[#f5f5f7] transition-all duration-300 rounded-l-md group-focus-within:bg-white">
                <MobileIcon className="max-w-6 max-h-6 fill-[#8b8fa8] transition-all duration-300 group-focus-within:fill-[#3c4071]" />
              </div>
              <input
                className="flex-1 h-full w-full px-4 text-base font-medium bg-[#f5f5f7] text-[#8b8fa8] rounded-r-md transition-all duration-300 border-none outline-none group-focus-within:bg-white group-focus-within:text-[#3c4071]"
                type="text"
                placeholder="Mobile Number"
                value={mobile_number}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
              />
            </div>

            <div className="group h-16 w-full flex rounded-md focus-within:border-2 focus-within:border-[#2979ff]">
              <div className="max-w-12.5 h-full w-full flex flex-1 items-center justify-center bg-[#f5f5f7] transition-all duration-300 rounded-l-md group-focus-within:bg-white">
                <EmailIcon className="max-w-6 max-h-6 fill-[#8b8fa8] transition-all duration-300 group-focus-within:fill-[#3c4071]" />
              </div>
              <input
                className="flex-1 h-full w-full px-4 text-base font-medium bg-[#f5f5f7] text-[#8b8fa8] rounded-r-md transition-all duration-300 border-none outline-none group-focus-within:bg-white group-focus-within:text-[#3c4071]"
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="text-[#d9534f] bg-[#f8d7da] border border-[#f5c6cb] p-2.5 rounded-md font-bold text-center">
                {error}
              </div>
            )}

            <div className="flex w-full h-12.5 gap-1.25 mt-1.25">
              <button
                type="button"
                className="h-full w-1/2 rounded-[5px] bg-white text-black shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:bg-[#d4d4d8]"
                onClick={() => router.push("/dashboard/projects")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="h-full w-1/2 rounded-[5px] bg-[#007dfa] text-white hover:bg-[#0071db]"
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
