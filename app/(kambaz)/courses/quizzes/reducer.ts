import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  quizzes: [] as unknown[],
  quiz: {} as unknown,
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, { payload }: { payload: unknown[] }) => {
      state.quizzes = payload;
    },
    setQuiz: (state, { payload }: { payload: unknown }) => {
      state.quiz = payload;
    },
    addQuiz: (state, { payload }: { payload: any }) => {
      state.quizzes = [...state.quizzes, payload] as any;
    },
    removeQuiz: (state, { payload: quizId }: { payload: string }) => {
      state.quizzes = state.quizzes.filter(
        (q: any) => String(q._id) !== String(quizId),
      ) as any;
    },
    updateQuizInList: (state, { payload }: { payload: any }) => {
      state.quizzes = state.quizzes.map((q: any) =>
        String(q._id) === String(payload._id) ? payload : q,
      ) as any;
    },
    togglePublish: (state, { payload: quizId }: { payload: string }) => {
      state.quizzes = state.quizzes.map((q: any) => {
        if (String(q._id) !== String(quizId)) return q;
        return { ...q, published: !q.published };
      }) as any;
      if (String((state.quiz as any)?._id) === String(quizId)) {
        const q = state.quiz as any;
        state.quiz = { ...q, published: !q.published };
      }
    },
  },
});

export const {
  setQuizzes,
  setQuiz,
  addQuiz,
  removeQuiz,
  updateQuizInList,
  togglePublish,
} = quizzesSlice.actions;
export default quizzesSlice.reducer;
