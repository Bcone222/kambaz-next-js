import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  courses: [] as unknown[],
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    addNewCourse: (state, { payload: course }: { payload: any }) => {
      const newCourse = { ...course, _id: uuidv4() };
      state.courses = [...state.courses, newCourse] as any;
    },
    deleteCourse: (state, { payload: courseId }: { payload: string }) => {
      state.courses = state.courses.filter(
        (course: any) => course._id !== courseId
      );
    },
    updateCourse: (state, { payload: course }: { payload: any }) => {
      state.courses = state.courses.map((c: any) =>
        c._id === course._id ? course : c
      ) as any;
    },
    setCourses: (state, { payload: newCourses }: { payload: any[] }) => {
      state.courses = newCourses;
    },
  },
});

export const { addNewCourse, deleteCourse, updateCourse, setCourses } =
  coursesSlice.actions;
export default coursesSlice.reducer;
