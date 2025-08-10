import { Stack } from "@mui/material";
import TopicsRow from "../components/TopicsRow";

// Helper to build params
const base = (overrides) => ({
  page: "1",
  limit: "18", // each row pulls ~18 items
  order: "desc",
  ...overrides,
});

export default function TopicsNetflixHome() {
  return (
    <Stack spacing={3}>
      {/* Trending Now (popularityScore desc) */}
      <TopicsRow
        title="Trending Now"
        params={base({ sort: "popularityScore" })}
      />

      {/* New This Week (createdAt desc; you can pass ?from=ISO to restrict) */}
      <TopicsRow
        title="New This Week"
        params={base({
          sort: "createdAt" /*, from: new Date(Date.now()-7*864e5).toISOString()*/,
        })}
      />

      {/* Most Answered */}
      <TopicsRow
        title="Most Answered"
        params={base({ sort: "responsesCount" })}
      />

      {/* By Category — add or adjust categories as you wish */}
      <TopicsRow
        title="Distributed Systems"
        params={base({
          category: "Distributed Systems",
          sort: "popularityScore",
        })}
      />
      <TopicsRow
        title="Frontend"
        params={base({ category: "Frontend", sort: "popularityScore" })}
      />
      <TopicsRow
        title="Databases"
        params={base({ category: "Databases", sort: "popularityScore" })}
      />
    </Stack>
  );
}
