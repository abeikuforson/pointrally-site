export interface Team {
  id: string;
  name: string;
  code: string;
  logo: string;
  sport: 'NBA' | 'NFL' | 'MLB' | 'NHL' | 'MLS';
  city: string;
  primaryColor: string;
  secondaryColor: string;
  isConnected: boolean;
  lastSyncedAt?: Date;
  pointsBalance?: number;
}

export interface PointsTransaction {
  id: string;
  userId: string;
  teamId: string;
  type: 'earned' | 'redeemed' | 'transferred' | 'expired';
  amount: number;
  balance: number;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  category: 'tickets' | 'merchandise' | 'experiences' | 'food' | 'digital';
  pointsCost: number;
  imageUrl: string;
  teamId?: string;
  availability: 'available' | 'limited' | 'soldout';
  stock?: number;
  expiresAt?: Date;
  terms?: string[];
}

export interface RedemptionRequest {
  id: string;
  userId: string;
  rewardId: string;
  reward: Reward;
  pointsUsed: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  redemptionCode?: string;
  processedAt?: Date;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  actionText?: string;
  createdAt: Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
  status?: string;
  [key: string]: unknown;
}

export interface Analytics {
  totalPoints: number;
  pointsEarned30Days: number;
  pointsRedeemed30Days: number;
  connectedTeams: number;
  favoriteTeam?: Team;
  recentTransactions: PointsTransaction[];
  upcomingExpiration?: {
    points: number;
    date: Date;
  };
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    pointsEarned: boolean;
    pointsExpiring: boolean;
    newRewards: boolean;
    teamNews: boolean;
  };
  privacy: {
    shareActivity: boolean;
    showProfile: boolean;
    allowDataCollection: boolean;
  };
  display: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    dateFormat: string;
  };
}

export interface AppConfig {
  features: {
    socialLogin: boolean;
    teamSync: boolean;
    pointsTransfer: boolean;
    referralProgram: boolean;
    achievements: boolean;
  };
  limits: {
    maxTeamConnections: number;
    minRedemptionPoints: number;
    maxTransferPoints: number;
    sessionTimeout: number;
  };
  maintenance: {
    enabled: boolean;
    message?: string;
    estimatedEndTime?: Date;
  };
}