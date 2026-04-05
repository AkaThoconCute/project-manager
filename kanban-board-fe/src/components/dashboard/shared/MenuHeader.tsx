import { Typography, Divider } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

interface MenuHeaderProps {
  goBackHandle?: () => void;
  handleClose: () => void;
  title: string;
}

const MenuHeader: React.FC<MenuHeaderProps> = ({
  goBackHandle,
  handleClose,
  title,
}) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 4,
        }}
      >
        {goBackHandle ? (
          <ArrowBackIosIcon
            style={{ fontSize: "1rem", cursor: "pointer", marginLeft: 10 }}
            onClick={goBackHandle}
          />
        ) : (
          <CloseRoundedIcon
            style={{
              fontSize: "1.3rem",
              cursor: "pointer",
              marginRight: 10,
              visibility: "hidden",
            }}
          />
        )}
        <Typography
          variant="subtitle1"
          style={{
            overflowX: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            padding: "0 15px",
          }}
        >
          {title}
        </Typography>
        <CloseRoundedIcon
          style={{
            fontSize: "1.3rem",
            cursor: "pointer",
            marginRight: 10,
            width: 21,
            height: 21,
          }}
          onClick={handleClose}
        />
      </div>
      <Divider style={{ margin: "0 9px" }} />
    </>
  );
};

export default MenuHeader;
