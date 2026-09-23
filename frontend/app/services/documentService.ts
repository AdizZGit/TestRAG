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

  console.log("[Documents] Upload started", {
    filename: file.name,
    size: file.size,
  });

  formData.append("file", file);
  formData.append("category", category);

  const response = await axiosUpload<UploadResponse>(
    "/upload",
    formData
  );

  console.log("[Documents] Upload completed", {
    filename: response.filename,
    documentId: response.document_id,
  });

  return response;
};

export const getDocuments = async () => {
  return axiosGet<Document[]>("/documents");
};