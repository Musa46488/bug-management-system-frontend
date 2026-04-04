"use client";
import Link from "next/link";
import UserTypeCard from "@/components/UserTypeCard";
import { useUserRole } from "@/context/UserRoleContext";
import { ManagerIcon, DeveloperIcon, QAIcon } from "@/Icons";

export default function Home() {
  const { setRole } = useUserRole();

  const handleSetRole = (role: string) => {
    setRole(role);
  };
  return (
    <>
      <div className="flex justify-end mt-9 pr-9 w-full">
        <p className="text-lg font-medium leading-relaxed text-[#8692a6] mr-3">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-lg font-medium leading-relaxed text-[#007dfa]"
          >
            Sign in
          </Link>
        </p>
      </div>
      <div className="flex flex-1 justify-center items-center py-16 px-8">
        <div className="w-full h-full max-w-106.5 max-h-125">
          <h2 className="font-bold text-[#2f3367] mb-2.5 text-[1.75rem]">
            Join Us!
          </h2>
          <div className="w-full mb-7.5">
            <p className="text-base font-normal leading-7 text-[#8692a6]">
              To begin this journey, tell us what type of account you&rsquo;d be
              opening.
            </p>
          </div>
          <Link href="/signup" onClick={() => handleSetRole("manager")}>
            <UserTypeCard
              textHeading="Manager"
              textBody="Signup as a manager to manage the tasks and bugs"
              Icon={ManagerIcon}
            />
          </Link>
          <Link href="/signup" onClick={() => handleSetRole("developer")}>
            <UserTypeCard
              textHeading="Developer"
              textBody="Signup as a Developer to assign the relevant task to QA"
              Icon={DeveloperIcon}
            />
          </Link>
          <Link href="/signup" onClick={() => handleSetRole("QA")}>
            <UserTypeCard
              textHeading="QA"
              textBody="Signup as a QA to create the bugs and report in tasks"
              Icon={QAIcon}
            />
          </Link>
        </div>
      </div>
    </>
  );
}
