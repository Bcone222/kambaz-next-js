import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

const ASSIGNMENTS_API = `${HTTP_SERVER}/api/assignments`;

export const findAssignmentsForCourse = async (courseId: string) => {
  const { data } = await axiosWithCredentials.get(
    `${HTTP_SERVER}/api/courses/${courseId}/assignments`
  );
  return data;
};

export const createAssignmentForCourse = async (
  courseId: string,
  assignment: Record<string, unknown>
) => {
  const { data } = await axiosWithCredentials.post(
    `${HTTP_SERVER}/api/courses/${courseId}/assignments`,
    assignment
  );
  return data;
};

export const deleteAssignmentOnServer = async (assignmentId: string) => {
  await axiosWithCredentials.delete(`${ASSIGNMENTS_API}/${assignmentId}`);
};

export const updateAssignmentOnServer = async (
  assignment: { _id: string } & Record<string, unknown>
) => {
  await axiosWithCredentials.put(
    `${ASSIGNMENTS_API}/${assignment._id}`,
    assignment
  );
};
