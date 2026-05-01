import axios, { AxiosRequestConfig, Method } from "axios";

interface ApiRequestProps<P = unknown> {
  method: Method;
  url: string;
  payload?: P;
  config?: AxiosRequestConfig;
}

interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
      withCredentials:true,
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
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
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
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
    return { data: response.data, error: null };
  } catch (error: unknown) {
    let errorMessage = "حدث خطأ غير متوقع";

    if (axios.isAxiosError(error)) {
      const data = error.response?.data;

      errorMessage =
        data?.errors?.[0]?.message ||
        data?.message ||
        data?.error ||
        errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { data: null, error: errorMessage };
  }
};
