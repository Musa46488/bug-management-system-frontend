"use client";
import { SearchIcon } from "@/Icons";
import ProjectCard from "@/components/ProjectCard";
import { useEffect, useState } from "react";
import NewProjectModal from "@/components/NewProjectModal";
import PaginationWithInfo from "@/components/PaginationWithInfo";
import { useUser } from "@/context/UserContext";
import Link from "next/link";

interface Project {
  id: number;
  name: string;
  short_detail: string;
  image: string;
  totalBugs?: number;
  completedBugs?: number;
}

const ProjectsPage = () => {
  const { user } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(6);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchProjectsByUser = async (userId: string, role: string) => {
    setIsLoading(true);
    setError(null);
    const accessToken = localStorage.getItem("access_token");
    try {
      const res = await fetch(
        `http://localhost:5000/api/projects/${role}/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const { data, message } = await res.json();
      if (res.ok) {
        const projectsWithCounts = await Promise.all(
          data.map(async (project: Project) => {
            const { total, completed } = await fetchBugCountByProject(
              project.id,
            );

            return {
              ...project,
              totalBugs: total,
              completedBugs: completed,
            };
          }),
        );

        setProjects(projectsWithCounts);
      } else setError(message || "Failed to fetch projects");
    } catch (err) {
      setError("Network error. Please try again.");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjectsByUserIdAndName = async (
    userId: string,
    query: string,
    role: string,
  ) => {
    if (!query) return;
    setIsLoading(true);
    setError(null);
    const accessToken = localStorage.getItem("access_token");
    try {
      const res = await fetch(
        `http://localhost:5000/api/projects/${role}/${userId}/name/${query}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const { data, message } = await res.json();
      if (res.ok) {
        const projectsWithCounts = await Promise.all(
          data.map(async (project: Project) => {
            const { total, completed } = await fetchBugCountByProject(
              project.id,
            );

            return {
              ...project,
              totalBugs: total,
              completedBugs: completed,
            };
          }),
        );

        setProjects(projectsWithCounts);
      } else setError(message || "Failed to fetch projects");
    } catch (err) {
      setError("Network error. Please try again.");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBugCountByProject = async (projectId: number) => {
    const accessToken = localStorage.getItem("access_token");

    const res = await fetch(
      `http://localhost:5000/api/bugs/count/project/${projectId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const result = await res.json();
    const { total, completed } = result.data;

    if (!res.ok) {
      return { total: 0, completed: 0 };
    }

    return {
      total: total,
      completed: completed,
    };
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery) {
        fetchProjectsByUserIdAndName(user.id!, searchQuery, user.role!);
      } else if (user.role && user.id) {
        fetchProjectsByUser(user.id, user.role);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const currentProjects = projects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage,
  );

  return (
    <>
      <div className="mt-7.5 flex min-h-21.25 w-full justify-center px-1.25 sm:px-0">
        <div className="py-5 relative flex flex-col sm:flex-row h-full items-center gap-7.5 border-y border-[#ececf0] max-w-287.5 flex-1 before:content-[''] before:left-0 before:bottom-0 before:w-1 before:h-[85%] before:absolute before:bg-[#50a885]">
          <div className="flex flex-col sm:flex-row items-center sm:justify-between w-full sm:max-w-240 flex-1 px-2.5 sm:px-0">
            <div className="w-full sm:max-w-65.75 h-full ml-5 flex flex-1 flex-col items-center sm:items-stretch">
              <p className="text-base font-semibold text-black">
                Visnext Software Solutions
              </p>
              {isMounted && (
                <p className="text-sm font-normal text-[#aeaeae] ">
                  Hi {user.name}, welcome to ManageBug
                </p>
              )}
            </div>
            <div className="group mt-2.5 sm:mt-0 bg-[#f1f1f1] w-full sm:max-w-84 min-h-11.25 flex flex-1 items-center gap-2.5 pl-5 rounded-md focus-within:border-2 focus-within:border-[#2979ff] focus-within:bg-white">
              <SearchIcon className="w-4.5 h-4.5 fill-none stroke-[#6e6f72] transition-all duration-300 group-focus-within:stroke-[#2f3367]" />
              <input
                type="text"
                placeholder="Search for Projects here"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-[#6e6f72] text-base font-normal border-none outline-none h-full w-full flex-1 group-focus-within:bg-white group-focus-within:text-[#2f3367]"
              />
            </div>
          </div>
          {isMounted && user.role === "manager" && (
            <button
              className="rounded-md w-1/2 sm:max-w-40.75 flex-1 min-h-11.25 bg-[#007dfa] text-white px-4 text-sm cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              + Add New Project
            </button>
          )}
          {isModalOpen && (
            <NewProjectModal
              manager_id={user.id!}
              setIsModalOpen={setIsModalOpen}
              onProjectCreated={() => fetchProjectsByUser(user.id!, user.role!)}
            />
          )}
        </div>
      </div>
      <div className="my-7.5 justify-items-center w-full flex-1">
        <div className="grid w-full max-w-287.5 gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center sm:justify-items-normal">
          {isLoading ? (
            <p>Loading projects...</p>
          ) : error ? (
            <p>{error}</p>
          ) : currentProjects.length === 0 ? (
            <p>No projects.</p>
          ) : (
            currentProjects.map((project) => (
              <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                <ProjectCard
                  title={project.name}
                  shortDetail={project.short_detail}
                  image={`http://localhost:5000${project.image}`}
                  totalBugs={project.totalBugs || 0}
                  completedBugs={project.completedBugs || 0}
                />
              </Link>
            ))
          )}
        </div>
      </div>
      {projects.length > projectsPerPage && (
        <PaginationWithInfo
          totalItems={projects.length}
          itemsPerPage={projectsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
};

export default ProjectsPage;
