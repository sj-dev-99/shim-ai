import Link from "next/link";
import { type KeyboardEvent, type PointerEvent, type UIEvent, useEffect, useMemo, useRef, useState } from "react";
import {
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
          감정 기록과 AI 심리테스트를 연결해 지금의 나를 더 차분하게 이해하도록 돕습니다.
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
    <section className={`shim-service-detail accent-${service.accent}`} aria-live="polite" key={service.id}>
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
  const loopOffset = homeServices.length;
  const loopedServices = useMemo(() => [...homeServices, ...homeServices, ...homeServices], []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeVirtualIndex, setActiveVirtualIndex] = useState(loopOffset);
  const [isCarouselReady, setIsCarouselReady] = useState(false);
  const [isMouseDragging, setIsMouseDragging] = useState(false);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const scrollEndTimerRef = useRef<number | null>(null);
  const programmaticScrollFrameRef = useRef<number | null>(null);
  const loopResetTimerRef = useRef<number | null>(null);
  const isProgrammaticScrollRef = useRef(false);
  const dragStateRef = useRef({
    isDragging: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    startVirtualIndex: loopOffset,
    didMove: false,
    isHorizontal: false,
    rafId: 0,
    pendingDeltaX: 0,
    samples: [] as Array<{ time: number; x: number }>
  });
  const suppressClickRef = useRef(false);
  const activeService = homeServices[activeIndex] || homeServices[0];

  useEffect(() => {
    let frame = 0;
    let attempts = 0;

    function placeInitialCard() {
      const didScroll = scrollCardIntoView(loopOffset, "auto");
      if (didScroll || attempts > 8) {
        setIsCarouselReady(true);
        return;
      }

      attempts += 1;
      frame = window.requestAnimationFrame(placeInitialCard);
    }

    frame = window.requestAnimationFrame(placeInitialCard);
    return () => window.cancelAnimationFrame(frame);
  }, [loopOffset]);

  function normalizeIndex(index: number) {
    return ((index % homeServices.length) + homeServices.length) % homeServices.length;
  }

  function scrollCardIntoView(index: number, behavior: ScrollBehavior = "smooth") {
    const scroller = scrollerRef.current;
    const card = cardRefs.current[index];
    if (!scroller || !card) return false;

    const left = getCardScrollLeft(index);
    if (left === null) return false;
    if (behavior === "auto") {
      const previousBehavior = scroller.style.scrollBehavior;
      scroller.style.scrollBehavior = "auto";
      scroller.scrollLeft = left;
      window.requestAnimationFrame(() => {
        scroller.style.scrollBehavior = previousBehavior;
      });
      return true;
    }

    scroller.scrollTo({ behavior, left });
    return true;
  }

  function getCardScrollLeft(index: number) {
    const scroller = scrollerRef.current;
    const card = cardRefs.current[index];
    if (!scroller || !card) return null;

    return card.offsetLeft - (scroller.clientWidth - card.offsetWidth) / 2;
  }

  function getCardStep() {
    const current = cardRefs.current[activeVirtualIndex];
    const next = cardRefs.current[activeVirtualIndex + 1] || cardRefs.current[activeVirtualIndex - 1];
    if (current && next) return Math.abs(next.offsetLeft - current.offsetLeft);
    if (current) return current.offsetWidth + 4;
    return (scrollerRef.current?.clientWidth || 375) * 0.74;
  }

  function finishProgrammaticScroll(targetIndex: number) {
    const scroller = scrollerRef.current;
    const targetLeft = getCardScrollLeft(targetIndex);
    if (!scroller || targetLeft === null) {
      isProgrammaticScrollRef.current = false;
      return;
    }
    const settledScroller = scroller;
    const settledTargetLeft = targetLeft;

    if (programmaticScrollFrameRef.current) window.cancelAnimationFrame(programmaticScrollFrameRef.current);

    let stableFrames = 0;
    const startedAt = window.performance.now();

    function checkSettled(now: number) {
      const currentLeft = settledScroller.scrollLeft;
      const isNearTarget = Math.abs(currentLeft - settledTargetLeft) < 1.2;
      stableFrames = isNearTarget ? stableFrames + 1 : 0;

      if (stableFrames >= 4 || now - startedAt > 950) {
        if (!isNearTarget) {
          scrollCardIntoView(targetIndex, "auto");
        }
        isProgrammaticScrollRef.current = false;
        if (targetIndex < loopOffset || targetIndex >= loopOffset * 2) {
          resetLoopPosition(targetIndex);
        }
        return;
      }

      programmaticScrollFrameRef.current = window.requestAnimationFrame(checkSettled);
    }

    programmaticScrollFrameRef.current = window.requestAnimationFrame(checkSettled);
  }

  function selectVirtualService(index: number, shouldScroll = true) {
    const nextIndex = Math.max(0, Math.min(loopedServices.length - 1, index));
    const nextRealIndex = normalizeIndex(nextIndex);
    setActiveVirtualIndex(nextIndex);
    setActiveIndex(nextRealIndex);

    if (shouldScroll) {
      scrollToVirtualService(nextIndex);
    }
  }

  function scrollToVirtualService(index: number) {
    const nextIndex = Math.max(0, Math.min(loopedServices.length - 1, index));
    isProgrammaticScrollRef.current = true;
    if (loopResetTimerRef.current) window.clearTimeout(loopResetTimerRef.current);
    scrollCardIntoView(nextIndex);
    finishProgrammaticScroll(nextIndex);
    if (nextIndex < loopOffset || nextIndex >= loopOffset * 2) {
      loopResetTimerRef.current = window.setTimeout(() => resetLoopPosition(nextIndex), 1100);
    }
  }

  function selectService(index: number, shouldScroll = true) {
    const nextRealIndex = normalizeIndex(index);
    selectVirtualService(loopOffset + nextRealIndex, shouldScroll);
  }

  function getClosestVirtualIndex() {
    const scroller = scrollerRef.current;
    if (!scroller) return activeVirtualIndex;

    const center = scroller.getBoundingClientRect().left + scroller.clientWidth / 2;
    let nextIndex = activeVirtualIndex;
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

    return nextIndex;
  }

  function getReleaseVelocity(samples: Array<{ time: number; x: number }>) {
    const lastSample = samples[samples.length - 1];
    if (!lastSample) return 0;

    const firstRecentSample = [...samples].reverse().find((sample) => lastSample.time - sample.time >= 60) || samples[0];
    const duration = Math.max(1, lastSample.time - firstRecentSample.time);
    return (lastSample.x - firstRecentSample.x) / duration;
  }

  function getTargetIndexFromGesture(dragState: typeof dragStateRef.current, endX: number) {
    const distance = endX - dragState.startX;
    const absDistance = Math.abs(distance);
    const step = getCardStep();
    const velocity = getReleaseVelocity(dragState.samples);
    const absVelocity = Math.abs(velocity);
    const direction = distance < 0 || (absDistance < 1 && velocity < 0) ? 1 : -1;
    const quietDistance = step * 0.12;
    const quietVelocity = 0.28;

    if (absDistance < quietDistance && absVelocity < quietVelocity) {
      return getClosestVirtualIndex();
    }

    const distanceSlides = absDistance / step;
    const velocitySlides = (absVelocity * 260) / step;
    const rawSlides = distanceSlides + velocitySlides;
    const slideCount = Math.max(1, Math.min(3, Math.round(rawSlides)));

    return dragState.startVirtualIndex + direction * slideCount;
  }

  function resetLoopPosition(virtualIndex: number) {
    const realIndex = normalizeIndex(virtualIndex);
    const centeredIndex = loopOffset + realIndex;
    if (centeredIndex === virtualIndex) return;

    isProgrammaticScrollRef.current = true;
    if (loopResetTimerRef.current) window.clearTimeout(loopResetTimerRef.current);
    scrollCardIntoView(centeredIndex, "auto");
    setActiveVirtualIndex(centeredIndex);
    window.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 40);
  }

  function syncActiveCard() {
    if (isProgrammaticScrollRef.current) return;

    const nextVirtualIndex = getClosestVirtualIndex();
    const nextRealIndex = normalizeIndex(nextVirtualIndex);
    if (nextVirtualIndex !== activeVirtualIndex) {
      setActiveVirtualIndex(nextVirtualIndex);
    }
    if (nextRealIndex !== activeIndex) {
      setActiveIndex(nextRealIndex);
    }

    if (nextVirtualIndex < loopOffset || nextVirtualIndex >= loopOffset * 2) {
      window.setTimeout(() => resetLoopPosition(nextVirtualIndex), 120);
    }
  }

  function handleScroll(_event: UIEvent<HTMLDivElement>) {
    if (isProgrammaticScrollRef.current) return;
    if (scrollEndTimerRef.current) window.clearTimeout(scrollEndTimerRef.current);
    scrollEndTimerRef.current = window.setTimeout(syncActiveCard, 90);
  }

  function handleCardSelect(index: number) {
    if (suppressClickRef.current) return;
    selectVirtualService(index);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    if (programmaticScrollFrameRef.current) window.cancelAnimationFrame(programmaticScrollFrameRef.current);
    isProgrammaticScrollRef.current = false;

    const now = window.performance.now();
    dragStateRef.current = {
      isDragging: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: scroller.scrollLeft,
      startVirtualIndex: activeVirtualIndex,
      didMove: false,
      isHorizontal: false,
      rafId: 0,
      pendingDeltaX: 0,
      samples: [{ time: now, x: event.clientX }]
    };
    setIsMouseDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const scroller = scrollerRef.current;
    const dragState = dragStateRef.current;
    if (!scroller || !dragState.isDragging || dragState.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (!dragState.isHorizontal && absX > 8 && absX > absY * 1.12) {
      dragState.isHorizontal = true;
    }

    if (dragState.isHorizontal && absX > 8) {
      dragState.didMove = true;
      suppressClickRef.current = true;
    }

    if (!dragState.isHorizontal) return;

    if (event.cancelable) {
      event.preventDefault();
    }

    const now = window.performance.now();
    dragState.samples.push({ time: now, x: event.clientX });
    dragState.samples = dragState.samples.filter((sample) => now - sample.time <= 140);
    dragState.pendingDeltaX = deltaX;

    if (!dragState.rafId) {
      dragState.rafId = window.requestAnimationFrame(() => {
        const latestDragState = dragStateRef.current;
        if (latestDragState.isDragging) {
          scroller.scrollLeft = latestDragState.scrollLeft - latestDragState.pendingDeltaX;
        }
        latestDragState.rafId = 0;
      });
    }
  }

  function finishPointerDrag(event: PointerEvent<HTMLDivElement>) {
    const dragState = dragStateRef.current;
    if (!dragState.isDragging || dragState.pointerId !== event.pointerId) return;
    const didMove = dragState.didMove;
    if (dragState.rafId) window.cancelAnimationFrame(dragState.rafId);

    dragStateRef.current = {
      isDragging: false,
      pointerId: -1,
      startX: 0,
      startY: 0,
      scrollLeft: 0,
      startVirtualIndex: loopOffset,
      didMove: false,
      isHorizontal: false,
      rafId: 0,
      pendingDeltaX: 0,
      samples: []
    };
    setIsMouseDragging(false);

    if (didMove) {
      const nextIndex = getTargetIndexFromGesture(dragState, event.clientX);
      selectVirtualService(nextIndex, false);
      window.requestAnimationFrame(() => scrollToVirtualService(nextIndex));
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 120);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectVirtualService(activeVirtualIndex + 1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectVirtualService(activeVirtualIndex - 1);
    }

    if (event.key === "Home") {
      event.preventDefault();
      selectVirtualService(loopOffset);
    }

    if (event.key === "End") {
      event.preventDefault();
      selectVirtualService(loopOffset + homeServices.length - 1);
    }
  }

  return (
    <section className="shim-service-section" aria-labelledby="shim-service-title">
      <div className="shim-section-heading">
        <span>SHIM SERVICES</span>
        <h2 id="shim-service-title">나에게 맞는 방식으로 시작하세요</h2>
        <p>하나의 검사로 끝나지 않고 기록과 변화까지 이어집니다.</p>
      </div>

      <div className="shim-carousel-shell">
        <div
          aria-label="SHIM 서비스 카드 슬라이더"
          className={`shim-service-carousel ${isCarouselReady ? "is-ready" : ""} ${
            isMouseDragging ? "is-dragging" : ""
          }`}
          onKeyDown={handleKeyDown}
          onPointerCancel={finishPointerDrag}
          onPointerDown={handlePointerDown}
          onPointerLeave={finishPointerDrag}
          onPointerMove={handlePointerMove}
          onPointerUp={finishPointerDrag}
          onScroll={handleScroll}
          ref={scrollerRef}
          role="tablist"
          tabIndex={0}
        >
          {loopedServices.map((service, index) => (
            <ServiceCard
              index={index}
              isActive={index === activeVirtualIndex}
              key={`${service.id}-${index}`}
              onSelect={handleCardSelect}
              service={service}
              setCardRef={(node) => {
                cardRefs.current[index] = node;
              }}
            />
          ))}
        </div>
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

      <ServiceDetail key={activeService.id} recommendedCount={recommendedCount} service={activeService} />
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
      <strong className="shim-footer-tagline">Understand yourself, gently.</strong>
    </footer>
  );
}
