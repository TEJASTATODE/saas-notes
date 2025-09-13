import axios from "axios";

const api = axios.create({
  baseURL:"https://saas-notes-k36a.vercel.app/api",
  withCredentials: true,
});
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};
export default api;
