import Link from "next/link";
import { KeyboardEvent, UIEvent, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpenText,
  BrainCircuit,
  ClipboardCheck,
  HeartPulse,
  MessageCircleHeart,
  Sparkles
} from "lucide-react";
import { BETA_VERSION } from "../lib/beta";
import { HomeService, homeServices, methodologyItems } from "../lib/homeContent";

const serviceIcons: Record<HomeService["id"], typeof ClipboardCheck> = {
  test: ClipboardCheck,
  diary: BookOpenText,
  report: BarChart3,
  care: HeartPulse,
  talk: MessageCircleHeart
};

type HeroSectionProps = {
  isDark: boolean;
  toggleTheme: () => void;
};

type ServiceCarouselProps = {
  recommendedCount: number | null;
};

function statusLabel(status: HomeService["status"]) {
  return status === "OPEN" ? "OPEN" : "준비중";
}

export function HeroSection({ isDark, toggleTheme }: HeroSectionProps) {
  return (
    <section className="shim-hero" aria-label="SHIM AI 소개">
      <div className="shim-hero-top">
        <span className="shim-hero-mark" aria-hidden="true">
          <BrainCircuit size={23} />
        </span>
        <span className="shim-hero-brand">shim.ai</span>
        <button
          aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
          aria-pressed={isDark}
          className="theme-toggle shim-hero-theme"
          onClick={toggleTheme}
          type="button"
        >
          {isDark ? "Dark" : "Light"}
        </button>
      </div>

      <div className="shim-hero-copy">
        <span className="shim-hero-kicker">
          <Sparkles size={15} aria-hidden="true" />
          AI 자기이해 플랫폼
        </span>
        <h1>
          <span>AI와 함께</span>
          <span>나를 더 정확하게 이해하세요.</span>
        </h1>
        <p>
          감정 기록, AI 심리테스트, 맥락 기반 해석을 연결해 지금의 나를 더 차분하게 이해하도록 돕습니다.
        </p>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  isActive,
  index,
  setCardRef,
  onSelect
}: {
  service: HomeService;
  isActive: boolean;
  index: number;
  setCardRef: (node: HTMLButtonElement | null) => void;
  onSelect: (index: number) => void;
}) {
  return (
    <button
      aria-label={`${service.title} 서비스 보기`}
      aria-selected={isActive}
      className={`shim-service-card accent-${service.accent} ${isActive ? "is-active" : ""}`}
      onClick={() => onSelect(index)}
      ref={setCardRef}
      role="tab"
      type="button"
    >
      <span className="shim-card-code">{service.code}</span>
      <em className={`shim-card-status ${service.status === "OPEN" ? "is-open" : "is-planned"}`}>
        {statusLabel(service.status)}
      </em>
      <strong>{service.title}</strong>
      <b>{service.headline}</b>
      <small>{service.englishTitle}</small>
      <ul>
        {service.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
    </button>
  );
}

function ServiceDetail({ service, recommendedCount }: { service: HomeService; recommendedCount: number | null }) {
  const Icon = serviceIcons[service.id];
  const isOpen = service.status === "OPEN";

  return (
    <section className={`shim-service-detail accent-${service.accent}`} aria-live="polite">
      <div className="shim-detail-heading">
        <span className="shim-detail-icon">
          <Icon size={20} aria-hidden="true" />
        </span>
        <div>
          <span>{service.title}</span>
          <h2>{service.description}</h2>
        </div>
      </div>

      {service.recommendation ? (
        <div className="shim-recommendation-badge">
          <span>{service.recommendation.label}</span>
          <strong>{service.recommendation.title}</strong>
          <small>
            3분 · 12문항 ·{" "}
            {recommendedCount === null ? "참여 수 집계 중" : `${recommendedCount.toLocaleString("ko-KR")}명 참여`}
          </small>
        </div>
      ) : null}

      <p>{service.detailDescription}</p>
      <div className="shim-detail-tags" aria-label={`${service.title} 핵심 태그`}>
        {service.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      {isOpen ? (
        <Link href={service.href}>
          <a className="shim-detail-cta" aria-label={`${service.title} ${service.ctaLabel}`}>
            {service.ctaLabel}
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </Link>
      ) : (
        <button className="shim-detail-cta is-disabled" disabled type="button">
          {service.ctaLabel}
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      )}
    </section>
  );
}

export function ServiceCarousel({ recommendedCount }: ServiceCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const rafRef = useRef<number | null>(null);
  const activeService = homeServices[activeIndex] || homeServices[0];

  function selectService(index: number, shouldScroll = true) {
    const nextIndex = Math.max(0, Math.min(homeServices.length - 1, index));
    setActiveIndex(nextIndex);

    if (shouldScroll) {
      cardRefs.current[nextIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
    }
  }

  function syncActiveCard() {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const center = scroller.getBoundingClientRect().left + scroller.clientWidth / 2;
    let nextIndex = activeIndex;
    let nextDistance = Number.POSITIVE_INFINITY;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - center);
      if (distance < nextDistance) {
        nextDistance = distance;
        nextIndex = index;
      }
    });

    if (nextIndex !== activeIndex) {
      setActiveIndex(nextIndex);
    }
  }

  function handleScroll(_event: UIEvent<HTMLDivElement>) {
    if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    rafRef.current = window.requestAnimationFrame(syncActiveCard);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectService(activeIndex + 1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectService(activeIndex - 1);
    }

    if (event.key === "Home") {
      event.preventDefault();
      selectService(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      selectService(homeServices.length - 1);
    }
  }

  return (
    <section className="shim-service-section" aria-labelledby="shim-service-title">
      <div className="shim-section-heading">
        <span>SHIM SERVICES</span>
        <h2 id="shim-service-title">나에게 맞는 방식으로 시작하세요</h2>
      </div>

      <div className="shim-carousel-shell">
        <button
          aria-label="이전 서비스 보기"
          className="shim-carousel-nav is-prev"
          onClick={() => selectService(activeIndex - 1)}
          type="button"
        >
          <ArrowLeft size={17} aria-hidden="true" />
        </button>
        <div
          aria-label="SHIM 서비스 카드 슬라이더"
          className="shim-service-carousel"
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          ref={scrollerRef}
          role="tablist"
          tabIndex={0}
        >
          {homeServices.map((service, index) => (
            <ServiceCard
              index={index}
              isActive={index === activeIndex}
              key={service.id}
              onSelect={selectService}
              service={service}
              setCardRef={(node) => {
                cardRefs.current[index] = node;
              }}
            />
          ))}
        </div>
        <button
          aria-label="다음 서비스 보기"
          className="shim-carousel-nav is-next"
          onClick={() => selectService(activeIndex + 1)}
          type="button"
        >
          <ArrowRight size={17} aria-hidden="true" />
        </button>
      </div>

      <div className="shim-carousel-pagination" aria-label="서비스 카드 위치">
        {homeServices.map((service, index) => (
          <button
            aria-label={`${service.title} 카드로 이동`}
            aria-pressed={index === activeIndex}
            key={service.id}
            onClick={() => selectService(index)}
            type="button"
          />
        ))}
      </div>

      <ServiceDetail recommendedCount={recommendedCount} service={activeService} />
    </section>
  );
}

export function MethodologySection() {
  return (
    <section className="shim-methodology" aria-labelledby="shim-methodology-title">
      <div className="shim-section-heading">
        <span>SHIM METHODOLOGY</span>
        <h2 id="shim-methodology-title">
          기록과 해석을 연결하는
          <br />
          SHIM의 자기이해 프레임워크
        </h2>
        <p>
          SHIM.AI는 단일 검사 결과보다 감정 기록, 사고 흐름, 반복되는 표현과 변화의 맥락을 함께 살펴
          사용자가 스스로를 더 깊이 이해할 수 있도록 돕습니다.
        </p>
      </div>

      <div className="shim-methodology-list">
        {methodologyItems.map((item) => (
          <article className="shim-methodology-item" key={item.number}>
            <span>{item.number}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function DisclaimerSection() {
  return (
    <section className="shim-disclaimer" aria-label="서비스 이용 안내">
      <p>본 서비스는 의료 상담이나 진단을 제공하지 않으며, 자기이해와 자기성찰을 돕기 위한 참고용 콘텐츠입니다.</p>
      <p>심각한 정서적 어려움이나 위기 상황이 지속되는 경우 전문 의료기관 또는 상담기관의 도움을 권장합니다.</p>
    </section>
  );
}

export function HomeFooter() {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="shim-footer">
      <span>shim.ai</span>
      <span>{BETA_VERSION}</span>
      <small>© {year} SHIM AI. Self-understanding, gently structured.</small>
    </footer>
  );
}
