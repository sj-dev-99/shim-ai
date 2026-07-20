export const HIGH_FUNCTIONING_DEPRESSION_TEST_NAME = "고지능 우울증 검사";
export const HIGH_FUNCTIONING_DEPRESSION_PROFILE_KEY = "shim_ai_high_functioning_depression_profile";

export type HighFunctioningDepressionProfile = {
  nickname: string;
};

export type DepressionDimension = "maskedMood" | "anhedonia" | "fatigue" | "selfPressure";

export type DepressionQuestion = {
  text: string;
  dimension: DepressionDimension;
};

export type DepressionResult = {
  id: string;
  label: string;
  title: string;
  summary: string;
  scoreMeaning: string;
  hiddenPattern: string;
  functioningPattern: string;
  strengths: string[];
  cautions: string[];
  supportSignals: string[];
  suggestion: string;
  routine: string[];
  reflectionQuestions: string[];
};

export const depressionOptions = [
  { label: "전혀 아니다", value: 1 },
  { label: "아니다", value: 2 },
  { label: "보통이다", value: 3 },
  { label: "그렇다", value: 4 },
  { label: "매우 그렇다", value: 5 }
];

export const depressionQuestions: DepressionQuestion[] = [
  {
    text: "겉으로는 평소처럼 지내지만 혼자 있을 때 마음이 자주 가라앉는다.",
    dimension: "maskedMood"
  },
  {
    text: "예전에는 즐겁던 일도 요즘은 해야 할 일처럼 느껴질 때가 많다.",
    dimension: "anhedonia"
  },
  {
    text: "일은 해내고 있지만 하루가 끝나면 에너지가 거의 남지 않는다.",
    dimension: "fatigue"
  },
  {
    text: "힘들어도 티 내지 않고 계속 괜찮은 사람처럼 보여야 한다고 느낀다.",
    dimension: "selfPressure"
  },
  {
    text: "사람들과 있을 때는 웃지만, 돌아서면 공허함이 크게 느껴진다.",
    dimension: "maskedMood"
  },
  {
    text: "취미나 휴식 시간이 있어도 마음이 쉽게 회복되지 않는다.",
    dimension: "anhedonia"
  },
  {
    text: "잠을 자도 개운하지 않고 집중력이 이전보다 떨어진 느낌이 든다.",
    dimension: "fatigue"
  },
  {
    text: "내가 무너지면 안 된다는 생각 때문에 도움을 요청하기 어렵다.",
    dimension: "selfPressure"
  },
  {
    text: "내 감정을 설명하려고 하면 '별일 아닌데 왜 이러지'라는 생각이 든다.",
    dimension: "maskedMood"
  },
  {
    text: "좋은 일이 생겨도 기쁨이 오래 머물지 않고 금방 무뎌진다.",
    dimension: "anhedonia"
  },
  {
    text: "해야 할 일을 미루지 않으려 애쓰지만 몸과 마음이 계속 무겁다.",
    dimension: "fatigue"
  },
  {
    text: "성과가 있어도 충분하다고 느끼기보다 더 잘해야 한다는 압박이 먼저 온다.",
    dimension: "selfPressure"
  }
];

export const depressionResults: DepressionResult[] = [
  {
    id: "watchful-balance",
    label: "균형 점검형",
    title: "아직은 회복 여지가 있지만 마음의 신호를 살펴볼 필요가 있는 상태",
    summary:
      "현재 결과는 일상 기능이 비교적 유지되고 있으나, 피로와 감정 둔화가 시작될 수 있는 구간을 보여줍니다. 지금의 신호를 작게 넘기지 않고 회복 루틴을 점검하면 더 큰 소진을 예방하는 데 도움이 됩니다.",
    scoreMeaning:
      "총점이 낮은 편이라 심각한 우울 신호가 강하게 나타난다고 보기보다는, 최근의 스트레스와 회복 리듬을 점검해볼 단계에 가깝습니다.",
    hiddenPattern:
      "겉으로는 큰 문제가 없어 보여도 마음이 예전보다 쉽게 피로해지고, 즐거움이 오래 지속되지 않는 순간이 있을 수 있습니다.",
    functioningPattern:
      "해야 할 일은 해내지만 회복 시간은 뒤로 밀릴 수 있습니다. 기능 유지가 곧 괜찮다는 뜻은 아닐 수 있습니다.",
    strengths: ["일상 리듬을 유지하려는 힘", "자기 상태를 점검하려는 민감성", "초기 신호를 알아차릴 가능성"],
    cautions: ["피로를 단순한 게으름으로 해석할 수 있음", "작은 즐거움이 줄어드는 변화를 놓칠 수 있음", "쉬어도 회복되지 않는 상태를 방치할 수 있음"],
    supportSignals: ["2주 이상 기분 저하가 이어질 때", "수면이나 식사 리듬이 계속 흔들릴 때", "일상 기능 유지가 점점 버거워질 때"],
    suggestion:
      "이번 주에는 해야 할 일 목록만큼 회복할 일 목록도 함께 적어보세요. 회복을 계획에 넣는 것부터 시작해도 충분합니다.",
    routine: ["하루 10분 산책 또는 햇빛 보기", "잠들기 전 업무/공부 생각을 3줄로 내려놓기", "즐거웠던 일보다 덜 힘들었던 순간 1개 기록하기"],
    reflectionQuestions: ["요즘 내 에너지를 가장 많이 쓰게 하는 일은 무엇일까?", "쉬어도 회복되지 않는 시간대가 있을까?", "도움을 요청해도 괜찮은 사람은 누구일까?"]
  },
  {
    id: "masked-fatigue",
    label: "가면 소진형",
    title: "괜찮은 모습 뒤에서 피로와 공허함이 쌓이는 상태",
    summary:
      "당신은 해야 할 역할을 계속 수행하고 있지만, 그 뒤에서 감정적 피로와 공허함이 누적되고 있을 가능성이 있습니다. 겉으로 잘 해내는 모습 때문에 주변도, 나 자신도 힘듦을 늦게 알아차릴 수 있습니다.",
    scoreMeaning:
      "중간 이상의 점수는 기능을 유지하는 힘과 별개로 마음의 회복감이 떨어지고 있을 수 있음을 뜻합니다.",
    hiddenPattern:
      "사람들 앞에서는 괜찮게 행동하지만 혼자 있을 때 마음이 급격히 가라앉거나 무뎌지는 패턴이 나타날 수 있습니다.",
    functioningPattern:
      "성과와 책임감으로 하루를 밀고 가지만, 휴식이 회복으로 연결되지 않는 느낌이 커질 수 있습니다.",
    strengths: ["책임을 다하려는 성실함", "상황을 분석하고 버티는 힘", "겉으로 무너지지 않으려는 자기통제"],
    cautions: ["도움 요청을 실패처럼 느낄 수 있음", "즐거움 저하를 단순한 피곤함으로 넘길 수 있음", "감정이 쌓인 뒤 갑자기 무기력해질 수 있음"],
    supportSignals: ["흥미 저하와 공허함이 2주 이상 지속될 때", "집중력 저하가 업무나 학업에 영향을 줄 때", "혼자 있을 때 감정이 급격히 가라앉을 때"],
    suggestion:
      "지금 필요한 것은 더 강하게 버티는 일이 아니라 힘든 상태를 안전하게 드러낼 통로를 만드는 일입니다.",
    routine: ["하루 한 번 '괜찮은 척한 순간' 기록하기", "신뢰할 수 있는 사람에게 상태를 한 문장으로 공유하기", "잠과 식사 시간을 먼저 고정하기"],
    reflectionQuestions: ["내가 요즘 괜찮은 척하고 있는 장면은 언제일까?", "도움을 요청하면 무엇이 가장 두려울까?", "회복보다 성과를 먼저 두는 습관이 어디에서 나타날까?"]
  },
  {
    id: "silent-depressive-signal",
    label: "조용한 우울 신호형",
    title: "기능은 유지되지만 우울감과 흥미 저하 신호가 뚜렷한 상태",
    summary:
      "현재 결과는 일상 역할을 해내는 능력과 별개로, 우울감·흥미 저하·피로 신호가 비교적 분명하게 나타나는 구간을 보여줍니다. 혼자 견디는 방식만으로는 회복이 늦어질 수 있어 전문적인 상담이나 진료를 고려해볼 필요가 있습니다.",
    scoreMeaning:
      "높은 점수대는 단순한 피곤함보다 지속적인 기분 저하와 회복감 저하를 함께 살펴봐야 하는 상태일 수 있음을 의미합니다.",
    hiddenPattern:
      "감정이 무뎌지고 좋은 일에도 반응이 약해지며, 혼자 있는 시간에 공허함이나 자기비난이 커질 수 있습니다.",
    functioningPattern:
      "겉으로는 일과 관계를 유지하지만, 실제로는 집중·수면·회복 리듬이 흔들릴 수 있습니다.",
    strengths: ["끝까지 해내려는 책임감", "상태를 분석하는 능력", "무너진 뒤에도 다시 정리하려는 힘"],
    cautions: ["기능 유지 때문에 심각성을 낮게 볼 수 있음", "감정을 설명하기 어려워 도움 요청이 늦어질 수 있음", "스스로를 더 몰아붙여 회복 여지를 줄일 수 있음"],
    supportSignals: ["기분 저하나 흥미 저하가 대부분의 날에 지속될 때", "수면·식욕·집중 문제가 함께 나타날 때", "죽음이나 사라지고 싶다는 생각이 스칠 때"],
    suggestion:
      "증상을 혼자 판단하려 하기보다, 최근 2주간의 기분·수면·식사·집중 변화를 적어 전문가와 상의할 자료로 가져가보세요.",
    routine: ["2주 증상 기록표 만들기", "상담센터·정신건강의학과·주치의 중 한 곳 연락처 저장하기", "오늘 해야 할 일 1개를 줄이고 회복 행동 1개 넣기"],
    reflectionQuestions: ["최근 2주 동안 가장 많이 줄어든 것은 무엇일까?", "내가 도움을 받아도 되는 이유는 무엇일까?", "오늘 혼자 견디지 않기 위해 할 수 있는 가장 작은 행동은 무엇일까?"]
  },
  {
    id: "urgent-support-needed",
    label: "도움 요청 권장형",
    title: "혼자 버티기보다 빠른 도움 연결이 필요한 상태",
    summary:
      "현재 결과는 우울감, 에너지 저하, 자기압박, 기능 유지의 부담이 상당히 높게 나타나는 구간입니다. 이 결과는 진단이 아니지만, 혼자 견디는 시간이 길어질수록 회복이 더 어려워질 수 있어 가능한 한 빨리 전문가나 신뢰할 수 있는 사람에게 상태를 알려야 합니다.",
    scoreMeaning:
      "매우 높은 점수대는 일상 기능을 유지하고 있더라도 마음과 몸의 부담이 이미 한계에 가까울 수 있음을 뜻합니다.",
    hiddenPattern:
      "괜찮아 보여야 한다는 압박이 강할수록 실제 힘듦은 더 깊이 숨겨질 수 있습니다. 특히 공허함, 무기력, 자기비난이 함께 커질 수 있습니다.",
    functioningPattern:
      "일은 해내지만 그 대가로 수면, 식사, 관계, 자기돌봄이 무너질 가능성이 있습니다.",
    strengths: ["오래 버텨온 생존력", "책임을 놓지 않으려는 힘", "도움을 찾기 시작할 수 있는 자기인식"],
    cautions: ["위험 신호를 '내가 약해서'라고 해석할 수 있음", "도움을 요청하기 전까지 더 버텨야 한다고 느낄 수 있음", "감정이 급격히 가라앉을 때 혼자 있게 될 수 있음"],
    supportSignals: ["죽음, 자해, 사라지고 싶다는 생각이 있을 때", "일상 기능 유지가 급격히 어려워질 때", "잠을 거의 못 자거나 식사를 못 할 때"],
    suggestion:
      "지금은 분석보다 연결이 먼저입니다. 오늘 안에 신뢰할 수 있는 사람에게 상태를 알리고, 필요하면 988 또는 119/응급실처럼 즉시 도움을 받을 수 있는 경로를 이용하세요.",
    routine: ["혼자 있지 않을 시간 확보하기", "가까운 사람에게 '지금 혼자 버티기 어렵다'고 보내기", "위기 연락처 988, 119, 지역 정신건강복지센터 저장하기"],
    reflectionQuestions: ["지금 바로 연락할 수 있는 사람은 누구일까?", "오늘 혼자 있지 않기 위해 어디로 이동할 수 있을까?", "나를 지키기 위해 지금 중단해도 되는 일은 무엇일까?"]
  }
];

export function getDepressionScores(answers: number[]) {
  return depressionQuestions.reduce<Record<DepressionDimension, number>>(
    (scores, question, index) => {
      scores[question.dimension] += answers[index] || 0;
      return scores;
    },
    { maskedMood: 0, anhedonia: 0, fatigue: 0, selfPressure: 0 }
  );
}

export function getDepressionResultByAnswers(answers: number[]) {
  const scores = getDepressionScores(answers);
  const total = Object.values(scores).reduce((sum, value) => sum + value, 0);

  if (total <= 25) return { result: depressionResults[0], scores, total };
  if (total <= 38) return { result: depressionResults[1], scores, total };
  if (total <= 50) return { result: depressionResults[2], scores, total };
  return { result: depressionResults[3], scores, total };
}
