import React, { useState } from 'react';
import authService from '../services/auth.service';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('');

  const [verificationId, setVerificationId] = useState(null);
  const [code, setCode] = useState('');

  const handleSendPnv = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.sendPnv(email, username, password, phoneNumber, countryCode);
      setVerificationId(response.data.verification_id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await authService.checkPnvAndRegister(verificationId, code, email, username, password, phoneNumber, countryCode);
      // Redirect or show success message
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
        {verificationId ? (
            <form onSubmit={handleRegister}>
                <input type="text" placeholder="Verification Code" value={code} onChange={(e) => setCode(e.target.value)} />
                <button type="submit">Register</button>
            </form>
        ) : (
            <form onSubmit={handleSendPnv}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type="text" placeholder="Country Code" value={countryCode} onChange={(e) => setCountryCode(e.target.value)} />
                <input type="text" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                <button type="submit">Send Verification Code</button>
            </form>
        )}
    </div>
  );
};

export default Register;
