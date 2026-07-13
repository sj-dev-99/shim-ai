import Head from "next/head";
import Link from "next/link";
import { ArrowLeft, BrainCircuit, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { disclaimer } from "../lib/data";
import {
  LOVE_PROFILE_KEY,
  LOVE_TEST_NAME,
  LoveProfile,
  getLoveResultByAnswers,
  loveQuestions
} from "../lib/loveTest";
import { ANONYMOUS_NICKNAME } from "../lib/testProfile";

function parseAnswers(raw: string | string[] | undefined) {
  const text = Array.isArray(raw) ? raw[0] : raw;
  const values = typeof text === "string" ? text.split(",").map((item) => Number(item)) : [];
  if (values.length !== loveQuestions.length) return Array(loveQuestions.length).fill(3);
  return values.map((value) => (Number.isFinite(value) && value >= 1 && value <= 5 ? value : 3));
}

export default function LoveResultPage() {
  const router = useRouter();
  const answers = useMemo(() => parseAnswers(router.query.answers), [router.query.answers]);
  const { result, scores } = getLoveResultByAnswers(answers);
  const [profile, setProfile] = useState<LoveProfile | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LOVE_PROFILE_KEY);
      if (!raw) {
        setProfile({ nickname: ANONYMOUS_NICKNAME, gender: "female" });
        return;
      }

      const parsed = JSON.parse(raw) as LoveProfile;
      setProfile({
        nickname: parsed.nickname || ANONYMOUS_NICKNAME,
        gender: parsed.gender === "male" ? "male" : "female"
      });
    } catch {
      setProfile({ nickname: ANONYMOUS_NICKNAME, gender: "female" });
    }
  }, []);

  return (
    <>
      <Head>
        <title>결과 | {LOVE_TEST_NAME}</title>
      </Head>
      <main className="page-shell">
        <header className="topbar">
          <Link href="/love-test">
            <a className="ghost-link">
              <ArrowLeft size={17} aria-hidden="true" />
              테스트
            </a>
          </Link>
          <div className="brand">
            <span className="brand-mark">
              <BrainCircuit size={19} aria-hidden="true" />
            </span>
            shim.ai
          </div>
        </header>

        <section className="result-card">
          <span className="result-type">{result.label}</span>
          <span className="result-owner">{profile?.nickname || ANONYMOUS_NICKNAME}님의 연애 보고서</span>
          <h1>{result.title}</h1>
          <p>{result.summary}</p>

          <div className="result-section">
            <h2>끌리는 이상형</h2>
            <p>{result.idealType}</p>
          </div>

          <div className="result-section">
            <h2>대표 강점</h2>
            <ul>
              {result.strengths.map((strength) => (
                <li key={strength}>{strength}</li>
              ))}
            </ul>
          </div>

          <div className="result-section">
            <h2>주의할 점</h2>
            <p>{result.watchPoint}</p>
          </div>

          <div className="result-section">
            <h2>관계 제안</h2>
            <p>{result.suggestion}</p>
          </div>

          <div className="love-score-grid" aria-label="연애 성향 점수">
            <div>
              <strong>{scores.stability}</strong>
              <span>안정감</span>
            </div>
            <div>
              <strong>{scores.expression}</strong>
              <span>표현</span>
            </div>
            <div>
              <strong>{scores.autonomy}</strong>
              <span>자율성</span>
            </div>
            <div>
              <strong>{scores.spark}</strong>
              <span>설렘</span>
            </div>
          </div>

          <div className="actions">
            <Link href="/love-type">
              <a className="primary-button">
                다시 하기
                <RotateCcw size={18} aria-hidden="true" />
              </a>
            </Link>
            <Link href="/shim-test">
              <a className="secondary-button">
                다른 검사 보기
                <Share2 size={18} aria-hidden="true" />
              </a>
            </Link>
          </div>
        </section>

        <p className="notice">{disclaimer}</p>
      </main>
    </>
  );
}
