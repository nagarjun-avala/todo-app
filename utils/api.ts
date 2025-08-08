// frontend/utils/api.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api", // change if backend runs elsewhere
  withCredentials: true,
});

let isRefreshing = false;
let subscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
};

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const { data } = await instance.post("/auth/refresh");
          const newToken = data.accessToken;

          instance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newToken}`;
          onRefreshed(newToken);
        } catch (err) {
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve) => {
        subscribers.push((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          resolve(instance(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default instance;
