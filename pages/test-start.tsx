import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowLeft, ArrowRight, BrainCircuit, Clock3 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { disclaimer, TEST_NAME } from "../lib/data";
import { ANONYMOUS_NICKNAME, readTestProfile, saveTestProfile } from "../lib/testProfile";

export default function TestStartPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const profile = readTestProfile();
    if (profile?.nickname && profile.nickname !== ANONYMOUS_NICKNAME) setNickname(profile.nickname);
  }, []);

  function startTest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveTestProfile({ nickname });
    router.push("/test");
  }

  return (
    <>
      <Head>
        <title>테스트 시작 | {TEST_NAME}</title>
        <meta name="description" content={`${TEST_NAME} 시작 전 보고서 표시 이름 입력`} />
      </Head>
      <main className="page-shell start-page-shell">
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
            shim.ai
          </div>
        </header>

        <section className="test-start-page" aria-label="테스트 시작 전 정보 입력">
          <div>
            <span className="start-brand">shim.ai</span>
            <h1>{TEST_NAME}</h1>
            <p>
              결과 보고서에 표시할 이름을 입력할 수 있습니다. 입력하지 않으면 익명으로 테스트가 진행됩니다.
            </p>
          </div>

          <form className="test-start-form" onSubmit={startTest}>
            <label htmlFor="test-nickname">보고서에 표시할 이름</label>
            <input
              autoComplete="nickname"
              id="test-nickname"
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
            이 검사는 성별에 따라 결과를 다르게 해석하지 않아 성별을 묻지 않습니다.
          </div>
        </section>

        <p className="notice">{disclaimer}</p>
      </main>
    </>
  );
}
