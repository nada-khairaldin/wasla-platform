export type TransactionType = "deposit" | "withdrawal" | "gift";

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  hours: number;
  date: string;
}

export interface Contract {
  id: string;
  title: string;
  partnerName: string;
  date: string;
  durationHours: number;
  iconBg: string;
}

export interface Review {
  id: string;
  reviewerId?: number;
  reviewerName: string;
  reviewerInitial: string;
  rating: number;
  comment: string;
}

export interface SavedService {
  id: string;
  title: string;
  providerName: string;
  durationHours: number;
}

export interface ProfileData {
  name: string;
  title: string;
  bio: string;
  offeredSkills: string[];
  requiredSkills: string[];
  avatarUrl?: string;
  timeBalanceHours: number;
  stats: {
    rating: number;
    servicesReceived: number;
    servicesProvided: number;
  };
  savedServices: SavedService[];
  reviews: Review[];
  recentContracts: Contract[];
  walletTransactions: Transaction[];
}

export interface ProfilePageProps {
  profile: ProfileData | null;
  isLoading?: boolean;
  onEditProfile?: () => void;
  onDeleteAccount?: () => void;
  onChangePassword?: () => void;
  onLogout?: () => void;
  onViewWalletDetails?: () => void;
  onViewAllContracts?: () => void;
  onViewAllSaved?: () => void;
  onViewAllTransactions?: () => void;
  onViewAllReviews?: () => void;
  onUnsaveService?: (id: string) => void;
  onContractClick?: (id: string) => void;
}
