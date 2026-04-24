import type { DashboardStat, LogItem, YearChartResponse } from "../types/DashBoardTypes";
import api from "./axios";

export const getLogs = async () => {
  const res = await api.get<LogItem[]>("/dashboard/logs/");
  return res.data;
};
export const getDashboardStats = async (): Promise<DashboardStat[]> => {
  const res = await api.get<DashboardStat[]>("/dashboard/stats/");
  return res.data;
};
export const getYearChartData = async (year: number): Promise<YearChartResponse> => {
  const res = await api.get<YearChartResponse>("/dashboard/chart/year/",
    {
      params: { year },
    }
  );
  return res.data;
};

export const getNetworkGraphData = async (): Promise<any> => {
  const res = await api.get("/dashboard/network-graph/");
  return res.data;
};

export const getDistributionData = async (mode: string = "category"): Promise<any[]> => {
  const res = await api.get("/dashboard/distribution/", {
    params: { mode }
  });
  return res.data;
};

export const getOcrHealthData = async (): Promise<any> => {
  const res = await api.get("/dashboard/ocr-health/");
  return res.data;
};

export const getSearchInsightsData = async (): Promise<any[]> => {
  const res = await api.get("/dashboard/search-insights/");
  return res.data;
};