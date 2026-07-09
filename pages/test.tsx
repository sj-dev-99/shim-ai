import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowLeft, ArrowRight, BrainCircuit, Check, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { disclaimer, options, questions, TEST_NAME } from "../lib/data";

export default function TestPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(0));
  const [current, setCurrent] = useState(0);
  const selected = answers[current];
  const progress = Math.round(((current + 1) / questions.length) * 100);

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
    if (current < questions.length - 1) {
      setCurrent((item) => item + 1);
      return;
    }

    const score = answers.reduce((sum, answer) => sum + answer, 0);
    router.push(`/result?score=${score}`);
  }

  function reset() {
    setAnswers(Array(questions.length).fill(0));
    setCurrent(0);
  }

  const canFinish = answeredCount === questions.length;

  return (
    <>
      <Head>
        <title>테스트 | {TEST_NAME}</title>
      </Head>
      <main className="page-shell">
        <header className="topbar">
          <Link href="/mind">
            <a className="ghost-link">
              <ArrowLeft size={17} aria-hidden="true" />
              소개
            </a>
          </Link>
          <div className="brand">
            <span className="brand-mark">
              <BrainCircuit size={19} aria-hidden="true" />
            </span>
            테스트
          </div>
        </header>

        <section className="progress-row" aria-label="진행률">
          <div className="progress-meta">
            <span>
              {current + 1} / {questions.length}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </section>

        <section className="question-panel">
          <h1>{questions[current]}</h1>
          <div className="option-list" role="radiogroup" aria-label={`${current + 1}번 문항 보기`}>
            {options.map((option) => {
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
              disabled={current === questions.length - 1 ? !canFinish : selected === 0}
              onClick={goNext}
              type="button"
            >
              {current === questions.length - 1 ? "결과 보기" : "다음"}
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </section>

        <p className="notice">{disclaimer}</p>
      </main>
    </>
  );
}
