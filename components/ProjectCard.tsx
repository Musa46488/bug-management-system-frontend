import Image from "next/image";

interface ProjectCardProps {
  title: string;
  shortDetail: string;
  image: string;
  totalBugs: number;
  completedBugs: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  shortDetail,
  image,
  totalBugs,
  completedBugs,
}) => {
  return (
    <div className="bg-white shadow-[0_4px_14px_rgba(0,0,0,0.1)] w-90 h-50.5 rounded-[10px] p-3.75">
      <Image
        src={image}
        alt="Image"
        width={57}
        height={58}
        className="object-cover w-14.25 h-14.5"
        unoptimized
      />
      <p className="text-[15px] font-semibold text-black mt-5">{title}</p>
      <p className="text-[13px] font-normal text-[#87888c] my-1.25">
        {shortDetail}
      </p>
      <p className="text-[13px] font-normal text-[#87888c]">
        Task Done:{" "}
        <b className="text-black">
          {completedBugs}/{totalBugs}
        </b>
      </p>
    </div>
  );
};

export default ProjectCard;
