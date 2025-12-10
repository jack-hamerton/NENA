
import { useState } from 'react';
import { api } from '../../utils/api';

export const CreateMitigationForm = ({ challengeId }) => {
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/impact/mitigations/', {
      challenge_id: challengeId,
      description,
    }, {});
    // Handle success or error
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the mitigation"
      />
      <button type="submit">Create Mitigation</button>
    </form>
  );
};
