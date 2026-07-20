import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BookOpenText,
  BrainCircuit,
  ClipboardCheck,
  HeartPulse,
  LineChart,
  MessageCircleHeart,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  Users
} from "lucide-react";
import { disclaimer } from "../lib/data";

type HomePageProps = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};

const services = [
  {
    name: "SHIM Test",
    description: "감정, 관계, 사고 패턴을 다루는 AI 심리검사 라인업",
    href: "/shim-test",
    icon: ClipboardCheck,
    status: "OPEN",
    action: "검사 라인업 보기"
  },
  {
    name: "SHIM Diary",
    description: "오늘의 감정을 기록하면 AI가 작은 위로와 한줄 코멘트를 남겨드립니다.",
    href: "/diary",
    icon: BookOpenText,
    status: "OPEN",
    action: "감정 기록하기"
  },
  {
    name: "SHIM Report",
    description: "지난 한 달 동안 내 감정이 어떻게 달라졌는지 AI가 분석해드립니다.",
    href: "/report",
    icon: BarChart3,
    status: "준비중",
    action: "오픈 예정"
  },
  {
    name: "SHIM Care",
    description: "AI가 추천하는 나만의 회복 루틴",
    href: "/care",
    icon: HeartPulse,
    status: "준비중",
    action: "오픈 예정"
  },
  {
    name: "SHIM Talk",
    description: "대화형 감정 정리와 자기이해 코칭",
    href: "/talk",
    icon: MessageCircleHeart,
    status: "준비중",
    action: "오픈 예정"
  }
];

const platformPoints = [
  {
    title: "자가진단이 아닌 자기이해",
    description: "결과를 단정하지 않고 감정, 관계, 사고 습관을 돌아볼 수 있는 언어로 정리합니다.",
    icon: ShieldCheck
  },
  {
    title: "검사 후 행동까지 연결",
    description: "점수만 보여주는 방식보다 회복 루틴과 다음 질문으로 이어지는 경험을 지향합니다.",
    icon: LineChart
  },
  {
    title: "관계와 정서 영역 확장",
    description: "연애, 이상형, 대인관계, 고기능 우울감처럼 실제 고민과 가까운 주제를 순차 공개합니다.",
    icon: Users
  }
];

const dailyQuotes = [
  "오늘의 작은 숨 고르기가 내일의 나를 조금 더 편안하게 합니다.",
  "괜찮아지는 일은 늘 조용히, 그러나 분명히 시작됩니다.",
  "마음이 느린 날에도 당신은 충분히 잘 지나가고 있습니다.",
  "잠시 멈추는 것도 나를 지키는 하나의 방법입니다.",
  "오늘의 나를 다그치기보다 살짝 안아주는 쪽을 선택해보세요.",
  "흔들리는 마음에도 방향을 잃지 않는 힘이 남아 있습니다.",
  "완벽하지 않아도 괜찮습니다. 지금의 속도도 당신의 속도입니다.",
  "마음이 무거운 날에는 작은 친절 하나가 충분한 시작입니다.",
  "나를 이해하려는 마음은 이미 회복의 첫 문장입니다.",
  "오늘 하루를 버텨낸 것만으로도 마음은 제 몫을 해냈습니다."
];

const moodOptions = [
  { emoji: "😊", label: "좋아요", diaryId: "good", note: "오늘의 좋은 감정을 조금 더 오래 머물게 해보세요.", prompt: "오늘 무엇이 나를 웃게 했나요?" },
  { emoji: "😌", label: "평온해요", diaryId: "calm", note: "차분한 마음을 기록하면 나만의 안정 패턴이 보입니다.", prompt: "오늘 마음이 편안했던 순간은 언제였나요?" },
  { emoji: "🥰", label: "따뜻해요", diaryId: "warm", note: "마음이 부드러운 날의 이유를 짧게 남겨보세요.", prompt: "오늘 누구에게, 혹은 무엇에게 따뜻함을 느꼈나요?" },
  { emoji: "🤩", label: "설레요", diaryId: "excited", note: "기대되는 마음은 나를 움직이게 하는 좋은 신호입니다.", prompt: "오늘 어떤 기대가 마음을 움직였나요?" },
  { emoji: "🙂", label: "괜찮아요", diaryId: "okay", note: "아주 특별하지 않아도 충분히 괜찮은 하루가 있습니다.", prompt: "오늘 괜찮다고 느낀 작은 이유는 무엇인가요?" },
  { emoji: "😐", label: "무덤덤해요", diaryId: "neutral", note: "감정이 선명하지 않은 날도 그대로 기록할 수 있어요.", prompt: "오늘 무슨 일이 있었나요?" },
  { emoji: "😕", label: "복잡해요", diaryId: "mixed", note: "엉킨 마음은 적어보는 순간 조금씩 정리되기 시작합니다.", prompt: "오늘 마음을 복잡하게 만든 일은 무엇인가요?" },
  { emoji: "😟", label: "불안해요", diaryId: "anxious", note: "불안의 크기보다 지금 필요한 안정을 먼저 살펴보세요.", prompt: "오늘 가장 신경 쓰였던 일은 무엇인가요?" },
  { emoji: "😢", label: "슬퍼요", diaryId: "sad", note: "슬픈 마음도 이름을 붙이면 혼자 견디는 느낌이 줄어듭니다.", prompt: "오늘 마음이 내려앉았던 순간은 언제였나요?" },
  { emoji: "😡", label: "화나요", diaryId: "angry", note: "화가 난 이유를 안전하게 적어두면 마음의 경계가 보입니다.", prompt: "오늘 어떤 일이 내 마음의 선을 넘었나요?" },
  { emoji: "😴", label: "피곤해요", diaryId: "tired", note: "지친 날에는 회복을 위한 작은 선택 하나면 충분합니다.", prompt: "오늘 나를 가장 지치게 한 것은 무엇인가요?" },
  { emoji: "🥺", label: "외로워요", diaryId: "lonely", note: "외로움도 오늘의 중요한 감정입니다. 조용히 들어봐도 괜찮아요.", prompt: "오늘 어떤 순간에 혼자라고 느꼈나요?" }
];

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

function getDailyQuote(date = new Date()) {
  const kstDate = new Date(date.getTime() + KST_OFFSET_MS);
  const year = kstDate.getUTCFullYear();
  const month = kstDate.getUTCMonth();
  const day = kstDate.getUTCDate();
  const dayIndex = Math.floor((Date.UTC(year, month, day) - Date.UTC(2026, 0, 1)) / DAY_MS);
  return `${dailyQuotes[Math.abs(dayIndex) % dailyQuotes.length]} - shim.ai`;
}

function getMsUntilNextKstMidnight(date = new Date()) {
  const kstDate = new Date(date.getTime() + KST_OFFSET_MS);
  const year = kstDate.getUTCFullYear();
  const month = kstDate.getUTCMonth();
  const day = kstDate.getUTCDate();
  const nextKstMidnightUtc = Date.UTC(year, month, day + 1) - KST_OFFSET_MS;
  return Math.max(nextKstMidnightUtc - date.getTime(), 1000);
}

export default function HomePage({ theme, toggleTheme }: HomePageProps) {
  const isDark = theme === "dark";
  const [dailyQuote, setDailyQuote] = useState(`${dailyQuotes[0]} - shim.ai`);
  const [recommendedCount, setRecommendedCount] = useState<number | null>(null);
  const [selectedMood, setSelectedMood] = useState(moodOptions[0]);

  useEffect(() => {
    let timeoutId: number;

    function refreshQuote() {
      setDailyQuote(getDailyQuote());
      timeoutId = window.setTimeout(refreshQuote, getMsUntilNextKstMidnight());
    }

    refreshQuote();
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    let mounted = true;

    fetch("/api/public-stats")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { recommendedParticipationCount?: number | null } | null) => {
        if (mounted && typeof data?.recommendedParticipationCount === "number") {
          setRecommendedCount(data.recommendedParticipationCount);
        }
      })
      .catch(() => {
        if (mounted) setRecommendedCount(null);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const savedMood = window.localStorage.getItem("shim-home-mood");
    const matchedMood = moodOptions.find((mood) => mood.label === savedMood);

    if (matchedMood) {
      setSelectedMood(matchedMood);
    }
  }, []);

  function handleMoodSelect(mood: (typeof moodOptions)[number]) {
    setSelectedMood(mood);
    window.localStorage.setItem("shim-home-mood", mood.label);
  }

  return (
    <>
      <Head>
        <title>shim.ai</title>
        <meta
          name="description"
          content="AI 심리검사와 감정 관리 기능을 제공하는 SHIM AI 베타 서비스"
        />
      </Head>
      <main className="page-shell">
        <header className="topbar">
          <div className="brand">
            <span className="brand-mark">
              <BrainCircuit size={19} aria-hidden="true" />
            </span>
            shim.ai
          </div>
          <button
            aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
            aria-pressed={isDark}
            className="theme-toggle"
            onClick={toggleTheme}
            type="button"
          >
            {isDark ? <Moon size={17} aria-hidden="true" /> : <Sun size={17} aria-hidden="true" />}
            <span>{isDark ? "Dark" : "Light"}</span>
          </button>
        </header>

        <section className="hero home-hero">
          <div className="home-hero-copy">
            <span className="eyebrow">
              <Sparkles size={15} aria-hidden="true" />
              AI 심리검사 기반 자기이해 플랫폼
            </span>
            <h1>AI와 함께 나를 더 정확하게 이해하세요.</h1>
            <p className="daily-quote" aria-label="오늘의 글귀">
              {dailyQuote}
            </p>
            <p>
              AI 심리테스트와 감정기록을 통해 나를 이해하고 성장하는 자기이해 플랫폼입니다.
              오늘의 감정부터 관계 패턴까지 쉽게 기록하고 해석해보세요.
            </p>
          </div>
        </section>

        <section className="today-recommendation" aria-label="오늘의 추천">
          <div>
            <span className="recommendation-kicker">오늘의 추천</span>
            <h2>감정·회복 유형 테스트</h2>
            <p>지금 내 감정 조절 패턴과 회복 방식을 12문항으로 확인해보세요.</p>
            <div className="recommendation-meta" aria-label="추천 테스트 정보">
              <span>3분</span>
              <span>★★★★★</span>
              <span>
                {recommendedCount === null ? "참여 수 집계 중" : `${recommendedCount.toLocaleString("ko-KR")}명이 참여했습니다.`}
              </span>
            </div>
          </div>
          <Link href="/mind">
            <a className="primary-button">
              테스트 시작
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </Link>
        </section>

        <section className="mood-check" aria-label="오늘의 기분 선택">
          <div className="mood-check-copy">
            <span>오늘의 기분</span>
            <h2>{selectedMood.emoji} {selectedMood.label}</h2>
            <p>{selectedMood.note}</p>
            <strong className="mood-question">{selectedMood.prompt}</strong>
          </div>
          <div className="mood-options" role="group" aria-label="기분 선택">
            {moodOptions.map((mood) => (
              <button
                aria-pressed={selectedMood.label === mood.label}
                className={selectedMood.label === mood.label ? "is-selected" : ""}
                key={mood.label}
                onClick={() => handleMoodSelect(mood)}
                type="button"
              >
                <span aria-hidden="true">{mood.emoji}</span>
                <small>{mood.label}</small>
              </button>
            ))}
          </div>
          <Link href={`/diary?emotion=${selectedMood.diaryId}`}>
            <a className="mood-diary-link">
              SHIM Diary로 남기기
              <ArrowRight size={17} aria-hidden="true" />
            </a>
          </Link>
        </section>

        <section className="service-map service-map-priority" aria-label="SHIM AI 서비스 선택">
          <div className="section-heading service-heading">
            <span>Service Map</span>
            <h2>필요한 방식으로 자기이해를 시작하세요</h2>
          </div>
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Link href={service.href} key={service.name}>
                <a className="service-map-item">
                  <span className="service-map-icon">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <strong>{service.name}</strong>
                  <em className={`service-status ${service.status === "OPEN" ? "is-open" : "is-planned"}`}>{service.status}</em>
                  <span className="service-map-description">{service.description}</span>
                  <span className={`service-map-action ${service.status === "OPEN" ? "is-open" : "is-planned"}`}>
                    {service.action}
                    <ArrowRight size={20} />
                  </span>
                </a>
              </Link>
            );
          })}
        </section>

        <section className="platform-grid" aria-label="SHIM AI 서비스 방향">
          {platformPoints.map((point) => {
            const Icon = point.icon;
            return (
              <article className="platform-card" key={point.title}>
                <span>
                  <Icon size={20} aria-hidden="true" />
                </span>
                <strong>{point.title}</strong>
                <p>{point.description}</p>
              </article>
            );
          })}
        </section>

        <p className="notice">{disclaimer}</p>
      </main>
    </>
  );
}
