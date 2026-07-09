import Head from "next/head";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BrainCircuit, Moon, Sparkles, Sun } from "lucide-react";
import { disclaimer, TEST_CATEGORY, TEST_NAME } from "../lib/data";

type ShimTestPageProps = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};

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
              감정, 관계, 회복 습관을 더 잘 이해하기 위한 심리테스트 영역입니다. 현재는 첫 테스트를
              공개했고, 이후 다양한 주제의 테스트를 추가할 예정입니다.
            </p>
          </div>
        </section>

        <section className="test-category" aria-label="테스트 목록">
          <div className="section-heading">
            <span>오픈 테스트</span>
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
