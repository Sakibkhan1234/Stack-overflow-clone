import React, { useState, useEffect, useRef } from 'react';
import { socket, createRoom } from '../../api/index'; 
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './ChatRoom.css';

const ChatRoom = () => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [customRoom, setCustomRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleMessage = (data) => {
      setMessages((prevMessages) => [...prevMessages, { sender: data.sender, message: data.msg }]);
    };

    const handleUserJoined = (data) => {
      setMessages((prevMessages) => [...prevMessages, { sender: 'system', message: `${data.username} has entered the room.` }]);
    };

    const handleUserLeft = (data) => {
      setMessages((prevMessages) => [...prevMessages, { sender: 'system', message: `${data.username} has left the room.` }]);
    };

    const handleNoRoom = (data) => {
      alert(data.message);
    };

    socket.on('message', handleMessage);
    socket.on('user-joined', handleUserJoined);
    socket.on('user-left', handleUserLeft);
    socket.on('no-room', handleNoRoom);

    return () => {
      socket.off('message', handleMessage);
      socket.off('user-joined', handleUserJoined);
      socket.off('user-left', handleUserLeft);
      socket.off('no-room', handleNoRoom);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCreateRoom = async () => {
    try {
      const response = await createRoom(customRoom); // Use the createRoom function
      if (response.data.success) {
        setRoom(customRoom);
        alert(`Room created with ID: ${customRoom}`);
        setStep(2);
        socket.emit('join', { username, room: customRoom });
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error creating room:", error);
      alert("An error occurred while creating the room. Please try again.");
    }
  };

  const joinRoom = () => {
    if (room.trim() !== '') {
      socket.emit('join', { username, room });
      socket.on('user-joined', ({ username }) => {
        setStep(2);
      });
    } else {
      alert("Please enter a valid Room ID.");
    }
  };

  const leaveRoom = () => {
    socket.emit('leave', { username, room });
    setStep(1);
  };

  const sendMessage = () => {
    if (message.trim() !== '') {
      socket.emit('message', { sender: username, msg: message, room });
      setMessage('');
    }
  };

  return (
    <div className='div-color'>
      <div className="app">
        {step === 1 && (
          <div className="login-container">
            <h3>Enter Username and Room ID</h3>
            <h1>⬇</h1>

            <Form.Control type="text" placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)} />
            <br />
            <Form.Control type="text" placeholder="Enter Room ID"
              value={room}
              onChange={(e) => setRoom(e.target.value)} />
            <br />
            <Button variant="success" onClick={joinRoom} disabled={room.trim() === ''}>Join Room</Button>
            <br />
            <br />
            <Form.Control type="text" placeholder="Enter Custom Room ID"
              value={customRoom}
              onChange={(e) => setCustomRoom(e.target.value)} />
            <br />
            <Button variant="success" onClick={handleCreateRoom}>Create Room</Button>
          </div>
        )}

        {step === 2 && (
          <div className="chat-container">
            <h1>Private Chat Room</h1>
            <p>Room ID: {room}</p>
            <Button variant="danger" onClick={leaveRoom}>Leave Room</Button>
            <div className="chat-box">
              <div className="messages">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${msg.sender === username ? 'my-message' : msg.sender === 'system' ? 'system-message' : 'other-message'}`}
                  >
                    {msg.sender !== 'system' ? (
                      <p><strong>{msg.sender}: </strong>{msg.message}</p>
                    ) : (
                      <p>{msg.message}</p>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="message-input">
              <Form.Control size="lg" type="text" placeholder="Enter message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()} />
              <Button variant="success" onClick={sendMessage}>Send</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;

