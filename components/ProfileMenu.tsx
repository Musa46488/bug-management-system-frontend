"use client";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

interface Props {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

const ProfileMenu = ({ anchorEl, open, onClose }: Props) => {
  const router = useRouter();
  const { logout } = useUser();

  const handleLogout = () => {
    logout();
    onClose();
    router.push("/");
  };

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      <MenuItem
        onClick={() => {
          onClose();
          router.push("/dashboard/profile");
        }}
      >
        <PersonOutlineIcon fontSize="small" />
        Edit Profile
      </MenuItem>

      <Divider />

      <MenuItem
        onClick={handleLogout}
        sx={{
          color: "#EC5962",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>Logout</span>
        <LogoutIcon sx={{ fontSize: 18 }} />
      </MenuItem>
    </Menu>
  );
};

export default ProfileMenu;
