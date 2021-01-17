import React from "react";
import Lottie from "react-lottie";
import animationData from "assets/walkwalk.json";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
 
const useStyles = makeStyles((theme) => ({
  background: {
    width: "50%",
    height: "50%",
    display: "flex",
    [theme.breakpoints.down("xs")]: {
      position: "absolute",
      opacity: 0.5,
      width: "100%",
      zIndex: -1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }
}));

export default () => {
  const classes = useStyles();
  return (
    <Box className={classes.background}>
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
          }
        }}
        style={{ margin: 0 }}
        isStopped={false}
        isPaused={false}
      />
    </Box>
  );
};
 
