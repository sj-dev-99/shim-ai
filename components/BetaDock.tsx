import { AlertTriangle, MessageCircle, Send, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { BETA_VERSION, BetaEventType, submitBetaEvent } from "../lib/beta";

type ModalType = Extract<BetaEventType, "feedback" | "bug_report">;

const modalCopy: Record<ModalType, { title: string; placeholder: string; button: string }> = {
  feedback: {
    title: "피드백 보내기",
    placeholder: "좋았던 점, 어색했던 점, 추가되면 좋을 기능을 적어주세요.",
    button: "피드백 보내기"
  },
  bug_report: {
    title: "오류 신고",
    placeholder: "어떤 화면에서 어떤 문제가 있었는지 적어주세요.",
    button: "오류 신고"
  }
};

export default function BetaDock() {
  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(5);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!modalType || !message.trim()) return;

    setStatus("sending");
    const ok = await submitBetaEvent({
      eventType: modalType,
      message: message.trim(),
      score: modalType === "feedback" ? score : undefined
    });

    if (ok) {
      setStatus("sent");
      setMessage("");
      window.setTimeout(() => {
        setModalType(null);
        setStatus("idle");
      }, 900);
      return;
    }

    setStatus("error");
  }

  function open(type: ModalType) {
    setModalType(type);
    setScore(5);
    setStatus("idle");
    setMessage("");
  }

  return (
    <>
      <div className="beta-dock" aria-label="베타 테스트 도구">
        <span className="beta-version">{BETA_VERSION}</span>
        <button className="beta-action" onClick={() => open("feedback")} type="button">
          <MessageCircle size={16} aria-hidden="true" />
          피드백
        </button>
        <button className="beta-action" onClick={() => open("bug_report")} type="button">
          <AlertTriangle size={16} aria-hidden="true" />
          오류 신고
        </button>
      </div>

      {modalType ? (
        <div className="beta-modal-backdrop" role="presentation">
          <section className="beta-modal" role="dialog" aria-modal="true" aria-label={modalCopy[modalType].title}>
            <div className="beta-modal-header">
              <h2>{modalCopy[modalType].title}</h2>
              <button
                aria-label="닫기"
                className="beta-close"
                onClick={() => setModalType(null)}
                type="button"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <form onSubmit={submit}>
              {modalType === "feedback" ? (
                <label className="beta-score-field">
                  <span>평점</span>
                  <select onChange={(event) => setScore(Number(event.target.value))} value={score}>
                    <option value={5}>5점 - 매우 만족</option>
                    <option value={4}>4점 - 만족</option>
                    <option value={3}>3점 - 보통</option>
                    <option value={2}>2점 - 아쉬움</option>
                    <option value={1}>1점 - 매우 아쉬움</option>
                  </select>
                </label>
              ) : null}
              <textarea
                className="beta-textarea"
                onChange={(event) => setMessage(event.target.value)}
                placeholder={modalCopy[modalType].placeholder}
                rows={5}
                value={message}
              />
              <button className="primary-button beta-submit" disabled={!message.trim() || status === "sending"} type="submit">
                <Send size={16} aria-hidden="true" />
                {status === "sending" ? "전송 중" : modalCopy[modalType].button}
              </button>
              {status === "sent" ? <p className="beta-status">전송되었습니다. 고맙습니다.</p> : null}
              {status === "error" ? <p className="beta-status">전송에 실패했습니다. 잠시 후 다시 시도해주세요.</p> : null}
            </form>
          </section>
        </div>
      ) : null}
    </>
  );
}
