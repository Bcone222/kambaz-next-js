"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button, Card, Spinner } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import * as quizClient from "../../../../../quizzes/client";
import * as attemptClient from "../../../../../quizzes/attemptClient";

type Choice = { _id: string; text?: string; isCorrect?: boolean };
type Blank = { _id: string; correctAnswers?: string[] };

type Question = {
  _id: string;
  title?: string;
  questionText?: string;
  points?: number;
  questionType?: string;
  choices?: Choice[];
  correctAnswer?: boolean;
  blanks?: Blank[];
};

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

function toBool(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return Boolean(value);
}

function choiceLabel(choices: Choice[], id: unknown): string {
  if (id == null || id === "") return "—";
  const c = choices.find((x) => String(x._id) === String(id));
  return c?.text?.trim() ? String(c.text) : "—";
}

function totalQuizPoints(questions: Question[]): number {
  return questions.reduce((s, q) => s + (Number(q.points) || 0), 0);
}

export default function ReviewAttemptPage() {
  const { cid, qid, attemptId } = useParams();
  const router = useRouter();

  const [quiz, setQuiz] = useState<Record<string, unknown> | null>(null);
  const [attempt, setAttempt] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!qid || !attemptId) return;
    setLoading(true);
    setError(null);
    try {
      const [quizData, attemptData] = await Promise.all([
        quizClient.findQuizById(qid as string) as Promise<Record<string, unknown>>,
        attemptClient.findAttemptById(attemptId as string),
      ]);
      let q = quizData;
      const embedded = (q.questions as unknown[]) || [];
      if (!embedded.length) {
        const list = await quizClient.findQuestionsForQuiz(qid as string);
        q = { ...q, questions: list };
      }
      setQuiz(q);
      setAttempt(attemptData as Record<string, unknown>);
      if (
        attemptData &&
        String((attemptData as any).quiz) !== String(qid)
      ) {
        setError("This attempt does not belong to this quiz.");
      }
    } catch {
      setQuiz(null);
      setAttempt(null);
      setError("Could not load attempt or quiz.");
    } finally {
      setLoading(false);
    }
  }, [qid, attemptId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div
        id="wd-quiz-attempt-review"
        className="p-3 d-flex align-items-center gap-2"
      >
        <Spinner animation="border" size="sm" />
        <span>Loading…</span>
      </div>
    );
  }

  if (error || !quiz || !attempt) {
    return (
      <div id="wd-quiz-attempt-review" className="p-3">
        <p className="text-danger mb-3">{error ?? "Not found."}</p>
        <Button
          variant="secondary"
          onClick={() => router.push(`/courses/${cid}/quizzes/${qid}`)}
        >
          Back to Quiz
        </Button>
      </div>
    );
  }

  const questions = (quiz.questions as Question[]) || [];
  const showCorrect = Boolean(quiz.showCorrectAnswers);
  const answersArr = (attempt.answers as any[]) || [];
  const maxPoints = totalQuizPoints(questions);

  const getEntry = (questionId: string) =>
    answersArr.find((a) => String(a.questionId) === String(questionId));

  return (
    <div id="wd-quiz-attempt-review" className="p-3">
      <div className="mb-4">
        <h1 className="h4 mb-2">{String(quiz.title ?? "Quiz")}</h1>
        <p className="text-muted mb-1">
          Attempt {String(attempt.attemptNumber ?? "—")} · Submitted{" "}
          {formatDateTime(attempt.submittedAt)}
        </p>
        <p className="fw-medium mb-0">
          Score: {String(attempt.score ?? 0)} / {maxPoints} points
        </p>
      </div>

      <Button
        variant="secondary"
        className="mb-4"
        onClick={() => router.push(`/courses/${cid}/quizzes/${qid}`)}
      >
        Back to Quiz
      </Button>

      <div
        className="overflow-auto border rounded p-3 bg-light"
        style={{ maxHeight: "min(75vh, 960px)" }}
      >
        {questions.map((q, qi) => {
          const entry = getEntry(q._id);
          const rawAnswer = entry?.answer;
          const qt = q.questionType ?? "MULTIPLE_CHOICE";

          return (
            <Card key={q._id || qi} className="mb-3 border shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                  <h2 className="h6 mb-0">
                    {q.title?.trim() ? q.title : `Question ${qi + 1}`}
                  </h2>
                  <span className="badge bg-secondary">{q.points ?? 1} pts</span>
                </div>
                {q.questionText ? (
                  <p className="small text-body mb-3">{q.questionText}</p>
                ) : null}

                <div className="small">
                  <div className="fw-medium mb-2">Your answer:</div>

                  {qt === "MULTIPLE_CHOICE" && (
                    <div>
                      {!showCorrect && (
                        <div className="ps-2 border-start border-3 border-secondary">
                          {choiceLabel(q.choices || [], rawAnswer)}
                        </div>
                      )}
                      {showCorrect && (() => {
                        const choices = q.choices || [];
                        const correctChoice = choices.find((c) => c.isCorrect);
                        const sid = rawAnswer != null ? String(rawAnswer) : "";
                        const picked = choices.find(
                          (c) => String(c._id) === sid,
                        );
                        const isRight = Boolean(picked?.isCorrect);

                        return (
                          <div>
                            {isRight ? (
                              <div className="d-flex align-items-start gap-2">
                                <FaCheckCircle className="text-success mt-1 flex-shrink-0" />
                                <span>{picked?.text ?? "—"}</span>
                              </div>
                            ) : (
                              <div>
                                <div className="d-flex align-items-start gap-2">
                                  <FaTimesCircle className="text-danger mt-1 flex-shrink-0" />
                                  <span>{picked?.text ?? "—"}</span>
                                </div>
                                {correctChoice && (
                                  <div className="mt-2">
                                    <span className="text-muted small">
                                      Correct answer:{" "}
                                    </span>
                                    <FaCheckCircle className="text-success ms-1 me-1" />
                                    {correctChoice.text ?? "—"}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {qt === "TRUE_FALSE" && (
                    <div>
                      {!showCorrect && (
                        <div className="ps-2 border-start border-3 border-secondary">
                          {rawAnswer === "true" || rawAnswer === true
                            ? "True"
                            : rawAnswer === "false" || rawAnswer === false
                              ? "False"
                              : "—"}
                        </div>
                      )}
                      {showCorrect && (() => {
                        const correctVal = q.correctAnswer === true;
                        const hasTfAnswer =
                          rawAnswer !== undefined &&
                          rawAnswer !== null &&
                          rawAnswer !== "";
                        const userVal = hasTfAnswer ? toBool(rawAnswer) : null;
                        const isRight =
                          hasTfAnswer && userVal !== null && userVal === correctVal;
                        const correctLabel = correctVal ? "True" : "False";
                        const userLabel =
                          !hasTfAnswer || userVal === null
                            ? "—"
                            : userVal
                              ? "True"
                              : "False";

                        return (
                          <div>
                            {isRight ? (
                              <div className="d-flex align-items-start gap-2">
                                <FaCheckCircle className="text-success mt-1 flex-shrink-0" />
                                <span>{userLabel}</span>
                              </div>
                            ) : (
                              <div>
                                <div className="d-flex align-items-start gap-2">
                                  <FaTimesCircle className="text-danger mt-1 flex-shrink-0" />
                                  <span>{userLabel}</span>
                                </div>
                                <div className="mt-2">
                                  <span className="text-muted small">
                                    Correct answer:{" "}
                                  </span>
                                  <FaCheckCircle className="text-success ms-1 me-1" />
                                  {correctLabel}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {qt === "FILL_IN_BLANK" && (
                    <div>
                      <div className="ps-2 border-start border-3 border-secondary mb-2">
                        {Array.isArray(rawAnswer) ? (
                          rawAnswer.map((line: string, bi: number) => (
                            <div key={bi}>
                              Blank {bi + 1}: {String(line ?? "")}
                            </div>
                          ))
                        ) : (
                          <span>{rawAnswer != null ? String(rawAnswer) : "—"}</span>
                        )}
                      </div>
                      {showCorrect && (
                        <p className="fst-italic text-secondary small mb-0">
                          Not graded yet by course instructor
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
