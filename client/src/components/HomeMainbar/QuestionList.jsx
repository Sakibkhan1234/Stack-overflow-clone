import React from "react";
import Questions from "./Questions";
import Ad from "./Ad"; // Import the Ad component

const QuestionList = ({ questionsList }) => {
  const questionWithAds = questionsList.flatMap((question, index) => {
    return index < questionsList.length - 1
      ? [<Questions question={question} key={`question_${index}`} />, <Ad key={`ad_${index}`} />]
      : [<Questions question={question} key={`question_${index}`} />];
  });

  return (
    <>
      {questionWithAds.map((item, index) => (
        <React.Fragment key={index}>{item}</React.Fragment>
      ))}
    </>
  );
};

export default QuestionList;

// import React from "react";
// import Questions from "./Questions";
// const QuestionList = ({ questionsList }) => {
//   return (
//     <>
//       {questionsList.map((question) => (
//         <Questions question={question} key={question._id} />
//       ))}
//     </>
//   );
// };

// export default QuestionList;