import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  assignments: [] as unknown[],
};

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    setAssignmentsForCourse: (
      state,
      {
        payload,
      }: { payload: { courseId: string; assignments: unknown[] } }
    ) => {
      const { courseId, assignments: incoming } = payload;
      state.assignments = [
        ...state.assignments.filter((a: any) => a.course !== courseId),
        ...incoming,
      ] as any;
    },
    addAssignment: (state, { payload: assignment }: { payload: any }) => {
      state.assignments = [...state.assignments, assignment] as any;
    },
    deleteAssignment: (state, { payload: assignmentId }: { payload: string }) => {
      state.assignments = state.assignments.filter(
        (a: any) => a._id !== assignmentId
      );
    },
    updateAssignment: (state, { payload: assignment }: { payload: any }) => {
      state.assignments = state.assignments.map((a: any) =>
        a._id === assignment._id ? assignment : a
      ) as any;
    },
  },
});

export const {
  setAssignmentsForCourse,
  addAssignment,
  deleteAssignment,
  updateAssignment,
} = assignmentsSlice.actions;
export default assignmentsSlice.reducer;
