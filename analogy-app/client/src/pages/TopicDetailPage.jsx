import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "../api/http";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function TopicDetailPage() {
  const upvoteTopic = useMutation({
    mutationFn: () => http.post(`/topics/${id}/upvote`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["topic", id] });
      qc.invalidateQueries({ queryKey: ["topics"] });
    },
    onError: () => alert("Failed to upvote topic"),
  });
  const upvoteResponse = useMutation({
    mutationFn: (rid) => http.post(`/responses/${rid}/upvote`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["responses", id] });
    },
    onError: () => alert("Failed to upvote response"),
  });
  const { id } = useParams();
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 10;

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

  const createResponse = useMutation({
    mutationFn: ({ content }) =>
      http.post(`/topics/${id}/responses`, { content }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["responses", id] });
      qc.invalidateQueries({ queryKey: ["topics"] }); // bump counts in list
    },
  });

  if (topicQ.isLoading) return <p>Loading…</p>;
  if (topicQ.isError) return <p>Error loading topic</p>;

  const t = topicQ.data;

  return (
    <div>
      <h3>{t.title}</h3>
      <div style={{ color: "#555", marginBottom: 8 }}>
        Category: {t.category || "-"} · Responses: {t.responsesCount} · Upvotes:{" "}
        {t.upvotesCount}
        <button style={{ marginLeft: 8 }} onClick={() => upvoteTopic.mutate()}>
          ▲ Upvote
        </button>
      </div>
      <p style={{ whiteSpace: "pre-wrap" }}>{t.description}</p>

      <hr style={{ margin: "16px 0" }} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const content = e.target.content.value.trim();
          if (!content) return;
          createResponse.mutate({ content });
          e.target.reset();
        }}
      >
        <textarea
          name="content"
          rows={3}
          placeholder="Add an analogy…"
          style={{ width: "100%", marginBottom: 8 }}
        />
        <button disabled={createResponse.isPending}>Post</button>
      </form>

      <h4 style={{ marginTop: 16 }}>Responses</h4>
      {responsesQ.data?.items?.map((r) => (
        <div
          key={r._id}
          style={{
            padding: 10,
            border: "1px solid #eee",
            borderRadius: 6,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              color: "#666",
            }}
          >
            <span>{new Date(r.createdAt).toLocaleString()}</span>
            <button onClick={() => upvoteResponse.mutate(r._id)}>
              ▲ {r.upvotesCount || 0}
            </button>
          </div>
          <div>{r.content}</div>
        </div>
      ))}

      {responsesQ.data && (
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Prev
          </button>
          <span>
            Page {responsesQ.data.page} /{" "}
            {Math.ceil(responsesQ.data.total / responsesQ.data.limit) || 1}
          </span>
          <button
            disabled={
              responsesQ.data.page * responsesQ.data.limit >=
              responsesQ.data.total
            }
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
