import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export const RegisterForm = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  useEffect(() => {
    setPasswordCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*(),.?\":{}|<>]/.test(password),
    });
  }, [password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(username, password, email);
  };

  const getCriteriaStyle = (met) => ({
    color: met ? 'green' : 'red',
  });

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <Input
        type="email"
        placeholder="Email (optional)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <div>
        <h4>Password Requirements:</h4>
        <ul>
          <li style={getCriteriaStyle(passwordCriteria.length)}>
            At least 8 characters long
          </li>
          <li style={getCriteriaStyle(passwordCriteria.uppercase)}>
            Contains an uppercase letter
          </li>
          <li style={getCriteriaStyle(passwordCriteria.lowercase)}>
            Contains a lowercase letter
          </li>
          <li style={getCriteriaStyle(passwordCriteria.number)}>
            Contains a number
          </li>
          <li style={getCriteriaStyle(passwordCriteria.specialChar)}>
            Contains a special character (!@#$%^&*(),.?\":{}|<>)
          </li>
        </ul>
      </div>
      <Button type="submit">Register</Button>
    </form>
  );
};
