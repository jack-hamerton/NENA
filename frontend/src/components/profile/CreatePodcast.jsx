
import React, { useState } from 'react';
import { createPodcast } from '../../services/podcast.service';

const CreatePodcast = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPodcast({ title, description });
      setTitle('');
      setDescription('');
      // Optionally, you can add a success message or redirect the user
    } catch (error) {
      console.error('Error creating podcast:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Podcast</h2>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <button type="submit">Create</button>
    </form>
  );
};

export default CreatePodcast;
