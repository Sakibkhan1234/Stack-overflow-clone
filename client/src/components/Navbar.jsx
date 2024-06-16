import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {jwtDecode} from "jwt-decode";
import logo from "../assest/logo.png";
import search from "../assest/search-solid.svg";
import Avatar from '../components/Avatar/Avatar';
import { setCurrentUser } from "../actions/currentUser";
import { getNotifications, markAsRead, deleteNotification } from "../actions/notification";
import notificationIcon from "../assest/notification-icon.svg";
import moment from "moment";

const Navbar = ({ toggleNav }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const User = useSelector((state) => state.currentUserReducer);
  const notifications = useSelector((state) => state.notificationsReducer);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
    dispatch(setCurrentUser(null));
  };

  useEffect(() => {
    const token = User?.token;
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        handleLogout();
      }
    }
    dispatch(setCurrentUser(JSON.parse(localStorage.getItem("Profile"))));

    if (User) {
      dispatch(getNotifications(User.result._id));
    }
  }, [User?.token, dispatch]);

  const handleDeleteNotification = (id) => {
    dispatch(deleteNotification(id));
  };

  return (
    <nav className="main-nav">
      <div className="navbar">
        <div className="navbar-1">
          <span className="bar-icon" onClick={toggleNav}>&#9776;</span>
          <Link to="/" className="nav-item nav-logo">
            <img src={logo} alt="logo" />
          </Link>
          <Link to="/" className="nav-item nav-btn res-nav">
            About
          </Link>
          <Link to="/" className="nav-item nav-btn res-nav">
            Products
          </Link>
          <Link to="/" className="nav-item nav-btn res-nav">
            For Teams
          </Link>
          <form>
            <input type="text" placeholder="Search..." />
            <img src={search} alt="search" width="18" className="search-icon" />
          </form>
        </div>
        <div className="navbar-2">
          {User === null ? (
            <Link to="/Auth" className="nav-item nav-links">
              Log in
            </Link>
          ) : (
            <>
              <div className="notification-icon" onClick={() => setShowNotifications(!showNotifications)}>
                <img src={notificationIcon} alt="notifications" />
                {notifications.length > 0 && <span className="notification-count">{notifications.length}</span>}
              </div>
              {showNotifications && (
                <div className="notification-dropdown" style={{ maxHeight: "300px", overflowY: "auto" }}>
                  {notifications.map(notification => (
                    <div key={notification._id} className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}>
                      <p><strong>{notification.senderName}</strong> :: {notification.message}</p>
                      <Link to={`/Question/${notification.questionId}`} className="Link-btn">{notification.questionTitle}</Link>
                      <p>{moment(notification.createdAt).fromNow()}</p>
                      {!notification.isRead && (
                       <button onClick={() => dispatch(markAsRead(notification._id))} className="b">Mark as Read</button>
                           )}
                      <button onClick={() => handleDeleteNotification(notification._id)} className="c">Delete</button>
                    </div>
                  ))}
                </div>
              )}
              <Avatar backgroundColor="#009dff" px="14px" py="7px" borderRadius="50%" color="white">
                <Link
                  to={`/Users/${User?.result?._id}`}
                  style={{ color: "white", textDecoration: "none" }}
                >
                  {User.result.name.charAt(0).toUpperCase()}
                </Link>
              </Avatar>
              <button className="nav-item nav-links" onClick={handleLogout}>
                Log out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
