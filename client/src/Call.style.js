const { makeStyles } = require("@material-ui/styles");

export default makeStyles((theme) => ({
  mainVideo: {
    margin: "auto",
    borderRadius: 8,
    overflow: "hidden"
  },
  subVideo: {
    bottom: theme.spacing(2),
    right: 0,
    overflow: "hidden",
    borderRadius: 8,
    position: "absolute",
    width: 200,
    maxWidth: "50%",
  },
  container: {
    background: "#333",
    width: "100%",
    height: "100%",
    flexDirection: "column",
    display: "flex",
  },
  controlBar: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(2),
    color: "white",
    backgroundColor: "transparent",
    minHeight: 80,
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      flexWrap: "wrap",
    },
  },
  controls: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    "& > *": {
      marginRight: theme.spacing(2)
    },
    "&:last-child": {
      marginRight: 0
    }
  },
  peerName: {
    flexGrow: 1,
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  bottomOverlay: {
    position: "absolute",
    color: "white",
    bottom: 0,
    left: 0,
    width: "100%",
    padding: theme.spacing(1),
    backgroundImage: "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,.5))"
  },
  controlFill: {
    flexGrow: 1
  },
  innerContainer: {
    flexGrow: 1,
    display: "flex",
    position: "relative",
    width: "100%",
  }
}));
