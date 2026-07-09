export const TEST_NAME = "AI 감정·회복 유형 테스트";
export const TEST_CATEGORY = "SHIM Test(심리테스트)";

export type ResultType = {
  id: string;
  label: string;
  title: string;
  range: string;
  description: string;
  strengths: string[];
  suggestion: string;
};

export const disclaimer =
  "본 서비스는 의료 상담이나 진단이 아닌 자기이해를 돕기 위한 참고용 콘텐츠입니다.";

export const questions = [
  "새로운 상황에서 비교적 빠르게 적응하는 편이다.",
  "하루 중 내 감정 변화를 알아차리는 시간이 있다.",
  "중요한 결정을 할 때 직감보다 근거를 함께 살피는 편이다.",
  "예상하지 못한 일이 생겨도 금방 다음 행동을 정한다.",
  "다른 사람의 말투나 표정 변화에 민감하게 반응한다.",
  "혼자 있는 시간이 에너지를 회복하는 데 도움이 된다.",
  "내가 맡은 일을 시작하면 끝까지 정리하려고 한다.",
  "갈등이 생기면 바로 해결하기보다 잠시 거리를 둔다.",
  "새로운 아이디어를 떠올리고 시도해보는 일이 즐겁다.",
  "내 감정을 말로 설명하는 것이 어렵지 않다.",
  "반복되는 일상 속에서도 안정감을 느끼는 편이다.",
  "스트레스를 받을 때 나만의 회복 루틴을 찾으려 한다."
];

export const options = [
  { label: "매우 아니다", value: 1 },
  { label: "아니다", value: 2 },
  { label: "보통이다", value: 3 },
  { label: "그렇다", value: 4 },
  { label: "매우 그렇다", value: 5 }
];

export const results: ResultType[] = [
  {
    id: "observer",
    label: "감정 관찰형",
    title: "감정을 천천히 확인하며 안전한 선택을 찾는 유형",
    range: "12-26점",
    description:
      "감정 반응을 즉시 행동으로 옮기기보다 충분히 관찰하고 정리하려는 경향이 큽니다. 심리학적으로는 정서 조절 과정에서 반응 억제와 상황 재평가를 먼저 사용하는 편에 가깝습니다. 신중함은 강점이지만, 감정을 오래 붙잡으면 실행이 늦어질 수 있습니다.",
    strengths: ["신중한 판단", "무리하지 않는 자기보호", "상황을 차분히 보는 힘"],
    suggestion:
      "오늘 느낀 감정을 한 단어로 이름 붙이고, 바로 할 수 있는 작은 행동 하나를 정해보세요. 관찰에서 실행으로 넘어가는 짧은 연결고리가 회복감을 높여줍니다."
  },
  {
    id: "balancer",
    label: "균형 조율형",
    title: "감정과 현실 사이의 균형을 맞추는 유형",
    range: "27-39점",
    description:
      "감정과 상황 정보를 함께 고려하며 비교적 안정적으로 균형을 찾는 편입니다. 자기인식과 사회적 단서를 같이 살피기 때문에 관계와 일상 리듬을 유지하는 데 강점이 있습니다. 다만 타인의 기대를 지나치게 고려하면 자신의 욕구가 뒤로 밀릴 수 있습니다.",
    strengths: ["상황 조율", "관계 감각", "꾸준한 회복력"],
    suggestion:
      "중요한 결정을 하기 전 '내가 원하는 것'과 '상황이 요구하는 것'을 각각 적어보세요. 균형은 둘 중 하나를 지우는 것이 아니라 비율을 조정하는 과정입니다."
  },
  {
    id: "starter",
    label: "변화 실행형",
    title: "감정 에너지를 빠르게 행동으로 바꾸는 유형",
    range: "40-51점",
    description:
      "새로운 자극과 가능성에 민감하고, 감정 에너지를 실행으로 전환하는 속도가 빠른 편입니다. 접근 동기가 높아 도전과 실험에 강하지만, 긴장이나 흥분이 높을 때는 주의가 분산될 수 있습니다.",
    strengths: ["빠른 적응", "아이디어 실행력", "긍정적 추진력"],
    suggestion:
      "새 일을 시작할 때 완료 기준을 하나만 정해보세요. 목표의 끝점을 분명히 하면 빠른 에너지가 더 안정적인 성과로 이어집니다."
  },
  {
    id: "driver",
    label: "회복 추진형",
    title: "자기이해와 실행 에너지가 모두 높은 유형",
    range: "52-60점",
    description:
      "감정을 인식하고 해석하는 힘과 실제 행동으로 옮기는 힘이 모두 높은 편입니다. 자기효능감과 회복 탄력성이 잘 작동할 수 있지만, 계속 해내야 한다는 압박이 쌓이면 휴식 신호를 놓칠 수 있습니다.",
    strengths: ["높은 자기인식", "강한 몰입", "문제 해결력"],
    suggestion:
      "해야 할 일 목록만큼 회복할 일 목록도 만들어보세요. 충분한 멈춤을 계획에 넣을 때 추진력은 더 오래 유지됩니다."
  }
];

export function getResultByScore(score: number) {
  if (score <= 26) return results[0];
  if (score <= 39) return results[1];
  if (score <= 51) return results[2];
  return results[3];
}
