import Image from "next/image";
import React from "react";

interface UserTypeCardProps {
  textHeading: string;
  textBody: string;
  Icon: React.ElementType;
}

const UserTypeCard: React.FC<UserTypeCardProps> = ({
  textHeading,
  textBody,
  Icon,
}) => {
  return (
    <div
      className="group w-full p-4 rounded-md bg-white
        shadow-[0_4px_14px_rgba(0,0,0,0.1)]
        flex items-center gap-4 mb-5
        transition-all duration-300
        hover:bg-[#f5f5f7] hover:border-2 hover:border-[#007dfa]
        hover:-translate-y-1 cursor-pointer "
    >
      <div className="w-12.5 h-12.5 rounded-full bg-white flex justify-center items-center border-2 border-[#007dfa] transition-all duration-300 group-hover:bg-[#007dfa]">
        <Icon className="max-w-5 max-h-5 fill-[#007dfa] group-hover:fill-white" />
      </div>
      <div className="flex-1 ml-2.5">
        <p className="text-[#2f3367] text-base font-medium">{textHeading}</p>
        <p className="text-[#8692a6] text-sm font-normal">{textBody}</p>
      </div>
      <div className="relative w-5 h-5 shrink-0 mr-1.25">
        <Image
          alt="Arrow"
          src="/icons/arrow-right.png"
          fill
          className="object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </div>
    </div>
  );
};

export default UserTypeCard;
