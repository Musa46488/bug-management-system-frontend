"use client";
import Image from "next/image";
import { ProjectIcon, BugIcon } from "@/Icons";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProfileMenu from "./ProfileMenu";
import { usePathname } from "next/navigation";

const DashboardHeader = () => {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const getSelectedTab = () => {
    if (pathname === "/dashboard/projects") return "projects";
    if (pathname?.startsWith("/dashboard/projects/")) return "bugs";
    return null;
  };

  const selectedTab = getSelectedTab();

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setRole(userData.role);
      }
    }
  }, []);

  return (
    <div className="flex justify-center w-full h-14.25 mt-7.5 px-1.25 sm:px-0">
      <div className="flex-1 max-w-62.5 h-full flex items-center">
        <Link href="/dashboard/projects">
          <Image
            src="/images/ManageBug.png"
            alt="ManageBug Icon"
            width={150}
            height={32}
          />
        </Link>
      </div>
      <div className="max-w-225 h-full flex flex-1 items-center justify-end sm:justify-between">
        <div className="max-h-5 flex-1 max-w-42.5 hidden sm:flex sm:justify-between">
          <div className="flex h-full items-center gap-2.5">
            <ProjectIcon
              className={`w-5 h-5 ${
                selectedTab === "projects" ? "fill-[#007dfa]" : "fill-[#787486]"
              }`}
            />
            <p
              className={`text-xs font-medium ${
                selectedTab === "projects" ? "text-[#2f3367]" : "text-[#787486]"
              }`}
            >
              Projects
            </p>
          </div>
          <div className="flex h-full items-center gap-2.5">
            <BugIcon
              className={`w-5 h-5 fill-none ${
                selectedTab === "bugs" ? "stroke-[#007dfa]" : "stroke-[#787486]"
              }`}
            />
            <p
              className={`text-xs font-medium ${
                selectedTab === "bugs" ? "text-[#2f3367]" : "text-[#787486]"
              }`}
            >
              Bugs
            </p>
          </div>
        </div>
        <div className="flex h-full items-center">
          <Image
            src="/icons/Notification.png"
            alt="Notification Icon"
            width={20}
            height={20}
          />
          <button
            type="button"
            className="ml-1.25 rounded-lg px-5 flex flex-1 items-center bg-[#f5f5f7] h-full max-w-33.75 justify-around cursor-pointer"
            onClick={handleProfileClick}
          >
            <Image
              src="/icons/EllipseIcon.png"
              alt="Profile"
              width={40}
              height={40}
            />
            <p className="ml-5 text-[#3B3F70] text-base font-medium hidden sm:block">
              {role === "manager"
                ? "Mgr."
                : role === "developer"
                  ? "Dev."
                  : role === "QA"
                    ? "QA"
                    : null}
            </p>
          </button>
          <ProfileMenu
            anchorEl={anchorEl}
            open={open}
            onClose={handleProfileClose}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
