import { axiosDownload } from "@/app/api/axios";
export const pdfdownload = async (
  report: any
) => {

  return axiosDownload(
    "/generate-report",
    report
  );

};