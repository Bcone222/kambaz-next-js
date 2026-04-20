"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  InputGroup,
} from "react-bootstrap";
import {
  FaPencilAlt,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import * as quizClient from "../../../../quizzes/client";

const TYPE_OPTIONS = [
  { label: "Multiple Choice", value: "MULTIPLE_CHOICE" },
  { label: "True/False", value: "TRUE_FALSE" },
  { label: "Fill in the Blank", value: "FILL_IN_BLANK" },
] as const;

function labelForType(t: string): string {
  return TYPE_OPTIONS.find((o) => o.value === t)?.label ?? t;
}

function makeChoice(text: string, isCorrect: boolean) {
  return { _id: uuidv4(), text, isCorrect };
}

function defaultMultipleChoiceQuestion(): Record<string, unknown> {
  return {
    title: "New Question",
    questionText: "",
    questionType: "MULTIPLE_CHOICE",
    points: 1,
    choices: [
      makeChoice("Option 1", true),
      makeChoice("Option 2", false),
      makeChoice("Option 3", false),
      makeChoice("Option 4", false),
    ],
    correctAnswer: true,
    blanks: [],
  };
}

function resetFieldsForType(
  questionType: string,
): Pick<
  Record<string, unknown>,
  "choices" | "correctAnswer" | "blanks"
> {
  if (questionType === "MULTIPLE_CHOICE") {
    return {
      choices: [
        makeChoice("Option 1", true),
        makeChoice("Option 2", false),
        makeChoice("Option 3", false),
        makeChoice("Option 4", false),
      ],
      correctAnswer: true,
      blanks: [],
    };
  }
  if (questionType === "TRUE_FALSE") {
    return {
      choices: [],
      correctAnswer: true,
      blanks: [],
    };
  }
  return {
    choices: [],
    correctAnswer: true,
    blanks: [{ _id: uuidv4(), correctAnswers: [""] }],
  };
}

function cloneQuestion(q: Record<string, unknown>): Record<string, unknown> {
  return JSON.parse(JSON.stringify(q));
}

type QuestionRow = {
  key: string;
  saved: Record<string, unknown>;
  draft: Record<string, unknown> | null;
  isNew: boolean;
};

function rowFromServer(q: Record<string, unknown>): QuestionRow {
  return {
    key: String(q._id),
    saved: q,
    draft: null,
    isNew: false,
  };
}

function buildRowsFromProps(questions: unknown[]): QuestionRow[] {
  return (questions || []).map((q) =>
    rowFromServer(q as Record<string, unknown>),
  );
}

/** Payload for POST addQuestion (no top-level _id). */
function toAddQuestionBody(draft: Record<string, unknown>): Record<string, unknown> {
  const { _id: _drop, ...rest } = draft;
  void _drop;
  return rest;
}

/** Payload for PUT updateQuestion — fields only, no _id in body per DAO pattern */
function toUpdateQuestionBody(draft: Record<string, unknown>): Record<string, unknown> {
  const { _id: _drop, ...rest } = draft;
  void _drop;
  return rest;
}

export default function QuestionsEditor({
  quizId,
  questions: questionsProp,
  onQuizUpdated,
}: {
  quizId: string;
  questions: unknown[];
  onQuizUpdated: (quiz: Record<string, unknown>) => void;
}) {
  const [rows, setRows] = useState<QuestionRow[]>(() =>
    buildRowsFromProps(questionsProp),
  );

  const refreshParentQuiz = useCallback(async () => {
    const fresh = (await quizClient.findQuizById(quizId)) as Record<
      string,
      unknown
    >;
    onQuizUpdated(fresh);
  }, [quizId, onQuizUpdated]);

  useEffect(() => {
    setRows((prev) => {
      const serverRows = buildRowsFromProps(questionsProp || []);
      const pending = prev.filter((r) => r.isNew && !r.saved._id);
      return [...serverRows, ...pending];
    });
  }, [questionsProp]);

  const setDraft = (key: string, updater: (d: Record<string, unknown>) => void) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.key !== key || !r.draft) return r;
        const d = cloneQuestion(r.draft);
        updater(d);
        return { ...r, draft: d };
      }),
    );
  };

  const startEdit = (key: string) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.key !== key) return r;
        let saved = cloneQuestion(r.saved) as Record<string, unknown>;
        if (
          String(saved.questionType) === "FILL_IN_BLANK" &&
          (!(saved.blanks as unknown[])?.length)
        ) {
          saved = {
            ...saved,
            blanks: [{ _id: uuidv4(), correctAnswers: [""] }],
          };
        }
        return { ...r, draft: saved };
      }),
    );
  };

  const cancelEdit = (key: string) => {
    setRows((prev) =>
      prev
        .map((r) => {
          if (r.key !== key) return r;
          if (r.isNew && !r.saved._id) return null;
          return { ...r, draft: null };
        })
        .filter(Boolean) as QuestionRow[],
    );
  };

  const changeQuestionType = (key: string, newType: string) => {
    setDraft(key, (d) => {
      d.questionType = newType;
      const reset = resetFieldsForType(newType);
      Object.assign(d, reset);
    });
  };

  const handleSaveRow = async (row: QuestionRow) => {
    if (!row.draft) return;
    const draft = cloneQuestion(row.draft);

    try {
      if (row.isNew && !row.saved._id) {
        const body = toAddQuestionBody(draft);
        await quizClient.addQuestion(quizId, body);
        setRows((prev) => prev.filter((r) => r.key !== row.key));
        await refreshParentQuiz();
        return;
      }

      const questionId = String(row.saved._id ?? draft._id);
      await quizClient.updateQuestion(
        quizId,
        questionId,
        toUpdateQuestionBody(draft),
      );
      await refreshParentQuiz();
      setRows((prev) =>
        prev.map((r) =>
          r.key === row.key ? { ...r, draft: null, isNew: false } : r,
        ),
      );
    } catch (err) {
      console.error(err);
      window.alert(
        "Could not save this question. Check your connection and try again.",
      );
    }
  };

  const removeRowIfNew = (key: string) => {
    setRows((prev) => prev.filter((r) => !(r.key === key && r.isNew)));
  };

  const addNewQuestion = () => {
    const base = defaultMultipleChoiceQuestion();
    const tempKey = `new-${uuidv4()}`;
    const row: QuestionRow = {
      key: tempKey,
      saved: { ...base },
      draft: cloneQuestion(base),
      isNew: true,
    };
    setRows((prev) => [...prev, row]);
  };

  return (
    <div id="wd-quiz-editor-questions" className="wd-questions-editor">
      <div className="d-flex justify-content-end mb-3">
        <Button
          variant="primary"
          id="wd-add-new-question"
          onClick={addNewQuestion}
        >
          <FaPlus className="me-2" />
          New Question
        </Button>
      </div>

      {rows.length === 0 && (
        <p className="text-muted">No questions yet. Add one to get started.</p>
      )}

      {rows.map((row) => {
        const isEditing = row.draft != null;
        const d = (isEditing ? row.draft! : row.saved) as Record<
          string,
          unknown
        >;
        const qType = String(d.questionType ?? "MULTIPLE_CHOICE");

        if (!isEditing) {
          return (
            <Card key={row.key} className="mb-3">
              <Card.Body className="d-flex flex-wrap justify-content-between align-items-start gap-2">
                <div>
                  <div className="fw-bold wd-question-summary-title">
                    {String(d.title ?? "Question")}
                  </div>
                  <div className="small text-muted">
                    {labelForType(qType)} · {Number(d.points ?? 0)} pts
                  </div>
                </div>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => startEdit(row.key)}
                  id={`wd-question-edit-${row.key}`}
                >
                  <FaPencilAlt className="me-1" />
                  Edit
                </Button>
              </Card.Body>
            </Card>
          );
        }

        const draft = row.draft!;

        return (
          <Card key={row.key} className="mb-4 border-primary">
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Question Type</Form.Label>
                <Form.Select
                  value={String(draft.questionType)}
                  onChange={(e) =>
                    changeQuestionType(row.key, e.target.value)
                  }
                >
                  {TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={String(draft.title ?? "")}
                  onChange={(e) =>
                    setDraft(row.key, (x) => {
                      x.title = e.target.value;
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Question Text</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={String(draft.questionText ?? "")}
                  onChange={(e) =>
                    setDraft(row.key, (x) => {
                      x.questionText = e.target.value;
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Points</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={Number(draft.points ?? 1)}
                  onChange={(e) =>
                    setDraft(row.key, (x) => {
                      x.points = Number(e.target.value) || 0;
                    })
                  }
                />
              </Form.Group>

              {qType === "MULTIPLE_CHOICE" && (
                <div className="mb-3">
                  <Form.Label>Answer Choices</Form.Label>
                  {((draft.choices as any[]) || []).map(
                    (ch: any, idx: number) => (
                      <InputGroup key={ch._id || idx} className="mb-2">
                        <InputGroup.Text className="bg-white">
                          <Form.Check
                            type="radio"
                            aria-label="Mark correct"
                            name={`mc-correct-${row.key}`}
                            checked={!!ch.isCorrect}
                            onChange={() =>
                              setDraft(row.key, (x) => {
                                const choices = [
                                  ...((x.choices as any[]) || []),
                                ];
                                choices.forEach((c, i) => {
                                  c.isCorrect = i === idx;
                                });
                                x.choices = choices;
                              })
                            }
                          />
                        </InputGroup.Text>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={String(ch.text ?? "")}
                          onChange={(e) =>
                            setDraft(row.key, (x) => {
                              const choices = [
                                ...((x.choices as any[]) || []),
                              ];
                              if (choices[idx])
                                choices[idx].text = e.target.value;
                              x.choices = choices;
                            })
                          }
                        />
                        <Button
                          variant="outline-danger"
                          onClick={() =>
                            setDraft(row.key, (x) => {
                              const choices = (
                                (x.choices as any[]) || []
                              ).filter((_, i) => i !== idx);
                              if (
                                choices.length &&
                                !choices.some((c) => c.isCorrect)
                              ) {
                                choices[0].isCorrect = true;
                              }
                              x.choices = choices;
                            })
                          }
                        >
                          <FaTrash />
                        </Button>
                      </InputGroup>
                    ),
                  )}
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() =>
                      setDraft(row.key, (x) => {
                        const choices = [...((x.choices as any[]) || [])];
                        choices.push(
                          makeChoice(`Option ${choices.length + 1}`, false),
                        );
                        x.choices = choices;
                      })
                    }
                  >
                    <FaPlus className="me-1" />
                    Add Answer
                  </Button>
                </div>
              )}

              {qType === "TRUE_FALSE" && (
                <Form.Group className="mb-3">
                  <Form.Label>Correct Answer</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      name={`tf-${row.key}`}
                      id={`tf-true-${row.key}`}
                      label="True"
                      checked={draft.correctAnswer === true}
                      onChange={() =>
                        setDraft(row.key, (x) => {
                          x.correctAnswer = true;
                        })
                      }
                    />
                    <Form.Check
                      inline
                      type="radio"
                      name={`tf-${row.key}`}
                      id={`tf-false-${row.key}`}
                      label="False"
                      checked={draft.correctAnswer === false}
                      onChange={() =>
                        setDraft(row.key, (x) => {
                          x.correctAnswer = false;
                        })
                      }
                    />
                  </div>
                </Form.Group>
              )}

              {qType === "FILL_IN_BLANK" && (
                <div className="mb-3">
                  <Form.Label>Blanks (correct answer per blank)</Form.Label>
                  {(
                    (draft.blanks as any[])?.length > 0
                      ? (draft.blanks as any[])
                      : [{ _id: `${row.key}-fib0`, correctAnswers: [""] }]
                  ).map((blank: any, bidx: number) => (
                    <InputGroup
                      key={String(blank._id ?? `fib-${bidx}`)}
                      className="mb-2"
                    >
                      <InputGroup.Text className="text-muted small">
                        Blank {bidx + 1}
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Accepted answer for this blank"
                        value={String(
                          (blank.correctAnswers && blank.correctAnswers[0]) ??
                            "",
                        )}
                        onChange={(e) =>
                          setDraft(row.key, (x) => {
                            let bs = [...((x.blanks as any[]) || [])];
                            if (!bs.length) {
                              bs = [{ _id: uuidv4(), correctAnswers: [""] }];
                            }
                            const cur = { ...bs[bidx] };
                            cur.correctAnswers = [e.target.value];
                            if (!cur._id) cur._id = uuidv4();
                            bs[bidx] = cur;
                            x.blanks = bs;
                          })
                        }
                      />
                      <Button
                        variant="outline-danger"
                        title="Remove blank"
                        onClick={() =>
                          setDraft(row.key, (x) => {
                            const bs = ((x.blanks as any[]) || []).filter(
                              (_: unknown, i: number) => i !== bidx,
                            );
                            x.blanks =
                              bs.length > 0
                                ? bs
                                : [{ _id: uuidv4(), correctAnswers: [""] }];
                          })
                        }
                      >
                        <FaTrash />
                      </Button>
                    </InputGroup>
                  ))}
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() =>
                      setDraft(row.key, (x) => {
                        const bs = [...((x.blanks as any[]) || [])];
                        bs.push({ _id: uuidv4(), correctAnswers: [""] });
                        x.blanks = bs;
                      })
                    }
                  >
                    <FaPlus className="me-1" />
                    Add Blank
                  </Button>
                </div>
              )}

              <div className="d-flex flex-wrap gap-2 justify-content-end mt-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (row.isNew && !row.saved._id) {
                      removeRowIfNew(row.key);
                    } else {
                      cancelEdit(row.key);
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => void handleSaveRow(row)}
                  id={`wd-question-save-${row.key}`}
                >
                  {row.isNew && !row.saved._id ? "Save" : "Update Question"}
                </Button>
              </div>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
}
