"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Dropdown,
  ListGroup,
  Modal,
} from "react-bootstrap";
import {
  FaBan,
  FaCheckCircle,
  FaEllipsisV,
  FaPencilAlt,
  FaPlus,
  FaRocket,
  FaTrash,
} from "react-icons/fa";
import { RootState } from "../../../store";
import {
  addQuiz,
  removeQuiz,
  setQuizzes,
  updateQuizInList,
} from "../../quizzes/reducer";
import * as quizClient from "../../quizzes/client";

const CAN_EDIT_QUIZZES_ROLES = ["FACULTY", "ADMIN", "TA"];

function formatShortDate(value: unknown): string {
  if (value == null || value === "") return "—";
  const d = new Date(value as string | number | Date);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function availabilityLabel(quiz: any): string {
  const now = Date.now();
  const until = quiz.untilDate ? new Date(quiz.untilDate).getTime() : null;
  const available = quiz.availableDate
    ? new Date(quiz.availableDate).getTime()
    : null;

  if (until != null && !Number.isNaN(until) && now > until) {
    return "Closed";
  }
  if (
    available != null &&
    !Number.isNaN(available) &&
    now < available
  ) {
    return `Available from ${formatShortDate(quiz.availableDate)}`;
  }
  return "Available";
}

export default function QuizListPage() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  const canEditQuizzes =
    currentUser && CAN_EDIT_QUIZZES_ROLES.includes(currentUser.role);
  const isStudent = currentUser?.role === "STUDENT";

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const loadQuizzes = useCallback(async () => {
    if (!cid) return;
    const data = await quizClient.findQuizzesForCourse(cid as string);
    dispatch(setQuizzes(data));
  }, [cid, dispatch]);

  useEffect(() => {
    void loadQuizzes();
  }, [loadQuizzes]);

  const courseQuizzes = (quizzes as any[]).filter(
    (q) => !q.course || String(q.course) === String(cid),
  );

  const visibleQuizzes = isStudent
    ? courseQuizzes.filter((q: any) => q.published === true)
    : courseQuizzes;

  const handleAddQuiz = async () => {
    if (!cid) return;
    const newQuiz = await quizClient.createQuiz(cid as string, {
      title: "Unnamed Quiz",
      course: cid,
    });
    dispatch(addQuiz(newQuiz));
    router.push(`/courses/${cid}/quizzes/${newQuiz._id}/editor`);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await quizClient.deleteQuiz(deleteTarget.id);
    dispatch(removeQuiz(deleteTarget.id));
    setDeleteTarget(null);
  };

  const handlePublishToggle = async (quiz: any) => {
    if (quiz.published) {
      await quizClient.unpublishQuiz(quiz._id);
    } else {
      await quizClient.publishQuiz(quiz._id);
    }
    const updated = await quizClient.findQuizById(quiz._id);
    dispatch(updateQuizInList(updated));
  };

  return (
    <div id="wd-quiz-list" className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h3 className="mb-0">Quizzes</h3>
        {canEditQuizzes && (
          <Button
            id="wd-add-quiz"
            variant="danger"
            onClick={() => void handleAddQuiz()}
          >
            <FaPlus className="me-2" aria-hidden />
            Quiz
          </Button>
        )}
      </div>

      {visibleQuizzes.length === 0 ? (
        <div className="text-muted border rounded p-4 bg-light">
          <p className="mb-3">
            {isStudent
              ? "No published quizzes are available for this course yet."
              : "No quizzes yet. Click the Quiz button to create one."}
          </p>
          {canEditQuizzes && (
            <Button variant="danger" onClick={() => void handleAddQuiz()}>
              <FaPlus className="me-2" aria-hidden />
              Quiz
            </Button>
          )}
        </div>
      ) : (
        <ListGroup variant="flush" className="border rounded">
          {visibleQuizzes.map((quiz: any) => {
            const qCount = Array.isArray(quiz.questions)
              ? quiz.questions.length
              : 0;
            return (
              <ListGroup.Item
                key={quiz._id}
                className="d-flex flex-wrap align-items-center gap-2 py-3"
              >
                <div className="flex-grow-1 min-width-0">
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <Link
                      href={`/courses/${cid}/quizzes/${quiz._id}`}
                      className="fw-bold text-dark text-decoration-none wd-quiz-title-link"
                    >
                      {quiz.title || "Unnamed Quiz"}
                    </Link>
                    {quiz.published ? (
                      <FaCheckCircle
                        className="text-success flex-shrink-0"
                        title="Published"
                        aria-label="Published"
                      />
                    ) : (
                      <FaBan
                        className="text-secondary flex-shrink-0"
                        title="Not published"
                        aria-label="Not published"
                      />
                    )}
                  </div>
                  <div className="small text-secondary mt-1">
                    <span className="me-2">{availabilityLabel(quiz)}</span>
                    <span className="me-2">
                      <strong>Due</strong> {formatShortDate(quiz.dueDate)}
                    </span>
                    <span className="me-2">
                      <strong>{quiz.points ?? 0}</strong> pts
                    </span>
                    <span>
                      <strong>{qCount}</strong> question{qCount === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>
                {canEditQuizzes && (
                  <Dropdown align="end">
                    <Dropdown.Toggle
                      variant="light"
                      size="sm"
                      className="border"
                      id={`wd-quiz-menu-${quiz._id}`}
                    >
                      <FaEllipsisV />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() =>
                          router.push(
                            `/courses/${cid}/quizzes/${quiz._id}/editor`,
                          )
                        }
                      >
                        <FaPencilAlt className="me-2" />
                        Edit
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          setDeleteTarget({
                            id: quiz._id,
                            title: quiz.title || "Unnamed Quiz",
                          })
                        }
                        className="text-danger"
                      >
                        <FaTrash className="me-2" />
                        Delete
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => void handlePublishToggle(quiz)}
                      >
                        <FaRocket className="me-2" />
                        {quiz.published ? "Unpublish" : "Publish"}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      )}

      <Modal show={!!deleteTarget} onHide={() => setDeleteTarget(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete &quot;{deleteTarget?.title}&quot;?
          This cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => void confirmDelete()}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
