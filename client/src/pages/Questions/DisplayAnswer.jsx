import React from "react";
import moment from "moment";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Avatar from "../../components/Avatar/Avatar";
import { deleteAnswer } from "../../actions/question";

const DisplayAnswer = ({ question, handleShare }) => {
  const User = useSelector((state) => state.currentUserReducer);
  const { id } = useParams();
  const dispatch = useDispatch();
  const handleDelete = (answerId, noOfAnswers) => {
    dispatch(deleteAnswer(id, answerId, noOfAnswers - 1));
  };

  const renderAnswerBody = (body) => {
    const mentionRegex = /@\[(.+?)\]\((\w+)\)/g;
    let lastIndex = 0;
    const result = [];
    let match;
  
    while ((match = mentionRegex.exec(body)) !== null) {
      const [fullMention, username, userId] = match;
      const plainTextBefore = body.substring(lastIndex, match.index);
      lastIndex = mentionRegex.lastIndex;
  
      if (plainTextBefore) {
        result.push(plainTextBefore);
      }
  
      result.push(
        <Link key={fullMention} to={`/Users/${userId}`} className="mention-link">
          @{username}
        </Link>
      );
    }
  
    const plainTextAfter = body.substring(lastIndex);
    if (plainTextAfter) {
      result.push(plainTextAfter);
    }
  
    return result;
  };
  
  return (
    <div>
      {question.answer.map((ans) => (
        <div className="display-ans" key={ans._id}>
          <p>{renderAnswerBody(ans.answerBody)}</p>
          <div className="question-actions-user">
            <div>
              <button type="button" onClick={handleShare}>
                Share
              </button>
              {User?.result?._id === ans?.userId && (
                <button type="button" onClick={() => handleDelete(ans._id, question.noOfAnswers)}>
                  Delete
                </button>
              )}
            </div>
            <div>
              <p>answered {moment(ans.answeredOn).fromNow()}</p>
              <Link
                to={`/Users/${ans.userId}`}
                className="user-link"
                style={{ color: "#0086d8" }}
              >
                <Avatar
                  backgroundColor="lightgreen"
                  px="8px"
                  py="5px"
                  borderRadius="4px"
                >
                  {ans.userAnswered.charAt(0).toUpperCase()}
                </Avatar>
                <div>{ans.userAnswered}</div>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DisplayAnswer;
