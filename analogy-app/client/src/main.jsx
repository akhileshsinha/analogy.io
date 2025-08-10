import React, { useMemo, useState, createContext, useContext } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "./theme";
import App from "./App.jsx";
import TopicsPage from "./pages/TopicsPage.jsx";
import TopicDetailPage from "./pages/TopicDetailPage.jsx";
import NewTopicPage from "./pages/NewTopicPage.jsx";
import LeaderboardsPage from "./pages/LeaderboardsPage.jsx";
import "./index.css";

const qc = new QueryClient();
const ColorModeCtx = createContext({ toggle: () => {} });
export const useColorMode = () => useContext(ColorModeCtx);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <TopicsPage /> },
      { path: "topics/new", element: <NewTopicPage /> },
      { path: "topics/:id", element: <TopicDetailPage /> },
      { path: "leaderboards", element: <LeaderboardsPage /> },
    ],
  },
]);

function Root() {
  const [mode, setMode] = useState("light");
  const theme = useMemo(() => getTheme(mode), [mode]);
  const value = useMemo(
    () => ({
      toggle: () => setMode((m) => (m === "light" ? "dark" : "light")),
    }),
    []
  );

  return (
    <ColorModeCtx.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={qc}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ThemeProvider>
    </ColorModeCtx.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
