export type FeedbackStatus = "new" | "reviewing" | "completed";
export type BugReportStatus = "new" | "reviewing" | "fixed";
export type RatingValue = "up" | "down" | "opinion";

export type AdminDataSource = "live" | "mock";

export interface AdminRecordMeta {
  source?: AdminDataSource;
}

export interface Feedback extends AdminRecordMeta {
  id: string;
  userName: string;
  rating: number;
  message: string;
  createdAt: string;
  status: FeedbackStatus;
  adminMemo: string;
}

export interface BugReport extends AdminRecordMeta {
  id: string;
  page: string;
  message: string;
  device: string;
  browser: string;
  createdAt: string;
  status: BugReportStatus;
  adminMemo: string;
}

export interface AiRating extends AdminRecordMeta {
  id: string;
  rating: RatingValue;
  comment: string;
  resultType: string;
  createdAt: string;
}

export interface VisitorLog extends AdminRecordMeta {
  id: string;
  visitedAt: string;
  page: string;
  device: string;
  browser: string;
  completedTest: boolean;
  exitPoint: string;
}

export interface VersionNote extends AdminRecordMeta {
  id: string;
  version: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface AdminData {
  feedbacks: Feedback[];
  bugReports: BugReport[];
  aiRatings: AiRating[];
  visitorLogs: VisitorLog[];
  versionNotes: VersionNote[];
  dataSource?: AdminDataSource;
  storageStatus?: "connected" | "not_configured" | "error";
  storageMessage?: string;
}
