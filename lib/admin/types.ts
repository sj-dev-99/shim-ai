export type FeedbackStatus = "new" | "reviewing" | "completed";
export type BugReportStatus = "new" | "reviewing" | "fixed";
export type RatingValue = "up" | "down";

export interface Feedback {
  id: string;
  userName: string;
  rating: number;
  message: string;
  createdAt: string;
  status: FeedbackStatus;
  adminMemo: string;
}

export interface BugReport {
  id: string;
  page: string;
  message: string;
  device: string;
  browser: string;
  createdAt: string;
  status: BugReportStatus;
  adminMemo: string;
}

export interface AiRating {
  id: string;
  rating: RatingValue;
  comment: string;
  resultType: string;
  createdAt: string;
}

export interface VisitorLog {
  id: string;
  visitedAt: string;
  page: string;
  device: string;
  browser: string;
  completedTest: boolean;
  exitPoint: string;
}

export interface VersionNote {
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
}
