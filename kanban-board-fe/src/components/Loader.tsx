import CircularProgress from "@mui/material/CircularProgress";

interface LoaderProps {
  button?: boolean;
  contained?: boolean;
}

const Loader = ({ button, contained }: LoaderProps) => {
  return (
    <CircularProgress
      style={
        button
          ? {
              width: 26,
              height: 26,
              position: "absolute",
              top: "calc(50% - 13px)",
              left: "calc(50% - 13px)",
            }
          : contained
            ? {
                width: 50,
                height: 50,
                position: "relative",
                top: "calc(50% - 25px)",
                left: "calc(50% - 25px)",
              }
            : {
                width: 70,
                height: 70,
                position: "absolute",
                top: "30%",
                left: "calc(50% - 35px)",
              }
      }
    />
  );
};

export default Loader;
