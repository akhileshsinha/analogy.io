import { createTheme } from "@mui/material/styles";

export const getTheme = (mode = "light") =>
  createTheme({
    palette: {
      mode,
      primary: { main: "#2b88ff" },
      secondary: { main: "#6c5ce7" },
      background: {
        default: mode === "light" ? "#f7f8fb" : "#0b1220",
        paper: mode === "light" ? "#fff" : "#0f172a",
      },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow:
              "0 6px 24px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)",
          },
        },
      },
      MuiButton: { defaultProps: { variant: "contained" } },
      MuiTextField: { defaultProps: { size: "small" } },
    },
  });
