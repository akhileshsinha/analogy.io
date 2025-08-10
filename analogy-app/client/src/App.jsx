import { Link, Outlet, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Container,
  Button,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DevUserBar from "./components/DevUserBar";
import { useTheme } from "@mui/material/styles";
import { useColorMode } from "./main";

export default function App() {
  const theme = useTheme();
  const { toggle } = useColorMode();
  const isDark = theme.palette.mode === "dark";
  const { pathname } = useLocation();

  const NavButton = ({ to, children }) => (
    <Button
      component={Link}
      to={to}
      color={
        pathname === to || (to === "/" && pathname === "/")
          ? "primary"
          : "inherit"
      }
      sx={{ textTransform: "none" }}
    >
      {children}
    </Button>
  );

  return (
    <>
      <AppBar position="sticky" color="inherit" elevation={1}>
        <Toolbar sx={{ gap: 1 }}>
          <Typography variant="h6" sx={{ mr: "auto", fontWeight: 700 }}>
            Analogies
          </Typography>
          <Stack direction="row" spacing={1}>
            <NavButton to="/">Topics</NavButton>
            <NavButton to="/topics/new">New Topic</NavButton>
            <NavButton to="/leaderboards">Leaderboards</NavButton>
          </Stack>
          <IconButton onClick={toggle} aria-label="toggle theme" sx={{ ml: 1 }}>
            {isDark ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <DevUserBar />
        <Outlet />
      </Container>
    </>
  );
}
