const { makeStyles } = require("@material-ui/core");

export default makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
    height: "100%",
    display: "flex",
    alignItems: "center",
  },
  glassy: {
    background: "rgba( 255, 255, 255, 0.5 )",
    boxShadow: "0 8px 20px 0 rgba( 255, 255, 255, 0.5 )",
    backdropFilter: "blur( 1.0px )",
    "-webkit-backdrop-filter": "blur( 1.0px )",
    borderRadius: "10px",
    border: "1px solid rgba( 255, 255, 255, 0.18 )",
  },
  form: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    marginLeft: "auto",
  },
  innerContainer: {
    flexGrow: 1,
    marginLeft: "auto"
  },
  bold: {
    fontWeight: "600"
  },
  inputContainer: {
    display: "flex",
  },
  buzzInButton: {
    width: "max-content"
  }
}));
