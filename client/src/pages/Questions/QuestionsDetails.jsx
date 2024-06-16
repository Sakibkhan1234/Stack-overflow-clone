import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import copy from 'copy-to-clipboard';
import Button from 'react-bootstrap/Button';
import { MentionsInput, Mention } from 'react-mentions';
import upvote from "../../assest/sort-up.svg";
import downvote from "../../assest/sort-down.svg";
import Avatar from "../../components/Avatar/Avatar";
import DisplayAnswer from "./DisplayAnswer";
import { postAnswer, deleteQuestion, voteQuestion } from "../../actions/question";
import { sendNotification, getNotifications } from "../../actions/notification";
import { fetchUserMentions } from "../../api/index";
import './notify.css'


const QuestionsDetails = () => {
  const { id } = useParams();
  const questionsList = useSelector((state) => state.questionsReducer);
  const [Answer, setAnswer] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [users, setUsers] = useState([]);
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const User = useSelector((state) => state.currentUserReducer);
  const location = useLocation();
  const url = "http://localhost:3000";

  useEffect(() => {
    if (User) {
      dispatch(getNotifications(User.result._id));
    }
  }, [User, dispatch]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response =await fetchUserMentions(); 
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);
  const handlePostAns = (e, answerLength) => {
    e.preventDefault();
    if (User === null) {
      alert("Login or Signup to answer a question");
      Navigate("/Auth");
    } else {
      if (Answer === "") {
        alert("Enter an answer before submitting");
      } else {
        const processedAnswer = Answer;

        dispatch(
          postAnswer({
            id,
            noOfAnswers: answerLength + 1,
            answerBody: processedAnswer,
            userAnswered: User.result.name,
          })
        );
        setAnswer("");
      }
    }
  };

  const handleShare = () => {
    copy(url + location.pathname);
    alert("Copied url : " + url + location.pathname);
  };

  const handleDelete = () => {
    dispatch(deleteQuestion(id, Navigate));
  };

  const handleUpVote = () => {
    if (User === null) {
      alert("Login or Signup to up vote a question");
      Navigate("/Auth");
    } else {
      dispatch(voteQuestion(id, "upVote"));
    }
  };

  const handleDownVote = () => {
    if (User === null) {
      alert("Login or Signup to down vote a question");
      Navigate("/Auth");
    } else {
      dispatch(voteQuestion(id, "downVote"));
    }
  };

  const handleSendNotification = async () => {
    if (User) {
      const question = questionsList.data.find(q => q._id === id);
      console.log("User sending notification:", User?.result?._id);
      console.log("Question owner receiving notification:", question.userId);
  
      try {
        await dispatch(sendNotification({
          recipientId: question.userId,
          senderId: User?.result?._id,
          senderName: User?.result?.name,
          message: notificationMessage,
          questionId: id,
          questionTitle: question.questionTitle
        }));
  
        setNotificationMessage("");
        setShowNotificationModal(false);
        alert("Message Sent Successfully");
      } catch (error) {
        console.error("Error sending notification:", error);
        alert("Failed to send notification");
      }
    } else {
      console.log("User is null");
      alert("Please Login First");
    }
    window.location.reload(false);
  };
  
  const mentionStyle = {
    control: {
      backgroundColor: '#fff',
      fontSize: 14,
      fontWeight: 'normal'
    },
    highlighter: {
      overflow: 'hidden'
    },
    input: {
      margin: 0
    },
    '&singleLine': {
      control: {
        display: 'inline-block',
        width: 130
      },
      highlighter: {
        padding: 1,
        border: '2px inset transparent'
      },
      input: {
        padding: 1,
        border: '2px inset'
      }
    },
    '&multiLine': {
      control: {
        fontFamily: 'monospace',
        border: '1px solid silver',
        minHeight : 200
      },
      highlighter: {
        padding: 9
      },
      input: {
        padding: 9,
        minHeight: 63,
        outline: 0,
        border: 0
      }
    },
    suggestions: {
      list: {
        backgroundColor: 'white',
        border: '1px solid rgba(0,0,0,0.15)',
        fontSize: 14
      },
      item: {
        padding: '5px 15px',
        borderBottom: '1px solid rgba(0,0,0,0.15)',
        '&focused': {
          backgroundColor: '#cee4e5'
        }
      }
    }
  };

  return (
    <div className="question-details-page">
      {questionsList.data === null ? (
        <h1>Loading...</h1>
      ) : (
        <>
          {questionsList.data
            .filter((question) => question._id === id)
            .map((question) => (
              <div key={question._id}>
                <section className="question-details-container">
                  <h1>{question.questionTitle}</h1>
                  <div className="question-details-container-2">
                    <div className="question-votes">
                      <img
                        src={upvote}
                        alt="upvote"
                        width="18"
                        className="votes-icon"
                        onClick={handleUpVote}
                      />
                      <p>{question.upVote.length - question.downVote.length}</p>
                      <img
                        src={downvote}
                        alt="downvote"
                        width="18"
                        className="votes-icon"
                        onClick={handleDownVote}
                      />
                    </div>
                    <div style={{ width: "100%" }}>
                      <p className="question-body">{question.questionBody}</p>
                      <div className="question-details-tags">
                        {question.questionTags.map((tag) => (
                          <p key={tag}>{tag}</p>
                        ))}
                      </div>
                      <div className="question-action-user">
                        <div className="question-button-edit">
                          <button type="button" onClick={handleShare}>
                            Share
                          </button>
                          {User?.result?._id === question?.userId && (
                            <button type="button" onClick={handleDelete}>
                              Delete
                            </button>
                          )}
                          <div>
                            <>
                              <div>
                                <button onClick={() => setShowNotificationModal(true)}>Code Review</button>
                              </div>
                               {/* {showNotificationModal && (
                                <div className="notification-modal">
                                  <div className="notification-modal-2">
                                    <h2>Send Notification</h2>
                                    <textarea
                                      className="textarea-edit"
                                      value={notificationMessage}
                                      onChange={(e) => setNotificationMessage(e.target.value)}
                                      placeholder="Enter your notification message"
                                    />
                                    <Button variant="outline-secondary" onClick={handleSendNotification} className="a">Send</Button>
                                    <Button variant="outline-danger" onClick={() => setShowNotificationModal(false)} className="a">Close</Button>
                                  </div>
                                </div>
                              )}  */}
                            </>
                          </div>
                        </div>
                        <div>
                          <p>asked {moment(question.askedOn).fromNow()}</p>
                          <Link
                            to={`/Users/${question.userId}`}
                            className="user-link"
                            style={{ color: "#0086d8" , textDecoration : 'none'}}
                          >
                            <Avatar
                              backgroundColor="orange"
                              px="8px"
                              py="5px"
                              borderRadius="5px"
                            >
                              {question.userPosted.charAt(0).toUpperCase()}
                            </Avatar>
                            <div>{question.userPosted}</div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                {question.noOfAnswers !== 0 && (
                  <section>
                    <h3>{question.noOfAnswers} Answers</h3>
                    <DisplayAnswer
                      key={question._id}
                      question={question}
                      handleShare={handleShare}
                    />
                  </section>
                )}
                <section className="post-ans-container">
                  <h3>Your Answer</h3>
                  <form
                    onSubmit={(e) => handlePostAns(e, question.answer.length)}
                  >
                    <MentionsInput
                      value={Answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      style={mentionStyle}
                      placeholder={"Mention using '@'"}
                      className="mentions-textarea"
                    >
                      <Mention
                        trigger="@"
                        data={users.map(user => ({ id: user._id, display: user.name }))}
                        style={{ backgroundColor: '#daf4fa' }}
                      />
                    </MentionsInput>
                    <br />
                    <input
                      type="Submit"
                      className="post-ans-btn"
                      value="Post Your Answer"
                    />
                  </form>
                  <p>
                    Browse other Question tagged
                    {question.questionTags.map((tag) => (
                      <Link to="/Tags" key={tag} className="ans-tags">
                        {tag}
                      </Link>
                    ))}{" "}
                    or
                    <Link
                      to="/AskQuestion"
                      style={{ textDecoration: "none", color: "#009dff" }}
                    >
                      {" "}
                      ask your own question.
                    </Link>
                  </p>
                </section>
                {showNotificationModal && (
                                <div className="notification-modal">
                                  <div className="notification-modal-2">
                                    <h2>Send Notification</h2>
                                    <textarea
                                      className="textarea-edit"
                                      value={notificationMessage}
                                      onChange={(e) => setNotificationMessage(e.target.value)}
                                      placeholder="Enter your notification message"/>
                               <Button variant="outline-secondary" onClick={handleSendNotification} className="a">Send</Button>
                              <Button variant="outline-danger" onClick={() => setShowNotificationModal(false)} className="a">Close</Button>
                        </div>
                  </div>
                )} 
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default QuestionsDetails;

