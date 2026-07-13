import Head from "next/head";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BrainCircuit, Copy, Download, RotateCcw, Share2 } from "lucide-react";
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

function stars(value: number) {
  return "★".repeat(value) + "☆".repeat(5 - value);
}

function scoreToStars(value: number) {
  return Math.max(1, Math.min(5, Math.round(value / 3)));
}

function escapeSvgText(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export default function LoveResultPage() {
  const router = useRouter();
  const answers = useMemo(() => parseAnswers(router.query.answers), [router.query.answers]);
  const { result, scores } = getLoveResultByAnswers(answers);
  const [profile, setProfile] = useState<LoveProfile | null>(null);
  const [shareStatus, setShareStatus] = useState("");
  const visualScores = [
    { label: "안정감", value: scoreToStars(scores.stability) },
    { label: "표현력", value: scoreToStars(scores.expression) },
    { label: "관계균형", value: scoreToStars(scores.autonomy) },
    { label: "설렘감도", value: scoreToStars(scores.spark) }
  ];

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

  function shareText() {
    return `${profile?.nickname || ANONYMOUS_NICKNAME}님의 ${LOVE_TEST_NAME} 결과는 '${result.label}'입니다. ${result.summary}`;
  }

  async function shareResult() {
    const url = window.location.href;
    const text = shareText();

    if (navigator.share) {
      await navigator.share({ title: LOVE_TEST_NAME, text, url });
      setShareStatus("공유창을 열었습니다.");
      return;
    }

    await navigator.clipboard.writeText(`${text}\n${url}`);
    setShareStatus("결과 링크를 복사했습니다.");
  }

  async function copyResultLink() {
    await navigator.clipboard.writeText(window.location.href);
    setShareStatus("링크를 복사했습니다.");
  }

  function saveResultImage() {
    const owner = escapeSvgText(`${profile?.nickname || ANONYMOUS_NICKNAME}님의 연애 보고서`);
    const label = escapeSvgText(result.label);
    const summary = escapeSvgText(result.summary);
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
        <rect width="1080" height="1080" fill="#f7fbf8"/>
        <rect x="90" y="90" width="900" height="900" rx="42" fill="#ffffff" stroke="#dbe7e2"/>
        <text x="140" y="180" fill="#13746a" font-size="34" font-family="Arial, sans-serif" font-weight="700">shim.ai</text>
        <text x="140" y="260" fill="#111827" font-size="42" font-family="Arial, sans-serif" font-weight="700">${LOVE_TEST_NAME} 결과</text>
        <text x="140" y="335" fill="#b84d3d" font-size="30" font-family="Arial, sans-serif" font-weight="700">${owner}</text>
        <text x="140" y="430" fill="#111827" font-size="58" font-family="Arial, sans-serif" font-weight="700">${label}</text>
        <foreignObject x="140" y="485" width="800" height="220">
          <div xmlns="http://www.w3.org/1999/xhtml" style="color:#4f5f5a;font-size:30px;line-height:1.55;font-family:Arial,sans-serif;font-weight:700;">${summary}</div>
        </foreignObject>
        <text x="140" y="790" fill="#13746a" font-size="32" font-family="Arial, sans-serif" font-weight="700">안정감 ${stars(visualScores[0].value)}</text>
        <text x="140" y="850" fill="#13746a" font-size="32" font-family="Arial, sans-serif" font-weight="700">표현력 ${stars(visualScores[1].value)}</text>
        <text x="140" y="910" fill="#13746a" font-size="32" font-family="Arial, sans-serif" font-weight="700">관계균형 ${stars(visualScores[2].value)}</text>
      </svg>
    `;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "shim-ai-love-result.svg";
    link.click();
    URL.revokeObjectURL(link.href);
    setShareStatus("결과 이미지를 저장했습니다.");
  }

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
          <p className="result-lead">{result.summary}</p>

          <div className="love-score-grid report-score-grid" aria-label="연애 성향 점수">
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

          <div className="result-visual-panel" aria-label="연애 성향 시각화">
            {visualScores.map((item) => (
              <div className="result-star-row" key={item.label}>
                <span>{stars(item.value)}</span>
                <strong>{item.label}</strong>
              </div>
            ))}
          </div>

          <div className="report-summary-grid">
            <article>
              <strong>관계 패턴</strong>
              <p>{result.relationshipPattern}</p>
            </article>
            <article>
              <strong>끌리는 이상형</strong>
              <p>{result.idealType}</p>
            </article>
          </div>

          <div className="result-section">
            <h2>관계에서 필요한 정서적 조건</h2>
            <ul>
              {result.emotionalNeeds.map((need) => (
                <li key={need}>{need}</li>
              ))}
            </ul>
          </div>

          <div className="result-section">
            <h2>잘 맞는 사람에게 보이는 신호</h2>
            <ul>
              {result.compatibleSignals.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
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

          <div className="result-section">
            <h2>추천 데이트 방식</h2>
            <div className="report-chip-grid">
              {result.dateGuide.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <div className="result-section">
            <h2>상대에게 설명하기 좋은 문장</h2>
            <ol className="report-question-list">
              {result.conversationTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ol>
          </div>

          <section className="result-share-panel" aria-label="결과 공유">
            <div>
              <h2>결과 공유</h2>
              <p>나의 결과를 저장하거나 친구에게 가볍게 공유해보세요.</p>
            </div>
            <div className="share-action-grid">
              <button className="secondary-button" onClick={shareResult} type="button">
                <Share2 size={17} aria-hidden="true" />
                결과 공유하기
              </button>
              <button className="secondary-button" onClick={copyResultLink} type="button">
                <Copy size={17} aria-hidden="true" />
                링크 복사
              </button>
              <button className="secondary-button" onClick={saveResultImage} type="button">
                <Download size={17} aria-hidden="true" />
                이미지 저장
              </button>
            </div>
            {shareStatus ? <p className="share-status">{shareStatus}</p> : null}
          </section>

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
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            </Link>
          </div>
        </section>

        <p className="notice">{disclaimer}</p>
      </main>
    </>
  );
}
