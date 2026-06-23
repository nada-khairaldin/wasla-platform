import axios, { AxiosRequestConfig, Method } from "axios";
import Cookies from "js-cookie";

interface ApiRequestProps<P = unknown> {
  method: Method;
  url: string;
  payload?: P;
  config?: AxiosRequestConfig;
}

interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  status?: number;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = Cookies.get("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (originalRequest.url?.includes("/auth/refresh")) {
      Cookies.remove("token");
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        console.log("✅ Refresh response:", res.data);
        const { accessToken } = res.data;
        const { useAuthStore } =
          await import("@/src/features/auth/store/useAuthStore");
        useAuthStore.getState().actions.setAuth(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        console.log("🚀 Retrying original request:", originalRequest.url);
        return api(originalRequest);
      } catch (refreshError) {
        console.log("❌ Refresh failed:", refreshError);
        Cookies.remove("token");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export const apiRequest = async <T = unknown, P = unknown>({
  method,
  url,
  payload,
  config = {},
}: ApiRequestProps<P>): Promise<ApiResponse<T>> => {
  const isGet = method.toLowerCase() === "get";
  try {
    const response = await api({
      method,
      url,
      ...(payload && (isGet ? { params: payload } : { data: payload })),
      ...config,
    });
    return { data: response.data, error: null, status: response.status };
  } catch (error: unknown) {
    let errorMessage = "حدث خطأ غير متوقع";
    let status: number | undefined;

    if (axios.isAxiosError(error)) {
      status = error.response?.status;
      const data = error.response?.data;
      errorMessage =
        data?.errors?.[0]?.message ||
        data?.message ||
        data?.error ||
        errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { data: null, error: errorMessage, status };
  }
};
