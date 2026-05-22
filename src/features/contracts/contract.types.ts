export type ContractStatus = "active" | "pending";
export type UserRole = "provider" | "seeker";
export type WorkSessionConfirmation = "مؤكدة" | "غير مؤكدة" | "ملغية";

export interface WorkSession {
  id: string;
  date: string;
  hours: number;
  notes: string;
  status: WorkSessionConfirmation;
}

export interface OperationLogEntry {
  id: string;
  title: string;
  byLine: string;
  description?: string;
}

export interface ContractStats {
  completedHours: number;
  totalHours: number;
  endDate: string;
  remainingHours: number;
}

export interface Contract {
  id: string;
  title: string;
  seekerName: string;
  providerName: string;
  serviceType: string;
  status: ContractStatus;
  deliveryType: "أونلاين" | "أوفلاين";
  stats?: ContractStats;
  workSessions?: WorkSession[];
  operationLogs?: OperationLogEntry[];
}
