export type PlanName = "Free" | "Starter" | "Pro" | "Enterprise";

export type ClientStatus = "active" | "trial" | "suspended";

export type UserRole =
  | "Super Admin"
  | "Support Agent"
  | "Billing Manager"
  | "Read-only";

export type UserStatus = "active" | "invited" | "disabled";

export type TransactionStatus = "success" | "failed" | "refunded";

export type PaymentGateway = "Stripe" | "Razorpay";

export type SubscriptionStatus =
  | "active"
  | "past_due"
  | "canceled"
  | "trialing"
  | "pending";

export type ActivityType =
  | "signup"
  | "upgrade"
  | "downgrade"
  | "cancellation"
  | "failed_payment"
  | "payout"
  | "note";

export type NotificationCategory = "All" | "Orders" | "Shipping" | "Analytics" | "Billing";

export interface Plan {
  id: string;
  name: PlanName;
  priceMonthly: number;
  features: string[];
  clientCount: number;
  limits: {
    products: number;
    storageGb: number;
    bandwidthGb: number;
  };
}

export interface Client {
  id: string;
  storeName: string;
  ownerName: string;
  ownerEmail: string;
  plan: PlanName;
  status: ClientStatus;
  mrr: number;
  orders30d: number;
  revenue: number;
  growthPercent: number;
  lastActive: string;
  joinedDate: string;
  usage: {
    products: number;
    storageGb: number;
    bandwidthGb: number;
  };
  notes: string;
}

export interface Subscription {
  id: string;
  clientId: string;
  clientName: string;
  plan: PlanName;
  status: SubscriptionStatus;
  renewalDate: string;
  mrr: number;
  amountDue: number;
}

export interface Transaction {
  id: string;
  clientId: string;
  clientName: string;
  amount: number;
  currency: string;
  gateway: PaymentGateway;
  status: TransactionStatus;
  date: string;
  transactionId: string;
}

export interface Payout {
  id: string;
  period: string;
  amount: number;
  commission: number;
  status: "paid" | "pending" | "processing";
  payoutDate: string;
  gateway: PaymentGateway;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  appliesTo: PlanName | "All";
  redemptions: number;
  maxRedemptions: number;
  expiresAt: string;
  active: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
  avatarInitials: string;
}

export interface AuditLog {
  id: string;
  adminName: string;
  action: string;
  target: string;
  timestamp: string;
  ipAddress: string;
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  category: Exclude<NotificationCategory, "All">;
  title: string;
  description: string;
  timestamp: string;
  dateGroup: string;
  read: boolean;
}

export interface RevenuePoint {
  month: string;
  revenue: number;
  mrr: number;
}

export interface PlanDistribution {
  name: PlanName;
  value: number;
  color: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalRevenueChange: number;
  activeClients: number;
  activeClientsChange: number;
  mrr: number;
  mrrChange: number;
  totalOrders: number;
  totalOrdersChange: number;
}
