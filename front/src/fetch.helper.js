import axios from "axios";

axios.defaults.baseURL = "http://localhost:3003/user";

export const signUp = (data) => axios.post("/signup", data);
export const signIn = (data) => axios.post("/signin", data);
export const info = (token) =>
  axios.get("/info", {
    headers: { Authorization: `Bearer ${token}` },
  });
export const latency = (token) =>
  axios.get("/latency", {
    headers: { Authorization: `Bearer ${token}` },
  });
export const logout = (token, all) =>
  axios.get(`/logout/${all}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
