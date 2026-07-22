import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BetaDock from "../components/BetaDock";
import { AuthProvider } from "../lib/auth/AuthProvider";
import { submitBetaEvent } from "../lib/beta";
import "../styles/globals.css";

function readSavedTheme() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    return window.localStorage.getItem("theme");
  } catch {
    return null;
  }
}

function saveTheme(theme: "light" | "dark") {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem("theme", theme);
    }
  } catch {
    // Theme switching should still work when storage is unavailable.
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/admin");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = readSavedTheme();
    const nextTheme = savedTheme === "dark" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  useEffect(() => {
    function logPageView(path: string) {
      if (path.startsWith("/admin")) return;

      submitBetaEvent({
        eventType: "page_view",
        path,
        metadata: {
          referrer: typeof document !== "undefined" ? document.referrer || null : null
        }
      });
    }

    logPageView(router.asPath);
    router.events.on("routeChangeComplete", logPageView);

    return () => {
      router.events.off("routeChangeComplete", logPageView);
    };
  }, [router.events]);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    saveTheme(nextTheme);
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <AuthProvider>
        <Component {...pageProps} theme={theme} toggleTheme={toggleTheme} />
        {isAdminRoute ? null : <BetaDock />}
      </AuthProvider>
    </>
  );
}
