import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { logout } from "../../../redux/actions/userActions";
import { CircularProgress } from "@mui/material";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import NewProjectModal from "./NewProjectModal";
import UserNav from "./UserNav";
import ProjectSelect from "./projectSelect/ProjectSelect";
import ProjectItems from "./ProjectItems";
import NavItem from "./NavItem";

interface NavLinksProps {
  navExpanded: boolean;
  mobile: boolean;
  closeNav?: () => void;
}

const NavLinks = ({ navExpanded, mobile, closeNav }: NavLinksProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { loading, userInfo } = useAppSelector((state) => state.userLogin);
  const dispatch = useAppDispatch();

  return (
    <>
      {loading && (!mobile || (mobile && navExpanded)) ? (
        <CircularProgress style={{ margin: "5vh auto 0 auto" }} />
      ) : userInfo ? (
        <>
          <UserNav navExpanded={navExpanded} mobile={mobile} />
          <ProjectItems navExpanded={navExpanded} mobile={mobile} />
          <ProjectSelect navExpanded={navExpanded} mobile={mobile} />
          <NavItem
            link="/boards"
            action={closeNav}
            navExpanded={navExpanded}
            mobile={mobile}
            title="Boards"
            Icon={DashboardIcon}
          />
          <NavItem
            action={() => setModalOpen(true)}
            navExpanded={navExpanded}
            mobile={mobile}
            title="New Project"
            Icon={CreateNewFolderIcon}
          />
          <NavItem
            action={() => {
              dispatch(logout());
              closeNav?.();
            }}
            navExpanded={navExpanded}
            mobile={mobile}
            title="Sign Out"
            Icon={ExitToAppIcon}
          />
          <NewProjectModal
            open={modalOpen}
            handleClose={() => {
              setModalOpen(false);
              if (mobile) closeNav?.();
            }}
          />
        </>
      ) : (
        <>
          <NavItem
            link="/"
            action={closeNav}
            navExpanded={navExpanded}
            mobile={mobile}
            title="Home"
            Icon={DashboardIcon}
          />
          <NavItem
            link="/signin"
            action={closeNav}
            navExpanded={navExpanded}
            mobile={mobile}
            title="Sign In"
            Icon={LockOpenIcon}
          />
          <NavItem
            link="/register"
            action={closeNav}
            navExpanded={navExpanded}
            mobile={mobile}
            title="Register"
            Icon={VpnKeyIcon}
          />
        </>
      )}
    </>
  );
};

export default NavLinks;
