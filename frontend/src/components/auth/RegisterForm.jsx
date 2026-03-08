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

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  gap: 1rem;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: ${props => props.theme.text.secondary};
  }
`;

const GoogleButton = styled(Button)`
  background-color: #fff;
  color: #333;
  border: 1px solid #ddd;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const UsernamePreview = styled.div`
  color: ${props => props.theme.text.secondary};
  font-size: 0.875rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: ${props => props.theme.background};
  border-radius: 4px;
  border-left: 3px solid ${props => props.theme.palette.accent};
`;

const SuccessMessage = styled.div`
  color: #37c978;
  margin-top: 1rem;
  text-align: center;
`;

export const RegisterForm = ({ onSubmit }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  // Generate username from first and last name
  const generateUsername = (first, last) => {
    if (!first || !last) return '';
    const base = `${first.toLowerCase()}.${last.toLowerCase()}`.replace(/\s+/g, '');
    return base.replace(/[^a-z0-9.]/g, '');
  };

  const username = generateUsername(firstName, lastName);

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
    setSuccess(null);

    if (!isPasswordValid) {
      setError('Password does not meet all requirements.');
      return;
    }
    
    setLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(firstName, lastName, username, email, password);
      } else {
        await register({ firstName, lastName, username, email, password });
      }
      setSuccess('Registration successful. You are now signed in.');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      setSuccess('Google registration successful. You are now signed in.');
    } catch (err) {
      setError(err.message || 'Failed to register with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <GoogleButton 
        type="button" 
        onClick={handleGoogleSignUp} 
        disabled={loading}
      >
        <span>🔵</span>
        Sign up with Google
      </GoogleButton>

      <Divider>or continue with email</Divider>

      <Input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
        disabled={loading}
      />
      <Input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
        disabled={loading}
      />
      
      {username && (
        <UsernamePreview>
          <strong>Username will be:</strong> {username}
        </UsernamePreview>
      )}

      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
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
      {success && <SuccessMessage>{success}</SuccessMessage>}
      <Button type="submit" disabled={loading || !firstName || !lastName || !email || !isPasswordValid}>
        {loading ? 'Registering...' : 'Register'}
      </Button>
    </form>
  );
};
