import { NavLink } from "react-router-dom";
import { styled, MenuItem, Tooltip } from "@mui/material";
import type { SvgIconComponent } from "@mui/icons-material";

interface NavItemProps {
  link?: string;
  title: string;
  action?: () => void;
  Icon: SvgIconComponent;
  navExpanded: boolean;
  mobile: boolean;
}

const StyledNavLink = styled(NavLink)({
  color: "#fff",
  textDecoration: "none",
});

const StyledMenuItem = styled(MenuItem)({
  display: "flex",
  justifyContent: "flex-start",
  "&:hover": {
    background: "rgba(0,0,0,0.15)",
  },
});

const NavItem = ({
  link,
  title,
  action,
  Icon,
  navExpanded,
  mobile,
}: NavItemProps) => {
  const hiddenStyle =
    !navExpanded && mobile ? { visibility: "hidden" as const } : {};

  return link ? (
    <StyledNavLink
      to={link}
      onClick={action}
      style={!navExpanded && mobile ? { visibility: "hidden" } : {}}
    >
      <Tooltip placement="right" title={!navExpanded ? title : ""}>
        <StyledMenuItem
          sx={
            !navExpanded
              ? { display: "flex", justifyContent: "flex-start" }
              : undefined
          }
        >
          <Icon sx={{ margin: "10px 0" }} />
          <p
            style={{
              margin: "10px 0 10px 15px",
              display: !navExpanded ? "none" : undefined,
            }}
          >
            {title}
          </p>
        </StyledMenuItem>
      </Tooltip>
    </StyledNavLink>
  ) : (
    <Tooltip placement="right" title={!navExpanded ? title : ""}>
      <MenuItem
        sx={{
          ...(navExpanded
            ? {
                display: "flex",
                justifyContent: "flex-start",
                "&:hover": { background: "rgba(0,0,0,0.15)" },
              }
            : {}),
          ...hiddenStyle,
        }}
        onClick={action}
      >
        <Icon sx={{ margin: "10px 0" }} />
        <p
          style={{
            margin: "10px 0 10px 15px",
            display: !navExpanded ? "none" : undefined,
          }}
        >
          {title}
        </p>
      </MenuItem>
    </Tooltip>
  );
};

export default NavItem;
