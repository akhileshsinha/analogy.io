import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

// optional: attach a dev user id for write ops (use an actual user id you created)
export function setDevUser(id) {
  if (id) http.defaults.headers.common["x-user-id"] = id;
}
