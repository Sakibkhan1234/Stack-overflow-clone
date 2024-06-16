import React, { useState } from 'react';
import { submitQuestion, addQuestionAnswer } from '../../api/index'; // Importing functions
import './Chatbot.css';
import OtpAuth from './OtpAuth';
import chatboticon from '../../assest/ChatbotLoader.mp4';

const Chatbot = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [answer, setAnswer] = useState('');
    const [getQuestion, setGetQuestion] = useState('');
    const [addQuestion, setAddQuestion] = useState('');
    const [addAnswer, setAddAnswer] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleQuestionSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await submitQuestion({ question: getQuestion });
            setAnswer(response.data.answer || 'Sorry, I don\'t have an answer to that question.');
        } catch (error) {
            console.error("Error from handleQuestionSubmit:", error);
            if (error.response && error.response.status === 404) {
                setError('Sorry, I couldn\'t find an answer to that question.');
            } else if (error.response) {
                setError('An error occurred on the server. Please try again later.');
            } else {
                setError('A network error occurred. Please check your connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddQuestionSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await addQuestionAnswer({ question: addQuestion, answer: addAnswer });
            console.log(response.data.message);
            setAddQuestion('');
            setAddAnswer('');
        } catch (error) {
            console.error("Error from handleAddQuestionSubmit:", error);
            setError('An error occurred while adding the question. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className='chatbot-2'>
                <button className="chatbot-icon" onClick={() => setIsOpen(!isOpen)}>
                    <video className="chatbot-video" autoPlay loop muted>
                        <source src={chatboticon} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </button>
            </div>

            {isOpen && (
                <div className="chatbot">
                    {!authenticated ? (
                        <OtpAuth setAuthenticated={setAuthenticated} />
                    ) : (
                        <div className="chatbot-container">
                            <div className="chatbot-header">
                                <h3>Programming Q&A Chatbot</h3>
                            </div>
                            <div className="chatbot-body">
                                <div className="chat-section">
                                    <h4>Get Answer</h4>
                                    <input
                                        type="text"
                                        value={getQuestion}
                                        onChange={(e) => setGetQuestion(e.target.value)}
                                        placeholder="Enter your question"
                                    />
                                    <button onClick={handleQuestionSubmit} disabled={loading} className='btn-btn'>
                                        {loading ? 'Loading...' : 'Submit'}
                                    </button>
                                    {answer && <p className="chatbot-answer">{answer}</p>}
                                    {error && <p className="chatbot-error">{error}</p>}
                                </div>
                                <div className="add-section">
                                    <h4>Add Question and Answer</h4>
                                    <h6 className='chattext'>(<span className='co'>note :</span> If you are a mentor or developer or senior developer and want to share some programming related information then you can post questions and answers, this will help the <span className='co'>chatbot</span> to get information so that the <span className='co'>chatbot</span> can answer any question. And yes, <span className='co'>do not enter wrong information</span>)</h6>
                                    <input
                                        type="text"
                                        value={addQuestion}
                                        onChange={(e) => setAddQuestion(e.target.value)}
                                        placeholder="Enter your question"
                                    />
                                    <textarea
                                        value={addAnswer}
                                        onChange={(e) => setAddAnswer(e.target.value)}
                                        placeholder="Enter your answer"
                                        rows="4"
                                        cols="50"
                                        className='textarea-big'
                                    />
                                    <button onClick={handleAddQuestionSubmit} disabled={loading} className='btn-btn'>
                                        {loading ? 'Loading...' : 'Add'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Chatbot;

