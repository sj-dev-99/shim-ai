import Head from "next/head";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpenText,
  BrainCircuit,
  HeartPulse,
  MessageCircleHeart,
  Moon,
  Sparkles,
  Sun
} from "lucide-react";
import { disclaimer, TEST_CATEGORY, TEST_NAME } from "../lib/data";

type HomePageProps = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};

const upcomingServices = [
  {
    name: "SHIM Talk",
    description: "AI 감정 대화",
    icon: MessageCircleHeart
  },
  {
    name: "SHIM Diary",
    description: "감정일기",
    icon: BookOpenText
  },
  {
    name: "SHIM Report",
    description: "주간·월간 감정 분석",
    icon: BarChart3
  },
  {
    name: "SHIM Care",
    description: "감정 관리 루틴",
    icon: HeartPulse
  }
];

export default function HomePage({ theme, toggleTheme }: HomePageProps) {
  const isDark = theme === "dark";

  return (
    <>
      <Head>
        <title>shim.ai</title>
        <meta name="description" content="심리테스트와 감정 관리 기능을 제공하는 SHIM AI 베타 서비스" />
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

        <section className="hero hub-hero">
          <div>
            <span className="eyebrow">
              <Sparkles size={15} aria-hidden="true" />
              AI 자기이해 서비스 허브
            </span>
            <h1>shim.ai</h1>
            <p>
              SHIM AI는 감정 인식, 자기이해, 회복 습관을 돕는 기능들을 하나씩 확장해가는 베타 서비스입니다.
              현재는 심리테스트 영역인 {TEST_CATEGORY}부터 열어두었습니다.
            </p>
          </div>
        </section>

        <section className="service-map" aria-label="SHIM AI 서비스 구성">
          {upcomingServices.map((service) => {
            const Icon = service.icon;
            return (
              <article className="service-map-item" key={service.name}>
                <span className="service-map-icon">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <strong>{service.name}</strong>
                <span>{service.description}</span>
              </article>
            );
          })}
        </section>

        <section className="test-category" aria-label={TEST_CATEGORY}>
          <div className="section-heading">
            <span>{TEST_CATEGORY}</span>
            <h2>지금 참여 가능한 테스트</h2>
          </div>

          <Link href="/mind">
            <a className="test-card">
              <span className="test-card-icon">
                <BrainCircuit size={22} aria-hidden="true" />
              </span>
              <span className="test-card-body">
                <strong>{TEST_NAME}</strong>
                <span>
                  정서 인식, 스트레스 대처, 회복 탄력성 단서를 바탕으로 현재 나의 감정 조절 패턴을 살펴봅니다.
                </span>
              </span>
              <ArrowRight size={20} aria-hidden="true" />
            </a>
          </Link>
        </section>

        <p className="notice">{disclaimer}</p>
      </main>
    </>
  );
}
