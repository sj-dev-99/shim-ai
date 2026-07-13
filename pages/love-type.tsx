import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowLeft, ArrowRight, BrainCircuit, Clock3, Heart, Sparkles } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { disclaimer } from "../lib/data";
import { LOVE_PROFILE_KEY, LOVE_TEST_NAME, LoveGender } from "../lib/loveTest";
import { ANONYMOUS_NICKNAME } from "../lib/testProfile";

export default function LoveTypePage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState<LoveGender | "">("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LOVE_PROFILE_KEY);
      if (!raw) return;

      const profile = JSON.parse(raw) as { nickname?: string; gender?: LoveGender };
      if (profile.nickname && profile.nickname !== ANONYMOUS_NICKNAME) setNickname(profile.nickname);
      if (profile.gender === "female" || profile.gender === "male") setGender(profile.gender);
    } catch {
      // Start form still works when storage is unavailable.
    }
  }, []);

  function startTest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!gender) {
      setError("맞춤형 분석을 위해 성별을 선택해주세요.");
      return;
    }

    try {
      window.localStorage.setItem(
        LOVE_PROFILE_KEY,
        JSON.stringify({
          nickname: nickname.trim() || ANONYMOUS_NICKNAME,
          gender
        })
      );
    } catch {
      // Navigation can continue even when storage is unavailable.
    }

    router.push("/love-test");
  }

  return (
    <>
      <Head>
        <title>{LOVE_TEST_NAME} | shim.ai</title>
        <meta name="description" content="연애 패턴과 이상형 기준을 함께 분석하는 SHIM AI 심리테스트" />
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
              <Heart size={15} aria-hidden="true" />
              Love Pattern Test
            </span>
            <h1>{LOVE_TEST_NAME}</h1>
            <p>
              연애에서 반복되는 애정 표현 방식과 내가 끌리는 이상형의 기준을 함께 살펴봅니다.
              설렘, 안정감, 표현 방식, 자율성의 균형을 바탕으로 현재 나의 관계 패턴을 정리합니다.
            </p>

            <form className="test-start-form love-start-form" onSubmit={startTest}>
              <label htmlFor="love-nickname">보고서에 표시할 이름</label>
              <input
                autoComplete="nickname"
                id="love-nickname"
                maxLength={24}
                onChange={(event) => setNickname(event.target.value)}
                placeholder="닉네임을 입력하세요"
                type="text"
                value={nickname}
              />
              <span>입력하지 않으면 익명으로 진행됩니다.</span>

              <fieldset className="gender-field">
                <legend>성별을 선택해주세요</legend>
                <span>연애·이상형 문항의 표현을 더 자연스럽게 맞추기 위해 필요합니다.</span>
                <div className="gender-options">
                  <button
                    aria-pressed={gender === "female"}
                    className="gender-option"
                    onClick={() => {
                      setGender("female");
                      setError("");
                    }}
                    type="button"
                  >
                    여성
                  </button>
                  <button
                    aria-pressed={gender === "male"}
                    className="gender-option"
                    onClick={() => {
                      setGender("male");
                      setError("");
                    }}
                    type="button"
                  >
                    남성
                  </button>
                </div>
              </fieldset>

              {error ? <p className="form-error">{error}</p> : null}

              <button className="primary-button test-start-submit" type="submit">
                검사 시작하기
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </form>

            <div className="test-start-note">
              <Clock3 size={16} aria-hidden="true" />
              약 3분, 12문항으로 구성된 베타 테스트입니다.
            </div>
          </div>
        </section>

        <section className="insight-band" aria-label="검사 구성">
          <div className="insight-item">
            <strong>연애유형</strong>
            <span>애착, 표현, 갈등 반응에서 반복되는 관계 패턴을 봅니다.</span>
          </div>
          <div className="insight-item">
            <strong>이상형 기준</strong>
            <span>내가 끌리는 사람의 정서적 조건과 관계 가치를 정리합니다.</span>
          </div>
          <div className="insight-item">
            <strong>4가지 결과</strong>
            <span>안정형, 표현형, 자율형, 설렘형 중 가장 강한 경향을 보여줍니다.</span>
          </div>
        </section>

        <p className="notice">{disclaimer}</p>
      </main>
    </>
  );
}
