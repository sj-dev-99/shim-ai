import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowLeft, BrainCircuit, Copy, Download, Instagram, MessageCircle, RotateCcw, Send, Share2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { submitBetaEvent } from "../lib/beta";
import { disclaimer, getResultByScore, TEST_NAME } from "../lib/data";
import { readTestProfile, TestProfile } from "../lib/testProfile";

const resultVisuals = {
  observer: [
    { label: "자기이해", value: 4 },
    { label: "감정관찰", value: 5 },
    { label: "실행력", value: 3 }
  ],
  balancer: [
    { label: "자기이해", value: 5 },
    { label: "균형감", value: 5 },
    { label: "회복력", value: 4 }
  ],
  starter: [
    { label: "문제해결", value: 5 },
    { label: "실행력", value: 5 },
    { label: "회복력", value: 4 }
  ],
  driver: [
    { label: "자기이해", value: 5 },
    { label: "문제해결", value: 5 },
    { label: "회복력", value: 5 }
  ]
};

function stars(value: number) {
  return "★".repeat(value) + "☆".repeat(5 - value);
}

function escapeSvgText(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export default function ResultPage() {
  const router = useRouter();
  const rawScore = Number(router.query.score);
  const score = Number.isFinite(rawScore) && rawScore >= 12 && rawScore <= 60 ? rawScore : 0;
  const result = getResultByScore(score || 36);
  const hasScore = score > 0;
  const [selectedRating, setSelectedRating] = useState<"up" | "down" | null>(null);
  const [opinion, setOpinion] = useState("");
  const [opinionStatus, setOpinionStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [profile, setProfile] = useState<TestProfile | null>(null);
  const [shareStatus, setShareStatus] = useState("");
  const visualScores = resultVisuals[result.id as keyof typeof resultVisuals] || resultVisuals.balancer;

  useEffect(() => {
    setProfile(readTestProfile());
  }, []);

  async function rate(rating: "up" | "down") {
    setSelectedRating(rating);
    await submitBetaEvent({
      eventType: "satisfaction",
      rating,
      score,
      resultType: result.label
    });
  }

  async function submitOpinion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!opinion.trim()) return;

    setOpinionStatus("sending");
    const ok = await submitBetaEvent({
      eventType: "result_opinion",
      message: opinion.trim(),
      score,
      resultType: result.label
    });

    if (ok) {
      setOpinionStatus("sent");
      setOpinion("");
      return;
    }

    setOpinionStatus("error");
  }

  function shareText() {
    return `${profile?.nickname ? `${profile.nickname}님의 ` : ""}${TEST_NAME} 결과는 '${result.label}'입니다. ${result.coreMessage}`;
  }

  async function shareResult() {
    const url = window.location.href;
    const text = shareText();

    if (navigator.share) {
      await navigator.share({ title: TEST_NAME, text, url });
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
    const title = escapeSvgText(`${TEST_NAME} 결과`);
    const owner = escapeSvgText(profile?.nickname ? `${profile.nickname}님의 결과` : "나의 결과");
    const label = escapeSvgText(result.label);
    const message = escapeSvgText(result.coreMessage);
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
        <rect width="1080" height="1080" fill="#f7fbf8"/>
        <rect x="90" y="90" width="900" height="900" rx="42" fill="#ffffff" stroke="#dbe7e2"/>
        <text x="140" y="180" fill="#13746a" font-size="34" font-family="Arial, sans-serif" font-weight="700">shim.ai</text>
        <text x="140" y="260" fill="#111827" font-size="42" font-family="Arial, sans-serif" font-weight="700">${title}</text>
        <text x="140" y="335" fill="#b84d3d" font-size="30" font-family="Arial, sans-serif" font-weight="700">${owner}</text>
        <text x="140" y="430" fill="#111827" font-size="58" font-family="Arial, sans-serif" font-weight="700">${label}</text>
        <foreignObject x="140" y="485" width="800" height="220">
          <div xmlns="http://www.w3.org/1999/xhtml" style="color:#4f5f5a;font-size:30px;line-height:1.55;font-family:Arial,sans-serif;font-weight:700;">${message}</div>
        </foreignObject>
        <text x="140" y="790" fill="#13746a" font-size="32" font-family="Arial, sans-serif" font-weight="700">자기이해 ${stars(visualScores[0].value)}</text>
        <text x="140" y="850" fill="#13746a" font-size="32" font-family="Arial, sans-serif" font-weight="700">문제해결 ${stars(visualScores[1].value)}</text>
        <text x="140" y="910" fill="#13746a" font-size="32" font-family="Arial, sans-serif" font-weight="700">회복력 ${stars(visualScores[2].value)}</text>
      </svg>
    `;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "shim-ai-result.svg";
    link.click();
    URL.revokeObjectURL(link.href);
    setShareStatus("결과 이미지를 저장했습니다.");
  }

  async function openSocialShare(target: "kakao" | "instagram") {
    await navigator.clipboard.writeText(`${shareText()}\n${window.location.href}`);
    if (target === "kakao") {
      window.open("https://sharer.kakao.com/talk/friends/picker/link", "_blank", "noopener,noreferrer");
      setShareStatus("공유 문구를 복사하고 카카오 공유 화면을 열었습니다.");
      return;
    }

    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
    setShareStatus("공유 문구를 복사했습니다. 인스타그램에 붙여넣어 공유해보세요.");
  }

  return (
    <>
      <Head>
        <title>결과 | {TEST_NAME}</title>
      </Head>
      <main className="page-shell">
        <header className="topbar">
          <Link href="/test">
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
          {profile?.nickname ? <span className="result-owner">{profile.nickname}님의 결과 보고서</span> : null}
          <h1>{result.title}</h1>
          <p className="result-lead">{result.coreMessage}</p>

          <div className="score-line">
            <span>총점</span>
            <span>{hasScore ? `${score}점` : "예시 결과"}</span>
          </div>

          <div className="report-summary-grid">
            <article>
              <strong>점수 해석</strong>
              <p>{result.scoreMeaning}</p>
            </article>
            <article>
              <strong>심리적 경향</strong>
              <p>{result.description}</p>
            </article>
          </div>

          <div className="result-visual-panel" aria-label="결과 성향 시각화">
            {visualScores.map((item) => (
              <div className="result-star-row" key={item.label}>
                <span>{stars(item.value)}</span>
                <strong>{item.label}</strong>
              </div>
            ))}
          </div>

          <div className="result-section">
            <h2>나에게 자주 나타나는 패턴</h2>
            <ul>
              {result.traits.map((trait) => (
                <li key={trait}>{trait}</li>
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
            <h2>주의하면 좋은 지점</h2>
            <ul>
              {result.cautions.map((caution) => (
                <li key={caution}>{caution}</li>
              ))}
            </ul>
          </div>

          <div className="result-section">
            <h2>오늘의 제안</h2>
            <p>{result.suggestion}</p>
          </div>

          <div className="result-section">
            <h2>7일 회복 루틴</h2>
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

          <section className="beta-result-panel" aria-label="AI 답변 만족도">
            <div>
              <h2>AI 답변 만족도</h2>
              <p>결과 설명이 도움이 되었나요?</p>
            </div>
            <div className="satisfaction-row">
              <button
                aria-pressed={selectedRating === "up"}
                className="satisfaction-button"
                onClick={() => rate("up")}
                type="button"
              >
                👍 도움이 되었어요
              </button>
              <button
                aria-pressed={selectedRating === "down"}
                className="satisfaction-button"
                onClick={() => rate("down")}
                type="button"
              >
                👎 조금 아쉬웠어요
              </button>
            </div>
          </section>

          <section className="beta-result-panel" aria-label="테스트 종료 후 의견 작성">
            <h2>테스트 종료 후 의견</h2>
            <form className="opinion-form" onSubmit={submitOpinion}>
              <textarea
                className="beta-textarea"
                onChange={(event) => setOpinion(event.target.value)}
                placeholder="어떤 점이 가장 좋았나요? 아쉬웠던 점이나 추가되었으면 하는 기능이 있다면 자유롭게 알려주세요."
                rows={4}
                value={opinion}
              />
              <button className="primary-button beta-submit" disabled={!opinion.trim() || opinionStatus === "sending"} type="submit">
                <Send size={16} aria-hidden="true" />
                {opinionStatus === "sending" ? "전송 중" : "의견 보내기"}
              </button>
              {opinionStatus === "sent" ? <p className="beta-status">의견이 전송되었습니다.</p> : null}
              {opinionStatus === "error" ? <p className="beta-status">전송에 실패했습니다. 잠시 후 다시 시도해주세요.</p> : null}
            </form>
          </section>

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
              <button className="secondary-button" onClick={() => openSocialShare("kakao")} type="button">
                <MessageCircle size={17} aria-hidden="true" />
                카카오
              </button>
              <button className="secondary-button" onClick={copyResultLink} type="button">
                <Copy size={17} aria-hidden="true" />
                링크 복사
              </button>
              <button className="secondary-button" onClick={saveResultImage} type="button">
                <Download size={17} aria-hidden="true" />
                이미지 저장
              </button>
              <button className="secondary-button" onClick={() => openSocialShare("instagram")} type="button">
                <Instagram size={17} aria-hidden="true" />
                인스타 스토리
              </button>
            </div>
            {shareStatus ? <p className="share-status">{shareStatus}</p> : null}
          </section>

          <div className="actions">
            <Link href="/test">
              <a className="primary-button">
                다시 하기
                <RotateCcw size={18} aria-hidden="true" />
              </a>
            </Link>
            <Link href="/">
              <a className="secondary-button">
                다른 기능 보기
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
