
import React, { useState } from 'react';

interface VerificationCodeFormProps {
  onSubmit: (code: string) => void;
}

const VerificationCodeForm: React.FC<VerificationCodeFormProps> = ({ onSubmit }) => {
  const [code, setCode] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(code);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Verification Code:
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
      </label>
      <button type="submit">Verify</button>
    </form>
  );
};

export default VerificationCodeForm;
