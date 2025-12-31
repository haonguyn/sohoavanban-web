import type { Log } from "../types/SystemUserTypes";
import api from "./axios";

export const fetchActionLogs = async () => {
  const res = await api.get<Log[]>("/admin/action-logs/");
  return res.data;
};
