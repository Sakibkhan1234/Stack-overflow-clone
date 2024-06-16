import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home/Home';
import Auth from './pages/Auth/Auth';
import Questions from './pages/Questions/Questions';
import AskQuestion from './pages/AskQuestion/AskQuestion';
import DisplayQuestion from './pages/Questions/DisplayQuestion';
import Tags from './pages/Tags/Tags';
import Users from './pages/Users/Users';
import UserProfile from "./pages/UserProfile/UserProfile";
import { fetchAllQuestions } from './actions/question';
import { useDispatch } from 'react-redux';
import { fetchAllUsers } from './actions/users';
import LeftSidebar from './components/LeftSidebar/LeftSidebar';
import VideoPlayer from './pages/Video/VideoPlayer'
import ChatRoom from './pages/PrivateChatRoom/ChatRoom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Chatbot from './pages/Chatbot/Chatbot';

const App = () => {
  const dispatch = useDispatch();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  useEffect(() => {
    dispatch(fetchAllQuestions());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  return (
    <div>
      <BrowserRouter>
        <Navbar toggleNav={toggleNav} />
        <Chatbot/>
        <LeftSidebar isNavOpen={isNavOpen} toggleNav={toggleNav} />
        <div className={`main-content ${isNavOpen ? 'shifted' : ''}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Auth" element={<Auth />} />
            <Route path="/AskQuestion" element={<AskQuestion />} />
            <Route path="/Questions" element={<Questions />} />
            <Route path="/Question/:id" element={<DisplayQuestion />} />
            <Route path="/Tags" element={<Tags />} />
            <Route path="/Users" element={<Users />} />
            <Route path="/Users/:id" element={<UserProfile />} />
            <Route path="/Video" element={<VideoPlayer/>} />
            <Route path="/ChatRoom" element={<ChatRoom/>} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;

