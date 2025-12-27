import { useState, useEffect } from 'react';
// import { api } from '../../utils/api'; // Temporarily disabled for mock data
import { Document } from './Document';

export const CollaborationSpace = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    // --- To-Do: Re-enable this when your backend is ready ---
    /*
    const fetchDocuments = async () => {
      try {
        const response = await api.get('/collaboration/documents', {});
        setDocuments(response.data);
      } catch (error) {
        console.error("Failed to fetch documents:", error);
        // For now, load mock data on error
        setDocuments([{ id: '1', name: 'Mock Document', content: '' }]);
      }
    };
    fetchDocuments();
    */

    // --- Using Mock Data for Demonstration ---
    // This simulates fetching a list of documents from your API.
    // Each object needs a unique `id`.
    const mockDocuments = [
      { id: 'doc-1', name: 'Shared Project Plan', content: '' },
      // You could add more mock documents here to see how it looks
      // { id: 'doc-2', name: 'Meeting Notes', content: '' },
    ];
    setDocuments(mockDocuments);

  }, []);

  if (documents.length === 0) {
    return <p>Loading documents...</p>;
  }

  return (
    <div>
      <h2 style={{ padding: '1rem', color: '#4a5969' }}>Collaboration Space</h2>
      {documents.map(doc => (
        <div key={doc.id} style={{ margin: '1rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: '#35424c' }}>{doc.name}</h3>
            <Document document={doc} />
        </div>
      ))}
    </div>
  );
};
