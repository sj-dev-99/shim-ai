import Head from "next/head";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BrainCircuit, Clock3, Moon, Sparkles, Sun } from "lucide-react";
import { disclaimer, TEST_CATEGORY, TEST_NAME } from "../lib/data";

type MindPageProps = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};

export default function MindPage({ theme, toggleTheme }: MindPageProps) {
  const isDark = theme === "dark";

  return (
    <>
      <Head>
        <title>{TEST_NAME} | shim.ai</title>
        <meta
          name="description"
          content="감정 인식, 스트레스 대처, 회복 탄력성 단서를 바탕으로 현재 감정 조절 패턴을 살펴보는 심리테스트"
        />
      </Head>
      <main className="page-shell">
        <header className="topbar">
          <Link href="/shim-test">
            <a className="ghost-link">
              <ArrowLeft size={17} aria-hidden="true" />
              SHIM Test
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

        <section className="hero">
          <div>
            <span className="eyebrow">
              <Sparkles size={15} aria-hidden="true" />
              {TEST_CATEGORY}
            </span>
            <h1>{TEST_NAME}</h1>
            <p>
              지금 내 감정을 알아차리는 방식과 회복 리듬을 가볍게 확인해보세요.
              결과에서는 감정 조절 패턴과 오늘 시도해볼 회복 루틴을 정리해드립니다.
            </p>
            <div className="test-summary-pills" aria-label="테스트 요약">
              <span>12문항</span>
              <span>약 2분</span>
              <span>자기이해 리포트</span>
            </div>
            <div className="actions">
              <Link href="/test-start">
                <a className="primary-button">
                  테스트 시작
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
              </Link>
              <span className="secondary-button">
                <Clock3 size={18} aria-hidden="true" /> 약 2분
              </span>
            </div>
          </div>
        </section>

        <p className="notice">{disclaimer}</p>
      </main>
    </>
  );
}
