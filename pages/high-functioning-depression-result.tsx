import Head from "next/head";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BrainCircuit, Copy, Download, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { disclaimer } from "../lib/data";
import {
  HIGH_FUNCTIONING_DEPRESSION_PROFILE_KEY,
  HIGH_FUNCTIONING_DEPRESSION_TEST_NAME,
  HighFunctioningDepressionProfile,
  depressionQuestions,
  getDepressionResultByAnswers
} from "../lib/highFunctioningDepressionTest";
import { ANONYMOUS_NICKNAME } from "../lib/testProfile";

function parseAnswers(raw: string | string[] | undefined) {
  const text = Array.isArray(raw) ? raw[0] : raw;
  const values = typeof text === "string" ? text.split(",").map((item) => Number(item)) : [];
  if (values.length !== depressionQuestions.length) return Array(depressionQuestions.length).fill(3);
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

export default function HighFunctioningDepressionResultPage() {
  const router = useRouter();
  const answers = useMemo(() => parseAnswers(router.query.answers), [router.query.answers]);
  const { result, scores, total } = getDepressionResultByAnswers(answers);
  const [profile, setProfile] = useState<HighFunctioningDepressionProfile | null>(null);
  const [shareStatus, setShareStatus] = useState("");
  const visualScores = [
    { label: "숨은 우울감", value: scoreToStars(scores.maskedMood) },
    { label: "흥미 저하", value: scoreToStars(scores.anhedonia) },
    { label: "에너지 소진", value: scoreToStars(scores.fatigue) },
    { label: "자기압박", value: scoreToStars(scores.selfPressure) }
  ];

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(HIGH_FUNCTIONING_DEPRESSION_PROFILE_KEY);
      if (!raw) {
        setProfile({ nickname: ANONYMOUS_NICKNAME });
        return;
      }

      const parsed = JSON.parse(raw) as HighFunctioningDepressionProfile;
      setProfile({ nickname: parsed.nickname || ANONYMOUS_NICKNAME });
    } catch {
      setProfile({ nickname: ANONYMOUS_NICKNAME });
    }
  }, []);

  function shareText() {
    return `${profile?.nickname || ANONYMOUS_NICKNAME}님의 ${HIGH_FUNCTIONING_DEPRESSION_TEST_NAME} 결과는 '${result.label}'입니다. ${result.summary}`;
  }

  async function shareResult() {
    const url = window.location.href;
    const text = shareText();

    if (navigator.share) {
      await navigator.share({ title: HIGH_FUNCTIONING_DEPRESSION_TEST_NAME, text, url });
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
    const owner = escapeSvgText(`${profile?.nickname || ANONYMOUS_NICKNAME}님의 자기점검 보고서`);
    const label = escapeSvgText(result.label);
    const summary = escapeSvgText(result.summary);
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
        <rect width="1080" height="1080" fill="#f7fbf8"/>
        <rect x="90" y="90" width="900" height="900" rx="42" fill="#ffffff" stroke="#dbe7e2"/>
        <text x="140" y="180" fill="#13746a" font-size="34" font-family="Arial, sans-serif" font-weight="700">shim.ai</text>
        <text x="140" y="260" fill="#111827" font-size="42" font-family="Arial, sans-serif" font-weight="700">${HIGH_FUNCTIONING_DEPRESSION_TEST_NAME} 결과</text>
        <text x="140" y="335" fill="#b84d3d" font-size="30" font-family="Arial, sans-serif" font-weight="700">${owner}</text>
        <text x="140" y="430" fill="#111827" font-size="58" font-family="Arial, sans-serif" font-weight="700">${label}</text>
        <foreignObject x="140" y="485" width="800" height="220">
          <div xmlns="http://www.w3.org/1999/xhtml" style="color:#4f5f5a;font-size:30px;line-height:1.55;font-family:Arial,sans-serif;font-weight:700;">${summary}</div>
        </foreignObject>
        <text x="140" y="790" fill="#13746a" font-size="32" font-family="Arial, sans-serif" font-weight="700">숨은 우울감 ${stars(visualScores[0].value)}</text>
        <text x="140" y="850" fill="#13746a" font-size="32" font-family="Arial, sans-serif" font-weight="700">흥미 저하 ${stars(visualScores[1].value)}</text>
        <text x="140" y="910" fill="#13746a" font-size="32" font-family="Arial, sans-serif" font-weight="700">자기압박 ${stars(visualScores[3].value)}</text>
      </svg>
    `;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "shim-ai-high-functioning-depression-result.svg";
    link.click();
    URL.revokeObjectURL(link.href);
    setShareStatus("결과 이미지를 저장했습니다.");
  }

  return (
    <>
      <Head>
        <title>결과 | {HIGH_FUNCTIONING_DEPRESSION_TEST_NAME}</title>
      </Head>
      <main className="page-shell">
        <header className="topbar">
          <Link href="/high-functioning-depression-questions">
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
          <span className="result-owner">{profile?.nickname || ANONYMOUS_NICKNAME}님의 자기점검 보고서</span>
          <h1>{result.title}</h1>
          <p className="result-lead">{result.summary}</p>

          <div className="score-line">
            <span>총점</span>
            <span>{total}점</span>
          </div>

          <div className="result-method-note">
            이 리포트는 숨은 우울감, 흥미 저하, 에너지 소진, 자기압박 답변을 함께 살펴
            겉으로 기능을 유지하는 동안 마음 안쪽에 쌓인 신호를 정리한 결과입니다.
          </div>

          <div className="result-safety-panel">
            <strong>중요 안내</strong>
            <p>
              이 결과는 의학적 진단이 아닙니다. 우울감, 흥미 저하, 수면·식사 변화가 2주 이상 지속되거나
              자해·죽음 생각이 있다면 혼자 판단하지 말고 즉시 한국생명의전화 1588-9191 또는 119, 가까운 응급실이나 정신건강 전문가에게 도움을 요청하세요.
            </p>
          </div>

          <div className="report-summary-grid">
            <article>
              <strong>점수 해석</strong>
              <p>{result.scoreMeaning}</p>
            </article>
            <article>
              <strong>겉으로 보이지 않는 패턴</strong>
              <p>{result.hiddenPattern}</p>
            </article>
          </div>

          <div className="result-visual-panel" aria-label="우울감 자기점검 시각화">
            {visualScores.map((item) => (
              <div className="result-star-row" key={item.label}>
                <span>{stars(item.value)}</span>
                <strong>{item.label}</strong>
              </div>
            ))}
          </div>

          <div className="result-section">
            <h2>기능 유지 방식</h2>
            <p>{result.functioningPattern}</p>
          </div>

          <div className="result-section">
            <h2>내가 가진 힘</h2>
            <ul>
              {result.strengths.map((strength) => (
                <li key={strength}>{strength}</li>
              ))}
            </ul>
          </div>

          <div className="result-section">
            <h2>주의할 점</h2>
            <ul>
              {result.cautions.map((caution) => (
                <li key={caution}>{caution}</li>
              ))}
            </ul>
          </div>

          <div className="result-section">
            <h2>도움을 고려해야 하는 신호</h2>
            <ul>
              {result.supportSignals.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
          </div>

          <div className="result-section">
            <h2>오늘의 제안</h2>
            <p>{result.suggestion}</p>
          </div>

          <div className="result-section">
            <h2>7일 회복 점검</h2>
            <div className="report-chip-grid">
              {result.routine.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <div className="result-section">
            <h2>스스로에게 던져볼 질문</h2>
            <ol className="report-question-list">
              {result.reflectionQuestions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ol>
          </div>

          <section className="result-share-panel" aria-label="결과 공유">
            <div>
              <h2>결과 공유</h2>
              <p>나의 결과를 저장하거나 필요할 때 상담 전 참고 자료로 남겨보세요.</p>
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
            <Link href="/high-functioning-depression">
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
