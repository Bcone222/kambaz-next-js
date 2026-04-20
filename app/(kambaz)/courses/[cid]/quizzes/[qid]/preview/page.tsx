"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  ListGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import * as quizClient from "../../../../quizzes/client";

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

export default function QuizPreviewPage() {
  const { qid } = useParams();
  const [quiz, setQuiz] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  /** Preview-only answers keyed by question _id */
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const loadQuiz = useCallback(async () => {
    if (!qid) return;
    setLoading(true);
    try {
      let data = (await quizClient.findQuizById(
        qid as string,
      )) as Record<string, unknown>;
      const embedded = (data.questions as unknown[]) || [];
      if (!embedded.length) {
        const list = await quizClient.findQuestionsForQuiz(qid as string);
        data = { ...data, questions: list };
      }
      setQuiz(data);
    } catch {
      setQuiz(null);
    } finally {
      setLoading(false);
    }
  }, [qid]);

  useEffect(() => {
    void loadQuiz();
  }, [loadQuiz]);

  const questions = (quiz?.questions as Question[]) || [];
  const total = questions.length;
  const safeIndex = total > 0 ? Math.min(currentIndex, total - 1) : 0;

  useEffect(() => {
    if (total > 0 && currentIndex >= total) {
      setCurrentIndex(total - 1);
    }
  }, [total, currentIndex]);

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

  const questionHasPreviewAnswer = (qq: Question) => {
    if (answers[qq._id]) return true;
    return Object.keys(answers).some((k) => k.startsWith(`${qq._id}-fib`));
  };

  if (loading) {
    return (
      <div id="wd-quiz-preview" className="p-3 d-flex align-items-center gap-2">
        <Spinner animation="border" size="sm" />
        <span>Loading quiz…</span>
      </div>
    );
  }

  if (!quiz || total === 0) {
    return (
      <div id="wd-quiz-preview" className="p-3">
        <Alert variant="warning" className="mb-3">
          This is a preview of the quiz. No responses are saved or graded.
        </Alert>
        <p className="text-muted mb-0">
          {!quiz
            ? "Quiz could not be loaded."
            : "This quiz has no questions yet. Add questions in the editor, then return to preview."}
        </p>
      </div>
    );
  }

  const q = questions[safeIndex];
  const qType = q.questionType ?? "MULTIPLE_CHOICE";

  return (
    <div id="wd-quiz-preview" className="p-3">
      <Alert variant="info" className="d-flex align-items-center gap-2 mb-4">
        <span>
          <strong>Preview mode</strong> — this is a preview of the quiz. Answers
          are not submitted or graded.
        </span>
      </Alert>

      <h1 className="h4 mb-3">{String(quiz.title ?? "Quiz")}</h1>

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
                id={`wd-preview-jump-${idx + 1}`}
              >
                <span>Question {idx + 1}</span>
                {questionHasPreviewAnswer(qq) ? (
                  <span className="text-success small">•</span>
                ) : null}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        <Col lg={9} md={8}>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <span className="text-secondary fw-medium" id="wd-preview-progress">
              Question {safeIndex + 1} of {total}
            </span>
            <div className="d-flex gap-2">
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={safeIndex <= 0}
                onClick={() => go(safeIndex - 1)}
                id="wd-preview-prev"
              >
                Previous
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={safeIndex >= total - 1}
                onClick={() => go(safeIndex + 1)}
                id="wd-preview-next"
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
                id={`wd-preview-num-${idx + 1}`}
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
                <span className="badge bg-secondary">
                  {q.points ?? 1} pts
                </span>
              </div>
              {q.questionText ? (
                <p className="mb-4 text-body wd-preview-question-text">
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
                      name={`preview-mc-${q._id}`}
                      id={`preview-mc-${q._id}-${ch._id}`}
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
                    name={`preview-tf-${q._id}`}
                    id={`preview-tf-true-${q._id}`}
                    label="True"
                    checked={answers[q._id] === "true"}
                    onChange={() => setAnswer(q._id, "true")}
                  />
                  <Form.Check
                    type="radio"
                    className="mb-2"
                    name={`preview-tf-${q._id}`}
                    id={`preview-tf-false-${q._id}`}
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
                      controlId={`preview-fib-${q._id}-${bi}`}
                    >
                      <Form.Label>
                        Blank {bi + 1}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Your answer"
                        value={
                          answers[`${q._id}-fib-${bi}`] ?? ""
                        }
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
