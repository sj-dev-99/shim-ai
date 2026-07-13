import Head from "next/head";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  BrainCircuit,
  ClipboardCheck,
  Heart,
  Moon,
  Sparkles,
  Sun,
  Users
} from "lucide-react";
import { disclaimer, TEST_CATEGORY, TEST_NAME } from "../lib/data";

type ShimTestPageProps = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};

const tests = [
  {
    title: TEST_NAME,
    description: "정서 인식, 스트레스 대처, 회복 탄력성 단서를 바탕으로 현재 나의 감정 조절 패턴을 살펴봅니다.",
    href: "/mind",
    status: "진행 가능",
    icon: ClipboardCheck
  },
  {
    title: "연애유형 분석",
    description: "애착 방식, 표현 습관, 갈등 반응을 바탕으로 연애에서 반복되는 관계 패턴을 분석합니다.",
    href: "/love-type",
    status: "준비중",
    icon: Heart
  },
  {
    title: "이상형 분석",
    description: "끌림의 기준, 안정감을 느끼는 조건, 관계에서 중요하게 보는 가치를 정리합니다.",
    href: "/ideal-type",
    status: "준비중",
    icon: Sparkles
  },
  {
    title: "대인관계 분석",
    description: "친밀감, 거리두기, 거절과 부탁의 어려움처럼 사회적 관계에서 나타나는 나의 방식을 살펴봅니다.",
    href: "/relationship-test",
    status: "준비중",
    icon: Users
  },
  {
    title: "고지능 우울증 검사",
    description: "겉으로는 기능하지만 내부적으로 소진과 공허감을 겪는 패턴을 자기점검 관점에서 다룹니다.",
    href: "/high-functioning-depression",
    status: "준비중",
    icon: Brain
  }
];

export default function ShimTestPage({ theme, toggleTheme }: ShimTestPageProps) {
  const isDark = theme === "dark";

  return (
    <>
      <Head>
        <title>{TEST_CATEGORY} | shim.ai</title>
        <meta name="description" content="SHIM AI에서 제공하는 심리테스트 목록" />
      </Head>
      <main className="page-shell">
        <header className="topbar">
          <Link href="/">
            <a className="ghost-link">
              <ArrowLeft size={17} aria-hidden="true" />
              서비스 선택
            </a>
          </Link>
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
              {TEST_CATEGORY}
            </span>
            <h1>SHIM Test</h1>
            <p>
              감정, 관계, 연애, 사고 패턴을 더 잘 이해하기 위한 AI 심리검사 영역입니다.
              현재 공개된 테스트부터 시작하고, 준비 중인 검사는 베타 기간 중 순차적으로 열립니다.
            </p>
          </div>
        </section>

        <section className="test-category" aria-label="테스트 목록">
          <div className="section-heading">
            <span>Test Catalog</span>
            <h2>SHIM AI 심리검사 라인업</h2>
          </div>

          <div className="test-catalog-grid">
            {tests.map((test) => {
              const Icon = test.icon;
              const isOpen = test.status === "진행 가능";
              return (
                <Link href={test.href} key={test.title}>
                  <a className={`test-card ${isOpen ? "is-open" : "is-planned"}`}>
                    <span className="test-card-icon">
                      <Icon size={22} aria-hidden="true" />
                    </span>
                    <span className="test-card-body">
                      <span className="test-status">{test.status}</span>
                      <strong>{test.title}</strong>
                      <span>{test.description}</span>
                    </span>
                    <ArrowRight size={20} aria-hidden="true" />
                  </a>
                </Link>
              );
            })}
          </div>
        </section>

        <p className="notice">{disclaimer}</p>
      </main>
    </>
  );
}
