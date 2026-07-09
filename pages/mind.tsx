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
              이 테스트는 정서 인식, 스트레스 대처 방식, 회복 탄력성, 행동 활성화 경향을 12문항으로 살펴봅니다.
              임상 진단이 아니라, 현재 나의 감정 조절 패턴을 더 구체적으로 이해하기 위한 자기보고형 체크입니다.
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
            <strong>정서 인식</strong>
            <span>내 감정을 알아차리고 언어화하는 정도를 확인합니다.</span>
          </div>
          <div className="insight-item">
            <strong>대처와 회복</strong>
            <span>스트레스 상황에서 사용하는 조절 방식과 회복 루틴을 살펴봅니다.</span>
          </div>
          <div className="insight-item">
            <strong>4가지 결과 유형</strong>
            <span>점수에 따라 감정 관찰형, 균형 조율형, 변화 실행형, 회복 추진형으로 정리합니다.</span>
          </div>
        </section>

        <p className="notice">{disclaimer}</p>
      </main>
    </>
  );
}
