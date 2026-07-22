export function getAuthErrorMessage(message?: string | null) {
  const normalized = (message || "").toLowerCase();

  if (!message) return "요청을 처리하지 못했어요. 잠시 후 다시 시도해주세요.";
  if (normalized.includes("invalid login credentials")) return "이메일 또는 비밀번호가 올바르지 않습니다.";
  if (normalized.includes("email not confirmed")) return "이메일 인증을 완료한 뒤 로그인해주세요.";
  if (normalized.includes("user already registered") || normalized.includes("already registered")) {
    return "이미 가입된 이메일입니다. 로그인 또는 비밀번호 재설정을 이용해주세요.";
  }
  if (normalized.includes("invalid email")) return "이메일 형식을 다시 확인해주세요.";
  if (normalized.includes("password")) return "비밀번호를 다시 확인해주세요. 비밀번호는 8자 이상이어야 합니다.";
  if (normalized.includes("rate limit")) return "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";
  if (normalized.includes("network")) return "네트워크 연결을 확인한 뒤 다시 시도해주세요.";

  return "요청을 처리하지 못했어요. 입력한 정보를 확인한 뒤 다시 시도해주세요.";
}
