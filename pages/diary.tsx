import Head from "next/head";
import Link from "next/link";
import { ArrowLeft, BookOpenText, BrainCircuit, CalendarDays, PenLine, Sparkles, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { disclaimer } from "../lib/data";

type DiaryEmotion = "calm" | "heavy" | "anxious" | "tired" | "grateful" | "bright";

type DiaryEntry = {
  id: string;
  emotion: DiaryEmotion;
  text: string;
  comment: string;
  createdAt: string;
};

const DIARY_STORAGE_KEY = "shim_ai_diary_entries";

const emotionOptions: Array<{ id: DiaryEmotion; label: string; tone: string }> = [
  { id: "calm", label: "차분함", tone: "마음이 비교적 안정된 하루" },
  { id: "heavy", label: "무거움", tone: "마음이 조금 가라앉은 하루" },
  { id: "anxious", label: "불안함", tone: "생각이 많고 긴장된 하루" },
  { id: "tired", label: "지침", tone: "에너지가 많이 쓰인 하루" },
  { id: "grateful", label: "고마움", tone: "작은 온기가 남은 하루" },
  { id: "bright", label: "괜찮음", tone: "조금은 나아진 하루" }
];

const commentByEmotion: Record<DiaryEmotion, string[]> = {
  calm: [
    "오늘의 차분함을 잘 기억해두면 흔들리는 날에도 돌아올 기준점이 됩니다.",
    "큰 사건이 없는 평온한 하루도 마음에게는 충분히 좋은 회복입니다."
  ],
  heavy: [
    "마음이 무거운 날에는 잘해내는 것보다 무게를 알아차리는 일이 먼저입니다.",
    "오늘의 무거움은 당신이 약해서가 아니라 많이 버티고 있다는 신호일 수 있습니다."
  ],
  anxious: [
    "불안은 미래를 준비하려는 마음의 신호이지만, 지금의 나를 너무 몰아붙이지 않아도 됩니다.",
    "생각이 많았던 하루라면 결론보다 호흡을 먼저 돌려주는 것이 좋습니다."
  ],
  tired: [
    "지친 하루에는 더 해내는 힘보다 멈출 수 있는 용기가 더 필요합니다.",
    "오늘의 피로를 인정하는 것만으로도 내일의 에너지를 지키는 선택이 됩니다."
  ],
  grateful: [
    "고마움을 알아차린 마음은 이미 오늘의 작은 빛을 놓치지 않은 마음입니다.",
    "작은 고마움 하나가 하루 전체를 조금 더 부드럽게 만들어줄 수 있습니다."
  ],
  bright: [
    "괜찮았던 순간을 기록하는 일은 나에게 맞는 회복 방식을 발견하는 단서가 됩니다.",
    "오늘의 괜찮음이 작더라도, 마음은 그 작은 신호를 분명히 기억합니다."
  ]
};

function readDiaryEntries() {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(DIARY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DiaryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveDiaryEntries(entries: DiaryEntry[]) {
  try {
    window.localStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // The diary still works for the current session if storage is unavailable.
  }
}

function createDiaryComment(emotion: DiaryEmotion, text: string) {
  const normalized = text.trim();
  const candidates = commentByEmotion[emotion];
  const index = normalized.length % candidates.length;

  if (normalized.includes("못") || normalized.includes("힘들") || normalized.includes("괜찮지")) {
    return "오늘을 완벽하게 설명하지 못해도 괜찮습니다. 적어낸 만큼 마음은 이미 조금 정리되고 있습니다.";
  }

  if (normalized.includes("고마") || normalized.includes("감사")) {
    return "고마움을 기록한 마음은 오늘의 온기를 놓치지 않은 마음입니다.";
  }

  return candidates[index];
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export default function DiaryPage() {
  const [emotion, setEmotion] = useState<DiaryEmotion>("calm");
  const [text, setText] = useState("");
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const selectedEmotion = emotionOptions.find((item) => item.id === emotion) || emotionOptions[0];
  const latestEntry = entries[0];

  useEffect(() => {
    setEntries(readDiaryEntries());
  }, []);

  const previewComment = useMemo(() => {
    if (!text.trim()) return "오늘의 감정을 적으면 shim.ai가 한 줄로 마음을 정리해드릴게요.";
    return createDiaryComment(emotion, text);
  }, [emotion, text]);

  function submitDiary(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!text.trim()) return;

    const entry: DiaryEntry = {
      id: `${Date.now()}`,
      emotion,
      text: text.trim(),
      comment: createDiaryComment(emotion, text),
      createdAt: new Date().toISOString()
    };
    const nextEntries = [entry, ...entries].slice(0, 20);
    setEntries(nextEntries);
    saveDiaryEntries(nextEntries);
    setText("");
  }

  function deleteEntry(id: string) {
    const nextEntries = entries.filter((entry) => entry.id !== id);
    setEntries(nextEntries);
    saveDiaryEntries(nextEntries);
  }

  return (
    <>
      <Head>
        <title>SHIM Diary | shim.ai</title>
        <meta name="description" content="그날의 감정을 기록하고 shim.ai의 한줄 코멘트를 받는 감정일기" />
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

        <section className="hero diary-hero">
          <div>
            <span className="eyebrow">
              <BookOpenText size={15} aria-hidden="true" />
              SHIM Diary
            </span>
            <h1>오늘의 감정을 한 편의 일기로 남겨보세요.</h1>
            <p>
              있었던 일을 길게 설명하지 않아도 괜찮습니다. 지금의 감정과 떠오르는 문장을 적으면
              shim.ai가 마음을 정리하는 한 줄 코멘트를 남겨드립니다.
            </p>
          </div>
        </section>

        <section className="diary-layout" aria-label="감정일기 작성">
          <form className="diary-writer" onSubmit={submitDiary}>
            <div className="section-heading">
              <span>Today</span>
              <h2>오늘의 감정 기록</h2>
            </div>

            <fieldset className="diary-emotion-field">
              <legend>오늘의 감정상태</legend>
              <div className="diary-emotion-grid">
                {emotionOptions.map((option) => (
                  <button
                    aria-pressed={emotion === option.id}
                    className="diary-emotion-button"
                    key={option.id}
                    onClick={() => setEmotion(option.id)}
                    type="button"
                  >
                    <strong>{option.label}</strong>
                    <span>{option.tone}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="diary-text-field" htmlFor="diary-text">
              <span>감정일기</span>
              <textarea
                id="diary-text"
                maxLength={800}
                onChange={(event) => setText(event.target.value)}
                placeholder="오늘 마음에 남은 장면, 감정, 생각을 자유롭게 적어보세요."
                rows={9}
                value={text}
              />
            </label>

            <aside className="diary-comment-preview" aria-label="shim.ai 코멘트 미리보기">
              <Sparkles size={17} aria-hidden="true" />
              <p>{previewComment}</p>
            </aside>

            <button className="primary-button diary-submit" disabled={!text.trim()} type="submit">
              <PenLine size={17} aria-hidden="true" />
              감정일기 저장
            </button>
          </form>

          <aside className="diary-history" aria-label="최근 감정일기">
            <div className="section-heading">
              <span>Archive</span>
              <h2>최근 기록</h2>
            </div>

            {latestEntry ? (
              <div className="diary-latest-card">
                <span className="diary-date">
                  <CalendarDays size={15} aria-hidden="true" />
                  {formatDate(latestEntry.createdAt)}
                </span>
                <strong>{emotionOptions.find((item) => item.id === latestEntry.emotion)?.label}</strong>
                <p>{latestEntry.comment}</p>
              </div>
            ) : (
              <div className="diary-empty">
                <strong>아직 기록이 없습니다.</strong>
                <span>첫 감정일기를 남기면 이곳에 shim.ai 코멘트와 함께 쌓입니다.</span>
              </div>
            )}

            <div className="diary-entry-list">
              {entries.map((entry) => (
                <article className="diary-entry-card" key={entry.id}>
                  <div>
                    <span>{formatDate(entry.createdAt)}</span>
                    <strong>{emotionOptions.find((item) => item.id === entry.emotion)?.label}</strong>
                  </div>
                  <p>{entry.text}</p>
                  <blockquote>{entry.comment}</blockquote>
                  <button aria-label="기록 삭제" className="diary-delete-button" onClick={() => deleteEntry(entry.id)} type="button">
                    <Trash2 size={15} aria-hidden="true" />
                  </button>
                </article>
              ))}
            </div>
          </aside>
        </section>

        <p className="notice">{disclaimer} 감정일기는 현재 사용자의 브라우저에만 저장됩니다.</p>
      </main>
    </>
  );
}
