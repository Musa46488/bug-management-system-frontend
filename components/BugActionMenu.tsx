"use client";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface Props {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  bugType?: string;
  userRole: string;
  onStatusChange: (status: string) => void;
  onDeleteClick: () => void;
}

const getStatusOptions = (type?: string) => {
  if (type === "bug") return ["new", "started", "resolved"];
  if (type === "feature") return ["new", "started", "completed"];
  return [];
};

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

const BugActionMenu = ({
  anchorEl,
  open,
  onClose,
  bugType,
  userRole,
  onStatusChange,
  onDeleteClick,
}: Props) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      sx={{
        borderRadius: "8px",
        boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
        minWidth: "160px",
      }}
    >
      <MenuItem
        disabled
        sx={{
          fontWeight: 600,
          "&.Mui-disabled": { opacity: 1 },
        }}
      >
        Change Status
      </MenuItem>

      {getStatusOptions(bugType).map((status) => (
        <MenuItem
          key={status}
          onClick={() => onStatusChange(status)}
          sx={{
            textTransform: "capitalize",
            fontWeight: 500,
            color: getStatusColor(status),
          }}
        >
          {status}
        </MenuItem>
      ))}

      {userRole === "QA" && (
        <div>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem
            onClick={onDeleteClick}
            sx={{
              color: "#EC5962",
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 500,
            }}
          >
            <span>Delete</span>
            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
          </MenuItem>
        </div>
      )}
    </Menu>
  );
};

export default BugActionMenu;
