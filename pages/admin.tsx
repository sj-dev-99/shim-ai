import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Bug,
  CheckCircle2,
  ClipboardList,
  LockKeyhole,
  MessageSquareText,
  MousePointerClick,
  ThumbsDown,
  ThumbsUp,
  Users,
  Workflow
} from "lucide-react";
import { getAdminData } from "../lib/admin/adminRepository";
import { getTemporaryAdminSession } from "../lib/admin/auth";
import { isAdminRequestAuthenticated } from "../lib/admin/session";
import {
  AdminData,
  BugReportStatus,
  FeedbackStatus,
  VersionNote
} from "../lib/admin/types";
import { BETA_VERSION } from "../lib/beta";

type AdminTab = "dashboard" | "feedbacks" | "bugs" | "ratings" | "visitors" | "versions";

type AdminPageProps = {
  initialData: AdminData | null;
  isAuthenticated: boolean;
};

const adminTabs: Array<{ id: AdminTab; label: string; icon: typeof BarChart3 }> = [
  { id: "dashboard", label: "대시보드", icon: BarChart3 },
  { id: "feedbacks", label: "피드백 목록", icon: MessageSquareText },
  { id: "bugs", label: "오류 신고 목록", icon: Bug },
  { id: "ratings", label: "만족도", icon: ThumbsUp },
  { id: "visitors", label: "방문자 로그", icon: Users },
  { id: "versions", label: "버전 관리", icon: Workflow }
];

const feedbackStatusLabels: Record<FeedbackStatus, string> = {
  new: "신규",
  reviewing: "확인중",
  completed: "반영완료"
};

const bugStatusLabels: Record<BugReportStatus, string> = {
  new: "신규",
  reviewing: "확인중",
  fixed: "수정완료"
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function isToday(value: string) {
  const target = new Date(value);
  const now = new Date();
  return (
    target.getFullYear() === now.getFullYear() &&
    target.getMonth() === now.getMonth() &&
    target.getDate() === now.getDate()
  );
}

function StatusBadge({ children, tone }: { children: string; tone: "new" | "reviewing" | "done" }) {
  return <span className={`admin-status admin-status-${tone}`}>{children}</span>;
}

function DashboardCard({
  label,
  value,
  helper,
  icon: Icon
}: {
  label: string;
  value: string;
  helper: string;
  icon: typeof BarChart3;
}) {
  return (
    <article className="admin-stat-card">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{helper}</small>
      </div>
      <span className="admin-stat-icon">
        <Icon size={22} aria-hidden="true" />
      </span>
    </article>
  );
}

function feedbackTone(status: FeedbackStatus) {
  if (status === "completed") return "done";
  return status === "reviewing" ? "reviewing" : "new";
}

function bugTone(status: BugReportStatus) {
  if (status === "fixed") return "done";
  return status === "reviewing" ? "reviewing" : "new";
}

function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        setError(result.error || "로그인에 실패했습니다.");
        return;
      }

      router.replace("/admin");
    } catch {
      setError("로그인 요청 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>Admin Login | shim.ai</title>
        <meta name="robots" content="noindex,nofollow,noarchive" />
      </Head>
      <main className="admin-login-shell">
        <section className="admin-login-card" aria-label="관리자 로그인">
          <span className="admin-login-icon">
            <LockKeyhole size={24} aria-hidden="true" />
          </span>
          <span className="admin-kicker">SHIM AI Admin</span>
          <h1>관리자 비밀번호를 입력해주세요</h1>
          <p>베타 운영 데이터는 관리자 인증 후에만 확인할 수 있습니다.</p>
          <form className="admin-login-form" onSubmit={submitLogin}>
            <label htmlFor="admin-password">비밀번호</label>
            <input
              autoComplete="current-password"
              id="admin-password"
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
            />
            {error ? <p className="admin-login-error">{error}</p> : null}
            <button className="admin-primary-button" disabled={!password || isSubmitting} type="submit">
              {isSubmitting ? "확인 중" : "관리자 페이지 열기"}
            </button>
          </form>
        </section>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<AdminPageProps> = async ({ req, res }) => {
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");

  const isAuthenticated = isAdminRequestAuthenticated(req);
  if (!isAuthenticated) {
    return {
      props: {
        initialData: null,
        isAuthenticated: false
      }
    };
  }

  // Mock data enters through the repository boundary so a DB client can replace it later.
  return {
    props: {
      initialData: await getAdminData(),
      isAuthenticated: true
    }
  };
};

function AdminDashboard({ initialData }: { initialData: AdminData }) {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [data, setData] = useState(initialData);
  const [versionDraft, setVersionDraft] = useState("");
  // Temporary session placeholder. Replace with server-side auth and role checks later.
  const session = getTemporaryAdminSession();

  // Derived dashboard metrics stay close to the UI while raw data access stays in lib/admin.
  const ratingSummary = useMemo(() => {
    const up = data.aiRatings.filter((item) => item.rating === "up").length;
    const down = data.aiRatings.filter((item) => item.rating === "down").length;
    const total = up + down;
    const percent = total > 0 ? Math.round((up / total) * 100) : 0;
    return { up, down, total, percent };
  }, [data.aiRatings]);

  const todayVisitors = useMemo(
    () => data.visitorLogs.filter((item) => isToday(item.visitedAt)).length,
    [data.visitorLogs]
  );

  // These local mutators mimic optimistic updates until Supabase/Firebase persistence is added.
  function updateFeedbackStatus(id: string, status: FeedbackStatus) {
    setData((current) => {
      if (!current) return current;
      return {
        ...current,
        feedbacks: current.feedbacks.map((item) => (item.id === id ? { ...item, status } : item))
      };
    });
  }

  function updateFeedbackMemo(id: string, adminMemo: string) {
    setData((current) => {
      if (!current) return current;
      return {
        ...current,
        feedbacks: current.feedbacks.map((item) => (item.id === id ? { ...item, adminMemo } : item))
      };
    });
  }

  function updateBugStatus(id: string, status: BugReportStatus) {
    setData((current) => {
      if (!current) return current;
      return {
        ...current,
        bugReports: current.bugReports.map((item) => (item.id === id ? { ...item, status } : item))
      };
    });
  }

  function updateBugMemo(id: string, adminMemo: string) {
    setData((current) => {
      if (!current) return current;
      return {
        ...current,
        bugReports: current.bugReports.map((item) => (item.id === id ? { ...item, adminMemo } : item))
      };
    });
  }

  function addVersionNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!versionDraft.trim()) return;

    const nextNote: VersionNote = {
      id: `ver-${Date.now()}`,
      version: BETA_VERSION,
      title: `${BETA_VERSION} 업데이트 메모`,
      description: versionDraft.trim(),
      createdAt: new Date().toISOString()
    };

    setData((current) => {
      if (!current) return current;
      return {
        ...current,
        versionNotes: [nextNote, ...current.versionNotes]
      };
    });
    setVersionDraft("");
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard | shim.ai</title>
        <meta name="description" content="SHIM AI 베타 테스트 운영 관리자 페이지" />
        <meta name="robots" content="noindex,nofollow,noarchive" />
      </Head>
      <main className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <span className="admin-brand-mark">S</span>
            <div>
              <strong>shim.ai</strong>
              <span>Beta Admin</span>
            </div>
          </div>

          <nav className="admin-nav" aria-label="관리자 메뉴">
            {adminTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  aria-current={activeTab === tab.id ? "page" : undefined}
                  className="admin-nav-item"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                >
                  <Icon size={18} aria-hidden="true" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="admin-session">
            <span>{session.displayName}</span>
            <strong>{session.role}</strong>
          </div>
        </aside>

        <section className="admin-content">
          <header className="admin-header">
            <div>
              <span className="admin-kicker">SHIM AI Beta Operations</span>
              <h1>{adminTabs.find((tab) => tab.id === activeTab)?.label}</h1>
            </div>
            <span className="admin-version">{BETA_VERSION}</span>
          </header>

          {activeTab === "dashboard" ? (
            <div className="admin-section-stack">
              <section className="admin-stat-grid" aria-label="베타 운영 요약">
                <DashboardCard icon={Users} label="오늘 방문자 수" value={`${todayVisitors}명`} helper="방문자 로그 기준" />
                <DashboardCard
                  icon={MessageSquareText}
                  label="총 피드백 수"
                  value={`${data.feedbacks.length}건`}
                  helper="전체 피드백"
                />
                <DashboardCard
                  icon={AlertTriangle}
                  label="총 오류 신고 수"
                  value={`${data.bugReports.length}건`}
                  helper="전체 오류 신고"
                />
                <DashboardCard
                  icon={ThumbsUp}
                  label="만족도 비율"
                  value={`${ratingSummary.percent}%`}
                  helper={`${ratingSummary.up} 좋아요 / ${ratingSummary.down} 아쉬워요`}
                />
              </section>

              <section className="admin-two-column">
                <div className="admin-panel">
                  <div className="admin-panel-heading">
                    <h2>최근 피드백 5개</h2>
                    <ClipboardList size={18} aria-hidden="true" />
                  </div>
                  <div className="admin-mini-list">
                    {data.feedbacks.slice(0, 5).map((item) => (
                      <article key={item.id}>
                        <strong>{item.userName}</strong>
                        <p>{item.message}</p>
                        <span>{formatDate(item.createdAt)}</span>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="admin-panel">
                  <div className="admin-panel-heading">
                    <h2>최근 오류 신고 5개</h2>
                    <Bug size={18} aria-hidden="true" />
                  </div>
                  <div className="admin-mini-list">
                    {data.bugReports.slice(0, 5).map((item) => (
                      <article key={item.id}>
                        <strong>{item.page}</strong>
                        <p>{item.message}</p>
                        <span>{formatDate(item.createdAt)}</span>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          ) : null}

          {activeTab === "feedbacks" ? (
            <div className="admin-panel">
              <div className="admin-panel-heading">
                <h2>피드백 목록</h2>
                <span>{data.feedbacks.length}건</span>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>사용자</th>
                      <th>평점</th>
                      <th>피드백 내용</th>
                      <th>작성일</th>
                      <th>상태</th>
                      <th>관리자 메모</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.feedbacks.map((item) => (
                      <tr key={item.id}>
                        <td>{item.userName}</td>
                        <td>{`${item.rating}점`}</td>
                        <td>{item.message}</td>
                        <td>{formatDate(item.createdAt)}</td>
                        <td>
                          <StatusBadge tone={feedbackTone(item.status)}>
                            {feedbackStatusLabels[item.status]}
                          </StatusBadge>
                          <select
                            aria-label="피드백 상태 변경"
                            className="admin-select"
                            onChange={(event) => updateFeedbackStatus(item.id, event.target.value as FeedbackStatus)}
                            value={item.status}
                          >
                            <option value="new">신규</option>
                            <option value="reviewing">확인중</option>
                            <option value="completed">반영완료</option>
                          </select>
                        </td>
                        <td>
                          <textarea
                            aria-label="피드백 관리자 메모"
                            className="admin-memo"
                            onChange={(event) => updateFeedbackMemo(item.id, event.target.value)}
                            placeholder="관리자 메모"
                            rows={3}
                            value={item.adminMemo}
                          />
                          <button className="admin-save-button" type="button">
                            저장됨
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {activeTab === "bugs" ? (
            <div className="admin-panel">
              <div className="admin-panel-heading">
                <h2>오류 신고 목록</h2>
                <span>{data.bugReports.length}건</span>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>발생 페이지</th>
                      <th>오류 내용</th>
                      <th>기기</th>
                      <th>브라우저</th>
                      <th>작성일</th>
                      <th>상태</th>
                      <th>관리자 메모</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.bugReports.map((item) => (
                      <tr key={item.id}>
                        <td>{item.page}</td>
                        <td>{item.message}</td>
                        <td>{item.device}</td>
                        <td>{item.browser}</td>
                        <td>{formatDate(item.createdAt)}</td>
                        <td>
                          <StatusBadge tone={bugTone(item.status)}>
                            {bugStatusLabels[item.status]}
                          </StatusBadge>
                          <select
                            aria-label="오류 신고 상태 변경"
                            className="admin-select"
                            onChange={(event) => updateBugStatus(item.id, event.target.value as BugReportStatus)}
                            value={item.status}
                          >
                            <option value="new">신규</option>
                            <option value="reviewing">확인중</option>
                            <option value="fixed">수정완료</option>
                          </select>
                        </td>
                        <td>
                          <textarea
                            aria-label="오류 신고 관리자 메모"
                            className="admin-memo"
                            onChange={(event) => updateBugMemo(item.id, event.target.value)}
                            placeholder="관리자 메모"
                            rows={3}
                            value={item.adminMemo}
                          />
                          <button className="admin-save-button" type="button">
                            저장됨
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {activeTab === "ratings" ? (
            <div className="admin-section-stack">
              <section className="admin-stat-grid compact">
                <DashboardCard icon={ThumbsUp} label="좋아요" value={`${ratingSummary.up}건`} helper="긍정 응답" />
                <DashboardCard icon={ThumbsDown} label="싫어요" value={`${ratingSummary.down}건`} helper="개선 필요 응답" />
                <DashboardCard
                  icon={CheckCircle2}
                  label="만족도"
                  value={`${ratingSummary.percent}%`}
                  helper={`${ratingSummary.total}개 응답 기준`}
                />
              </section>
              <div className="admin-panel">
                <div className="admin-panel-heading">
                  <h2>사용자 추가 의견</h2>
                  <span>{data.aiRatings.length}건</span>
                </div>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>평가</th>
                        <th>결과 유형</th>
                        <th>추가 의견</th>
                        <th>작성일</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.aiRatings.map((item) => (
                        <tr key={item.id}>
                          <td>{item.rating === "up" ? "좋아요" : "싫어요"}</td>
                          <td>{item.resultType}</td>
                          <td>{item.comment}</td>
                          <td>{formatDate(item.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "visitors" ? (
            <div className="admin-panel">
              <div className="admin-panel-heading">
                <h2>방문자 로그</h2>
                <span>{data.visitorLogs.length}건</span>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>접속 시간</th>
                      <th>접속 페이지</th>
                      <th>기기</th>
                      <th>브라우저</th>
                      <th>테스트 완료</th>
                      <th>이탈 위치</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.visitorLogs.map((item) => (
                      <tr key={item.id}>
                        <td>{formatDate(item.visitedAt)}</td>
                        <td>{item.page}</td>
                        <td>{item.device}</td>
                        <td>{item.browser}</td>
                        <td>{item.completedTest ? "완료" : "미완료"}</td>
                        <td>{item.exitPoint}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {activeTab === "versions" ? (
            <div className="admin-section-stack">
              <section className="admin-version-panel">
                <div>
                  <span>현재 버전</span>
                  <strong>{BETA_VERSION}</strong>
                </div>
                <form className="admin-version-form" onSubmit={addVersionNote}>
                  <textarea
                    aria-label="업데이트 내역 작성"
                    className="admin-memo"
                    onChange={(event) => setVersionDraft(event.target.value)}
                    placeholder="이번 배포에서 바뀐 점을 적어주세요."
                    rows={4}
                    value={versionDraft}
                  />
                  <button className="admin-primary-button" type="submit">
                    변경사항 추가
                  </button>
                </form>
              </section>

              <section className="admin-panel">
                <div className="admin-panel-heading">
                  <h2>버전별 변경사항</h2>
                  <MousePointerClick size={18} aria-hidden="true" />
                </div>
                <div className="admin-version-list">
                  {data.versionNotes.map((item) => (
                    <article key={item.id}>
                      <span>{formatDate(item.createdAt)}</span>
                      <strong>
                        {item.version} · {item.title}
                      </strong>
                      <p>{item.description}</p>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          ) : null}
        </section>
      </main>
    </>
  );
}

export default function AdminPage({ initialData, isAuthenticated }: AdminPageProps) {
  if (!isAuthenticated || !initialData) {
    return <AdminLogin />;
  }

  return <AdminDashboard initialData={initialData} />;
}
