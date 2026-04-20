"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Card,
  Col,
  Form,
  ListGroup,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import { RootState } from "../../../../../store";
import * as quizClient from "../../../../quizzes/client";
import * as attemptClient from "../../../../quizzes/attemptClient";

type Question = {
  _id: string;
  title?: string;
  questionText?: string;
  points?: number;
  questionType?: string;
  choices?: { _id: string; text?: string; isCorrect?: boolean }[];
  correctAnswer?: boolean;
  blanks?: { _id: string; correctAnswers?: string[] }[];
};

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

export default function TakeQuizPage() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  const [quiz, setQuiz] = useState<Record<string, unknown> | null>(null);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    if (!qid) return;
    setLoading(true);
    try {
      const data = (await quizClient.findQuizById(
        qid as string,
      )) as Record<string, unknown>;
      const embedded = (data.questions as unknown[]) || [];
      let quizData = data;
      if (!embedded.length) {
        const list = await quizClient.findQuestionsForQuiz(qid as string);
        quizData = { ...data, questions: list };
      }
      const att = await attemptClient.findAttemptsForQuiz(qid as string);
      setQuiz(quizData);
      setAttempts(Array.isArray(att) ? att : []);
    } catch {
      setQuiz(null);
      setAttempts([]);
    } finally {
      setLoading(false);
    }
  }, [qid]);

  useEffect(() => {
    void load();
  }, [load]);

  const questions = (quiz?.questions as Question[]) || [];
  const total = questions.length;
  const safeIndex = total > 0 ? Math.min(currentIndex, total - 1) : 0;

  useEffect(() => {
    if (total > 0 && currentIndex >= total) {
      setCurrentIndex(total - 1);
    }
  }, [total, currentIndex]);

  const isStudent = currentUser?.role === "STUDENT";
  const published = Boolean(quiz?.published);
  const availableNow = quiz ? isAfterOrNoAvailableDate(quiz) : false;
  const attemptCap = quiz ? maxAllowedAttempts(quiz) : 1;
  const hasAttemptsLeft = attempts.length < attemptCap;

  useEffect(() => {
    if (loading || !qid || !cid) return;
    if (!quiz || total === 0) {
      router.replace(`/courses/${cid}/quizzes/${qid}`);
      return;
    }
    if (!currentUser || !isStudent || !published || !availableNow || !hasAttemptsLeft) {
      router.replace(`/courses/${cid}/quizzes/${qid}`);
    }
  }, [
    loading,
    quiz,
    total,
    qid,
    cid,
    router,
    currentUser,
    isStudent,
    published,
    availableNow,
    hasAttemptsLeft,
  ]);

  const go = (idx: number) => {
    if (idx < 0 || idx >= total) return;
    setCurrentIndex(idx);
  };

  const setAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const setFibBlankAnswer = (
    questionId: string,
    blankIdx: number,
    value: string,
  ) => {
    const key = `${questionId}-fib-${blankIdx}`;
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const questionHasAnswer = (qq: Question) => {
    if (answers[qq._id]) return true;
    return Object.keys(answers).some((k) => k.startsWith(`${qq._id}-fib`));
  };

  const buildSubmissionAnswers = (): {
    questionId: string;
    questionType: string;
    answer: unknown;
  }[] => {
    const out: { questionId: string; questionType: string; answer: unknown }[] =
      [];
    for (const q of questions) {
      const qt = q.questionType ?? "MULTIPLE_CHOICE";
      if (qt === "FILL_IN_BLANK") {
        const blankList =
          q.blanks && q.blanks.length > 0
            ? q.blanks
            : [{ _id: "p0", correctAnswers: [""] }];
        const parts = blankList.map(
          (_, bi) => answers[`${q._id}-fib-${bi}`] ?? "",
        );
        out.push({
          questionId: q._id,
          questionType: qt,
          answer: parts.length === 1 ? parts[0] : parts,
        });
      } else {
        out.push({
          questionId: q._id,
          questionType: qt,
          answer: answers[q._id] ?? "",
        });
      }
    }
    return out;
  };

  const handleSubmit = async () => {
    if (!qid || !cid) return;
    setSubmitting(true);
    setConfirmOpen(false);
    try {
      const payload = buildSubmissionAnswers();
      const newAttempt = await attemptClient.submitAttempt(
        qid as string,
        payload,
      );
      const id = newAttempt?._id;
      if (id) {
        router.push(`/courses/${cid}/quizzes/${qid}/attempts/${id}`);
      } else {
        router.push(`/courses/${cid}/quizzes/${qid}`);
      }
    } catch {
      router.push(`/courses/${cid}/quizzes/${qid}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div id="wd-quiz-take" className="p-3 d-flex align-items-center gap-2">
        <Spinner animation="border" size="sm" />
        <span>Loading quiz…</span>
      </div>
    );
  }

  if (
    !quiz ||
    total === 0 ||
    !isStudent ||
    !published ||
    !availableNow ||
    !hasAttemptsLeft
  ) {
    return (
      <div id="wd-quiz-take" className="p-3">
        <p className="text-muted mb-0">Redirecting…</p>
      </div>
    );
  }

  const q = questions[safeIndex];
  const qType = q.questionType ?? "MULTIPLE_CHOICE";

  return (
    <div id="wd-quiz-take" className="p-3">
      <div
        className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3 sticky-top bg-white py-2"
        style={{ zIndex: 1020 }}
      >
        <h1 className="h4 mb-0">{String(quiz.title ?? "Quiz")}</h1>
        <Button
          variant="danger"
          id="wd-quiz-submit-btn"
          disabled={submitting}
          onClick={() => setConfirmOpen(true)}
        >
          Submit Quiz
        </Button>
      </div>

      <Modal show={confirmOpen} onHide={() => setConfirmOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Submit quiz?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to submit? You cannot change your answers after
          submitting.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            disabled={submitting}
            onClick={() => void handleSubmit()}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Row className="g-4">
        <Col lg={3} md={4}>
          <div className="small text-muted mb-2">Jump to question</div>
          <ListGroup variant="flush" className="border rounded">
            {questions.map((qq, idx) => (
              <ListGroup.Item
                key={qq._id || idx}
                action
                active={idx === safeIndex}
                onClick={() => go(idx)}
                className="d-flex justify-content-between align-items-center py-2"
                id={`wd-take-jump-${idx + 1}`}
              >
                <span>Question {idx + 1}</span>
                {questionHasAnswer(qq) ? (
                  <span className="text-success small">•</span>
                ) : null}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        <Col lg={9} md={8}>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <span className="text-secondary fw-medium" id="wd-take-progress">
              Question {safeIndex + 1} of {total}
            </span>
            <div className="d-flex gap-2">
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={safeIndex <= 0}
                onClick={() => go(safeIndex - 1)}
                id="wd-take-prev"
              >
                Previous
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={safeIndex >= total - 1}
                onClick={() => go(safeIndex + 1)}
                id="wd-take-next"
              >
                Next
              </Button>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-1 mb-3">
            {questions.map((_, idx) => (
              <Button
                key={idx}
                size="sm"
                variant={idx === safeIndex ? "primary" : "outline-secondary"}
                onClick={() => go(idx)}
                className="rounded-circle"
                style={{ width: "2.25rem", height: "2.25rem" }}
                id={`wd-take-num-${idx + 1}`}
              >
                {idx + 1}
              </Button>
            ))}
          </div>

          <Card className="border">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                <h2 className="h5 mb-0">
                  {q.title?.trim() ? q.title : `Question ${safeIndex + 1}`}
                </h2>
                <span className="badge bg-secondary">{q.points ?? 1} pts</span>
              </div>
              {q.questionText ? (
                <p className="mb-4 text-body wd-take-question-text">
                  {q.questionText}
                </p>
              ) : null}

              {qType === "MULTIPLE_CHOICE" && (
                <Form>
                  {(q.choices || []).map((ch, i) => (
                    <Form.Check
                      key={ch._id || i}
                      type="radio"
                      className="mb-2"
                      name={`take-mc-${q._id}`}
                      id={`take-mc-${q._id}-${ch._id}`}
                      label={ch.text || `Choice ${i + 1}`}
                      checked={answers[q._id] === ch._id}
                      onChange={() => setAnswer(q._id, ch._id)}
                    />
                  ))}
                </Form>
              )}

              {qType === "TRUE_FALSE" && (
                <Form>
                  <Form.Check
                    type="radio"
                    className="mb-2"
                    name={`take-tf-${q._id}`}
                    id={`take-tf-true-${q._id}`}
                    label="True"
                    checked={answers[q._id] === "true"}
                    onChange={() => setAnswer(q._id, "true")}
                  />
                  <Form.Check
                    type="radio"
                    className="mb-2"
                    name={`take-tf-${q._id}`}
                    id={`take-tf-false-${q._id}`}
                    label="False"
                    checked={answers[q._id] === "false"}
                    onChange={() => setAnswer(q._id, "false")}
                  />
                </Form>
              )}

              {qType === "FILL_IN_BLANK" && (
                <div>
                  {(q.blanks && q.blanks.length > 0
                    ? q.blanks
                    : [{ _id: "p0", correctAnswers: [""] }]
                  ).map((blank, bi) => (
                    <Form.Group
                      key={blank._id || bi}
                      className="mb-3"
                      controlId={`take-fib-${q._id}-${bi}`}
                    >
                      <Form.Label>Blank {bi + 1}</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Your answer"
                        value={answers[`${q._id}-fib-${bi}`] ?? ""}
                        onChange={(e) =>
                          setFibBlankAnswer(q._id, bi, e.target.value)
                        }
                      />
                    </Form.Group>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
