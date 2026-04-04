"use client";
import Pagination from "@mui/material/Pagination";

interface PaginationWithInfoProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const PaginationWithInfo = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}: PaginationWithInfoProps) => {
  if (totalItems <= itemsPerPage) return null;

  const startEntry = (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex justify-center w-full my-5">
      <div className="flex justify-between items-center max-w-287.5 flex-1 px-2.5 sm:px-0">
        <span className="text-sm text-[#6B7280]">
          Showing {startEntry} to {endEntry} of {totalItems} entries
        </span>

        <Pagination
          count={Math.ceil(totalItems / itemsPerPage)}
          page={currentPage}
          onChange={(_, page) => onPageChange(page)}
          shape="rounded"
          siblingCount={1}
          boundaryCount={1}
          sx={{
            "& .MuiPaginationItem-root": {
              minWidth: "28px",
              height: "28px",
              borderRadius: "4px",
              fontSize: "14px",
              color: "#6B7280",
            },
            "& .Mui-selected": {
              backgroundColor: "#007dfa !important",
              color: "#fff",
              fontWeight: 400,
            },
            "& .MuiPaginationItem-previousNext": {
              backgroundColor: "#E5E7EB",
              color: "#6B7280",
            },
            "& .MuiPaginationItem-previousNext:not(.Mui-disabled):hover": {
              backgroundColor: "#007dfa",
              color: "#FFF",
            },
            "& .MuiPaginationItem-previousNext.Mui-disabled": {
              backgroundColor: "#F3F4F6",
              color: "#9CA3AF",
              opacity: 1,
            },
          }}
        />
      </div>
    </div>
  );
};

export default PaginationWithInfo;
