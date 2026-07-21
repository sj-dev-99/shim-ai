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
    description: "AI 심리검사로 감정, 관계, 사고 패턴을 빠르게 이해합니다.",
    href: "/shim-test",
    icon: ClipboardCheck,
    status: "OPEN",
    action: "검사 시작",
    highlight: "오늘 추천: 감정·회복 유형 테스트"
  },
  {
    name: "SHIM Diary",
    description: "오늘의 감정을 기록하면 AI가 작은 위로를 남겨드립니다.",
    href: "/diary",
    icon: BookOpenText,
    status: "OPEN",
    action: "감정 기록"
  },
  {
    name: "SHIM Report",
    description: "지난 감정의 흐름을 AI가 월간 리포트로 정리합니다.",
    href: "/report",
    icon: BarChart3,
    status: "준비중",
    action: "오픈 예정"
  },
  {
    name: "SHIM Care",
    description: "AI가 추천하는 나만의 회복 루틴을 제안합니다.",
    href: "/care",
    icon: HeartPulse,
    status: "준비중",
    action: "오픈 예정"
  },
  {
    name: "SHIM Talk",
    description: "대화로 감정을 정리하고 자기이해 질문을 이어갑니다.",
    href: "/talk",
    icon: MessageCircleHeart,
    status: "준비중",
    action: "오픈 예정"
  }
];

const platformPoints = [
  {
    title: "심리검사가 아닌 자기이해",
    description: "결과를 단정하지 않고 나를 이해하는 언어로 감정과 관계를 정리합니다.",
    icon: ShieldCheck
  },
  {
    title: "결과보다 변화",
    description: "점수에서 끝나지 않고 오늘 시도할 수 있는 회복 행동으로 이어집니다.",
    icon: LineChart
  },
  {
    title: "AI와 함께 성장",
    description: "검사, 기록, 리포트를 연결해 나를 조금씩 더 정확하게 알아갑니다.",
    icon: Users
  }
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

const INITIAL_MOOD_COUNT = 6;

export default function HomePage({ theme, toggleTheme }: HomePageProps) {
  const isDark = theme === "dark";
  const [recommendedCount, setRecommendedCount] = useState<number | null>(null);
  const [selectedMood, setSelectedMood] = useState(moodOptions[0]);
  const [showAllMoods, setShowAllMoods] = useState(false);
  const visibleMoodOptions = showAllMoods ? moodOptions : moodOptions.slice(0, INITIAL_MOOD_COUNT);

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

        <section className="home-redesign-hero" aria-label="SHIM AI 소개">
          <div className="home-hero-copy">
            <span className="eyebrow">
              <Sparkles size={15} aria-hidden="true" />
              AI 자기이해 플랫폼
            </span>
            <h1>
              <span>AI와 함께</span>
              <span>나를 더 정확하게 이해하세요.</span>
            </h1>
            <p>
              SHIM은 AI 심리테스트와 감정기록을 통해 지금의 감정, 관계, 회복 패턴을 더 쉽게 이해하도록 돕습니다.
            </p>
            <Link href="/shim-test">
              <a className="primary-button home-hero-cta">
                지금 시작하기
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            </Link>
          </div>
        </section>

        <section className="service-slider-section" aria-label="SHIM 서비스">
          <div className="section-heading">
            <span>SHIM Services</span>
            <h2>필요한 방식으로 자기이해를 시작하세요</h2>
          </div>
          <div className="service-card-slider" role="list">
            {services.map((service) => {
              const Icon = service.icon;
              const isOpen = service.status === "OPEN";
              return (
                <Link href={service.href} key={service.name}>
                  <a className={`service-slide-card ${isOpen ? "is-open" : "is-planned"}`} role="listitem">
                    <span className="service-slide-icon">
                      <Icon size={22} aria-hidden="true" />
                    </span>
                    <em className={`service-status ${isOpen ? "is-open" : "is-planned"}`}>{service.status}</em>
                    <strong>{service.name}</strong>
                    <p>{service.description}</p>
                    {service.highlight ? (
                      <div className="service-card-recommendation" aria-label="SHIM Test 추천">
                        <span>{service.highlight}</span>
                        <small>
                          3분 · 12문항 ·{" "}
                          {recommendedCount === null ? "참여 수 집계 중" : `${recommendedCount.toLocaleString("ko-KR")}명 참여`}
                        </small>
                      </div>
                    ) : null}
                    <span className="service-slide-action">
                      {service.action}
                      <ArrowRight size={17} aria-hidden="true" />
                    </span>
                  </a>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mood-check" aria-label="오늘의 기분 선택">
          <div className="mood-check-copy">
            <span>오늘의 기분</span>
            <h2>{selectedMood.emoji} {selectedMood.label}</h2>
            <p>{selectedMood.note}</p>
            <strong className="mood-question">{selectedMood.prompt}</strong>
          </div>
          <div className="mood-options" role="group" aria-label="기분 선택">
            {visibleMoodOptions.map((mood) => (
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
            <button
              aria-expanded={showAllMoods}
              className="mood-more-button"
              onClick={() => setShowAllMoods((value) => !value)}
              type="button"
            >
              <span aria-hidden="true">{showAllMoods ? "−" : "+"}</span>
              <small>{showAllMoods ? "접기" : "더보기"}</small>
            </button>
          </div>
          <Link href={`/diary?emotion=${selectedMood.diaryId}`}>
            <a className="mood-diary-link">
              SHIM Diary로 남기기
              <ArrowRight size={17} aria-hidden="true" />
            </a>
          </Link>
        </section>

        <section className="philosophy-section" aria-label="SHIM AI 서비스 철학">
          <div className="section-heading">
            <span>Our Philosophy</span>
            <h2>나를 판단하지 않고 이해하는 방식</h2>
          </div>
          <div className="platform-grid">
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
          </div>
        </section>

        <p className="notice">{disclaimer}</p>
      </main>
    </>
  );
}
