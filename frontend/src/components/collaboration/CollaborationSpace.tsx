import { useState, useEffect } from 'react';
import { api } from '../../utils/api';

export const CollaborationSpace = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      const response = await api.get('/collaboration/documents');
      setDocuments(response.data);
    };
    fetchDocuments();
  }, []);

  return (
    <div>
      {documents.map(doc => (
        <Document key={doc.id} document={doc} />
      ))}
    </div>
  );
};
