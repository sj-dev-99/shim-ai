import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowLeft, ArrowRight, BrainCircuit, Clock3, Users } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { disclaimer } from "../lib/data";
import { RELATIONSHIP_PROFILE_KEY, RELATIONSHIP_TEST_NAME } from "../lib/relationshipTest";
import { ANONYMOUS_NICKNAME } from "../lib/testProfile";

export default function RelationshipTestStartPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(RELATIONSHIP_PROFILE_KEY);
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
        RELATIONSHIP_PROFILE_KEY,
        JSON.stringify({
          nickname: nickname.trim() || ANONYMOUS_NICKNAME
        })
      );
    } catch {
      // Navigation can continue even when storage is unavailable.
    }

    router.push("/relationship-questions");
  }

  return (
    <>
      <Head>
        <title>{RELATIONSHIP_TEST_NAME} | shim.ai</title>
        <meta name="description" content="관계 거리감, 표현 방식, 경계감, 갈등 대처를 분석하는 SHIM AI 심리테스트" />
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
              <Users size={15} aria-hidden="true" />
              Relationship Pattern Test
            </span>
            <h1>{RELATIONSHIP_TEST_NAME}</h1>
            <p>
              사람들과 가까워지는 방식, 감정을 표현하는 습관, 나의 경계와 갈등 대처 방식을 함께 살펴봅니다.
              관계에서 반복되는 편안함과 어려움을 자기이해 언어로 정리해보세요.
            </p>

            <form className="test-start-form" onSubmit={startTest}>
              <label htmlFor="relationship-nickname">보고서에 표시할 이름</label>
              <input
                autoComplete="nickname"
                id="relationship-nickname"
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
              약 3분, 12문항으로 구성된 베타 테스트입니다. 성별에 따라 결과를 다르게 해석하지 않아 성별은 묻지 않습니다.
            </div>
          </div>
        </section>

        <section className="insight-band" aria-label="검사 구성">
          <div className="insight-item">
            <strong>거리감</strong>
            <span>가까움과 독립감 사이에서 편안한 관계 리듬을 봅니다.</span>
          </div>
          <div className="insight-item">
            <strong>표현 방식</strong>
            <span>감정, 부탁, 서운함을 어떻게 말로 풀어내는지 살펴봅니다.</span>
          </div>
          <div className="insight-item">
            <strong>갈등 대처</strong>
            <span>불편한 상황을 피하는지, 조정하는지, 회복하는지 분석합니다.</span>
          </div>
        </section>

        <p className="notice">{disclaimer}</p>
      </main>
    </>
  );
}
