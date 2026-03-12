import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export function fetchTopConsistentFunds() {
  return api.get("/funds/top-consistent/").then((res) => res.data.funds);
}

export function fetchFundRankings() {
  return api.get("/funds/rankings/").then((res) => res.data.funds);
}

export function fetchFundDetail(fundName) {
  return api.get(`/funds/${fundName}/`).then((res) => res.data);
}

export function generateDataset() {
  return api.post("/funds/generate-dataset/").then((res) => res.data);
}

export default api;
