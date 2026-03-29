import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });

export const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
export const USERS_API = `${HTTP_SERVER}/api/users`;

export type Credentials = {
  username: string;
  password: string;
};

export const signin = async (credentials: Credentials) => {
  const response = await axiosWithCredentials.post(
    `${USERS_API}/signin`,
    credentials
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

export const updateUser = async (user: { _id: string } & Record<string, unknown>) => {
  const response = await axiosWithCredentials.put(
    `${USERS_API}/${user._id}`,
    user
  );
  return response.data;
};

export const fetchMyEnrollments = async () => {
  const { data } = await axiosWithCredentials.get(
    `${USERS_API}/current/enrollments`
  );
  return data;
};

export const enrollInCourse = async (courseId: string) => {
  await axiosWithCredentials.post(`${USERS_API}/current/enrollments`, {
    courseId,
  });
};

export const unenrollFromCourse = async (courseId: string) => {
  await axiosWithCredentials.delete(
    `${USERS_API}/current/enrollments/${courseId}`
  );
};
