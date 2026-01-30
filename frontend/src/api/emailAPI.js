import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// fetch all emails
export const getEmails = (status) => {
  const url = status ? `/emails?status=${status}` : "/emails";
  return API.get(url);
};

// schedule email
export const scheduleEmail = (data) => {
  return API.post("/emails/schedule", data);
};
