import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { api } from '../../utils/api';
import { darkTheme } from '../../theme';

// --- Styled Components ---
const ListenersContainer = styled.div`
  padding: 2rem;
  color: ${darkTheme.palette.text.primary};
`;

// --- ListenersPage Component ---
export const ListenersPage = () => {
  const { artistId } = useParams();
  const [listeners, setListeners] = useState([]);

  useEffect(() => {
    const fetchListeners = async () => {
      const response = await api.get(`/podcast-artists/${artistId}/listeners`);
      setListeners(response.data);
    };
    fetchListeners();
  }, [artistId]);

  return (
    <ListenersContainer>
      <h2>Listeners</h2>
      {/* You can map through the listeners and display their info here */}
    </ListenersContainer>
  );
};
