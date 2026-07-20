import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowLeft, ArrowRight, Brain, BrainCircuit, Clock3 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { disclaimer } from "../lib/data";
import {
  HIGH_FUNCTIONING_DEPRESSION_PROFILE_KEY,
  HIGH_FUNCTIONING_DEPRESSION_TEST_NAME
} from "../lib/highFunctioningDepressionTest";
import { ANONYMOUS_NICKNAME } from "../lib/testProfile";

export default function HighFunctioningDepressionStartPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(HIGH_FUNCTIONING_DEPRESSION_PROFILE_KEY);
      if (!raw) return;

      const profile = JSON.parse(raw) as { nickname?: string };
      if (profile.nickname && profile.nickname !== ANONYMOUS_NICKNAME) {
        setNickname(profile.nickname);
      }
    } catch {
      // Start form still works when storage is unavailable.
    }
  }, []);

  function startTest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      window.localStorage.setItem(
        HIGH_FUNCTIONING_DEPRESSION_PROFILE_KEY,
        JSON.stringify({
          nickname: nickname.trim() || ANONYMOUS_NICKNAME
        })
      );
    } catch {
      // Navigation can continue even when storage is unavailable.
    }

    router.push("/high-functioning-depression-questions");
  }

  return (
    <>
      <Head>
        <title>{HIGH_FUNCTIONING_DEPRESSION_TEST_NAME} | shim.ai</title>
        <meta name="description" content="기능하는 일상 뒤의 우울감, 소진, 흥미 저하 신호를 점검하는 SHIM AI 심리테스트" />
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
        </header>

        <section className="hero">
          <div>
            <span className="eyebrow">
              <Brain size={15} aria-hidden="true" />
              Hidden Burnout Check
            </span>
            <h1>{HIGH_FUNCTIONING_DEPRESSION_TEST_NAME}</h1>
            <p>
              겉으로는 잘 지내는 것 같지만 마음속 피로와 흥미 저하가 쌓이고 있는지 조용히 점검해보세요.
              결과에서는 최근 신호와 도움을 고려해야 할 지점을 정리해드립니다.
            </p>
            <div className="test-summary-pills" aria-label="검사 요약">
              <span>12문항</span>
              <span>약 3분</span>
              <span>자가점검 리포트</span>
            </div>

            <form className="test-start-form" onSubmit={startTest}>
              <label htmlFor="depression-nickname">보고서에 표시할 이름</label>
              <input
                autoComplete="nickname"
                id="depression-nickname"
                maxLength={24}
                onChange={(event) => setNickname(event.target.value)}
                placeholder="닉네임을 입력하세요"
                type="text"
                value={nickname}
              />
              <span>입력하지 않으면 익명으로 진행됩니다.</span>

              <button className="primary-button test-start-submit" type="submit">
                검사 시작하기
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </form>

            <div className="test-start-note">
              <Clock3 size={16} aria-hidden="true" />
              약 3분, 12문항으로 구성된 베타 테스트입니다. 최근 2주 이상의 변화가 있다면 전문가와 상담을 권장합니다.
            </div>
          </div>
        </section>

        <p className="notice">{disclaimer} 위기 상황이거나 자해·죽음 생각이 있다면 즉시 한국생명의전화 1588-9191 또는 119에 도움을 요청하세요.</p>
      </main>
    </>
  );
}
