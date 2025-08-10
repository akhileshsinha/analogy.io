import { useQuery } from "@tanstack/react-query";
import { http } from "../api/http";
import { useState } from "react";
import {
  Card,
  CardContent,
  Tabs,
  Tab,
  Stack,
  Select,
  MenuItem,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";

export default function LeaderboardsPage() {
  const [tab, setTab] = useState("users");
  const [period, setPeriod] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["lb", tab, period],
    queryFn: async () => {
      const url =
        tab === "users"
          ? `/leaderboard/users?period=${period}&limit=20`
          : `/leaderboard/topics?period=${period}&limit=20`;
      return (await http.get(url)).data;
    },
  });

  return (
    <Stack spacing={2}>
      <Card variant="outlined">
        <Tabs
          value={tab}
          onChange={(_e, v) => setTab(v)}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab
            icon={<PersonOutlineIcon />}
            iconPosition="start"
            value="users"
            label="Users"
          />
          <Tab
            icon={<LocalFireDepartmentOutlinedIcon />}
            iconPosition="start"
            value="topics"
            label="Topics"
          />
        </Tabs>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="body2">Period</Typography>
            <Select
              size="small"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          {isLoading && <Typography>Loading…</Typography>}
          <List>
            {data?.items?.map((it, i) => (
              <ListItem key={it._id} divider>
                <ListItemText
                  primary={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <EmojiEventsOutlinedIcon
                        color={i < 3 ? "warning" : "disabled"}
                        fontSize="small"
                      />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {tab === "users" ? it.name : it.title}
                      </Typography>
                    </Stack>
                  }
                  secondary={
                    tab === "users" ? (
                      <Stack direction="row" spacing={1}>
                        <Chip
                          size="small"
                          label={`Score ${it.popularityScore}`}
                        />
                        <Chip
                          size="small"
                          label={`Responses ${it.responsesCount}`}
                        />
                        <Chip
                          size="small"
                          label={`Upvotes ${it.upvotesReceived}`}
                        />
                      </Stack>
                    ) : (
                      <Stack direction="row" spacing={1}>
                        <Chip
                          size="small"
                          label={`Score ${it.popularityScore}`}
                        />
                        <Chip
                          size="small"
                          label={`Responses ${it.responsesCount}`}
                        />
                        <Chip
                          size="small"
                          label={`Upvotes ${it.upvotesCount}`}
                        />
                        {it.category && (
                          <Chip size="small" label={it.category} />
                        )}
                      </Stack>
                    )
                  }
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Stack>
  );
}
