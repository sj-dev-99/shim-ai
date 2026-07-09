import Head from "next/head";
import Link from "next/link";
import { ArrowRight, BrainCircuit, Moon, Sparkles, Sun } from "lucide-react";
import { disclaimer } from "../lib/data";

type HomePageProps = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};

export default function HomePage({ theme, toggleTheme }: HomePageProps) {
  const isDark = theme === "dark";

  return (
    <>
      <Head>
        <title>shim.ai</title>
        <meta name="description" content="AI 심리테스트를 고르고 시작하는 자기이해 테스트 허브" />
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
              AI 자기이해 테스트 허브
            </span>
            <h1>shim.ai</h1>
            <p>
              지금은 하나의 테스트로 시작하지만, 앞으로 다양한 심리테스트와 자기이해 기능을
              이곳에서 고를 수 있게 확장할 예정입니다.
            </p>
          </div>
        </section>

        <section className="test-catalog" aria-label="테스트 선택">
          <Link href="/mind">
            <a className="test-card">
              <span className="test-card-icon">
                <BrainCircuit size={22} aria-hidden="true" />
              </span>
              <span className="test-card-body">
                <strong>AI 마음결 테스트</strong>
                <span>12문항으로 감정 인식, 적응 방식, 회복 습관을 살펴봅니다.</span>
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
