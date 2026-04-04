import { useState, useEffect, useRef } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useAppSelector } from "../../redux/hooks";
import NavLinks from "./navComponents/NavLinks";

const NavbarContainer = styled("div")({
  display: "flex",
  position: "fixed",
  top: 0,
  flexDirection: "column",
  justifyContent: "baseline",
  height: "100vh",
  width: "15rem",
  backgroundColor: "#4e73df",
  backgroundImage:
    "linear-gradient(0deg, rgb(0, 23, 67) 0%, rgb(20, 116, 172) 100%)",
  backgroundSize: "cover",
  zIndex: 12,
  color: "#fff",
  borderTopRightRadius: 15,
  transition: ".2s ease",
});

const ButtonContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  transition: "all .2s",
  marginTop: 10,
});

const ArrowButton = styled(IconButton)({
  width: 48,
  color: "#fff",
  transition: "background .2s",
});

const MobileBackdrop = styled("div")({
  position: "absolute",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.20)",
  zIndex: 111,
});

const VerticalNav = () => {
  const [navExpanded, setNavExpanded] = useState(true);
  const [prepareToHide, setPrepareToHide] = useState(true);
  const [mobile, setMobile] = useState(false);
  const { loading } = useAppSelector((state) => state.userLogin);
  const navbarRef = useRef<HTMLDivElement>(null);

  const handleWindowSizeChange = () => {
    if (window.innerWidth <= 768) {
      setNavExpanded(false);
      setPrepareToHide(false);
      setMobile(true);
    } else if (window.innerWidth > 768) {
      setMobile(false);
    }
  };

  useEffect(() => {
    handleWindowSizeChange();
    window.addEventListener("resize", handleWindowSizeChange);
    return () => window.removeEventListener("resize", handleWindowSizeChange);
  }, []);

  const expandHandle = () => {
    setPrepareToHide((prev) => !prev);
    if (!mobile) {
      setNavExpanded((prev) => !prev);
    } else if (navExpanded && mobile) {
      if (navbarRef.current) {
        navbarRef.current.style.width = "0";
        navbarRef.current.style.marginRight = "0";
      }
      setTimeout(() => {
        setNavExpanded(false);
      }, 200);
    } else {
      setNavExpanded(true);
    }
  };

  return (
    <>
      <Box sx={{ background: "transparent", zIndex: 112 }}>
        <NavbarContainer
          ref={navbarRef}
          style={{
            width: navExpanded ? "13.5rem" : mobile ? 0 : 56,
          }}
        >
          <NavLinks
            navExpanded={mobile ? prepareToHide : navExpanded}
            mobile={mobile}
            closeNav={() => mobile && navExpanded && expandHandle()}
          />
          {!loading && (
            <ButtonContainer
              style={{ marginLeft: !navExpanded && mobile ? 5 : undefined }}
            >
              <ArrowButton onClick={expandHandle}>
                <ArrowForwardIosIcon
                  sx={{ transition: ".2s ease" }}
                  color={!navExpanded && mobile ? "primary" : "inherit"}
                  style={{
                    color: navExpanded ? "#fff" : undefined,
                    transform: navExpanded ? "rotate(-180deg)" : "rotate(0deg)",
                  }}
                />
              </ArrowButton>
            </ButtonContainer>
          )}
        </NavbarContainer>
        {/* Fix to use position: fixed and keep navbar's space */}
        {!mobile && (
          <div
            style={{
              width: navExpanded ? "13.5rem" : mobile ? 48 : 56,
              visibility: "hidden",
              transition: ".2s ease",
            }}
          >
            <NavLinks navExpanded={navExpanded} mobile={mobile} />
          </div>
        )}
      </Box>
      {mobile && navExpanded && <MobileBackdrop onClick={expandHandle} />}
    </>
  );
};

export default VerticalNav;
