import type { ReportByMonthYearResponse } from "../types/ReportTypes";
import api from "./axios";

export const exportReportExcel = async (
  month: number,
  year: number
): Promise<Blob> => {
  const res = await api.get("/reports/export-excel/", {
    params: { month, year },
    responseType: "blob",
  });
  return res.data;
};

export const getReportByMonthYear = async (
  month: number,
  year: number
): Promise<ReportByMonthYearResponse> => {
  const res = await api.get<ReportByMonthYearResponse>("/reports/", {
    params: { month, year },
  });
  return res.data;
};
