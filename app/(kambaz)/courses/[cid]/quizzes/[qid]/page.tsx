"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, ListGroup, Spinner, Table } from "react-bootstrap";
import { RootState } from "../../../../store";
import { updateQuizInList } from "../../../quizzes/reducer";
import * as quizClient from "../../../quizzes/client";
import * as attemptClient from "../../../quizzes/attemptClient";

const CAN_EDIT_QUIZZES_ROLES = ["FACULTY", "ADMIN", "TA"];

function yn(value: unknown): string {
  return value ? "Yes" : "No";
}

function formatDateTime(value: unknown): string {
  if (value == null || value === "") return "—";
  const d = new Date(value as string | number | Date);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function timeLimitLabel(quiz: Record<string, unknown>): string {
  if (!quiz.timeLimitEnabled) return "No";
  const n = Number(quiz.timeLimit);
  if (Number.isNaN(n) || n <= 0) return "No";
  return `${n} Minute${n === 1 ? "" : "s"}`;
}

function showCorrectAnswersLabel(quiz: Record<string, unknown>): string {
  return yn(quiz.showCorrectAnswers);
}

function isAfterOrNoAvailableDate(quiz: Record<string, unknown>): boolean {
  const ad = quiz.availableDate;
  if (ad == null || ad === "") return true;
  const t = new Date(ad as string | number | Date).getTime();
  if (Number.isNaN(t)) return true;
  return Date.now() >= t;
}

function maxAllowedAttempts(quiz: Record<string, unknown>): number {
  if (!quiz.multipleAttempts) return 1;
  const n = Number(quiz.howManyAttempts);
  if (Number.isNaN(n) || n < 1) return 1;
  return n;
}

export default function QuizDetailsPage() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  const canEditQuizzes =
    !!currentUser && CAN_EDIT_QUIZZES_ROLES.includes(currentUser.role);
  const isStudent = currentUser?.role === "STUDENT";

  const [quiz, setQuiz] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishBusy, setPublishBusy] = useState(false);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [attemptsLoading, setAttemptsLoading] = useState(false);

  const loadQuiz = useCallback(async () => {
    if (!qid) return;
    setLoading(true);
    try {
      const data = await quizClient.findQuizById(qid as string);
      setQuiz(data as Record<string, unknown>);
    } catch {
      setQuiz(null);
    } finally {
      setLoading(false);
    }
  }, [qid]);

  useEffect(() => {
    void loadQuiz();
  }, [loadQuiz]);

  const loadAttempts = useCallback(async () => {
    if (!qid || !isStudent) return;
    setAttemptsLoading(true);
    try {
      const data = await attemptClient.findAttemptsForQuiz(qid as string);
      setAttempts(Array.isArray(data) ? data : []);
    } catch {
      setAttempts([]);
    } finally {
      setAttemptsLoading(false);
    }
  }, [qid, isStudent]);

  useEffect(() => {
    if (!isStudent || !quiz) return;
    void loadAttempts();
  }, [isStudent, quiz, loadAttempts]);

  const handlePublishToggle = async () => {
    if (!qid || !quiz) return;
    setPublishBusy(true);
    try {
      if (quiz.published) {
        await quizClient.unpublishQuiz(qid as string);
      } else {
        await quizClient.publishQuiz(qid as string);
      }
      const updated = await quizClient.findQuizById(qid as string);
      setQuiz(updated as Record<string, unknown>);
      dispatch(updateQuizInList(updated));
    } finally {
      setPublishBusy(false);
    }
  };

  if (loading) {
    return (
      <div id="wd-quiz-details" className="p-3 d-flex align-items-center gap-2">
        <Spinner animation="border" size="sm" />
        <span>Loading quiz…</span>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div id="wd-quiz-details" className="p-3">
        <p className="text-danger mb-0">Quiz not found.</p>
      </div>
    );
  }

  const published = Boolean(quiz.published);
  const availableNow = isAfterOrNoAvailableDate(quiz);
  const attemptCap = maxAllowedAttempts(quiz);
  const attemptsUsed = attempts.length;
  const hasAttemptsLeft = attemptsUsed < attemptCap;
  const showStartQuiz =
    isStudent && published && availableNow && hasAttemptsLeft;

  const rows: { label: string; value: string }[] = [
    { label: "Quiz Type", value: String(quiz.quizType ?? "—") },
    { label: "Points", value: String(quiz.points ?? 0) },
    { label: "Assignment Group", value: String(quiz.assignmentGroup ?? "—") },
    { label: "Shuffle Answers", value: yn(quiz.shuffleAnswers) },
    { label: "Time Limit", value: timeLimitLabel(quiz) },
    { label: "Multiple Attempts", value: yn(quiz.multipleAttempts) },
    { label: "How Many Attempts", value: String(quiz.howManyAttempts ?? "—") },
    { label: "Show Correct Answers", value: showCorrectAnswersLabel(quiz) },
    {
      label: "Access Code",
      value:
        quiz.accessCode != null && String(quiz.accessCode).trim() !== ""
          ? String(quiz.accessCode)
          : "—",
    },
    { label: "One Question at a Time", value: yn(quiz.oneQuestionAtATime) },
    { label: "Webcam Required", value: yn(quiz.webcamRequired) },
    {
      label: "Lock Questions After Answering",
      value: yn(quiz.lockQuestionsAfterAnswering),
    },
    { label: "Due Date", value: formatDateTime(quiz.dueDate) },
    { label: "Available Date", value: formatDateTime(quiz.availableDate) },
    { label: "Until Date", value: formatDateTime(quiz.untilDate) },
  ];

  return (
    <div id="wd-quiz-details" className="p-3">
      {canEditQuizzes && (
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
          <div className="d-flex flex-wrap gap-2">
            <Button
              variant="secondary"
              id="wd-quiz-preview-btn"
              onClick={() =>
                router.push(`/courses/${cid}/quizzes/${qid}/preview`)
              }
            >
              Preview
            </Button>
            <Button
              variant="primary"
              id="wd-quiz-edit-btn"
              onClick={() =>
                router.push(`/courses/${cid}/quizzes/${qid}/editor`)
              }
            >
              Edit
            </Button>
            <Button
              variant={quiz.published ? "warning" : "success"}
              id="wd-quiz-publish-toggle-btn"
              disabled={publishBusy}
              onClick={() => void handlePublishToggle()}
            >
              {quiz.published ? "Unpublish" : "Publish"}
            </Button>
          </div>
        </div>
      )}

      {isStudent && (
        <div className="mb-3">
          {!published && (
            <p className="text-muted mb-2">
              This quiz is not published and is not available to take.
            </p>
          )}
          {published && !availableNow && quiz.availableDate != null && (
            <p className="text-muted mb-2">
              This quiz is not available until{" "}
              {formatDateTime(quiz.availableDate)}.
            </p>
          )}
          {published &&
            availableNow &&
            !hasAttemptsLeft &&
            !attemptsLoading && (
              <p className="text-muted mb-2">No more attempts available.</p>
            )}
          {showStartQuiz && (
            <Button
              variant="danger"
              id="wd-quiz-start-btn"
              onClick={() =>
                router.push(`/courses/${cid}/quizzes/${qid}/take`)
              }
            >
              Start Quiz
            </Button>
          )}
          {attemptsLoading && (
            <span className="text-muted small ms-2">Loading attempts…</span>
          )}
        </div>
      )}

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <h2 className="h4 mb-4">
            {String(quiz.title ?? "Unnamed Quiz")}
          </h2>
          {quiz.description != null &&
            String(quiz.description).trim() !== "" && (
              <p className="text-muted small mb-4">
                {String(quiz.description)}
              </p>
            )}

          <h3 className="h6 text-uppercase text-secondary mb-3">Quiz details</h3>
          <Table borderless responsive className="mb-0 wd-quiz-details-table">
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <td
                    className="text-secondary py-2"
                    style={{ width: "42%", maxWidth: "280px" }}
                  >
                    {row.label}
                  </td>
                  <td className="py-2 fw-medium">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {isStudent && attempts.length > 0 && !attemptsLoading && (
        <div className="mt-4">
          <h3 className="h6 text-uppercase text-secondary mb-3">
            Previous attempts
          </h3>
          <ListGroup variant="flush" className="border rounded">
            {[...attempts]
              .sort(
                (a, b) =>
                  (Number(a.attemptNumber) || 0) -
                  (Number(b.attemptNumber) || 0),
              )
              .map((att: any) => (
                <ListGroup.Item
                  key={att._id}
                  className="d-flex flex-wrap justify-content-between align-items-center gap-2"
                >
                  <Link
                    href={`/courses/${cid}/quizzes/${qid}/attempts/${att._id}`}
                    className="fw-medium"
                  >
                    Attempt {att.attemptNumber ?? "—"}
                  </Link>
                  <span className="text-muted small">
                    Score: {att.score ?? 0} · Submitted{" "}
                    {formatDateTime(att.submittedAt)}
                  </span>
                </ListGroup.Item>
              ))}
          </ListGroup>
        </div>
      )}
    </div>
  );
}
