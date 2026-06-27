export type ContractStatus = "active" | "pending" | "completed" | "accepted" | "in_progress" | "waiting_confirmation" | "canceled" | "cancelled" | "rejected" | "disputed";
export type UserRole = "provider" | "seeker";
export type WorkSessionConfirmation = "مؤكدة" | "غير مؤكدة" | "ملغية" | "قيد الانتظار";

export interface WorkSession {
  id: string | number;
  createdAt?: string;
  date?: string;
  hours: number;
  notes?: string;
  status: string;
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
  deliveryType: "أونلاين" | "أوفلاين" | "حضوري";
  stats?: ContractStats;
  workSessions?: WorkSession[];
  operationLogs?: OperationLogEntry[];
  providerId?: number;
  requesterId?: number;
}

export type CompletedContractStatus = "انتهى بنجاح" | "انتهى بنزاع" | "مرفوض" | "ملغي";

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
