
import React, { useState } from 'react';

interface PhoneNumberFormProps {
  onSubmit: (phoneNumber: string) => void;
}

const PhoneNumberForm: React.FC<PhoneNumberFormProps> = ({ onSubmit }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(phoneNumber);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Phone Number:
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
      </label>
      <button type="submit">Send Code</button>
    </form>
  );
};

export default PhoneNumberForm;
