import { useState, useEffect } from "react";
import { http, setDevUser } from "../api/http";
import {
  Card,
  Stack,
  TextField,
  Button,
  Typography,
  Chip,
} from "@mui/material";

export default function DevUserBar() {
  const [id, setId] = useState(localStorage.getItem("devUserId") || "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (id) setDevUser(id);
  }, [id]);

  const createUser = async (e) => {
    e.preventDefault();
    if (!name || !email) return;
    const { data } = await http.post("/users", { name, email });
    setId(data._id);
    localStorage.setItem("devUserId", data._id);
    setDevUser(data._id);
    setName("");
    setEmail("");
  };

  const clearUser = () => {
    localStorage.removeItem("devUserId");
    setId("");
    setDevUser(null);
  };

  return (
    <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
      >
        <Typography variant="subtitle2" sx={{ minWidth: 80 }}>
          Dev User
        </Typography>
        {id ? (
          <>
            <Chip label={id} size="small" />
            <Button variant="outlined" onClick={clearUser}>
              Clear
            </Button>
          </>
        ) : (
          <Stack
            component="form"
            onSubmit={createUser}
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{ width: "100%" }}
          >
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit">Create & Use</Button>
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
