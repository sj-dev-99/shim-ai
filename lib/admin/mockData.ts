import { AdminData } from "./types";

export const mockAdminData: AdminData = {
  feedbacks: [
    {
      id: "fb-001",
      userName: "익명",
      rating: 5,
      message: "문항 흐름이 부담스럽지 않고 결과 문장이 따뜻해서 좋았습니다.",
      createdAt: "2026-07-09T10:12:00+09:00",
      status: "new",
      adminMemo: ""
    },
    {
      id: "fb-002",
      userName: "민지",
      rating: 4,
      message: "결과 공유 버튼이 있으면 친구들에게 보내기 좋을 것 같아요.",
      createdAt: "2026-07-09T09:42:00+09:00",
      status: "reviewing",
      adminMemo: "공유 기능 백로그에 추가"
    },
    {
      id: "fb-003",
      userName: "익명",
      rating: 3,
      message: "문항 간 의미가 비슷하게 느껴지는 부분이 있었습니다.",
      createdAt: "2026-07-08T22:21:00+09:00",
      status: "completed",
      adminMemo: "다음 문항 개편 때 반영"
    },
    {
      id: "fb-004",
      userName: "준호",
      rating: 5,
      message: "모바일에서 보기 편하고 다크모드 색감도 괜찮았습니다.",
      createdAt: "2026-07-08T20:05:00+09:00",
      status: "new",
      adminMemo: ""
    },
    {
      id: "fb-005",
      userName: "익명",
      rating: 4,
      message: "결과 유형별 추천 행동이 조금 더 구체적이면 좋겠습니다.",
      createdAt: "2026-07-08T18:38:00+09:00",
      status: "reviewing",
      adminMemo: ""
    },
    {
      id: "fb-006",
      userName: "수연",
      rating: 5,
      message: "의료 진단이 아니라는 안내가 명확해서 안심됐어요.",
      createdAt: "2026-07-08T15:04:00+09:00",
      status: "completed",
      adminMemo: "안내 문구 유지"
    }
  ],
  bugReports: [
    {
      id: "bug-001",
      page: "/test",
      message: "이전 버튼을 빠르게 누르면 진행률 표시가 늦게 바뀌는 느낌이 있습니다.",
      device: "iPhone 15",
      browser: "Safari 18",
      createdAt: "2026-07-09T11:08:00+09:00",
      status: "new",
      adminMemo: ""
    },
    {
      id: "bug-002",
      page: "/result",
      message: "결과 페이지 의견 입력 후 완료 문구가 조금 빨리 사라집니다.",
      device: "Galaxy S24",
      browser: "Chrome 126",
      createdAt: "2026-07-09T08:56:00+09:00",
      status: "reviewing",
      adminMemo: "토스트 유지 시간 확인"
    },
    {
      id: "bug-003",
      page: "/",
      message: "구형 안드로이드에서 카드 그림자가 진하게 보입니다.",
      device: "Galaxy A52",
      browser: "Samsung Internet",
      createdAt: "2026-07-08T19:11:00+09:00",
      status: "fixed",
      adminMemo: "CSS shadow 조정 완료"
    },
    {
      id: "bug-004",
      page: "/mind",
      message: "네트워크가 느릴 때 아이콘 로딩이 약간 늦습니다.",
      device: "Windows laptop",
      browser: "Edge 126",
      createdAt: "2026-07-08T17:44:00+09:00",
      status: "new",
      adminMemo: ""
    },
    {
      id: "bug-005",
      page: "/test",
      message: "키보드만으로 선택할 때 포커스가 더 잘 보이면 좋겠습니다.",
      device: "MacBook Air",
      browser: "Chrome 126",
      createdAt: "2026-07-08T13:22:00+09:00",
      status: "reviewing",
      adminMemo: "접근성 개선 후보"
    }
  ],
  aiRatings: [
    {
      id: "rate-001",
      rating: "up",
      comment: "내 상태를 부드럽게 설명해줘서 좋았습니다.",
      resultType: "균형 탐색형",
      createdAt: "2026-07-09T10:20:00+09:00"
    },
    {
      id: "rate-002",
      rating: "down",
      comment: "조금 더 현실적인 조언이 있으면 좋겠습니다.",
      resultType: "감정 관찰형",
      createdAt: "2026-07-09T09:18:00+09:00"
    },
    {
      id: "rate-003",
      rating: "up",
      comment: "결과 유형 이름이 기억에 남아요.",
      resultType: "회복 루틴형",
      createdAt: "2026-07-08T21:35:00+09:00"
    },
    {
      id: "rate-004",
      rating: "up",
      comment: "친구와 같이 해보고 싶습니다.",
      resultType: "관계 조율형",
      createdAt: "2026-07-08T18:02:00+09:00"
    },
    {
      id: "rate-005",
      rating: "down",
      comment: "문장이 조금 길게 느껴졌습니다.",
      resultType: "균형 탐색형",
      createdAt: "2026-07-08T14:49:00+09:00"
    }
  ],
  visitorLogs: [
    {
      id: "visit-001",
      visitedAt: "2026-07-09T11:25:00+09:00",
      page: "/result",
      device: "iPhone 15",
      browser: "Safari 18",
      completedTest: true,
      exitPoint: "결과 의견 작성"
    },
    {
      id: "visit-002",
      visitedAt: "2026-07-09T11:12:00+09:00",
      page: "/test",
      device: "Galaxy S24",
      browser: "Chrome 126",
      completedTest: false,
      exitPoint: "8번 문항"
    },
    {
      id: "visit-003",
      visitedAt: "2026-07-09T10:57:00+09:00",
      page: "/mind",
      device: "Windows desktop",
      browser: "Chrome 126",
      completedTest: false,
      exitPoint: "테스트 소개"
    },
    {
      id: "visit-004",
      visitedAt: "2026-07-09T10:33:00+09:00",
      page: "/result",
      device: "MacBook Pro",
      browser: "Safari 18",
      completedTest: true,
      exitPoint: "다시 테스트하기"
    },
    {
      id: "visit-005",
      visitedAt: "2026-07-08T23:02:00+09:00",
      page: "/",
      device: "iPad",
      browser: "Safari 18",
      completedTest: false,
      exitPoint: "테스트 선택"
    },
    {
      id: "visit-006",
      visitedAt: "2026-07-08T22:17:00+09:00",
      page: "/result",
      device: "Android tablet",
      browser: "Chrome 126",
      completedTest: true,
      exitPoint: "브라우저 닫기"
    }
  ],
  versionNotes: [
    {
      id: "ver-001",
      version: "Beta v0.1.0",
      title: "베타 테스트 공개",
      description: "AI 마음결 테스트, 피드백 수집, 오류 신고, 만족도 기능을 포함한 첫 베타 버전입니다.",
      createdAt: "2026-07-09T12:00:00+09:00"
    }
  ]
};
