
import React, { useState } from 'react';

const CreatePodcast = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverArt, setCoverArt] = useState(null);

  const handleCreatePodcast = (e) => {
    e.preventDefault();
    // Add your logic to create a podcast here
  };

  return (
    <div>
      <h2>Create Podcast</h2>
      <form onSubmit={handleCreatePodcast}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Cover Art</label>
          <input
            type="file"
            onChange={(e) => setCoverArt(e.target.files[0])}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreatePodcast;
