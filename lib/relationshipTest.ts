export const RELATIONSHIP_TEST_NAME = "대인관계 분석";
export const RELATIONSHIP_PROFILE_KEY = "shim_ai_relationship_profile";

export type RelationshipProfile = {
  nickname: string;
};

export type RelationshipDimension = "closeness" | "expression" | "boundary" | "conflict";

export type RelationshipQuestion = {
  text: string;
  dimension: RelationshipDimension;
};

export type RelationshipResult = {
  id: string;
  label: string;
  title: string;
  summary: string;
  relationshipPattern: string;
  communicationStyle: string;
  strengths: string[];
  cautions: string[];
  needs: string[];
  suggestion: string;
  routine: string[];
  conversationTips: string[];
};

export const relationshipOptions = [
  { label: "전혀 아니다", value: 1 },
  { label: "아니다", value: 2 },
  { label: "보통이다", value: 3 },
  { label: "그렇다", value: 4 },
  { label: "매우 그렇다", value: 5 }
];

export const relationshipQuestions: RelationshipQuestion[] = [
  {
    text: "친해지고 싶은 사람이 생기면 비교적 먼저 다가가는 편이다.",
    dimension: "closeness"
  },
  {
    text: "내가 느낀 감정이나 생각을 상대에게 말로 설명하는 편이다.",
    dimension: "expression"
  },
  {
    text: "상대가 부탁해도 내가 어렵다면 거절할 수 있어야 한다고 생각한다.",
    dimension: "boundary"
  },
  {
    text: "갈등이 생기면 피하기보다 대화로 정리하려고 한다.",
    dimension: "conflict"
  },
  {
    text: "관계가 가까워질수록 연락이나 만남이 자연스럽게 늘어나는 편이 좋다.",
    dimension: "closeness"
  },
  {
    text: "서운한 일이 생기면 혼자 넘기기보다 적절한 시점에 말하는 편이다.",
    dimension: "expression"
  },
  {
    text: "나의 시간과 에너지를 지키는 것도 좋은 관계의 일부라고 느낀다.",
    dimension: "boundary"
  },
  {
    text: "상대와 의견이 다를 때도 관계가 끝날까 봐 지나치게 피하지는 않는다.",
    dimension: "conflict"
  },
  {
    text: "관계에서 소속감과 함께한다는 느낌이 나에게 중요하다.",
    dimension: "closeness"
  },
  {
    text: "고마움, 미안함, 부탁 같은 말을 비교적 분명하게 표현하려고 한다.",
    dimension: "expression"
  },
  {
    text: "아무리 가까운 사이라도 지켜야 할 선과 사생활이 있다고 생각한다.",
    dimension: "boundary"
  },
  {
    text: "불편한 일이 반복되면 관계를 유지하기 위해서라도 문제를 짚고 넘어가야 한다.",
    dimension: "conflict"
  }
];

export const relationshipResults: Record<RelationshipDimension, RelationshipResult> = {
  closeness: {
    id: "warm-connector",
    label: "따뜻한 연결형",
    title: "가까움과 소속감에서 에너지를 얻는 관계 타입",
    summary:
      "당신은 관계 안에서 함께한다는 느낌, 자연스러운 관심, 정서적 연결을 중요하게 여기는 편입니다. 혼자 잘 지내는 능력도 필요하지만, 마음이 맞는 사람들과 안정적으로 연결될 때 일상 에너지가 커집니다.",
    relationshipPattern:
      "관계 초반에도 호감이 생기면 비교적 따뜻하게 다가가며, 가까워진 뒤에는 연락과 관심을 통해 관계가 유지된다고 느끼는 경향이 있습니다.",
    communicationStyle:
      "상대의 반응과 분위기를 잘 살피고, 말보다 태도에서 정서적 신호를 많이 읽습니다. 다만 상대가 거리감을 원할 때는 내 마음이 거절당한 것처럼 느껴질 수 있습니다.",
    strengths: ["사람을 편안하게 만드는 친화력", "관계의 온도를 빠르게 감지하는 감각", "소속감과 팀워크를 만드는 힘"],
    cautions: ["상대의 답장 속도나 반응을 관계의 크기로 해석할 수 있음", "가까운 관계일수록 혼자만의 시간을 죄책감으로 느낄 수 있음", "내가 준 관심만큼 돌려받지 못하면 쉽게 서운해질 수 있음"],
    needs: ["일관된 관심", "정서적 확인", "함께한다는 느낌"],
    suggestion:
      "관계의 안정감을 상대의 반응 하나로만 확인하기보다, 내가 편안하게 연결될 수 있는 방식과 상대의 속도를 함께 살펴보세요.",
    routine: ["연락 빈도보다 관계에서 편안했던 장면 기록하기", "서운함이 생기면 사실과 해석을 나눠서 적기", "혼자 회복하는 시간을 일정에 먼저 넣기"],
    conversationTips: ["나는 함께한다는 느낌이 있을 때 마음이 편해져", "답장이 늦으면 내가 혼자 해석할 때가 있어", "우리에게 편한 연락 리듬을 같이 맞춰보고 싶어"]
  },
  expression: {
    id: "clear-communicator",
    label: "솔직한 소통형",
    title: "말로 정리하고 표현하며 관계를 선명하게 만드는 타입",
    summary:
      "당신은 관계에서 감정과 생각이 너무 오래 쌓이기보다 말로 정리되는 편이 편안합니다. 표현을 통해 오해를 줄이고 관계의 방향을 확인하려는 경향이 강합니다.",
    relationshipPattern:
      "가까운 사람에게는 고마움, 서운함, 요청을 비교적 직접적으로 말하려고 합니다. 명확한 대화가 관계를 지키는 방식이라고 느낄 가능성이 큽니다.",
    communicationStyle:
      "상황을 말로 풀어가는 힘이 있지만, 상대가 준비되지 않은 상태에서는 표현이 압박처럼 느껴질 수 있습니다. 타이밍을 고르면 장점이 더 잘 전달됩니다.",
    strengths: ["오해를 줄이는 언어화 능력", "관계의 문제를 방치하지 않는 태도", "감정을 건강하게 표현하려는 시도"],
    cautions: ["상대의 속도보다 내 정리 욕구가 앞설 수 있음", "표현이 부족한 사람을 무심하다고 판단할 수 있음", "대화의 결론을 빨리 내고 싶어질 수 있음"],
    needs: ["명확한 대화", "감정의 확인", "서로의 입장을 듣는 시간"],
    suggestion:
      "중요한 말을 꺼내기 전 '지금 해결하고 싶은지, 이해받고 싶은지'를 먼저 구분해보세요. 대화의 목적이 분명하면 관계가 덜 소모됩니다.",
    routine: ["중요한 대화 전 핵심 문장 1개만 적기", "상대의 말을 다시 요약한 뒤 내 생각 말하기", "서운함은 비난보다 요청 문장으로 바꾸기"],
    conversationTips: ["내가 지금 원하는 건 결론보다 이해에 가까워", "이 부분은 오해가 생기기 전에 말하고 싶어", "네 입장도 듣고 나서 같이 정리하고 싶어"]
  },
  boundary: {
    id: "balanced-boundary",
    label: "건강한 경계형",
    title: "가까움 속에서도 나의 선과 리듬을 지키는 타입",
    summary:
      "당신은 좋은 관계가 무조건 맞춰주는 것이 아니라 서로의 시간, 에너지, 선택을 존중하는 데서 만들어진다고 느끼는 편입니다. 가까워져도 나의 리듬이 지켜질 때 오래 안정됩니다.",
    relationshipPattern:
      "처음부터 과하게 밀착되는 관계보다 천천히 신뢰를 쌓는 방식을 선호할 수 있습니다. 부탁과 거절, 사생활의 기준이 비교적 분명합니다.",
    communicationStyle:
      "필요한 선을 지키는 능력이 강점이지만, 마음을 표현하기 전 거리부터 확보하면 상대가 차갑게 느낄 수 있습니다. 경계와 애정을 함께 말하는 것이 중요합니다.",
    strengths: ["관계에 과도하게 소진되지 않는 힘", "서로의 독립성을 존중하는 태도", "무리한 부탁에 휩쓸리지 않는 균형감"],
    cautions: ["거리두기가 방어처럼 보일 수 있음", "도움이 필요할 때도 혼자 해결하려 할 수 있음", "상대의 친밀감 욕구를 부담으로만 느낄 수 있음"],
    needs: ["개인의 시간", "존중받는 선택권", "부담 없는 관계 리듬"],
    suggestion:
      "거리를 두고 싶을 때는 이유 없이 사라지기보다 '내가 회복할 시간이 필요하다'고 설명해보세요. 경계가 관계를 끊는 신호가 아니라는 점이 전달됩니다.",
    routine: ["이번 주 내가 지키고 싶은 시간 1개 정하기", "거절 문장을 짧고 다정하게 연습하기", "도움이 필요한 일을 하나만 공유하기"],
    conversationTips: ["혼자 있는 시간이 필요하지만 관계를 덜 아끼는 건 아니야", "이 부탁은 지금은 어렵지만 다른 방식은 가능해", "내 리듬을 지키면 더 편안하게 만날 수 있어"]
  },
  conflict: {
    id: "relation-repairer",
    label: "관계 회복형",
    title: "갈등을 피하기보다 다시 맞춰가려는 타입",
    summary:
      "당신은 갈등을 관계의 끝으로만 보기보다 조정과 회복의 과정으로 받아들이려는 편입니다. 불편한 지점을 덮어두기보다 관계가 지속되기 위해 필요한 대화를 중요하게 여깁니다.",
    relationshipPattern:
      "의견 차이가 생겨도 지나치게 회피하기보다 해결 가능한 부분을 찾으려 합니다. 관계를 오래 유지하려면 불편한 이야기 역시 필요하다고 느낄 수 있습니다.",
    communicationStyle:
      "문제를 짚고 넘어가는 힘이 있지만, 상대가 갈등을 두려워하는 사람이라면 속도가 빠르게 느껴질 수 있습니다. 회복 의도를 먼저 말하면 방어가 줄어듭니다.",
    strengths: ["갈등 후 관계를 다시 정리하는 힘", "문제를 현실적으로 바라보는 태도", "반복되는 불편함을 구조적으로 개선하려는 능력"],
    cautions: ["상대가 준비되기 전 대화를 밀어붙일 수 있음", "문제 해결에 집중하다 감정의 여운을 놓칠 수 있음", "관계의 모든 불편함을 즉시 고쳐야 한다고 느낄 수 있음"],
    needs: ["회복 가능한 대화", "책임 있는 태도", "반복 문제의 정리"],
    suggestion:
      "갈등을 꺼낼 때는 '너의 잘못'보다 '우리 사이에서 반복되는 패턴'에 초점을 맞춰보세요. 방어보다 협력이 쉬워집니다.",
    routine: ["갈등 후 바로 결론 내리기보다 감정 진정 시간 갖기", "반복되는 문제는 사람보다 상황 언어로 표현하기", "대화 끝에는 앞으로의 작은 약속 1개 정하기"],
    conversationTips: ["이 이야기를 꺼내는 이유는 관계를 포기하고 싶어서가 아니야", "누가 맞는지보다 반복되는 패턴을 같이 보고 싶어", "다음에는 우리가 어떻게 해보면 좋을까?"]
  }
};

export function getRelationshipScores(answers: number[]) {
  return relationshipQuestions.reduce<Record<RelationshipDimension, number>>(
    (scores, question, index) => {
      scores[question.dimension] += answers[index] || 0;
      return scores;
    },
    { closeness: 0, expression: 0, boundary: 0, conflict: 0 }
  );
}

export function getRelationshipResultByAnswers(answers: number[]) {
  const scores = getRelationshipScores(answers);
  const dimensions = Object.keys(scores) as RelationshipDimension[];
  const topDimension = dimensions.sort((a, b) => scores[b] - scores[a])[0];
  return {
    result: relationshipResults[topDimension],
    scores,
    topDimension
  };
}
