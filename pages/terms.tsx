import { AuthLayout } from "../components/AuthLayout";

export default function TermsPage() {
  return (
    <AuthLayout title="이용약관" description="SHIM.AI 이용약관 문서 구조입니다. 정식 약관 확정 전 초안 영역입니다.">
      <article className="policy-content">
        <span>Version 1.0 draft</span>
        <h2>이용약관 초안 준비 영역</h2>
        <p>
          이 페이지는 정식 약관 문서를 게시하기 위한 구조입니다. 서비스 이용 조건, 계정 생성, 사용자 책임,
          콘텐츠 이용 범위, 서비스 변경 및 중단, 문의 방법 등의 조항을 확정 후 반영해야 합니다.
        </p>
        <p>현재 문구는 법률 문서가 아니며, 실제 서비스 오픈 전 전문가 검토를 권장합니다.</p>
      </article>
    </AuthLayout>
  );
}
