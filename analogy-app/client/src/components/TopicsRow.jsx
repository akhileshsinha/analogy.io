import { useQuery } from "@tanstack/react-query";
import { http } from "../api/http";
import { useRef, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import ClassNames from "embla-carousel-class-names";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TopicPosterCard from "./TopicPosterCard";

export default function TopicsRow({ title, params }) {
  // params -> URLSearchParams or plain object of query params for /api/topics
  const qs = new URLSearchParams(params).toString();
  const { data, isLoading } = useQuery({
    queryKey: ["topics-row", title, qs],
    queryFn: async () => (await http.get(`/topics?${qs}`)).data,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });

  const [emblaRef, embla] = useEmblaCarousel(
    { align: "start", containScroll: "trimSnaps" },
    [ClassNames()]
  );
  const prev = () => embla && embla.scrollPrev();
  const next = () => embla && embla.scrollNext();
  const canScroll = data?.items?.length > 0;

  // keyboard arrow navigation (optional)
  const wrapRef = useRef(null);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [embla]);

  return (
    <Stack spacing={1} sx={{ position: "relative" }} ref={wrapRef} tabIndex={0}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 0.5 }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          {title}
        </Typography>
        <Stack direction="row" spacing={1}>
          <IconButton size="small" onClick={prev} disabled={!canScroll}>
            <ChevronLeftIcon />
          </IconButton>
          <IconButton size="small" onClick={next} disabled={!canScroll}>
            <ChevronRightIcon />
          </IconButton>
        </Stack>
      </Stack>

      <Box sx={{ position: "relative" }}>
        {isLoading && (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ height: 200 }}
          >
            <CircularProgress size={28} />
          </Stack>
        )}

        <div className="embla" ref={emblaRef} style={{ overflow: "hidden" }}>
          <div
            className="embla__container"
            style={{ display: "flex", gap: "12px", padding: "6px" }}
          >
            {data?.items?.map((t) => (
              <div
                className="embla__slide"
                key={t._id}
                style={{ flex: "0 0 auto" }}
              >
                <TopicPosterCard topic={t} />
              </div>
            ))}
          </div>
        </div>
      </Box>
    </Stack>
  );
}
