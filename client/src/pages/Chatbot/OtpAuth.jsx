import React, { useState } from 'react';
import { sendOtp, verifyOtp } from '../../api/index'; // Importing functions
import './Chatbot.css';

const OtpAuth = ({ setAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async () => {
        setLoading(true);
        setMessage('');
        try {
            const response = await sendOtp({ email });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error sending OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setLoading(true);
        setMessage('');
        try {
            const response = await verifyOtp({ email, otp });
            setMessage(response.data.message);
            if (response.data.message === 'OTP verified successfully') {
                setAuthenticated(true);
            }
        } catch (error) {
            setMessage('Error verifying OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="otp-auth">
            <h2>OTP Authentication</h2>
            <h6 className='chattext'>(<span className='co'>note :</span>This is only for <span className='co'>verification purpose</span>, after that you can use <span className='co'>Chabot</span>)</h6>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
            />
            <button onClick={handleSendOtp} disabled={loading}>{loading ? 'Sending...' : 'Send OTP'}</button>
            <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
            />
            <button onClick={handleVerifyOtp} disabled={loading}>{loading ? 'Verifying...' : 'Verify OTP'}</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default OtpAuth;
