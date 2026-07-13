import Head from "next/head";
import Link from "next/link";
import { ArrowLeft, BrainCircuit, Clock3, Sparkles } from "lucide-react";
import { disclaimer } from "../lib/data";

type ComingSoonPageProps = {
  title: string;
  description: string;
  profileRequirement?: string;
};

export default function ComingSoonPage({ title, description, profileRequirement }: ComingSoonPageProps) {
  return (
    <>
      <Head>
        <title>{title} | shim.ai</title>
        <meta name="description" content={`${title} 서비스 준비중`} />
      </Head>
      <main className="page-shell">
        <header className="topbar">
          <Link href="/">
            <a className="ghost-link">
              <ArrowLeft size={17} aria-hidden="true" />
              서비스 선택
            </a>
          </Link>
          <div className="brand">
            <span className="brand-mark">
              <BrainCircuit size={19} aria-hidden="true" />
            </span>
            shim.ai
          </div>
        </header>

        <section className="coming-soon-panel" aria-label={`${title} 준비중`}>
          <span className="eyebrow">
            <Sparkles size={15} aria-hidden="true" />
            {description}
          </span>
          <h1>{title}</h1>
          <p>서비스 준비중입니다. 추후 업데이트 예정입니다.</p>
          <div className="coming-soon-meta">
            <Clock3 size={18} aria-hidden="true" />
            베타 기간 중 순차적으로 공개할 예정입니다.
          </div>
          {profileRequirement ? <p className="coming-soon-requirement">오픈 시 {profileRequirement} 후 검사가 시작됩니다.</p> : null}
        </section>

        <p className="notice">{disclaimer}</p>
      </main>
    </>
  );
}
