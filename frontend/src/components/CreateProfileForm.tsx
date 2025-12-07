
import React, { useState } from 'react';

interface CreateProfileFormProps {
  onSubmit: (profileData: { name: string; email: string }) => void;
}

const CreateProfileForm: React.FC<CreateProfileFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({ name, email });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <button type="submit">Create Profile</button>
    </form>
  );
};

export default CreateProfileForm;
