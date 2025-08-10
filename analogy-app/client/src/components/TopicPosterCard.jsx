import {
  Card,
  CardActionArea,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "../api/http";

export default function TopicPosterCard({ topic }) {
  const qc = useQueryClient();
  const upvote = useMutation({
    mutationFn: () => http.post(`/topics/${topic._id}/upvote`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["topics-row"] });
      qc.invalidateQueries({ queryKey: ["topic", topic._id] });
    },
  });

  const hasImg = Boolean(topic.imageUrl);
  return (
    <Card
      variant="outlined"
      sx={{
        width: 220,
        height: 330,
        borderRadius: 2,
        overflow: "hidden",
        position: "relative",
        bgcolor: (t) => t.palette.background.paper,
      }}
    >
      <CardActionArea
        component={Link}
        to={`/topics/${topic._id}`}
        sx={{ width: "100%", height: "100%", position: "relative" }}
      >
        {/* Poster image or gradient fallback */}
        <Box
          sx={{
            width: "100%",
            height: "100%",
            background: hasImg
              ? `url(${topic.imageUrl}) center/cover no-repeat`
              : "linear-gradient(135deg, #2b88ff 0%, #6c5ce7 100%)",
          }}
        />
        {/* Bottom gradient & title */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            p: 1.2,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.65) 100%)",
            color: "#fff",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700, lineHeight: 1.2 }}
          >
            {topic.title}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.85 }}>
            {topic.category || "—"} · Resp {topic.responsesCount}
          </Typography>
        </Box>
      </CardActionArea>

      {/* Floating upvote button */}
      <IconButton
        size="small"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          upvote.mutate();
        }}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          bgcolor: "rgba(0,0,0,0.45)",
          color: "white",
          "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
        }}
        aria-label="upvote topic"
      >
        <ThumbUpAltOutlinedIcon fontSize="small" />
      </IconButton>
    </Card>
  );
}
