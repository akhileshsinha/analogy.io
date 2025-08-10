import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "../api/http";
import { useParams } from "react-router-dom";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Stack,
  Typography,
  Chip,
  Divider,
  TextField,
  Button,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import WhatshotOutlinedIcon from "@mui/icons-material/WhatshotOutlined";

export default function TopicDetailPage() {
  const { id } = useParams();
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);

  const topicQ = useQuery({
    queryKey: ["topic", id],
    queryFn: async () => (await http.get(`/topics/${id}`)).data,
  });

  const responsesQ = useQuery({
    queryKey: ["responses", id, page],
    queryFn: async () =>
      (await http.get(`/topics/${id}/responses?page=${page}&limit=${limit}`))
        .data,
    keepPreviousData: true,
  });

  const upvoteTopic = useMutation({
    mutationFn: () => http.post(`/topics/${id}/upvote`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["topic", id] });
      qc.invalidateQueries({ queryKey: ["topics"] });
    },
  });

  const upvoteResponse = useMutation({
    mutationFn: (rid) => http.post(`/responses/${rid}/upvote`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["responses", id] }),
  });

  const submitResponse = async (e) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;
    try {
      setPosting(true);
      await http.post(`/topics/${id}/responses`, { content: trimmed });
      setContent("");
      qc.invalidateQueries({ queryKey: ["responses", id] });
      qc.invalidateQueries({ queryKey: ["topics"] });
    } finally {
      setPosting(false);
    }
  };

  if (topicQ.isLoading) return <Typography>Loading…</Typography>;
  if (topicQ.isError)
    return <Typography color="error">Error loading topic</Typography>;

  const t = topicQ.data;
  const resp = responsesQ.data;

  return (
    <Stack spacing={2}>
      {/* Topic header */}
      <Card variant="outlined">
        <CardHeader
          title={
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {t.title}
            </Typography>
          }
          subheader={
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Chip
                icon={<CategoryOutlinedIcon />}
                size="small"
                label={t.category || "—"}
              />
              <Chip
                icon={<ChatBubbleOutlineIcon />}
                size="small"
                label={`Responses: ${t.responsesCount}`}
              />
              <Chip
                icon={<WhatshotOutlinedIcon />}
                size="small"
                label={`Pop: ${t.popularityScore}`}
              />
            </Stack>
          }
          action={
            <IconButton
              color="primary"
              onClick={() => upvoteTopic.mutate()}
              aria-label="upvote topic"
            >
              <ThumbUpAltOutlinedIcon />
            </IconButton>
          }
        />
        {t.description && (
          <CardContent>
            <Typography sx={{ whiteSpace: "pre-wrap" }}>
              {t.description}
            </Typography>
          </CardContent>
        )}
      </Card>

      {/* Composer */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Add an analogy
          </Typography>
          <Stack component="form" onSubmit={submitResponse} spacing={1}>
            <TextField
              multiline
              minRows={3}
              placeholder="Write a crisp analogy…"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <Button type="submit" disabled={posting}>
                Post
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Responses */}
      <Card variant="outlined">
        <CardHeader title={`Responses (${resp?.total ?? 0})`} />
        <Divider />
        <CardContent sx={{ pt: 0 }}>
          {!responsesQ.data?.items?.length && (
            <Typography color="text.secondary">
              Be the first to respond.
            </Typography>
          )}
          <List dense>
            {responsesQ.data?.items?.map((r) => (
              <ListItem key={r._id} alignItems="flex-start" sx={{ py: 1.5 }}>
                <ListItemText
                  primary={
                    <Typography sx={{ whiteSpace: "pre-wrap" }}>
                      {r.content}
                    </Typography>
                  }
                  secondary={new Date(r.createdAt).toLocaleString()}
                />
                <ListItemSecondaryAction>
                  <Button
                    size="small"
                    startIcon={<ThumbUpAltOutlinedIcon fontSize="small" />}
                    onClick={() => upvoteResponse.mutate(r._id)}
                  >
                    {r.upvotesCount || 0}
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          {/* Simple pager */}
          {resp && (
            <Box
              sx={{ display: "flex", gap: 1, justifyContent: "center", mt: 1 }}
            >
              <Button
                variant="outlined"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </Button>
              <Typography variant="body2" sx={{ alignSelf: "center" }}>
                Page {resp.page} /{" "}
                {Math.max(1, Math.ceil(resp.total / resp.limit))}
              </Typography>
              <Button
                variant="outlined"
                disabled={resp.page * resp.limit >= resp.total}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
