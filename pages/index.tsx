import Head from "next/head";
import Link from "next/link";
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
  "연애유형 분석",
  "이상형 분석",
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

export default function HomePage({ theme, toggleTheme }: HomePageProps) {
  const isDark = theme === "dark";

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
            <p>
              SHIM AI는 감정, 관계, 사고 패턴을 검사하고 해석해 스스로를 더 잘 이해하도록 돕는
              베타 서비스입니다. 지금은 심리검사를 중심으로 시작하고, 대화와 리포트, 관리 루틴으로
              확장하고 있습니다.
            </p>
            <div className="actions">
              <Link href="/shim-test">
                <a className="primary-button">
                  검사 라인업 보기
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
              </Link>
              <Link href="/mind">
                <a className="secondary-button">
                  바로 테스트 시작
                  <ClipboardCheck size={18} aria-hidden="true" />
                </a>
              </Link>
            </div>
          </div>
          <aside className="home-hero-panel" aria-label="현재 준비 중인 심리검사">
            <span className="panel-label">SHIM Test Catalog</span>
            <strong>현재 공개 및 준비 중인 검사</strong>
            <div className="hero-test-list">
              {featuredTests.map((test, index) => (
                <span key={test}>
                  <b>{String(index + 1).padStart(2, "0")}</b>
                  {test}
                </span>
              ))}
            </div>
          </aside>
        </section>

        <section className="trust-strip" aria-label="SHIM AI 운영 기준">
          <div>
            <strong>Beta v0.1.3</strong>
            <span>실제 피드백 기반 개선 중</span>
          </div>
          <div>
            <strong>5개</strong>
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

        <section className="service-map" aria-label="SHIM AI 서비스 선택">
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

        <section className="featured-path" aria-label="추천 시작 경로">
          <div>
            <span className="eyebrow">
              <Heart size={15} aria-hidden="true" />
              Recommended
            </span>
            <h2>처음 방문했다면, 감정·회복 유형 테스트부터 시작해보세요.</h2>
            <p>
              현재 공개된 테스트는 감정 인식, 스트레스 대처, 회복 탄력성 단서를 바탕으로
              나의 정서 조절 패턴을 살펴볼 수 있게 설계되어 있습니다.
            </p>
          </div>
          <Link href="/mind">
            <a className="primary-button">
              시작하기
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </Link>
        </section>

        <p className="notice">{disclaimer}</p>
      </main>
    </>
  );
}
