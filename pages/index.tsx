import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BookOpenText,
  BrainCircuit,
  ClipboardCheck,
  Heart,
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
    icon: ClipboardCheck
  },
  {
    name: "SHIM Talk",
    description: "대화형 감정 정리와 자기이해 코칭",
    href: "/talk",
    icon: MessageCircleHeart
  },
  {
    name: "SHIM Diary",
    description: "일상 기록 기반 감정 흐름 추적",
    href: "/diary",
    icon: BookOpenText
  },
  {
    name: "SHIM Report",
    description: "주간·월간 변화 리포트와 회복 신호 분석",
    href: "/report",
    icon: BarChart3
  },
  {
    name: "SHIM Care",
    description: "개인 패턴에 맞춘 감정 관리 루틴",
    href: "/care",
    icon: HeartPulse
  }
];

const featuredTests = [
  "AI 감정·회복 유형 테스트",
  "연애유형·이상형 분석",
  "대인관계 분석",
  "고지능 우울증 검사"
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

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

function getDailyQuote(date = new Date()) {
  const kstDate = new Date(date.getTime() + KST_OFFSET_MS);
  const year = kstDate.getUTCFullYear();
  const month = kstDate.getUTCMonth();
  const day = kstDate.getUTCDate();
  const dayIndex = Math.floor((Date.UTC(year, month, day) - Date.UTC(2026, 0, 1)) / DAY_MS);
  return dailyQuotes[Math.abs(dayIndex) % dailyQuotes.length];
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
  const [dailyQuote, setDailyQuote] = useState(dailyQuotes[0]);

  useEffect(() => {
    let timeoutId: number;

    function refreshQuote() {
      setDailyQuote(getDailyQuote());
      timeoutId = window.setTimeout(refreshQuote, getMsUntilNextKstMidnight());
    }

    refreshQuote();
    return () => window.clearTimeout(timeoutId);
  }, []);

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
            <h1>나를 설명하는 언어를 더 정교하게.</h1>
            <p className="daily-quote" aria-label="오늘의 글귀">
              {dailyQuote}
            </p>
            <p>
              SHIM AI는 감정, 관계, 사고 패턴을 검사하고 해석해 스스로를 더 잘 이해하도록 돕는
              베타 서비스입니다. 지금은 심리검사를 중심으로 시작하고, 대화와 리포트, 관리 루틴으로
              확장하고 있습니다.
            </p>
          </div>
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
                  <span className="service-map-description">{service.description}</span>
                  <span className="service-map-arrow" aria-hidden="true">
                    <ArrowRight size={20} />
                  </span>
                </a>
              </Link>
            );
          })}
        </section>

        <section className="trust-strip" aria-label="SHIM AI 운영 기준">
          <div>
            <strong>Beta v0.1.3</strong>
            <span>실제 피드백 기반 개선 중</span>
          </div>
          <div>
            <strong>4개</strong>
            <span>심리검사 라인업 구성</span>
          </div>
          <div>
            <strong>익명</strong>
            <span>이름 없이 의견 제출</span>
          </div>
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

        <section className="test-catalog-panel" aria-label="현재 공개 및 준비 중인 검사">
          <div>
            <span className="eyebrow">
              <ClipboardCheck size={15} aria-hidden="true" />
              SHIM Test Catalog
            </span>
            <h2>현재 공개 및 준비 중인 검사</h2>
            <p>
              감정·회복 테스트와 연애유형·이상형 분석은 지금 바로 이용할 수 있고,
              대인관계와 고지능 우울증 검사는 순차적으로 공개할 예정입니다.
            </p>
            <div className="hero-test-list compact">
              {featuredTests.map((test, index) => (
                <span key={test}>
                  <b>{String(index + 1).padStart(2, "0")}</b>
                  {test}
                </span>
              ))}
            </div>
          </div>
          <div className="test-catalog-actions">
            <Link href="/shim-test">
              <a className="primary-button">
                검사 라인업 보기
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            </Link>
            <Link href="/mind">
              <a className="secondary-button">
                바로 테스트 시작
                <Heart size={18} aria-hidden="true" />
              </a>
            </Link>
          </div>
        </section>

        <p className="notice">{disclaimer}</p>
      </main>
    </>
  );
}
