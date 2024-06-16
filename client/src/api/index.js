import axios from "axios";
import io from "socket.io-client";

const API = axios.create({
  // baseURL: "https://stack-overflow-clone-72ck.onrender.com",
  baseURL: "http://localhost:5000",
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("Profile")) {
    req.headers.authorization = `Bearer ${
      JSON.parse(localStorage.getItem("Profile")).token
    }`;
  }
  return req;
});

// Socket connection
export const socket = io.connect('http://localhost:5000');
// export const socket = io.connect('https://stack-overflow-clone-72ck.onrender.com');

// User Authentication
export const logIn = (authData) => API.post("/user/login", authData);
export const signUp = (authData) => API.post("/user/signup", authData);

// Question Operations
export const postQuestion = (questionData) => API.post("/questions/Ask", questionData);
export const getAllQuestions = () => API.get("/questions/get");
export const deleteQuestion = (id) => API.delete(`/questions/delete/${id}`);
export const voteQuestion = (id, value) => API.patch(`/questions/vote/${id}`, { value });

// Answer Operations
export const postAnswer = (id, noOfAnswers, answerBody, userAnswered) => 
  API.patch(`/answer/post/${id}`, { noOfAnswers, answerBody, userAnswered });
export const deleteAnswer = (id, answerId, noOfAnswers) => 
  API.patch(`/answer/delete/${id}`, { answerId, noOfAnswers });

// User Operations
export const getAllUsers = () => API.get("/user/getAllUsers");
export const updateProfile = (id, updateData) => API.patch(`/user/update/${id}`, updateData);

// Notifications
export const sendNotification = (notificationData) => API.post('/notifications/send', notificationData);
export const getNotifications = (userId) => API.get(`/notifications/${userId}`);
export const markAsRead = (id) => API.patch(`/notifications/read/${id}`);
export const deleteNotification = (id) => API.delete(`/notifications/delete/${id}`);

// Chat Room Operations
export const createRoom = (roomId) => API.post('/create_room', { roomId });

// Video Upload Operations
export const uploadVideo = (formData, onUploadProgress) =>
  API.post('/upload', formData, { onUploadProgress });

// Chatbot Operations
export const submitQuestion = (questionData) => API.post('/api/question', questionData);
export const addQuestionAnswer = (questionData) => API.post('/api/add', questionData);
export const sendOtp = (emailData) => API.post('/api/send-otp', emailData);
export const verifyOtp = (otpData) => API.post('/api/verify-otp', otpData);
//Mention User
export const fetchUserMentions = () => API.get('/user/mention');

