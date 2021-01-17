import {
  createMuiTheme, responsiveFontSizes
} from "@material-ui/core";

export default responsiveFontSizes(createMuiTheme({
  props: {
    MuiTooltip: {
      arrow: true,
      style: {
        pointerEvents: "all"
      }
    },
    MuiDivider: {
      style: {
        marginTop: 8,
        marginBottom: 8
      },
    },
  },
  overrides: {
    MuiFilledInput: {
      root: {
        background: "rgba(66, 69, 73, .4)",
        borderRadius: 4
      }
    }
  },
  typography: {
    button: {
      textTransform: "capitalize",
      fontWeight: 600,
    },
  },
  palette: {
    text: {
      primary: "#594452",
      hint: "#ddd",
      secondary: "#333",
      disabled: "#9B9DA4",
    },
    primary: {
      main: "#FEC4B4",
    },
    secondary: {
      main: "#fff",
    },
    background: {
      default: "#FEE8CD",
      paper: "#FFF",
    },
    action: {
      disabledOpacity: 1,
      disabled: "#999",
      disabledBackground: "rgba(48,48,48,.4)",
    },
    divider: "#eee"
  },
  zIndex: {
    tooltip: 99999999,
    modal: 999999999,
    drawer: 9999999,
    appBar: 99999999,

  },
}));
