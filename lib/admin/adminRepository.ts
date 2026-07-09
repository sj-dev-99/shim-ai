import { mockAdminData } from "./mockData";
import { AdminData } from "./types";

function cloneAdminData(data: AdminData): AdminData {
  return {
    feedbacks: data.feedbacks.map((item) => ({ ...item })),
    bugReports: data.bugReports.map((item) => ({ ...item })),
    aiRatings: data.aiRatings.map((item) => ({ ...item })),
    visitorLogs: data.visitorLogs.map((item) => ({ ...item })),
    versionNotes: data.versionNotes.map((item) => ({ ...item }))
  };
}

// Data access boundary: replace these functions with Supabase/Firebase calls later.
export async function getAdminData(): Promise<AdminData> {
  return cloneAdminData(mockAdminData);
}
