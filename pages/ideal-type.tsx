import Head from "next/head";
import Link from "next/link";
import { ArrowRight, BrainCircuit, Heart } from "lucide-react";

export default function IdealTypePage() {
  return (
    <>
      <Head>
        <title>연애유형·이상형 분석 | shim.ai</title>
      </Head>
      <main className="page-shell start-page-shell">
        <header className="topbar">
          <div className="brand">
            <span className="brand-mark">
              <BrainCircuit size={19} aria-hidden="true" />
            </span>
            shim.ai
          </div>
        </header>

        <section className="test-start-page" aria-label="통합 검사 안내">
          <div>
            <span className="eyebrow">
              <Heart size={15} aria-hidden="true" />
              통합 안내
            </span>
            <h1>이상형 분석은 연애유형 분석과 하나로 합쳐졌습니다.</h1>
            <p>연애 패턴과 끌림의 기준을 함께 보는 통합 검사에서 확인해보세요.</p>
          </div>
          <Link href="/love-type">
            <a className="primary-button test-start-submit">
              통합 검사로 이동
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </Link>
        </section>
      </main>
    </>
  );
}
