import Link from "next/link";
import { type KeyboardEvent, type PointerEvent, useEffect, useMemo, useRef, useState } from "react";
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

const DRAG_ACTIVATION_PX = 7;
const DRAG_FOLLOW_RATIO = 0.96;
const VELOCITY_WINDOW_MS = 110;
const MAX_RELEASE_VELOCITY = 1.15;
const VELOCITY_PROJECT_MS = 90;
const MAX_SLIDES_PER_GESTURE = 2;
const ACTIVE_CARD_SCALE = 1;
const ADJACENT_CARD_SCALE = 0.91;
const DISTANT_CARD_SCALE = 0.86;
const ACTIVE_CARD_OPACITY = 1;
const ADJACENT_CARD_OPACITY = 0.9;
const DISTANT_CARD_OPACITY = 0.72;
const ADJACENT_CARD_Y = 12;
const DISTANT_CARD_Y = 22;

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
      aria-current={isActive ? "true" : undefined}
      aria-selected={isActive}
      className={`shim-service-card accent-${service.accent} ${isActive ? "is-active" : ""}`}
      onClick={() => onSelect(index)}
      ref={setCardRef}
      role="tab"
      tabIndex={isActive ? 0 : -1}
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
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const animationFrameRef = useRef<number | null>(null);
  const activeVirtualIndexRef = useRef(loopOffset);
  const activeIndexRef = useRef(0);
  const currentXRef = useRef(0);
  const metricsRef = useRef({
    cardWidth: 0,
    gap: 4,
    viewportWidth: 0,
    trackOffsetLeft: 0,
    step: 0,
    offsets: [] as number[]
  });
  const dragStateRef = useRef({
    isDragging: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    startTranslateX: 0,
    startVirtualIndex: loopOffset,
    didMove: false,
    isHorizontal: false,
    isVerticalCancelled: false,
    rafId: 0,
    pendingDeltaX: 0,
    samples: [] as Array<{ time: number; x: number }>
  });
  const suppressClickRef = useRef(false);
  const activeService = homeServices[activeIndex] || homeServices[0];

  useEffect(() => {
    activeVirtualIndexRef.current = activeVirtualIndex;
  }, [activeVirtualIndex]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    let frame = 0;
    let attempts = 0;

    function setupCarousel() {
      const didMeasure = measureCarousel();
      if (!didMeasure && attempts < 8) {
        attempts += 1;
        frame = window.requestAnimationFrame(setupCarousel);
        return;
      }
      setTrackX(getTranslateForIndex(loopOffset));
      setIsCarouselReady(true);
    }

    frame = window.requestAnimationFrame(setupCarousel);
    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
      cancelAnimation();
      const dragState = dragStateRef.current;
      if (dragState.rafId) window.cancelAnimationFrame(dragState.rafId);
    };
  }, [loopOffset]);

  function normalizeIndex(index: number) {
    return ((index % homeServices.length) + homeServices.length) % homeServices.length;
  }

  function measureCarousel() {
    const viewport = carouselRef.current;
    const track = trackRef.current;
    const card = cardRefs.current[activeVirtualIndexRef.current] || cardRefs.current[loopOffset];
    if (!viewport || !track || !card) return false;

    const trackStyles = window.getComputedStyle(track);
    const gap = Number.parseFloat(trackStyles.columnGap || trackStyles.gap || "4") || 4;
    const cardWidth = card.offsetWidth || card.getBoundingClientRect().width;
    const viewportWidth = viewport.getBoundingClientRect().width;
    const offsets = cardRefs.current.map((cardNode, index) => cardNode?.offsetLeft ?? index * (cardWidth + gap));
    metricsRef.current = {
      cardWidth,
      gap,
      viewportWidth,
      trackOffsetLeft: track.offsetLeft || 0,
      step: cardWidth + gap,
      offsets
    };
    return true;
  }

  function handleResize() {
    measureCarousel();
    setTrackX(getTranslateForIndex(activeVirtualIndexRef.current));
  }

  function getTranslateForIndex(index: number) {
    const { cardWidth, offsets, step, trackOffsetLeft, viewportWidth } = metricsRef.current;
    if (!cardWidth || !viewportWidth || !step) return 0;
    const cardOffset = offsets[index] ?? index * step;
    return (viewportWidth - cardWidth) / 2 - trackOffsetLeft - cardOffset;
  }

  function setTrackX(value: number) {
    currentXRef.current = value;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${value}px, 0, 0)`;
    }
    updateCardVisuals(value);
  }

  function interpolateByDistance(distance: number, activeValue: number, adjacentValue: number, distantValue: number) {
    const clamped = Math.min(2, Math.max(0, distance));
    if (clamped <= 1) {
      return activeValue + (adjacentValue - activeValue) * clamped;
    }
    return adjacentValue + (distantValue - adjacentValue) * (clamped - 1);
  }

  function updateCardVisuals(trackX: number) {
    const { cardWidth, offsets, step, trackOffsetLeft, viewportWidth } = metricsRef.current;
    if (!cardWidth || !viewportWidth || !step) return;

    const viewportCenter = viewportWidth / 2;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      const cardOffset = offsets[index] ?? index * step;
      const cardCenter = trackOffsetLeft + trackX + cardOffset + cardWidth / 2;
      const distance = Math.abs(cardCenter - viewportCenter) / step;
      const scale = interpolateByDistance(distance, ACTIVE_CARD_SCALE, ADJACENT_CARD_SCALE, DISTANT_CARD_SCALE);
      const opacity = interpolateByDistance(distance, ACTIVE_CARD_OPACITY, ADJACENT_CARD_OPACITY, DISTANT_CARD_OPACITY);
      const translateY = interpolateByDistance(distance, 0, ADJACENT_CARD_Y, DISTANT_CARD_Y);
      const depth = Math.max(0, 1 - Math.min(distance, 2) / 2);
      const shadowAlpha = 0.04 + depth * 0.1;
      const shadowBlur = 16 + depth * 30;
      const shadowY = 10 + depth * 12;

      card.style.setProperty("--card-scale", scale.toFixed(4));
      card.style.setProperty("--card-opacity", opacity.toFixed(4));
      card.style.setProperty("--card-y", `${translateY.toFixed(2)}px`);
      card.style.setProperty("--card-shadow", `0 ${shadowY.toFixed(1)}px ${shadowBlur.toFixed(1)}px rgba(78, 67, 52, ${shadowAlpha.toFixed(3)})`);
      card.style.zIndex = String(Math.round(1000 - distance * 100));
    });
  }

  function cancelAnimation() {
    if (animationFrameRef.current) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }

  function getNearestVirtualIndex(realIndex: number) {
    const current = activeVirtualIndexRef.current;
    const candidates = [realIndex, loopOffset + realIndex, loopOffset * 2 + realIndex];
    return candidates.reduce((nearest, candidate) =>
      Math.abs(candidate - current) < Math.abs(nearest - current) ? candidate : nearest
    );
  }

  function selectVirtualService(index: number, shouldAnimate = true) {
    const nextIndex = Math.max(0, Math.min(loopedServices.length - 1, index));
    const nextRealIndex = normalizeIndex(nextIndex);
    activeVirtualIndexRef.current = nextIndex;
    activeIndexRef.current = nextRealIndex;

    if (shouldAnimate) {
      animateToVirtualIndex(nextIndex);
    } else {
      setTrackX(getTranslateForIndex(nextIndex));
      normalizeLoopPosition(nextIndex);
    }
  }

  function animateToVirtualIndex(index: number) {
    const targetX = getTranslateForIndex(index);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    cancelAnimation();

    if (reduceMotion) {
      setTrackX(targetX);
      normalizeLoopPosition(index);
      return;
    }

    const startX = currentXRef.current;
    const distance = targetX - startX;
    const absDistance = Math.abs(distance);
    const step = metricsRef.current.step || absDistance || 1;
    const distanceInSlides = Math.min(MAX_SLIDES_PER_GESTURE, absDistance / step);
    const duration = Math.max(320, Math.min(650, 340 + distanceInSlides * 130));
    const startTime = window.performance.now();

    if (absDistance < 0.5) {
      setTrackX(targetX);
      normalizeLoopPosition(index);
      return;
    }

    function easeGentleOut(progress: number) {
      return Math.sin((progress * Math.PI) / 2);
    }

    function tick(now: number) {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = easeGentleOut(progress);
      setTrackX(startX + distance * eased);

      if (progress >= 1) {
        setTrackX(targetX);
        animationFrameRef.current = null;
        normalizeLoopPosition(index);
        return;
      }

      animationFrameRef.current = window.requestAnimationFrame(tick);
    }

    animationFrameRef.current = window.requestAnimationFrame(tick);
  }

  function selectService(index: number, shouldScroll = true) {
    const nextRealIndex = normalizeIndex(index);
    selectVirtualService(getNearestVirtualIndex(nextRealIndex), shouldScroll);
  }

  function getReleaseVelocity(samples: Array<{ time: number; x: number }>) {
    const lastSample = samples[samples.length - 1];
    if (!lastSample) return 0;

    const recentSamples = samples.filter((sample) => lastSample.time - sample.time <= VELOCITY_WINDOW_MS);
    const firstRecentSample = recentSamples[0] || samples[0];
    const duration = Math.max(16, lastSample.time - firstRecentSample.time);
    const velocity = (lastSample.x - firstRecentSample.x) / duration;
    return Math.max(-MAX_RELEASE_VELOCITY, Math.min(MAX_RELEASE_VELOCITY, velocity));
  }

  function getTargetIndexFromGesture(dragState: typeof dragStateRef.current, endX: number) {
    const distance = endX - dragState.startX;
    const absDistance = Math.abs(distance);
    const step = metricsRef.current.step || 1;
    const velocity = getReleaseVelocity(dragState.samples);
    const absVelocity = Math.abs(velocity);
    const direction = distance < 0 || (absDistance < 1 && velocity < 0) ? 1 : -1;
    const quietDistance = step * 0.16;
    const quietVelocity = 0.18;

    if (absDistance < quietDistance && absVelocity < quietVelocity) {
      return dragState.startVirtualIndex;
    }

    const projectedDistance = absDistance + absVelocity * VELOCITY_PROJECT_MS;
    const wantsTwoSlides =
      absDistance >= step * 1.26 || (absDistance >= step * 0.72 && absVelocity >= 0.72);
    const wantsOneSlide = projectedDistance >= step * 0.2 || absVelocity >= 0.36;
    const slideCount = wantsTwoSlides ? 2 : wantsOneSlide ? 1 : 0;

    return dragState.startVirtualIndex + direction * Math.min(MAX_SLIDES_PER_GESTURE, slideCount);
  }

  function normalizeLoopPosition(virtualIndex: number) {
    const realIndex = normalizeIndex(virtualIndex);
    const centeredIndex = loopOffset + realIndex;
    activeVirtualIndexRef.current = centeredIndex;
    activeIndexRef.current = realIndex;
    setActiveVirtualIndex(centeredIndex);
    setActiveIndex(realIndex);

    if (centeredIndex === virtualIndex) return;

    setTrackX(getTranslateForIndex(centeredIndex));
  }

  function handleCardSelect(index: number) {
    if (suppressClickRef.current) return;
    selectVirtualService(index);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!carouselRef.current) return;

    measureCarousel();
    cancelAnimation();

    const now = window.performance.now();
    dragStateRef.current = {
      isDragging: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startTranslateX: currentXRef.current,
      startVirtualIndex: activeVirtualIndexRef.current,
      didMove: false,
      isHorizontal: false,
      isVerticalCancelled: false,
      rafId: 0,
      pendingDeltaX: 0,
      samples: [{ time: now, x: event.clientX }]
    };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const dragState = dragStateRef.current;
    if (!dragState.isDragging || dragState.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (dragState.isVerticalCancelled) return;

    if (!dragState.isHorizontal && absY > DRAG_ACTIVATION_PX && absY > absX * 1.14) {
      dragState.isVerticalCancelled = true;
      return;
    }

    if (!dragState.isHorizontal && absX > DRAG_ACTIVATION_PX && absX > absY * 1.16) {
      dragState.isHorizontal = true;
      setIsMouseDragging(true);
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.setPointerCapture(event.pointerId);
      }
    }

    if (dragState.isHorizontal && absX > DRAG_ACTIVATION_PX) {
      dragState.didMove = true;
      suppressClickRef.current = true;
    }

    if (!dragState.isHorizontal) return;

    if (event.cancelable) {
      event.preventDefault();
    }

    const now = window.performance.now();
    dragState.samples.push({ time: now, x: event.clientX });
    dragState.samples = dragState.samples.filter((sample) => now - sample.time <= VELOCITY_WINDOW_MS);
    dragState.pendingDeltaX = deltaX * DRAG_FOLLOW_RATIO;

    if (!dragState.rafId) {
      dragState.rafId = window.requestAnimationFrame(() => {
        const latestDragState = dragStateRef.current;
        if (latestDragState.isDragging) {
          setTrackX(latestDragState.startTranslateX + latestDragState.pendingDeltaX);
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
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragStateRef.current = {
      isDragging: false,
      pointerId: -1,
      startX: 0,
      startY: 0,
      startTranslateX: 0,
      startVirtualIndex: loopOffset,
      didMove: false,
      isHorizontal: false,
      isVerticalCancelled: false,
      rafId: 0,
      pendingDeltaX: 0,
      samples: []
    };
    setIsMouseDragging(false);

    if (didMove) {
      const nextIndex = getTargetIndexFromGesture(dragState, event.clientX);
      selectVirtualService(nextIndex, true);
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 120);
    } else {
      suppressClickRef.current = false;
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectVirtualService(activeVirtualIndexRef.current + 1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectVirtualService(activeVirtualIndexRef.current - 1);
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
          onPointerMove={handlePointerMove}
          onPointerUp={finishPointerDrag}
          ref={carouselRef}
          role="tablist"
          tabIndex={0}
        >
          <div className="shim-service-track" ref={trackRef}>
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
