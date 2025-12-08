import React from 'react';
import styled from 'styled-components';

const EventsContainer = styled.div`
  /* Add your styles here */
`;

const Event = styled.div`
  /* Add your styles here */
`;

const Events = ({ events }) => {
  return (
    <EventsContainer>
      <h2>Happening Now</h2>
      {events.map(event => (
        <Event key={event.id}>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
        </Event>
      ))}
    </EventsContainer>
  );
};

export default Events;
