

export interface Log {
  id: number;
  user?: string | null;
  type: string;
  entity?: string;
  entity_id?: string | null;
  message: string;
  created_at: string;
}