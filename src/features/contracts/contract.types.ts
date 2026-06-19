export type ContractStatus = "active" | "pending" | "completed";
export type UserRole = "provider" | "seeker";
export type WorkSessionConfirmation = "مؤكدة" | "غير مؤكدة" | "ملغية" | "قيد الانتظار";

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

export type CompletedContractStatus = "انتهى بنجاح" | "انتهى بنزاع";

export interface CompletedContract {
  id: string;
  title: string;
  serviceDescription: string;
  date: string;
  durationText: string;
  otherPartyName: string;
  otherPartyInitials: string;
  rating?: number;
  status: CompletedContractStatus;
  disputeResponsible?: string; 
  iconType: "code" | "translate" | "write" | "design" | string;
}
