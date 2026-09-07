import { axiosGet, axiosUpload } from "@/app/api/axios";

export interface Document {
  id: number;
  filename: string;
  document_category: string;
}

export interface UploadResponse {
  success: boolean;
  document_id: number;
  filename: string;
  message: string;
}

export const uploadDocument = async (
  file: File,
  category: string
) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("category", category);

  return axiosUpload<UploadResponse>(
    "/upload",
    formData
  );
};

export const getDocuments = async () => {
  return axiosGet<Document[]>("/documents");
};