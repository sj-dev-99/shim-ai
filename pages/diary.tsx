import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowLeft, BookOpenText, BrainCircuit, CalendarDays, PenLine, Sparkles, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { disclaimer } from "../lib/data";

type DiaryEmotion =
  | "good"
  | "calm"
  | "warm"
  | "excited"
  | "okay"
  | "neutral"
  | "mixed"
  | "anxious"
  | "sad"
  | "angry"
  | "tired"
  | "lonely";

type DiaryEntry = {
  id: string;
  emotion: DiaryEmotion;
  text: string;
  comment: string;
  createdAt: string;
};

const DIARY_STORAGE_KEY = "shim_ai_diary_entries";

const emotionOptions: Array<{ id: DiaryEmotion; label: string; tone: string }> = [
  { id: "good", label: "좋음", tone: "기분 좋은 장면이 남은 하루" },
  { id: "calm", label: "평온함", tone: "마음이 비교적 안정된 하루" },
  { id: "warm", label: "따뜻함", tone: "작은 온기와 다정함이 남은 하루" },
  { id: "excited", label: "설렘", tone: "기대와 활력이 올라온 하루" },
  { id: "okay", label: "괜찮음", tone: "조금은 나아진 하루" },
  { id: "neutral", label: "무덤덤함", tone: "감정이 크게 흔들리지 않은 하루" },
  { id: "mixed", label: "복잡함", tone: "여러 생각과 감정이 엉킨 하루" },
  { id: "anxious", label: "불안함", tone: "생각이 많고 긴장된 하루" },
  { id: "sad", label: "슬픔", tone: "마음이 조금 가라앉은 하루" },
  { id: "angry", label: "화남", tone: "마음의 경계가 건드려진 하루" },
  { id: "tired", label: "지침", tone: "에너지가 많이 쓰인 하루" },
  { id: "lonely", label: "외로움", tone: "혼자라는 감각이 커진 하루" }
];

const commentByEmotion: Record<DiaryEmotion, string[]> = {
  good: [
    "좋았던 감정을 기록하는 일은 나에게 맞는 회복 방식을 발견하는 단서가 됩니다.",
    "오늘의 미소가 작더라도 마음은 그 장면을 분명히 기억합니다."
  ],
  calm: [
    "오늘의 차분함을 잘 기억해두면 흔들리는 날에도 돌아올 기준점이 됩니다.",
    "큰 사건이 없는 평온한 하루도 마음에게는 충분히 좋은 회복입니다."
  ],
  warm: [
    "따뜻함을 알아차린 마음은 오늘의 작은 빛을 놓치지 않은 마음입니다.",
    "작은 온기 하나가 하루 전체를 조금 더 부드럽게 만들어줄 수 있습니다."
  ],
  excited: [
    "설렘은 마음이 앞으로 움직이고 있다는 신호입니다. 그 기대를 천천히 따라가도 괜찮습니다.",
    "오늘의 기대감을 기록해두면 나를 움직이게 하는 방향이 조금 더 선명해집니다."
  ],
  okay: [
    "괜찮았던 순간을 적어두면 흔들리는 날에도 돌아볼 수 있는 작은 기준이 됩니다.",
    "오늘의 괜찮음이 아주 작더라도, 마음은 그 신호를 분명히 기억합니다."
  ],
  neutral: [
    "무덤덤한 날도 마음의 중요한 기록입니다. 선명하지 않은 감정도 그대로 괜찮습니다.",
    "특별한 감정이 없어도 하루는 지나갔고, 그 사실만으로도 충분한 기록이 됩니다."
  ],
  mixed: [
    "복잡한 마음은 한 번에 풀려고 하기보다, 지금 가장 큰 감정 하나부터 적어봐도 좋습니다.",
    "엉킨 감정을 말로 꺼내는 순간 마음은 조금씩 정리될 준비를 시작합니다."
  ],
  anxious: [
    "불안은 미래를 준비하려는 마음의 신호이지만, 지금의 나를 너무 몰아붙이지 않아도 됩니다.",
    "생각이 많았던 하루라면 결론보다 호흡을 먼저 돌려주는 것이 좋습니다."
  ],
  sad: [
    "슬픈 마음을 알아차리는 것만으로도 오늘의 나를 혼자 두지 않는 일이 됩니다.",
    "마음이 가라앉은 날에는 이유를 다 설명하지 못해도 괜찮습니다."
  ],
  angry: [
    "화는 내 마음의 경계가 건드려졌다는 신호일 수 있습니다. 그 경계를 천천히 살펴봐도 좋습니다.",
    "오늘의 화를 안전하게 적어두면 내가 지키고 싶은 것이 무엇인지 보일 수 있습니다."
  ],
  tired: [
    "지친 하루에는 더 해내는 힘보다 멈출 수 있는 용기가 더 필요합니다.",
    "오늘의 피로를 인정하는 것만으로도 내일의 에너지를 지키는 선택이 됩니다."
  ],
  lonely: [
    "외로움도 오늘의 중요한 감정입니다. 그 마음을 적어두는 일은 나에게 말을 걸어주는 일과 같습니다.",
    "혼자라고 느낀 순간을 기록하면, 내가 필요로 하는 연결의 모양이 조금씩 보입니다."
  ]
};

function isDiaryEmotion(value: unknown): value is DiaryEmotion {
  return typeof value === "string" && emotionOptions.some((option) => option.id === value);
}

function getEmotionLabel(value: string) {
  return emotionOptions.find((item) => item.id === value)?.label || "감정 기록";
}

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
  const router = useRouter();
  const [emotion, setEmotion] = useState<DiaryEmotion>("calm");
  const [text, setText] = useState("");
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const latestEntry = entries[0];

  useEffect(() => {
    setEntries(readDiaryEntries());
  }, []);

  useEffect(() => {
    const rawEmotion = Array.isArray(router.query.emotion) ? router.query.emotion[0] : router.query.emotion;

    if (isDiaryEmotion(rawEmotion)) {
      setEmotion(rawEmotion);
    }
  }, [router.query.emotion]);

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
                <strong>{getEmotionLabel(latestEntry.emotion)}</strong>
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
                    <strong>{getEmotionLabel(entry.emotion)}</strong>
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
