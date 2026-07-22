import { AuthLayout } from "../components/AuthLayout";

const privacyItems = [
  "수집하는 개인정보: 이메일 주소, 계정 식별자, 선택적으로 입력한 닉네임",
  "Diary 데이터: 선택한 감정, 사용자가 작성한 일기 내용, 생성 및 수정 시간",
  "수집 목적: 계정 인증, Diary 기록 저장, 사용자별 기록 조회와 삭제",
  "보관 기간: 회원 탈퇴 또는 사용자의 삭제 요청 시까지",
  "외부 인프라: Supabase 인증과 데이터베이스를 사용할 예정",
  "AI 분석: 현재 Phase 2에서는 Diary 원문을 외부 AI API로 전송하지 않음",
  "사용자 권리: 기록 조회, 수정, 삭제, 계정 탈퇴 요청",
  "정책 변경: 버전과 시행일을 표시하고 변경 시 안내"
];

export default function PrivacyPage() {
  return (
    <AuthLayout title="개인정보처리방침" description="SHIM.AI 개인정보처리방침 문서 구조입니다.">
      <article className="policy-content">
        <span>Version 1.0 draft</span>
        <h2>개인정보처리방침 초안 구조</h2>
        <p>
          아래 항목은 정식 개인정보처리방침을 작성하기 위한 구조입니다. 실제 운영 전 법률 검토와 문의 창구,
          시행일을 확정해주세요.
        </p>
        <ul>
          {privacyItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
    </AuthLayout>
  );
}
