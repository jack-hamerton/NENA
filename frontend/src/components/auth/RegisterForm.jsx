import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import styled from 'styled-components';

const PasswordReqs = styled.div`
    color: ${props => props.theme.text.primary};
    margin-top: 1rem;
    h4 {
        margin-bottom: 0.5rem;
    }
    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
`;

const Criteria = styled.li`
    color: ${props => (props.met ? props.theme.palette.accent : props.theme.text.primary)};
    transition: color 0.3s ease;
    
    &::before {
        content: '${props => (props.met ? '✓ ' : '○ ')}';
        display: inline-block;
        margin-right: 0.5rem;
        color: ${props => (props.met ? props.theme.palette.accent : props.theme.text.primary)};
    }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.palette.danger};
  margin-top: 1rem;
  text-align: center;
`;

export const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
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

  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isPasswordValid) {
      setError('Password does not meet all requirements.');
      return;
    }
    
    setLoading(true);
    try {
      await register({ username, email, password });
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        disabled={loading}
      />
      <Input
        type="email"
        placeholder="Email (optional)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={loading}
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
                {'Contains a special character (!@#$%^&*(),.?\":{}|<>)'}
            </Criteria>
          </ul>
      </PasswordReqs>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Button type="submit" disabled={loading || !username || !isPasswordValid}>
        {loading ? 'Registering...' : 'Register'}
      </Button>
    </form>
  );
};
