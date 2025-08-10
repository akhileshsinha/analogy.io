import { useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "../api/http";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Stack,
  TextField,
  Button,
  Typography,
  Grid,
  Alert,
} from "@mui/material";
import { useState } from "react";

export default function NewTopicPage() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const [err, setErr] = useState("");

  const createTopic = useMutation({
    mutationFn: (body) => http.post("/topics", body),
    onSuccess: ({ data }) => {
      qc.invalidateQueries({ queryKey: ["topics"] });
      nav(`/topics/${data._id}`);
    },
    onError: (e) =>
      setErr(e?.response?.data?.error || "Failed to create topic"),
  });

  const onSubmit = (e) => {
    e.preventDefault();
    setErr("");
    const f = new FormData(e.currentTarget);
    const body = {
      title: f.get("title")?.toString().trim(),
      description: f.get("description")?.toString(),
      category: f.get("category")?.toString().trim(),
      purposes: String(f.get("purposes") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    if (!body.title) return setErr("Title is required");
    createTopic.mutate(body);
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Create a new topic
        </Typography>
        {err && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {err}
          </Alert>
        )}
        <Stack component="form" onSubmit={onSubmit} spacing={2}>
          <TextField
            label="Title *"
            name="title"
            placeholder="e.g., Explain CAP with analogies"
          />
          <TextField
            label="Description"
            name="description"
            multiline
            minRows={4}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Category"
                name="category"
                placeholder="Distributed Systems"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Purposes (comma separated)"
                name="purposes"
                placeholder="teaching, interview-prep"
                fullWidth
              />
            </Grid>
          </Grid>
          <Stack direction="row" justifyContent="flex-end">
            <Button type="submit" disabled={createTopic.isPending}>
              Create Topic
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
