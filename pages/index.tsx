import Head from "next/head";
import { useEffect, useState } from "react";
import {
  DisclaimerSection,
  HeroSection,
  HomeFooter,
  MethodologySection,
  ServiceCarousel
} from "../components/HomeSections";

type HomePageProps = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};

export default function HomePage({ theme, toggleTheme }: HomePageProps) {
  const [recommendedCount, setRecommendedCount] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    fetch("/api/public-stats")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { recommendedParticipationCount?: number | null } | null) => {
        if (mounted && typeof data?.recommendedParticipationCount === "number") {
          setRecommendedCount(data.recommendedParticipationCount);
        }
      })
      .catch(() => {
        if (mounted) setRecommendedCount(null);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <Head>
        <title>shim.ai | AI 자기이해 플랫폼</title>
        <meta
          name="description"
          content="SHIM.AI는 감정 기록, AI 심리테스트, 맥락 기반 해석을 연결하는 AI 자기이해 플랫폼입니다."
        />
      </Head>
      <main className="page-shell shim-home-shell">
        <HeroSection isDark={theme === "dark"} toggleTheme={toggleTheme} />
        <ServiceCarousel recommendedCount={recommendedCount} />
        <MethodologySection />
        <DisclaimerSection />
        <HomeFooter />
      </main>
    </>
  );
}
