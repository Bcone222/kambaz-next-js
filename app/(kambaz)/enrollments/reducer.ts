import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  enrollments: [] as unknown[],
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    setEnrollments: (
      state,
      { payload }: { payload: typeof initialState.enrollments }
    ) => {
      state.enrollments = payload;
    },
    enroll: (state, { payload: { userId, courseId } }: { payload: { userId: string; courseId: string } }) => {
      const newEnrollment = {
        _id: uuidv4(),
        user: userId,
        course: courseId,
      };
      state.enrollments = [...state.enrollments, newEnrollment] as any;
    },
    unenroll: (state, { payload: { userId, courseId } }: { payload: { userId: string; courseId: string } }) => {
      state.enrollments = state.enrollments.filter(
        (e: any) => !(e.user === userId && e.course === courseId)
      );
    },
  },
});

export const { setEnrollments, enroll, unenroll } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;
