import Head from "next/head";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpenText,
  BrainCircuit,
  ClipboardCheck,
  HeartPulse,
  MessageCircleHeart,
  Moon,
  Sparkles,
  Sun
} from "lucide-react";
import { disclaimer } from "../lib/data";

type HomePageProps = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};

const services = [
  {
    name: "SHIM Test",
    description: "심리테스트",
    href: "/shim-test",
    icon: ClipboardCheck
  },
  {
    name: "SHIM Talk",
    description: "AI 감정 대화",
    href: "/talk",
    icon: MessageCircleHeart
  },
  {
    name: "SHIM Diary",
    description: "감정일기",
    href: "/diary",
    icon: BookOpenText
  },
  {
    name: "SHIM Report",
    description: "주간·월간 감정 분석",
    href: "/report",
    icon: BarChart3
  },
  {
    name: "SHIM Care",
    description: "감정 관리 루틴",
    href: "/care",
    icon: HeartPulse
  }
];

export default function HomePage({ theme, toggleTheme }: HomePageProps) {
  const isDark = theme === "dark";

  return (
    <>
      <Head>
        <title>shim.ai</title>
        <meta
          name="description"
          content="심리테스트와 감정 관리 기능을 제공하는 SHIM AI 베타 서비스"
        />
      </Head>
      <main className="page-shell">
        <header className="topbar">
          <div className="brand">
            <span className="brand-mark">
              <BrainCircuit size={19} aria-hidden="true" />
            </span>
            shim.ai
          </div>
          <button
            aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
            aria-pressed={isDark}
            className="theme-toggle"
            onClick={toggleTheme}
            type="button"
          >
            {isDark ? <Moon size={17} aria-hidden="true" /> : <Sun size={17} aria-hidden="true" />}
            <span>{isDark ? "Dark" : "Light"}</span>
          </button>
        </header>

        <section className="hero hub-hero">
          <div>
            <span className="eyebrow">
              <Sparkles size={15} aria-hidden="true" />
              AI 자기이해 서비스 허브
            </span>
            <h1>shim.ai</h1>
            <p>
              SHIM AI는 감정 인식, 자기이해, 회복 습관을 돕는 기능들을 하나씩 확장하는
              베타 서비스입니다. 원하는 영역을 선택해 현재 이용 가능한 콘텐츠를 확인해보세요.
            </p>
          </div>
        </section>

        <section className="service-map" aria-label="SHIM AI 서비스 선택">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Link href={service.href} key={service.name}>
                <a className="service-map-item">
                  <span className="service-map-icon">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <strong>{service.name}</strong>
                  <span className="service-map-description">{service.description}</span>
                  <span className="service-map-arrow" aria-hidden="true">
                    <ArrowRight size={20} />
                  </span>
                </a>
              </Link>
            );
          })}
        </section>

        <p className="notice">{disclaimer}</p>
      </main>
    </>
  );
}
