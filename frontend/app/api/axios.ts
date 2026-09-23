import axios, {
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

// ---------- GET ----------

export async function axiosGet<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await api.get(url, config);
  return response.data;
}

// ---------- POST ----------

export async function axiosPost<T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await api.post(url, data, config);
  return response.data;
}

// ---------- PUT ----------

export async function axiosPut<T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await api.put(url, data, config);
  return response.data;
}

// ---------- PATCH ----------

export async function axiosPatch<T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await api.patch(url, data, config);
  return response.data;
}

// ---------- DELETE ----------

export async function axiosDelete<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await api.delete(url, config);
  return response.data;
}

// ---------- FILE UPLOAD ----------

export const axiosUpload = async <T>(
  url: string,
  data: FormData,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await api.post<T>(url, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 300000,
    ...config,
  });

  return response.data;
};

// ---------- PDF DOWNLOAD ----------

export const axiosDownload = async (
  url: string,
  data?: any
): Promise<Blob> => {
  const response = await api.post(url, data, {
    responseType: "blob",
  });

  return response.data;
};