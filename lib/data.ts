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
  "새로운 상황에서도 비교적 빠르게 적응하는 편이다.",
  "하루 중 내 감정 변화를 알아차리는 시간이 있다.",
  "중요한 결정을 할 때 직감보다 근거를 더 살피는 편이다.",
  "예상치 못한 일이 생겨도 금방 다음 행동을 정한다.",
  "다른 사람의 말투나 표정 변화를 민감하게 느낀다.",
  "혼자 있는 시간이 에너지를 회복하는 데 도움이 된다.",
  "내가 맡은 일을 시작하면 끝까지 정리하려고 한다.",
  "갈등이 생기면 바로 해결하기보다 잠시 거리를 둔다.",
  "새 아이디어를 떠올리고 실험해보는 일이 즐겁다.",
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
    id: "ground",
    label: "차분한 관찰자",
    title: "속도를 낮추고 상황을 섬세하게 읽는 타입",
    range: "12-26점",
    description:
      "지금의 당신은 빠른 결론보다 충분한 관찰과 안전한 선택을 선호합니다. 감정과 환경의 작은 변화를 잘 포착하지만, 때로는 생각이 길어져 행동이 늦어질 수 있습니다.",
    strengths: ["신중한 판단", "섬세한 감지력", "무리하지 않는 자기보호"],
    suggestion:
      "큰 결정보다 작은 실행 단위를 정해보세요. 오늘 할 수 있는 한 가지 행동이 마음의 흐름을 더 선명하게 만들어줍니다."
  },
  {
    id: "balance",
    label: "균형형 조율자",
    title: "감정과 현실 사이의 균형을 찾는 타입",
    range: "27-39점",
    description:
      "당신은 주변 상황과 자신의 감정을 함께 살피며 무난한 균형점을 찾는 편입니다. 안정적인 관계와 예측 가능한 리듬 속에서 가장 자연스럽게 힘을 냅니다.",
    strengths: ["상황 조율", "관계 감각", "꾸준한 회복력"],
    suggestion:
      "모두에게 괜찮은 답을 찾기 전에 나에게 충분히 괜찮은지도 확인해보세요. 균형은 나를 빼놓지 않을 때 더 오래 갑니다."
  },
  {
    id: "spark",
    label: "민첩한 탐색가",
    title: "가능성을 빠르게 발견하고 움직이는 타입",
    range: "40-51점",
    description:
      "당신은 변화와 아이디어에 열려 있고, 마음이 움직이면 비교적 빠르게 시도합니다. 활력이 큰 장점이지만 에너지를 너무 넓게 쓰면 집중이 흐려질 수 있습니다.",
    strengths: ["빠른 적응", "아이디어 실행력", "긍정적 추진력"],
    suggestion:
      "시작한 일의 기준을 하나만 정해보세요. 무엇을 완료로 볼지 정하면 당신의 속도가 더 좋은 성과로 이어집니다."
  },
  {
    id: "core",
    label: "깊은 추진가",
    title: "자기 인식과 실행 에너지가 모두 높은 타입",
    range: "52-60점",
    description:
      "당신은 감정을 비교적 잘 이해하고, 상황을 정리해 실제 행동으로 옮기는 힘도 큽니다. 다만 늘 잘 해내려는 마음이 커지면 휴식 신호를 놓칠 수 있습니다.",
    strengths: ["높은 자기인식", "강한 몰입", "문제 해결력"],
    suggestion:
      "잘 해내는 능력만큼 멈추는 능력도 의식해보세요. 회복을 계획에 넣으면 추진력이 더 오래 유지됩니다."
  }
];

export function getResultByScore(score: number) {
  if (score <= 26) return results[0];
  if (score <= 39) return results[1];
  if (score <= 51) return results[2];
  return results[3];
}
