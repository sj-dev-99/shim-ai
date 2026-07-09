export interface AdminSession {
  isAuthenticated: boolean;
  role: "admin";
  displayName: string;
}

// Temporary auth boundary. Real login and role checks can replace this function.
export function getTemporaryAdminSession(): AdminSession {
  return {
    isAuthenticated: true,
    role: "admin",
    displayName: "SHIM AI Admin"
  };
}
