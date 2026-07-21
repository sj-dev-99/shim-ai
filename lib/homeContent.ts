export type HomeServiceStatus = "OPEN" | "COMING_SOON";

export type HomeService = {
  id: "test" | "diary" | "report" | "care" | "talk";
  code: string;
  title: string;
  headline: string;
  englishTitle: string;
  description: string;
  detailDescription: string;
  features: string[];
  tags: string[];
  status: HomeServiceStatus;
  ctaLabel: string;
  href: string;
  accent: "teal" | "mint" | "bluegreen" | "apricot" | "lightteal";
  recommendation?: {
    label: string;
    title: string;
  };
};

export const homeServices: HomeService[] = [
  {
    id: "test",
    code: "TEST",
    title: "SHIM Test",
    headline: "나의 감정과 사고 패턴 분석",
    englishTitle: "AI Self-Understanding Test",
    description: "나의 감정과 사고 패턴을 알아보세요.",
    detailDescription:
      "구조화된 질문을 통해 감정 조절 방식, 관계 경향, 사고 습관을 돌아보고 AI 기반 해석을 확인할 수 있습니다.",
    features: ["감정 조절 패턴", "관계 및 사고 경향", "AI 기반 해석"],
    tags: ["감정 패턴", "관계 경향", "AI 해석"],
    status: "OPEN",
    ctaLabel: "검사 시작하기",
    href: "/shim-test",
    accent: "teal",
    recommendation: {
      label: "오늘의 추천",
      title: "감정·회복 유형 테스트"
    }
  },
  {
    id: "diary",
    code: "DIARY",
    title: "SHIM Diary",
    headline: "오늘의 감정 기록",
    englishTitle: "Emotional Reflection Journal",
    description: "오늘의 감정을 기록하고 마음의 흐름을 발견해보세요.",
    detailDescription:
      "그날의 기분과 경험을 남기면 AI가 짧은 피드백을 제공하고, 기록은 이후 SHIM Report의 감정 흐름으로 연결됩니다.",
    features: ["감정 선택", "일상 기록", "AI 한 줄 피드백"],
    tags: ["감정 기록", "AI 한 줄 피드백", "리포트 연동"],
    status: "OPEN",
    ctaLabel: "감정 기록하기",
    href: "/diary",
    accent: "mint"
  },
  {
    id: "report",
    code: "REPORT",
    title: "SHIM Report",
    headline: "감정 변화 리포트",
    englishTitle: "Personal Insight Report",
    description: "쌓인 기록 속에서 감정의 변화를 돌아보세요.",
    detailDescription:
      "Diary와 Test 기록을 바탕으로 감정 타임라인, 반복 주제, 월간 변화 흐름을 한눈에 확인할 수 있도록 제공할 예정입니다.",
    features: ["감정 타임라인", "반복 패턴 분석", "월간 변화 요약"],
    tags: ["감정 타임라인", "반복 패턴", "월간 리포트"],
    status: "COMING_SOON",
    ctaLabel: "서비스 미리보기",
    href: "/report",
    accent: "bluegreen"
  },
  {
    id: "care",
    code: "CARE",
    title: "SHIM Care",
    headline: "나를 위한 회복 루틴",
    englishTitle: "Personal Recovery Guidance",
    description: "지금의 나에게 필요한 작은 회복 방법을 만나보세요.",
    detailDescription:
      "감정 상태와 기록 흐름을 바탕으로 일상에서 실천할 수 있는 자기돌봄과 회복 루틴을 제안할 예정입니다.",
    features: ["맞춤형 회복 제안", "감정별 실천 루틴", "생활 패턴 가이드"],
    tags: ["회복 루틴", "자기돌봄", "실천 제안"],
    status: "COMING_SOON",
    ctaLabel: "오픈 예정",
    href: "/care",
    accent: "apricot"
  },
  {
    id: "talk",
    code: "TALK",
    title: "SHIM Talk",
    headline: "대화로 정리하는 마음",
    englishTitle: "Reflective AI Conversation",
    description: "대화를 통해 복잡한 마음을 차분하게 정리해보세요.",
    detailDescription:
      "사용자의 감정을 판단하기보다 공감, 질문, 요약을 중심으로 스스로 마음을 이해할 수 있도록 돕는 대화형 자기성찰 서비스를 준비 중입니다.",
    features: ["감정 정리", "자기이해 질문", "대화형 회고"],
    tags: ["감정 정리", "자기성찰 질문", "대화형 회고"],
    status: "COMING_SOON",
    ctaLabel: "오픈 예정",
    href: "/talk",
    accent: "lightteal"
  }
];

export const methodologyItems = [
  {
    number: "01",
    title: "자기성찰 기반 설계",
    description:
      "정서 인식, 자기관찰, 메타인지적 성찰을 중심으로 사용자가 자신의 감정과 경험을 언어화할 수 있도록 구조화된 질문과 기록 방식을 제공합니다."
  },
  {
    number: "02",
    title: "맥락 중심 AI 해석",
    description:
      "단일 점수나 한 번의 답변만으로 판단하지 않고, 감정 맥락, 반복 주제, 언어적 패턴을 종합해 자기이해를 위한 해석 단서를 제공합니다."
  },
  {
    number: "03",
    title: "연속 기록 기반 패턴 분석",
    description:
      "Test와 Diary 기록을 시간의 흐름에 따라 연결해 감정 빈도, 변화 추세, 반복되는 주제와 자기보고 패턴을 확인할 수 있도록 설계합니다."
  },
  {
    number: "04",
    title: "실천 중심 피드백",
    description:
      "해석에서 끝나지 않고 자기돌봄, 감정 조절, 행동 활성화를 돕는 질문과 저강도 실천 제안을 통해 일상 속 변화로 이어지도록 합니다."
  }
];
