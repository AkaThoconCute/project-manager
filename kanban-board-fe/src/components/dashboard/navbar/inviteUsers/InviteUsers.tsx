import { useState } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddUserMenu from "./AddUserMenu";
import NavItem from "../../../layout/navComponents/NavItem";

interface InviteUsersProps {
  navExpanded?: boolean;
  mobile?: boolean;
}

const InviteUsers = ({ navExpanded, mobile }: InviteUsersProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <>
      <NavItem
        action={(e) => setAnchorEl(e?.currentTarget ?? null)}
        navExpanded={navExpanded ?? false}
        mobile={mobile ?? false}
        title="Invite Users"
        Icon={PersonAddIcon}
      />
      <AddUserMenu handleClose={() => setAnchorEl(null)} anchorEl={anchorEl} />
    </>
  );
};

export default InviteUsers;
