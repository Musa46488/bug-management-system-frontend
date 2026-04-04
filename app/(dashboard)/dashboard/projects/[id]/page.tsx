"use client";
import { SearchIcon } from "@/Icons";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import NewBugModal from "@/components/NewBugModal";
import Image from "next/image";
import { useParams } from "next/navigation";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BugActionMenu from "@/components/BugActionMenu";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import PaginationWithInfo from "@/components/PaginationWithInfo";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Tooltip from "@mui/material/Tooltip";

interface User {
  id: string;
  name: string;
  role: string;
}

interface Bug {
  id: number;
  title: string;
  description: string;
  screenshot: string;
  deadline: string;
  type: string;
  status: string;
  assignedBugs: User[];
}

const ProjectDetailPage = () => {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const params = useParams();
  const projectId = params.id;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);
  const open = Boolean(anchorEl);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const bugsPerPage = 7;
  const [isMounted, setIsMounted] = useState(false);
  const paginatedBugs = bugs.slice(
    (currentPage - 1) * bugsPerPage,
    currentPage * bugsPerPage,
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [bugs.length, searchQuery]);

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const fetchBugs = async (projectId: string) => {
    setIsLoading(true);
    setError(null);

    const accessToken = localStorage.getItem("access_token");

    const url =
      user.role === "QA"
        ? `http://localhost:5000/api/bugs/creator/${user.id}/project/${projectId}`
        : user.role === "developer"
          ? `http://localhost:5000/api/bugs/developer/${user.id}/project/${projectId}`
          : `http://localhost:5000/api/bugs/project/${projectId}`;

    try {
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { data, message } = await res.json();

      if (res.ok) setBugs(data);
      else setError(message || "Failed to fetch bugs");
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBugsByTitle = async (projectId: string, title: string) => {
    setIsLoading(true);
    setError(null);

    const accessToken = localStorage.getItem("access_token");

    const url =
      user.role === "QA"
        ? `http://localhost:5000/api/bugs/creator/${user.id}/project/${projectId}/title/${title}`
        : user.role === "developer"
          ? `http://localhost:5000/api/bugs/developer/${user.id}/project/${projectId}/title/${title}`
          : `http://localhost:5000/api/bugs/project/${projectId}/title/${title}`;

    try {
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { data, message } = await res.json();

      if (res.ok) setBugs(data);
      else setError(message || "Failed to fetch bugs");
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery) {
        fetchBugsByTitle(projectId as string, searchQuery);
      } else if (projectId) {
        fetchBugs(projectId as string);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "#EC5962";
      case "started":
        return "#3069FE";
      default:
        return "#00B894";
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, bug: Bug) => {
    setAnchorEl(event.currentTarget);
    setSelectedBug(bug);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBug(null);
  };

  const updateBugStatus = async (bugId: number, status: string) => {
    const accessToken = localStorage.getItem("access_token");

    try {
      const res = await fetch(
        `http://localhost:5000/api/bugs/status/${bugId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ status }),
        },
      );

      if (!res.ok) throw new Error("Failed to update status");
      setBugs((prev) =>
        prev.map((bug) => (bug.id === bugId ? { ...bug, status } : bug)),
      );
    } catch (error) {
      console.error(error);
    } finally {
      handleMenuClose();
    }
  };

  const confirmDeleteBug = async () => {
    if (!selectedBug) return;

    const accessToken = localStorage.getItem("access_token");

    try {
      const res = await fetch(
        `http://localhost:5000/api/bugs/${selectedBug.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!res.ok) throw new Error("Failed to delete bug");

      setBugs((prev) => prev.filter((b) => b.id !== selectedBug.id));
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleteDialogOpen(false);
      handleMenuClose();
    }
  };

  const formatDeadline = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      <div className="mt-7.5 flex min-h-18 justify-center px-1.25 sm:px-0">
        <div className="flex flex-col sm:flex-row py-5 gap-7.5 max-w-287.5 flex-1 items-center sm:items-stretch sm:justify-between border-t border-[#ececf0]">
          <div className="flex flex-1 max-w-225">
            <p className="text-4xl font-bold text-black">All bugs listing</p>
          </div>
          {isMounted && user.role === "QA" && (
            <button
              className="max-w-40.75 min-h-10 flex-1 w-full h-full rounded-md bg-[#007dfa] text-white text-sm cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              + Add New Bug
            </button>
          )}
          {isModalOpen && (
            <NewBugModal
              creator_id={user.id!}
              setIsModalOpen={setIsModalOpen}
              projectId={projectId as string}
              onBugCreated={() => fetchBugs(projectId as string)}
            />
          )}
        </div>
      </div>
      <div className="flex justify-center">
        <div className="max-w-287.5 min-h-18.25 flex flex-1 items-center justify-between border-y border-[#ececf0] px-1.25 sm:px-0">
          <div className="group bg-white max-w-59 min-h-10 flex flex-1 items-center gap-2.5 pl-5 border-2 border-[#dde2e4] focus-within:border-[#2979ff]">
            <SearchIcon className="w-4.5 h-4.5 fill-none stroke-[#6e6f72] transition-all duration-300 group-focus-within:stroke-[#2f3367]" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-[#6e6f72] text-base font-normal border-none outline-none h-full w-full group-focus-within:text-[#2f3367]"
            />
          </div>
          <div className="max-w-75 flex flex-1 h-8 justify-end sm:justify-normal">
            <div className="w-2/5 h-full hidden sm:flex">
              <select
                name="assignTo"
                defaultValue=""
                disabled
                className="border-none outline-none w-[85%] text-sm"
              >
                <option value="" disabled className="text-sm">
                  Assign To
                </option>
              </select>
            </div>
            <div className="w-1/2 h-full flex">
              <Image
                src="/images/icons.png"
                alt="Icons"
                width={144}
                height={32}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="my-7.5 flex justify-center w-full flex-1">
        <div className="max-w-full p-2 md:max-w-287.5 flex-1">
          {isLoading ? (
            <p>Loading bugs...</p>
          ) : error ? (
            <p>{error}</p>
          ) : bugs.length === 0 ? (
            <p>No bugs found.</p>
          ) : (
            <TableContainer component={Paper}>
              <Table
                sx={{
                  "& th": {
                    height: 50,
                    py: 0,
                    fontSize: "13px",
                    fontWeight: 600,
                    fontFamily: "Poppins, sans-serif",
                    color: "#3A3541DE",
                    backgroundColor: "#F9FAFC",
                  },
                  "& td": {
                    height: 45,
                    py: 0,
                    fontSize: "14px",
                    fontWeight: 400,
                    fontFamily: "Poppins, sans-serif",
                    color: "#3A3541AD",
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "50%" }}>
                      <b>BUG DETAILS</b>
                    </TableCell>
                    <TableCell>
                      <b>STATUS</b>
                    </TableCell>
                    <TableCell align="center">
                      <b>DUE DATE</b>
                    </TableCell>
                    <TableCell>
                      <b>ASSIGNED TO</b>
                    </TableCell>
                    <TableCell align="center">
                      <b>ACTION</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedBugs.map((bug) => (
                    <TableRow key={bug.id}>
                      <TableCell>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <span
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              backgroundColor: getStatusColor(bug.status),
                              flexShrink: 0,
                            }}
                          />
                          <span>{bug.description}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={bug.status}
                          size="small"
                          sx={{
                            borderRadius: "4px",
                            backgroundColor: "#FDF2F2",
                            fontWeight: 600,
                            textTransform: "capitalize",
                            color:
                              bug.status === "new"
                                ? "#EC5962"
                                : bug.status === "started"
                                  ? "#3069FE"
                                  : "#00B894",
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {bug.deadline ? (
                          <Tooltip title={formatDeadline(bug.deadline)} arrow>
                            <IconButton size="small">
                              <CalendarMonthIcon
                                sx={{
                                  color: "#6B7280",
                                  cursor: "pointer",
                                }}
                              />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {bug.assignedBugs?.length
                          ? bug.assignedBugs.map((u) => u.name).join(", ")
                          : "-"}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, bug)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </div>
      {bugs.length > bugsPerPage && (
        <PaginationWithInfo
          totalItems={bugs.length}
          itemsPerPage={bugsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
      <BugActionMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        bugType={selectedBug?.type}
        userRole={user.role!}
        onStatusChange={(status: string) =>
          selectedBug && updateBugStatus(selectedBug.id, status)
        }
        onDeleteClick={openDeleteDialog}
      />
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteBug}
      />
    </>
  );
};

export default ProjectDetailPage;
