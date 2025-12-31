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