export const LOVE_TEST_NAME = "연애유형·이상형 분석";
export const LOVE_PROFILE_KEY = "shim_ai_love_profile";

export type LoveGender = "female" | "male";

export type LoveProfile = {
  nickname: string;
  gender: LoveGender;
};

export type LoveDimension = "stability" | "expression" | "autonomy" | "spark";

export type LoveQuestion = {
  text: string;
  dimension: LoveDimension;
};

export type LoveResult = {
  id: string;
  label: string;
  title: string;
  summary: string;
  idealType: string;
  strengths: string[];
  watchPoint: string;
  suggestion: string;
};

export const loveOptions = [
  { label: "전혀 아니다", value: 1 },
  { label: "아니다", value: 2 },
  { label: "보통이다", value: 3 },
  { label: "그렇다", value: 4 },
  { label: "매우 그렇다", value: 5 }
];

export const loveQuestions: LoveQuestion[] = [
  {
    text: "연애에서 가장 중요한 것은 설렘보다 정서적으로 안전하다는 느낌이다.",
    dimension: "stability"
  },
  {
    text: "좋아하는 마음이 생기면 표현을 아끼기보다 분명하게 보여주는 편이다.",
    dimension: "expression"
  },
  {
    text: "연인이 있어도 혼자만의 시간과 생활 리듬은 꼭 지켜져야 한다.",
    dimension: "autonomy"
  },
  {
    text: "예측 가능한 관계보다 서로에게 계속 새로운 자극을 주는 관계에 끌린다.",
    dimension: "spark"
  },
  {
    text: "상대가 내 감정을 세심하게 알아차려줄 때 마음이 깊어진다.",
    dimension: "stability"
  },
  {
    text: "갈등이 생기면 피하기보다 빠르게 대화해서 풀고 싶다.",
    dimension: "expression"
  },
  {
    text: "상대가 나를 너무 자주 확인하거나 통제하려 하면 마음이 멀어진다.",
    dimension: "autonomy"
  },
  {
    text: "나와 다른 취향, 다른 세계를 가진 사람에게 호기심을 느낀다.",
    dimension: "spark"
  },
  {
    text: "이상형을 떠올릴 때 다정함과 책임감이 먼저 생각난다.",
    dimension: "stability"
  },
  {
    text: "사랑받고 있다는 확신은 말과 행동으로 자주 확인되어야 한다.",
    dimension: "expression"
  },
  {
    text: "건강한 관계라면 서로의 사생활과 선택을 존중해야 한다.",
    dimension: "autonomy"
  },
  {
    text: "연애가 일상에 활력과 영감을 주지 않으면 쉽게 식는 편이다.",
    dimension: "spark"
  }
];

export const loveResults: Record<LoveDimension, LoveResult> = {
  stability: {
    id: "safe-harbor",
    label: "안정형 애정추구",
    title: "깊고 편안한 관계에서 마음이 열리는 타입",
    summary:
      "당신은 빠른 설렘보다 믿음, 책임감, 정서적 안정감을 중요하게 보는 편입니다. 상대가 일관된 태도로 곁을 지켜줄 때 호감이 깊어지고, 관계 안에서 편안함을 느낄수록 더 솔직해집니다.",
    idealType: "다정하고 책임감 있으며 감정 기복이 크지 않은 사람",
    strengths: ["관계를 오래 가꾸는 힘", "상대의 진심을 천천히 확인하는 신중함", "편안한 애정 표현"],
    watchPoint:
      "안정감을 중요하게 보는 만큼 변화나 불확실성에 예민해질 수 있습니다. 상대의 작은 반응을 관계 전체의 신호로 확대해석하지 않는 연습이 필요합니다.",
    suggestion: "상대에게 바라는 안정감의 기준을 구체적인 행동 언어로 표현해보세요."
  },
  expression: {
    id: "warm-signal",
    label: "표현형 애정확인",
    title: "사랑을 말과 행동으로 확인하며 가까워지는 타입",
    summary:
      "당신은 감정을 숨기기보다 표현하고 확인하는 관계에서 편안함을 느낍니다. 호감이 생기면 관계의 방향을 분명히 알고 싶고, 애정 표현이 충분할수록 마음의 온도가 안정됩니다.",
    idealType: "표현이 솔직하고 대화를 피하지 않는 사람",
    strengths: ["관계의 온도를 빠르게 감지", "솔직한 대화와 애정 표현", "갈등을 방치하지 않는 태도"],
    watchPoint:
      "확인을 원하는 마음이 커질수록 상대에게 압박으로 전달될 수 있습니다. 표현의 빈도보다 표현의 방식이 서로에게 맞는지 확인해보는 것이 좋습니다.",
    suggestion: "내가 원하는 표현과 상대가 편하게 줄 수 있는 표현의 교집합을 찾아보세요."
  },
  autonomy: {
    id: "free-bond",
    label: "자율형 균형연애",
    title: "가까움과 독립감의 균형을 중요하게 여기는 타입",
    summary:
      "당신은 사랑하더라도 나의 생활, 선택, 속도가 존중되는 관계에서 가장 자연스럽습니다. 서로를 소유하기보다 각자의 세계를 지켜주며 함께 성장하는 관계에 끌립니다.",
    idealType: "믿음을 바탕으로 서로의 시간을 존중하는 사람",
    strengths: ["건강한 거리감", "상대의 독립성 존중", "관계에 과도하게 매몰되지 않는 균형감"],
    watchPoint:
      "자율성을 지키려는 마음이 때로는 거리감이나 무심함으로 보일 수 있습니다. 혼자 있고 싶은 마음과 관계를 아끼는 마음을 함께 말해주는 것이 중요합니다.",
    suggestion: "혼자만의 시간과 함께 보내는 시간을 미리 약속해 관계의 리듬을 만들어보세요."
  },
  spark: {
    id: "spark-seeker",
    label: "설렘형 탐색연애",
    title: "새로운 자극과 감정의 생동감에 끌리는 타입",
    summary:
      "당신은 관계가 나에게 영감과 활력을 줄 때 강하게 끌립니다. 비슷한 일상만 반복되는 관계보다 서로의 세계를 넓혀주고 감각을 깨우는 사람에게 마음이 움직입니다.",
    idealType: "새로운 경험을 함께 만들고 호기심을 자극하는 사람",
    strengths: ["관계에 활력을 불어넣는 에너지", "상대의 매력을 발견하는 감각", "새로운 경험을 제안하는 힘"],
    watchPoint:
      "설렘이 줄어드는 시기를 관계의 끝으로 오해할 수 있습니다. 편안함도 친밀감의 다른 형태라는 점을 기억하면 관계가 더 깊어질 수 있습니다.",
    suggestion: "반복되는 일상 안에서도 둘만의 새로운 경험을 작게 설계해보세요."
  }
};

export function getLoveScores(answers: number[]) {
  return loveQuestions.reduce<Record<LoveDimension, number>>(
    (scores, question, index) => {
      scores[question.dimension] += answers[index] || 0;
      return scores;
    },
    { stability: 0, expression: 0, autonomy: 0, spark: 0 }
  );
}

export function getLoveResultByAnswers(answers: number[]) {
  const scores = getLoveScores(answers);
  const dimensions = Object.keys(scores) as LoveDimension[];
  const topDimension = dimensions.sort((a, b) => scores[b] - scores[a])[0];
  return {
    result: loveResults[topDimension],
    scores,
    topDimension
  };
}
