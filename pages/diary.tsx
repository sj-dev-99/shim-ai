import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  ArrowLeft,
  BookOpenText,
  BrainCircuit,
  CalendarDays,
  Check,
  Edit3,
  PenLine,
  RefreshCw,
  Sparkles,
  Trash2,
  X
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAuth } from "../lib/auth/AuthProvider";
import { disclaimer } from "../lib/data";
import { getSupabaseBrowserClient } from "../lib/supabase/client";
import { DiaryEntry, EmotionCode } from "../lib/supabase/types";

type LegacyDiaryEntry = {
  id: string;
  emotion: EmotionCode;
  text: string;
  comment: string;
  createdAt: string;
};

type DiaryStatus = {
  tone: "neutral" | "success" | "error";
  text: string;
};

const DIARY_STORAGE_KEY = "shim_ai_diary_entries";
const DIARY_DRAFT_KEY = "shim_ai_diary_draft";
const DIARY_PREVIEW_MESSAGE = "오늘의 감정을 적으면 shim.ai가 한 줄로 마음을 정리해드릴게요.";

const emotionOptions: Array<{ id: EmotionCode; icon: string; label: string; tone: string }> = [
  { id: "good", icon: "😊", label: "좋아요", tone: "기분 좋은 장면이 오래 남은 하루" },
  { id: "calm", icon: "🌿", label: "평온해요", tone: "마음이 잔잔하고 안정된 하루" },
  { id: "warm", icon: "🤍", label: "따뜻해요", tone: "작은 다정함이 오래 기억되는 하루" },
  { id: "excited", icon: "✨", label: "설레요", tone: "기대와 생기가 조용히 피어난 하루" },
  { id: "okay", icon: "🙂", label: "괜찮아요", tone: "크게 흔들리지 않고 지나온 하루" },
  { id: "neutral", icon: "▫️", label: "무덤덤해요", tone: "선명하지 않아도 그대로 괜찮은 하루" },
  { id: "mixed", icon: "🌀", label: "복잡해요", tone: "여러 마음이 겹쳐 정리가 필요한 하루" },
  { id: "anxious", icon: "☁️", label: "불안해요", tone: "생각이 많아 마음이 긴장된 하루" },
  { id: "sad", icon: "💧", label: "슬퍼요", tone: "마음 한쪽이 조용히 가라앉은 하루" },
  { id: "angry", icon: "⚡", label: "화나요", tone: "내 경계가 건드려진 것 같은 하루" },
  { id: "tired", icon: "🌙", label: "지쳤어요", tone: "에너지를 천천히 아껴야 하는 하루" },
  { id: "lonely", icon: "🫧", label: "외로워요", tone: "연결이 조금 더 필요하게 느껴진 하루" }
];

const commentByEmotion: Record<EmotionCode, string[]> = {
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

function isDiaryEmotion(value: unknown): value is EmotionCode {
  return typeof value === "string" && emotionOptions.some((option) => option.id === value);
}

function getEmotionLabel(value: string) {
  return emotionOptions.find((item) => item.id === value)?.label || "감정 기록";
}

function readLegacyDiaryEntries() {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(DIARY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LegacyDiaryEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry) => isDiaryEmotion(entry.emotion) && typeof entry.text === "string");
  } catch {
    return [];
  }
}

function saveDraft(emotion: EmotionCode, text: string) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(DIARY_DRAFT_KEY, JSON.stringify({ emotion, text }));
  } catch {
    // Draft preservation is best-effort.
  }
}

function readDraft() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(DIARY_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { emotion?: string; text?: string };
    return {
      emotion: isDiaryEmotion(parsed.emotion) ? parsed.emotion : "calm",
      text: typeof parsed.text === "string" ? parsed.text : ""
    };
  } catch {
    return null;
  }
}

function clearDraft() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(DIARY_DRAFT_KEY);
  } catch {
    // Non-critical cleanup.
  }
}

function createDiaryComment(emotion: EmotionCode, text: string) {
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

function getKoreaDateString(value = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(value);
}

export default function DiaryPage() {
  const router = useRouter();
  const { isConfigured, isLoading: isAuthLoading, user } = useAuth();
  const [emotion, setEmotion] = useState<EmotionCode>("calm");
  const [text, setText] = useState("");
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [legacyEntries, setLegacyEntries] = useState<LegacyDiaryEntry[]>([]);
  const [status, setStatus] = useState<DiaryStatus | null>(null);
  const [isLoadingEntries, setIsLoadingEntries] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [editingEmotion, setEditingEmotion] = useState<EmotionCode | null>(null);
  const latestEntry = entries[0];
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  useEffect(() => {
    const draft = readDraft();
    if (draft) {
      setEmotion(draft.emotion);
      setText(draft.text);
    }
    setLegacyEntries(readLegacyDiaryEntries());
  }, []);

  useEffect(() => {
    const rawEmotion = Array.isArray(router.query.emotion) ? router.query.emotion[0] : router.query.emotion;

    if (isDiaryEmotion(rawEmotion)) {
      setEmotion(rawEmotion);
    }
  }, [router.query.emotion]);

  useEffect(() => {
    if (!user) {
      setEntries([]);
      setIsLoadingEntries(false);
      return;
    }

    loadDiaryEntries();
  }, [user?.id]);

  useEffect(() => {
    if (text.trim()) {
      saveDraft(emotion, text);
    }
  }, [emotion, text]);

  async function loadDiaryEntries() {
    if (!supabase || !user) return;

    setIsLoadingEntries(true);
    setStatus(null);

    const { data, error } = await supabase
      .from("diary_entries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      setStatus({ tone: "error", text: "감정일기를 불러오지 못했어요. 네트워크 상태를 확인한 뒤 다시 시도해주세요." });
      setIsLoadingEntries(false);
      return;
    }

    setEntries(data || []);
    setIsLoadingEntries(false);
  }

  async function submitDiary(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!text.trim()) return;

    if (!isConfigured || !supabase) {
      setStatus({ tone: "error", text: "Supabase 환경변수가 아직 설정되지 않아 기록을 저장할 수 없습니다." });
      return;
    }

    if (!user) {
      saveDraft(emotion, text);
      setStatus({
        tone: "neutral",
        text: "기록을 안전하게 저장하려면 로그인이 필요해요. 로그인하면 휴대전화와 PC에서 같은 기록을 이어서 볼 수 있습니다."
      });
      return;
    }

    setIsSaving(true);
    setStatus(null);

    const aiComment = createDiaryComment(emotion, text);
    const { data, error } = await supabase
      .from("diary_entries")
      .insert({
        user_id: user.id,
        emotion_code: emotion,
        emotion_label: getEmotionLabel(emotion),
        content: text.trim(),
        ai_comment: aiComment,
        entry_date: getKoreaDateString()
      })
      .select("*")
      .single();

    if (error || !data) {
      setStatus({ tone: "error", text: "저장하지 못했어요. 잠시 후 다시 시도해주세요." });
      setIsSaving(false);
      return;
    }

    setEntries((items) => [data, ...items]);
    setText("");
    clearDraft();
    setStatus({ tone: "success", text: "저장 완료. 이 기록은 로그인한 계정에 안전하게 저장되었습니다." });
    setIsSaving(false);
  }

  async function updateEntry(entry: DiaryEntry) {
    if (!supabase || !user || !editingText.trim()) return;

    const nextEmotion = editingEmotion || entry.emotion_code;
    const nextEmotionLabel = emotionOptions.find((option) => option.id === nextEmotion)?.label || entry.emotion_label;
    const nextComment = createDiaryComment(nextEmotion, editingText);
    const { data, error } = await supabase
      .from("diary_entries")
      .update({
        emotion_code: nextEmotion,
        emotion_label: nextEmotionLabel,
        content: editingText.trim(),
        ai_comment: nextComment
      })
      .eq("id", entry.id)
      .select("*")
      .single();

    if (error || !data) {
      setStatus({ tone: "error", text: "기록을 수정하지 못했어요. 다시 시도해주세요." });
      return;
    }

    setEntries((items) => items.map((item) => (item.id === data.id ? data : item)));
    setEditingId(null);
    setEditingText("");
    setEditingEmotion(null);
    setStatus({ tone: "success", text: "기록을 수정했습니다." });
  }

  async function deleteEntry(id: string) {
    if (!supabase || !user) return;

    const previousEntries = entries;
    setEntries((items) => items.filter((entry) => entry.id !== id));

    const { error } = await supabase.from("diary_entries").delete().eq("id", id);

    if (error) {
      setEntries(previousEntries);
      setStatus({ tone: "error", text: "기록을 삭제하지 못했어요. 다시 시도해주세요." });
      return;
    }

    setStatus({ tone: "success", text: "기록을 삭제했습니다." });
  }

  async function migrateLegacyEntries() {
    if (!supabase || !user || legacyEntries.length === 0) return;

    setIsMigrating(true);
    setStatus(null);

    const migrationKeys = legacyEntries.map((entry) => entry.id);
    const { data: existingRows } = await supabase
      .from("diary_entries")
      .select("migration_key")
      .in("migration_key", migrationKeys);
    const existingKeys = new Set((existingRows || []).map((row) => row.migration_key).filter(Boolean));
    const rows = legacyEntries
      .filter((entry) => !existingKeys.has(entry.id))
      .map((entry) => ({
        user_id: user.id,
        emotion_code: entry.emotion,
        emotion_label: getEmotionLabel(entry.emotion),
        content: entry.text.slice(0, 2000),
        ai_comment: entry.comment || createDiaryComment(entry.emotion, entry.text),
        entry_date: getKoreaDateString(new Date(entry.createdAt)),
        migration_key: entry.id,
        created_at: entry.createdAt
      }));

    if (rows.length === 0) {
      setStatus({ tone: "neutral", text: "이미 계정으로 옮긴 기록입니다." });
      setLegacyEntries([]);
      setIsMigrating(false);
      return;
    }

    const { error } = await supabase.from("diary_entries").insert(rows);

    if (error) {
      setStatus({ tone: "error", text: "일부 기록을 가져오지 못했어요. 잠시 후 다시 시도해주세요." });
      setIsMigrating(false);
      return;
    }

    await loadDiaryEntries();
    setStatus({ tone: "success", text: `${rows.length}개의 기존 기록을 계정으로 가져왔습니다.` });
    setLegacyEntries([]);
    setIsMigrating(false);
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

        {status ? <p className={`diary-status is-${status.tone}`}>{status.text}</p> : null}

        {!isAuthLoading && !user ? (
          <aside className="diary-login-panel">
            <strong>기록을 안전하게 저장하려면 로그인이 필요해요.</strong>
            <p>
              로그인하면 휴대전화와 PC에서
              <br />
              같은 기록을 이어서 볼 수 있습니다.
            </p>
            <div>
              <Link href="/login?next=/diary">
                <a className="primary-button">로그인하고 기록하기</a>
              </Link>
              <Link href="/signup">
                <a className="secondary-button">회원가입</a>
              </Link>
            </div>
          </aside>
        ) : null}

        {user && legacyEntries.length > 0 ? (
          <aside className="diary-migration-panel">
            <div>
              <strong>이 기기에 기존 SHIM Diary 기록이 있습니다.</strong>
              <p>
                계정에 옮기면 다른 기기에서도 기록을 이어서 볼 수 있어요. 기존 로컬 기록은 자동으로 삭제하지 않습니다.
              </p>
            </div>
            <button className="secondary-button" disabled={isMigrating} onClick={migrateLegacyEntries} type="button">
              <RefreshCw size={16} aria-hidden="true" />
              {isMigrating ? "가져오는 중..." : "기록 가져오기"}
            </button>
          </aside>
        ) : null}

        <section className="diary-layout" aria-label="감정일기 작성">
          <form className="diary-writer" onSubmit={submitDiary}>
            <div className="section-heading">
              <span>Today</span>
              <h2>오늘의 감정 기록</h2>
            </div>

            <fieldset className="diary-emotion-field">
              <legend>오늘의 감정상태</legend>
              <div className="diary-emotion-grid">
                {emotionOptions.map((option) => {
                  const isSelected = emotion === option.id;

                  return (
                    <button
                      aria-pressed={isSelected}
                      className="diary-emotion-button"
                      key={option.id}
                      onClick={() => setEmotion(option.id)}
                      type="button"
                    >
                      <span className="diary-emotion-head">
                        <span className="diary-emotion-icon" aria-hidden="true">
                          {option.icon}
                        </span>
                        <strong>{option.label}</strong>
                        <span className="diary-emotion-check" aria-hidden="true">
                          ✓
                        </span>
                      </span>
                      <span className="diary-emotion-tone">{option.tone}</span>
                    </button>
                  );
                })}
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
              <p>{DIARY_PREVIEW_MESSAGE}</p>
            </aside>

            <button className="primary-button diary-submit" disabled={!text.trim() || isSaving} type="submit">
              <PenLine size={17} aria-hidden="true" />
              {isSaving ? "저장 중..." : "감정일기 저장"}
            </button>
          </form>

          <aside className="diary-history" aria-label="최근 감정일기">
            <div className="section-heading">
              <span>Archive</span>
              <h2>최근 기록</h2>
            </div>

            {isAuthLoading || isLoadingEntries ? <p className="diary-loading">감정일기를 불러오고 있어요.</p> : null}

            {!isAuthLoading && user && !isLoadingEntries && latestEntry ? (
              <div className="diary-latest-card">
                <span className="diary-date">
                  <CalendarDays size={15} aria-hidden="true" />
                  {formatDate(latestEntry.created_at)}
                </span>
                <strong>{latestEntry.emotion_label}</strong>
                <p>{latestEntry.ai_comment}</p>
              </div>
            ) : null}

            {!isAuthLoading && user && !isLoadingEntries && !latestEntry ? (
              <div className="diary-empty">
                <strong>아직 남긴 기록이 없어요.</strong>
                <span>
                  오늘의 감정을 한 번 남기면
                  <br />
                  첫 번째 마음의 흐름이 시작됩니다.
                </span>
              </div>
            ) : null}

            {!user && !isAuthLoading ? (
              <div className="diary-empty">
                <strong>로그인 후 기록을 볼 수 있어요.</strong>
                <span>개인 Diary 기록은 계정별로 안전하게 분리되어 저장됩니다.</span>
              </div>
            ) : null}

            <div className="diary-entry-list">
              {entries.map((entry) => (
                <article className="diary-entry-card" key={entry.id}>
                  <div>
                    <span>{formatDate(entry.created_at)}</span>
                    <strong>{entry.emotion_label}</strong>
                  </div>

                  {editingId === entry.id ? (
                    <div className="diary-edit-box">
                      <label>
                        <span>감정 상태</span>
                        <select
                          aria-label="수정할 감정 상태"
                          onChange={(event) => setEditingEmotion(event.target.value as EmotionCode)}
                          value={editingEmotion || entry.emotion_code}
                        >
                          {emotionOptions.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.label} - {option.tone}
                            </option>
                          ))}
                        </select>
                      </label>
                      <textarea
                        aria-label="감정일기 수정"
                        maxLength={800}
                        onChange={(event) => setEditingText(event.target.value)}
                        rows={5}
                        value={editingText}
                      />
                      <div>
                        <button className="secondary-button" onClick={() => updateEntry(entry)} type="button">
                          <Check size={15} aria-hidden="true" />
                          저장
                        </button>
                        <button
                          className="secondary-button"
                          onClick={() => {
                            setEditingId(null);
                            setEditingText("");
                            setEditingEmotion(null);
                          }}
                          type="button"
                        >
                          <X size={15} aria-hidden="true" />
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p>{entry.content}</p>
                      <blockquote>{entry.ai_comment}</blockquote>
                      <div className="diary-entry-actions">
                        <button
                          aria-label="기록 수정"
                          className="diary-delete-button"
                          onClick={() => {
                            setEditingId(entry.id);
                            setEditingText(entry.content);
                            setEditingEmotion(entry.emotion_code);
                          }}
                          type="button"
                        >
                          <Edit3 size={15} aria-hidden="true" />
                        </button>
                        <button
                          aria-label="기록 삭제"
                          className="diary-delete-button"
                          onClick={() => deleteEntry(entry.id)}
                          type="button"
                        >
                          <Trash2 size={15} aria-hidden="true" />
                        </button>
                      </div>
                    </>
                  )}
                </article>
              ))}
            </div>
          </aside>
        </section>

        <p className="notice">
          {disclaimer} 로그인한 사용자의 감정일기는 Supabase에 계정별로 저장되며, 비로그인 작성 내용은 임시 draft로만 보존됩니다.
        </p>
      </main>
    </>
  );
}
