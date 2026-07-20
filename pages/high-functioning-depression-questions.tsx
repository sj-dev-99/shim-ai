import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowLeft, ArrowRight, BrainCircuit, Check, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { disclaimer } from "../lib/data";
import {
  HIGH_FUNCTIONING_DEPRESSION_TEST_NAME,
  depressionOptions,
  depressionQuestions
} from "../lib/highFunctioningDepressionTest";

export default function HighFunctioningDepressionQuestionsPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<number[]>(Array(depressionQuestions.length).fill(0));
  const [current, setCurrent] = useState(0);
  const selected = answers[current];
  const progress = Math.round(((current + 1) / depressionQuestions.length) * 100);

  const answeredCount = useMemo(
    () => answers.filter((answer) => answer > 0).length,
    [answers]
  );

  function chooseAnswer(value: number) {
    const nextAnswers = [...answers];
    nextAnswers[current] = value;
    setAnswers(nextAnswers);
  }

  function goNext() {
    if (current < depressionQuestions.length - 1) {
      setCurrent((item) => item + 1);
      return;
    }

    router.push(`/high-functioning-depression-result?answers=${answers.join(",")}`);
  }

  function reset() {
    setAnswers(Array(depressionQuestions.length).fill(0));
    setCurrent(0);
  }

  const canFinish = answeredCount === depressionQuestions.length;

  return (
    <>
      <Head>
        <title>테스트 | {HIGH_FUNCTIONING_DEPRESSION_TEST_NAME}</title>
      </Head>
      <main className="page-shell">
        <header className="topbar">
          <Link href="/high-functioning-depression">
            <a className="ghost-link">
              <ArrowLeft size={17} aria-hidden="true" />
              소개
            </a>
          </Link>
          <div className="brand">
            <span className="brand-mark">
              <BrainCircuit size={19} aria-hidden="true" />
            </span>
            우울감 점검
          </div>
        </header>

        <section className="progress-row" aria-label="진행률">
          <div className="progress-meta">
            <span>
              {current + 1} / {depressionQuestions.length}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </section>

        <section className="question-panel">
          <h1>{depressionQuestions[current].text}</h1>
          <div className="option-list" role="radiogroup" aria-label={`${current + 1}번 문항 보기`}>
            {depressionOptions.map((option) => {
              const isSelected = selected === option.value;

              return (
                <button
                  aria-checked={isSelected}
                  className="option-button"
                  data-value={option.value}
                  key={option.value}
                  onClick={() => chooseAnswer(option.value)}
                  role="radio"
                  type="button"
                >
                  <span className="option-dot" aria-hidden="true">
                    {isSelected ? <Check size={15} strokeWidth={3} /> : null}
                  </span>
                  <span>{option.label}</span>
                  {isSelected ? <span className="selected-label">선택됨</span> : null}
                </button>
              );
            })}
          </div>

          <div className="test-controls">
            <button
              aria-label="이전 문항"
              className="icon-button"
              disabled={current === 0}
              onClick={() => setCurrent((item) => item - 1)}
              type="button"
            >
              <ArrowLeft size={20} aria-hidden="true" />
            </button>
            <button aria-label="처음부터 다시" className="icon-button" onClick={reset} type="button">
              <RotateCcw size={19} aria-hidden="true" />
            </button>
            <button
              className="primary-button"
              disabled={current === depressionQuestions.length - 1 ? !canFinish : selected === 0}
              onClick={goNext}
              type="button"
            >
              {current === depressionQuestions.length - 1 ? "결과 보기" : "다음"}
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </section>

        <p className="notice">{disclaimer} 자해·죽음 생각이 있다면 테스트를 계속하기보다 즉시 한국생명의전화 1588-9191 또는 119에 연락하세요.</p>
      </main>
    </>
  );
}
