import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;
const QUIZ_ATTEMPTS_API = `${HTTP_SERVER}/api/quizAttempts`;

export const findAttemptsForQuiz = async (quizId: string) => {
  const response = await axiosWithCredentials.get(
    `${QUIZZES_API}/${quizId}/attempts`,
  );
  return response.data;
};

export const findAttemptById = async (attemptId: string) => {
  const response = await axiosWithCredentials.get(
    `${QUIZ_ATTEMPTS_API}/${attemptId}`,
  );
  return response.data;
};

export const submitAttempt = async (quizId: string, answers: any[]) => {
  const response = await axiosWithCredentials.post(
    `${QUIZZES_API}/${quizId}/attempts`,
    { answers },
  );
  return response.data;
};
