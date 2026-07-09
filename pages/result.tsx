import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowLeft, BrainCircuit, RotateCcw, Send, Share2, ThumbsDown, ThumbsUp } from "lucide-react";
import { FormEvent, useState } from "react";
import { submitBetaEvent } from "../lib/beta";
import { disclaimer, getResultByScore } from "../lib/data";

export default function ResultPage() {
  const router = useRouter();
  const rawScore = Number(router.query.score);
  const score = Number.isFinite(rawScore) && rawScore >= 12 && rawScore <= 60 ? rawScore : 0;
  const result = getResultByScore(score || 36);
  const hasScore = score > 0;
  const [selectedRating, setSelectedRating] = useState<"up" | "down" | null>(null);
  const [opinion, setOpinion] = useState("");
  const [opinionStatus, setOpinionStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

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

  return (
    <>
      <Head>
        <title>결과 | AI 마음결 테스트</title>
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
          <h1>{result.title}</h1>
          <p>{result.description}</p>

          <div className="score-line">
            <span>총점</span>
            <span>{hasScore ? `${score}점` : "예시 결과"}</span>
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
            <h2>오늘의 제안</h2>
            <p>{result.suggestion}</p>
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
                <ThumbsUp size={18} aria-hidden="true" />
                좋아요
              </button>
              <button
                aria-pressed={selectedRating === "down"}
                className="satisfaction-button"
                onClick={() => rate("down")}
                type="button"
              >
                <ThumbsDown size={18} aria-hidden="true" />
                아쉬워요
              </button>
            </div>
          </section>

          <section className="beta-result-panel" aria-label="테스트 종료 후 의견 작성">
            <h2>테스트 종료 후 의견</h2>
            <form className="opinion-form" onSubmit={submitOpinion}>
              <textarea
                className="beta-textarea"
                onChange={(event) => setOpinion(event.target.value)}
                placeholder="문항, 결과 설명, 디자인에서 개선되면 좋을 점을 알려주세요."
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

          <div className="actions">
            <Link href="/test">
              <a className="primary-button">
                다시 하기
                <RotateCcw size={18} aria-hidden="true" />
              </a>
            </Link>
            <Link href="/">
              <a className="secondary-button">
                공유 전 확인
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
