import axios from "axios";

export const axiosWithCredentials = axios.create({ withCredentials: true });

export const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
export const USERS_API = `${HTTP_SERVER}/api/users`;

export type Credentials = {
  username: string;
  password: string;
};

export const signin = async (credentials: Credentials) => {
  const response = await axiosWithCredentials.post(
    `${USERS_API}/signin`,
    credentials,
  );
  return response.data;
};

export const profile = async () => {
  const response = await axiosWithCredentials.post(`${USERS_API}/profile`);
  return response.data;
};

export const signup = async (user: Record<string, unknown>) => {
  const response = await axiosWithCredentials.post(`${USERS_API}/signup`, user);
  return response.data;
};

export const signout = async () => {
  await axiosWithCredentials.post(`${USERS_API}/signout`);
};

export const updateUser = async (
  user: { _id: string } & Record<string, unknown>,
) => {
  const response = await axiosWithCredentials.put(
    `${USERS_API}/${user._id}`,
    user,
  );
  return response.data;
};

/** GET — list enrollment rows for the logged-in user (not enroll/unenroll actions). */
export const fetchMyEnrollments = async () => {
  const { data } = await axiosWithCredentials.get(
    `${USERS_API}/current/enrollments`,
  );
  return data;
};

export const enrollInCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.post(
    `${USERS_API}/current/courses/${courseId}`,
  );
  return response.data;
};

export const unenrollFromCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.delete(
    `${USERS_API}/current/courses/${courseId}`,
  );
  return response.data;
};

export const findAllUsers = async () => {
  const response = await axiosWithCredentials.get(USERS_API);
  return response.data;
};

export const findUsersByRole = async (role: string) => {
  const response = await axiosWithCredentials.get(
    `${USERS_API}?role=${encodeURIComponent(role)}`,
  );
  return response.data;
};

export const findUsersByPartialName = async (name: string) => {
  const response = await axiosWithCredentials.get(
    `${USERS_API}?name=${encodeURIComponent(name)}`,
  );
  return response.data;
};

export const findUserById = async (id: string) => {
  const response = await axiosWithCredentials.get(`${USERS_API}/${id}`);
  return response.data;
};

export const createUser = async (user: Record<string, unknown>) => {
  const response = await axiosWithCredentials.post(`${USERS_API}`, user);
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await axiosWithCredentials.delete(`${USERS_API}/${userId}`);
  return response.data;
};
