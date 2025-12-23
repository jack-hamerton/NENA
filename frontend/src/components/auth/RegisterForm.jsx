import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import styled from 'styled-components';

const PasswordReqs = styled.div`
    color: ${props => props.theme.text.primary};
    h4 {
        margin-top: 1rem;
        margin-bottom: 0.5rem;
    }
    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
`;

const Criteria = styled.li`
    color: ${props => (props.met ? props.theme.palette.accent : props.theme.palette.danger)};
`;

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
      <PasswordReqs>
        <h4>Password Requirements:</h4>
        <ul>
          <Criteria met={passwordCriteria.length}>
            At least 8 characters long
          </Criteria>
          <Criteria met={passwordCriteria.uppercase}>
            Contains an uppercase letter
          </Criteria>
          <Criteria met={passwordCriteria.lowercase}>
            Contains a lowercase letter
          </Criteria>
          <Criteria met={passwordCriteria.number}>
            Contains a number
          </Criteria>
          <Criteria met={passwordCriteria.specialChar}>
            Contains a special character (!@#$%^&*(),.?\":{}|<>)
          </Criteria>
        </ul>
      </PasswordReqs>
      <Button type="submit">Register</Button>
    </form>
  );
};
