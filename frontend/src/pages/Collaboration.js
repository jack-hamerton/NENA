import React, { useState, useEffect } from 'react';
import collaborationService from '../services/collaboration.service';

const Collaboration = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    collaborationService.getProjects().then(response => setProjects(response.data));
  }, []);

  return (
    <div>
      <h2>Collaboration Projects</h2>
      {/* Add project creation and display here */}
    </div>
  );
};

export default Collaboration;
