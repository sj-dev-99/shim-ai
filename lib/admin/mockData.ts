import { AdminData } from "./types";

export const mockAdminData: AdminData = {
  feedbacks: [
    {
      id: "mock-fb-001",
      userName: "익명",
      rating: 5,
      message: "문항 흐름이 부담스럽지 않고 결과 문장이 부드러워서 좋았습니다.",
      createdAt: "2026-07-09T10:12:00+09:00",
      status: "new",
      adminMemo: ""
    },
    {
      id: "mock-fb-002",
      userName: "민지",
      rating: 4,
      message: "결과 공유 버튼이 있으면 친구들에게 보내기 좋을 것 같아요.",
      createdAt: "2026-07-09T09:42:00+09:00",
      status: "reviewing",
      adminMemo: "공유 기능 백로그에 추가"
    },
    {
      id: "mock-fb-003",
      userName: "익명",
      rating: 3,
      message: "문항 몇 개가 비슷하게 느껴지는 부분이 있었습니다.",
      createdAt: "2026-07-08T22:21:00+09:00",
      status: "completed",
      adminMemo: "다음 문항 개편 때 반영"
    }
  ],
  bugReports: [
    {
      id: "mock-bug-001",
      page: "/test",
      message: "이전 버튼을 빠르게 누르면 진행 표시가 늦게 바뀌는 것 같습니다.",
      device: "iPhone",
      browser: "Safari",
      createdAt: "2026-07-09T11:08:00+09:00",
      status: "new",
      adminMemo: ""
    },
    {
      id: "mock-bug-002",
      page: "/result",
      message: "결과 페이지 의견 입력 후 완료 문구가 조금 빨리 사라집니다.",
      device: "Galaxy",
      browser: "Chrome",
      createdAt: "2026-07-09T08:56:00+09:00",
      status: "reviewing",
      adminMemo: "토스트 유지 시간 확인"
    }
  ],
  aiRatings: [
    {
      id: "mock-rate-001",
      rating: "up",
      comment: "제 상태를 부드럽게 설명해줘서 좋았습니다.",
      resultType: "균형 조율형",
      createdAt: "2026-07-09T10:20:00+09:00"
    },
    {
      id: "mock-rate-002",
      rating: "down",
      comment: "조금 더 현실적인 조언이 있으면 좋겠습니다.",
      resultType: "감정 관찰형",
      createdAt: "2026-07-09T09:18:00+09:00"
    },
    {
      id: "mock-rate-003",
      rating: "opinion",
      comment: "결과 유형 이름이 기억에 남아요.",
      resultType: "회복 추진형",
      createdAt: "2026-07-08T21:35:00+09:00"
    }
  ],
  visitorLogs: [
    {
      id: "mock-visit-001",
      visitedAt: "2026-07-09T11:25:00+09:00",
      page: "/result",
      device: "iPhone",
      browser: "Safari",
      completedTest: true,
      exitPoint: "결과 의견 작성"
    },
    {
      id: "mock-visit-002",
      visitedAt: "2026-07-09T11:12:00+09:00",
      page: "/test",
      device: "Android",
      browser: "Chrome",
      completedTest: false,
      exitPoint: "8번 문항"
    },
    {
      id: "mock-visit-003",
      visitedAt: "2026-07-09T10:57:00+09:00",
      page: "/mind",
      device: "Windows",
      browser: "Chrome",
      completedTest: false,
      exitPoint: "테스트 소개"
    }
  ],
  versionNotes: [
    {
      id: "ver-006",
      version: "Beta v0.2.0",
      title: "모바일 퍼스트 메인페이지 전면 리디자인",
      description:
        "SHIM.AI를 AI 자기이해 플랫폼으로 더 빠르게 이해할 수 있도록 Hero, 서비스 카드 슬라이더, 선택형 상세 CTA, Methodology 섹션 중심으로 메인페이지 구조를 재설계했습니다.",
      createdAt: "2026-07-21T10:30:00+09:00"
    },
    {
      id: "ver-005",
      version: "Beta v0.1.4",
      title: "검사 시작 화면 간소화 및 결과 리포트 보강",
      description:
        "메인 UX와 피드백 FAB를 정리하고, 대인관계 분석·고지능 우울증 검사 안정화와 함께 검사 시작 페이지를 더 가볍게 다듬었습니다.",
      createdAt: "2026-07-20T18:30:00+09:00"
    },
    {
      id: "ver-004",
      version: "Beta v0.1.3",
      title: "서비스 카드 UI 및 베타 데이터 저장 구조 개선",
      description:
        "메인 서비스 카드를 균일한 레이아웃으로 정리하고, Supabase 연결 시 실제 베타 이벤트가 관리자 페이지에 반영되도록 준비했습니다.",
      createdAt: "2026-07-09T18:00:00+09:00"
    },
    {
      id: "ver-003",
      version: "Beta v0.1.2",
      title: "서비스 카테고리 라우팅 추가",
      description:
        "SHIM Test, SHIM Talk, SHIM Diary, SHIM Report, SHIM Care를 각각 클릭 가능한 서비스 항목으로 분리했습니다.",
      createdAt: "2026-07-09T17:00:00+09:00"
    },
    {
      id: "ver-002",
      version: "Beta v0.1.1",
      title: "서비스 허브 구조 개편",
      description:
        "메인 페이지에 SHIM Test 상위 카테고리를 추가하고 기존 테스트명을 AI 감정·회복 유형 테스트로 변경했습니다.",
      createdAt: "2026-07-09T16:30:00+09:00"
    },
    {
      id: "ver-001",
      version: "Beta v0.1.0",
      title: "베타 테스트 공개",
      description: "초기 심리테스트, 피드백 수집, 오류 신고, 만족도 기능을 포함한 첫 베타 버전입니다.",
      createdAt: "2026-07-09T12:00:00+09:00"
    }
  ]
};
