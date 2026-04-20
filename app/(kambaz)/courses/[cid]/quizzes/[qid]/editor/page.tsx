"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Form, Nav, Spinner } from "react-bootstrap";
import * as quizClient from "../../../../quizzes/client";
import { updateQuizInList } from "../../../../quizzes/reducer";
import QuestionsEditor from "./QuestionsEditor";

const QUIZ_TYPES = [
  "Graded Quiz",
  "Practice Quiz",
  "Graded Survey",
  "Ungraded Survey",
] as const;

const ASSIGNMENT_GROUPS = [
  "Quizzes",
  "Exams",
  "Assignments",
  "Project",
] as const;

/** Format for `<input type="datetime-local" />`: YYYY-MM-DDTHH:mm (local time). */
function toDateTimeLocalValue(value: unknown): string {
  if (value == null || value === "") return "";
  const d = new Date(value as string | number | Date);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day}T${h}:${min}`;
}

/** Parse datetime-local value to a Date for the server (ISO instant). */
function dateTimeLocalToPayload(value: string): Date | null {
  const t = value.trim();
  if (!t) return null;
  const d = new Date(t);
  return Number.isNaN(d.getTime()) ? null : d;
}

type TabKey = "details" | "questions";

type FormFields = {
  title: string;
  description: string;
  points: number;
  quizType: string;
  assignmentGroup: string;
  shuffleAnswers: boolean;
  timeLimitEnabled: boolean;
  timeLimit: number;
  multipleAttempts: boolean;
  howManyAttempts: number;
  showCorrectAnswers: boolean;
  accessCode: string;
  oneQuestionAtATime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;
  dueDate: string;
  availableDate: string;
  untilDate: string;
};

function quizToFormFields(quiz: Record<string, unknown>): FormFields {
  return {
    title: String(quiz.title ?? ""),
    description: String(quiz.description ?? ""),
    points: Number(quiz.points ?? 0),
    quizType: String(quiz.quizType ?? "Graded Quiz"),
    assignmentGroup: String(quiz.assignmentGroup ?? "Quizzes"),
    shuffleAnswers: Boolean(quiz.shuffleAnswers),
    timeLimitEnabled: Boolean(quiz.timeLimitEnabled),
    timeLimit: Number(quiz.timeLimit ?? 20),
    multipleAttempts: Boolean(quiz.multipleAttempts),
    howManyAttempts: Number(quiz.howManyAttempts ?? 1),
    showCorrectAnswers: Boolean(quiz.showCorrectAnswers),
    accessCode: String(quiz.accessCode ?? ""),
    oneQuestionAtATime: Boolean(quiz.oneQuestionAtATime),
    webcamRequired: Boolean(quiz.webcamRequired),
    lockQuestionsAfterAnswering: Boolean(quiz.lockQuestionsAfterAnswering),
    dueDate: toDateTimeLocalValue(quiz.dueDate),
    availableDate: toDateTimeLocalValue(quiz.availableDate),
    untilDate: toDateTimeLocalValue(quiz.untilDate),
  };
}

function buildUpdatePayload(
  form: FormFields,
  published: boolean | undefined,
  base: Record<string, unknown>,
): Record<string, unknown> {
  const { __v: _v, ...rest } = base as Record<string, unknown> & {
    __v?: unknown;
  };
  void _v;
  return {
    ...rest,
    title: form.title,
    description: form.description,
    points: form.points,
    quizType: form.quizType,
    assignmentGroup: form.assignmentGroup,
    shuffleAnswers: form.shuffleAnswers,
    timeLimitEnabled: form.timeLimitEnabled,
    timeLimit: form.timeLimit,
    multipleAttempts: form.multipleAttempts,
    howManyAttempts: form.howManyAttempts,
    showCorrectAnswers: form.showCorrectAnswers,
    accessCode: form.accessCode,
    oneQuestionAtATime: form.oneQuestionAtATime,
    webcamRequired: form.webcamRequired,
    lockQuestionsAfterAnswering: form.lockQuestionsAfterAnswering,
    dueDate: dateTimeLocalToPayload(form.dueDate),
    availableDate: dateTimeLocalToPayload(form.availableDate),
    untilDate: dateTimeLocalToPayload(form.untilDate),
    ...(published !== undefined ? { published } : {}),
  };
}

export default function QuizEditorPage() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState<TabKey>("details");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [baseQuiz, setBaseQuiz] = useState<Record<string, unknown> | null>(
    null,
  );
  const [form, setForm] = useState<FormFields | null>(null);

  const loadQuiz = useCallback(async () => {
    if (!qid) return;
    setLoading(true);
    try {
      const data = (await quizClient.findQuizById(
        qid as string,
      )) as Record<string, unknown>;
      setBaseQuiz(data);
      setForm(quizToFormFields(data));
    } catch {
      setBaseQuiz(null);
      setForm(null);
    } finally {
      setLoading(false);
    }
  }, [qid]);

  useEffect(() => {
    void loadQuiz();
  }, [loadQuiz]);

  const updateField = <K extends keyof FormFields>(
    key: K,
    value: FormFields[K],
  ) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleCancel = () => {
    if (!cid) return;
    router.push(`/courses/${cid}/quizzes`);
  };

  const persist = async (options: { published?: boolean; goToList?: boolean }) => {
    if (!qid || !form || !baseQuiz) return;
    setSaving(true);
    try {
      const payload = buildUpdatePayload(
        form,
        options.published,
        baseQuiz,
      );
      await quizClient.updateQuiz(qid as string, payload);
      const fresh = (await quizClient.findQuizById(
        qid as string,
      )) as Record<string, unknown>;
      setBaseQuiz(fresh);
      setForm(quizToFormFields(fresh));
      dispatch(updateQuizInList(fresh));

      if (options.goToList) {
        router.push(`/courses/${cid}/quizzes`);
      } else {
        router.push(`/courses/${cid}/quizzes/${qid}`);
      }
    } catch (err) {
      console.error(err);
      window.alert(
        "Could not save the quiz. Check your connection and try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => void persist({ goToList: false });

  const handleSaveAndPublish = () =>
    void persist({ published: true, goToList: true });

  const handleQuizUpdatedFromQuestions = useCallback(
    (fresh: Record<string, unknown>) => {
      setBaseQuiz(fresh);
      setForm(quizToFormFields(fresh));
      dispatch(updateQuizInList(fresh));
    },
    [dispatch],
  );

  if (loading || !form) {
    return (
      <div id="wd-quiz-editor" className="p-3 d-flex align-items-center gap-2">
        <Spinner animation="border" size="sm" />
        <span>Loading quiz…</span>
      </div>
    );
  }

  if (!baseQuiz) {
    return (
      <div id="wd-quiz-editor" className="p-3">
        <p className="text-danger mb-0">Quiz not found.</p>
      </div>
    );
  }

  return (
    <div id="wd-quiz-editor" className="p-3">
      <h2 className="h4 mb-3">Edit Quiz</h2>

      <Nav variant="tabs" className="mb-3">
        <Nav.Item>
          <Nav.Link
            active={activeTab === "details"}
            onClick={() => setActiveTab("details")}
            id="wd-quiz-editor-tab-details"
          >
            Details
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            active={activeTab === "questions"}
            onClick={() => setActiveTab("questions")}
            id="wd-quiz-editor-tab-questions"
          >
            Questions
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {activeTab === "details" && (
        <Form className="wd-quiz-editor-details">
          <Form.Group className="mb-3" controlId="wd-quiz-title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="wd-quiz-description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="wd-quiz-points">
            <Form.Label>Points</Form.Label>
            <Form.Control
              type="number"
              min={0}
              value={form.points}
              onChange={(e) =>
                updateField("points", Number(e.target.value) || 0)
              }
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="wd-quiz-type">
            <Form.Label>Quiz Type</Form.Label>
            <Form.Select
              value={form.quizType}
              onChange={(e) => updateField("quizType", e.target.value)}
            >
              {QUIZ_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="wd-quiz-assignment-group">
            <Form.Label>Assignment Group</Form.Label>
            <Form.Select
              value={form.assignmentGroup}
              onChange={(e) => updateField("assignmentGroup", e.target.value)}
            >
              {ASSIGNMENT_GROUPS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="wd-quiz-shuffle">
            <Form.Check
              type="checkbox"
              label="Shuffle Answers"
              checked={form.shuffleAnswers}
              onChange={(e) =>
                updateField("shuffleAnswers", e.target.checked)
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="wd-quiz-time-limit-enabled"
              label="Time Limit"
              checked={form.timeLimitEnabled}
              onChange={(e) =>
                updateField("timeLimitEnabled", e.target.checked)
              }
            />
            {form.timeLimitEnabled && (
              <div className="ms-4 mt-2 d-flex align-items-center gap-2">
                <Form.Control
                  type="number"
                  min={1}
                  id="wd-quiz-time-limit-minutes"
                  style={{ maxWidth: "120px" }}
                  value={form.timeLimit}
                  onChange={(e) =>
                    updateField("timeLimit", Number(e.target.value) || 1)
                  }
                />
                <span className="text-muted small">minutes</span>
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="wd-quiz-multiple-attempts">
            <Form.Check
              type="checkbox"
              label="Multiple Attempts"
              checked={form.multipleAttempts}
              onChange={(e) =>
                updateField("multipleAttempts", e.target.checked)
              }
            />
          </Form.Group>

          {form.multipleAttempts && (
            <Form.Group className="mb-3" controlId="wd-quiz-how-many-attempts">
              <Form.Label>How Many Attempts</Form.Label>
              <Form.Control
                type="number"
                min={1}
                value={form.howManyAttempts}
                onChange={(e) =>
                  updateField(
                    "howManyAttempts",
                    Number(e.target.value) || 1,
                  )
                }
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3" controlId="wd-quiz-show-correct">
            <Form.Check
              type="checkbox"
              label="Show Correct Answers"
              checked={form.showCorrectAnswers}
              onChange={(e) =>
                updateField("showCorrectAnswers", e.target.checked)
              }
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="wd-quiz-access-code">
            <Form.Label>Access Code</Form.Label>
            <Form.Control
              type="text"
              value={form.accessCode}
              onChange={(e) => updateField("accessCode", e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="wd-quiz-one-question">
            <Form.Check
              type="checkbox"
              label="One Question at a Time"
              checked={form.oneQuestionAtATime}
              onChange={(e) =>
                updateField("oneQuestionAtATime", e.target.checked)
              }
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="wd-quiz-webcam">
            <Form.Check
              type="checkbox"
              label="Webcam Required"
              checked={form.webcamRequired}
              onChange={(e) =>
                updateField("webcamRequired", e.target.checked)
              }
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="wd-quiz-lock-questions">
            <Form.Check
              type="checkbox"
              label="Lock Questions After Answering"
              checked={form.lockQuestionsAfterAnswering}
              onChange={(e) =>
                updateField(
                  "lockQuestionsAfterAnswering",
                  e.target.checked,
                )
              }
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="wd-quiz-due-date">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="datetime-local"
              value={form.dueDate}
              onChange={(e) => updateField("dueDate", e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="wd-quiz-available-date">
            <Form.Label>Available Date</Form.Label>
            <Form.Control
              type="datetime-local"
              value={form.availableDate}
              onChange={(e) => updateField("availableDate", e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="wd-quiz-until-date">
            <Form.Label>Until Date</Form.Label>
            <Form.Control
              type="datetime-local"
              value={form.untilDate}
              onChange={(e) => updateField("untilDate", e.target.value)}
            />
          </Form.Group>
        </Form>
      )}

      {activeTab === "questions" && qid && (
        <QuestionsEditor
          quizId={qid as string}
          questions={(baseQuiz.questions as unknown[]) || []}
          onQuizUpdated={handleQuizUpdatedFromQuestions}
        />
      )}

      <div className="d-flex flex-wrap gap-2 justify-content-end pt-3 mt-3 border-top">
        <Button
          variant="secondary"
          id="wd-quiz-editor-cancel"
          disabled={saving}
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          id="wd-quiz-editor-save"
          disabled={saving}
          onClick={handleSave}
        >
          {saving ? "Saving…" : "Save"}
        </Button>
        <Button
          variant="success"
          id="wd-quiz-editor-save-publish"
          disabled={saving}
          onClick={handleSaveAndPublish}
        >
          {saving ? "Saving…" : "Save & Publish"}
        </Button>
      </div>
    </div>
  );
}
