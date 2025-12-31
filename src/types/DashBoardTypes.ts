// src/types/DashBoardTypes.ts

export interface LogItem {
  type: string;
  message: string;
  time: string;
}

export interface DashboardStat {
  label: string;
  val: number;
  color: string;
  icon: string;
}

export interface YearChartResponse {
  labels: string[];
  values: number[];
}