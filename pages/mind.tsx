import Head from "next/head";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BrainCircuit, Clock3, Moon, Sparkles, Sun } from "lucide-react";
import { disclaimer } from "../lib/data";

type MindPageProps = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};

export default function MindPage({ theme, toggleTheme }: MindPageProps) {
  const isDark = theme === "dark";

  return (
    <>
      <Head>
        <title>AI 마음결 테스트 | shim.ai</title>
        <meta name="description" content="12문항으로 살펴보는 자기이해용 심리테스트" />
      </Head>
      <main className="page-shell">
        <header className="topbar">
          <Link href="/">
            <a className="ghost-link">
              <ArrowLeft size={17} aria-hidden="true" />
              테스트 선택
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
              12문항 자기이해 체크
            </span>
            <h1>AI 마음결 테스트</h1>
            <p>
              최근의 감정 인식, 적응 방식, 회복 습관을 바탕으로 지금 나에게 가까운 마음의
              패턴을 살펴보세요.
            </p>
            <div className="actions">
              <Link href="/test">
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

        <section className="insight-band" aria-label="테스트 구성">
          <div className="insight-item">
            <strong>5지선다 응답</strong>
            <span>매우 아니다부터 매우 그렇다까지 자연스럽게 고르면 됩니다.</span>
          </div>
          <div className="insight-item">
            <strong>4가지 결과 유형</strong>
            <span>총점에 따라 현재 마음 패턴을 네 가지 유형으로 정리합니다.</span>
          </div>
          <div className="insight-item">
            <strong>모바일 최적화</strong>
            <span>짧은 이동 시간에도 편하게 완료할 수 있도록 구성했습니다.</span>
          </div>
        </section>

        <p className="notice">{disclaimer}</p>
      </main>
    </>
  );
}
