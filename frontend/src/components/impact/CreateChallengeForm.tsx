
import { useState, useEffect } from 'react';
import { api } from '../../utils/api';

export const CreateChallengeForm = () => {
  const [collaborations, setCollaborations] = useState([]);
  const [selectedCollaboration, setSelectedCollaboration] = useState('');
  const [description, setDescription] = useState('');
  const [workType, setWorkType] = useState('');

  useEffect(() => {
    const fetchCollaborations = async () => {
      const response = await api.get('/collaborations', {});
      setCollaborations(response.data);
    };
    fetchCollaborations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let collaborationId = selectedCollaboration;
    if (!collaborationId) {
        const response = await api.post('/collaborations/', {
            title: `Collaboration on ${workType}`,
            work_type: workType,
        }, {});
        collaborationId = response.data.id;
    }

    await api.post('/impact/challenges/', {
      collaboration_id: collaborationId,
      description,
    }, {});
    // Handle success or error
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        value={selectedCollaboration}
        onChange={(e) => setSelectedCollaboration(e.target.value)}
      >
        <option value="">Select a Collaboration</option>
        {collaborations.map((collaboration) => (
          <option key={collaboration.id} value={collaboration.id}>
            {collaboration.title}
          </option>
        ))}
      </select>
      <input 
        type="text"
        value={workType}
        onChange={(e) => setWorkType(e.target.value)}
        placeholder="Type of work"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the challenge"
      />
      <button type="submit">Create Challenge</button>
    </form>
  );
};
