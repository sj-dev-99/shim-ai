import Head from "next/head";
import Link from "next/link";
import { ArrowLeft, BrainCircuit } from "lucide-react";
import { ReactNode } from "react";

type AuthLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthLayout({ title, description, children }: AuthLayoutProps) {
  return (
    <>
      <Head>
        <title>{title} | shim.ai</title>
        <meta name="description" content={description} />
      </Head>
      <main className="page-shell auth-shell">
        <header className="topbar">
          <Link href="/">
            <a className="ghost-link">
              <ArrowLeft size={17} aria-hidden="true" />
              홈으로
            </a>
          </Link>
          <div className="brand">
            <span className="brand-mark">
              <BrainCircuit size={19} aria-hidden="true" />
            </span>
            shim.ai
          </div>
        </header>

        <section className="auth-card" aria-labelledby="auth-title">
          <div className="section-heading">
            <span>Account</span>
            <h1 id="auth-title">{title}</h1>
            <p>{description}</p>
          </div>
          {children}
        </section>
      </main>
    </>
  );
}

export function AuthMessage({ message, tone = "neutral" }: { message: string; tone?: "neutral" | "success" | "error" }) {
  return (
    <p className={`auth-message is-${tone}`} role={tone === "error" ? "alert" : "status"}>
      {message}
    </p>
  );
}
