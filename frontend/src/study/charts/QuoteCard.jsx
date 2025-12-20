import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
`;

const QuoteText = styled.p`
    font-style: italic;
`;

const QuoteAuthor = styled.p`
    text-align: right;
`;

const QuoteCard = ({ quote }) => {
  return (
    <CardContainer>
      <QuoteText>"{quote.text}"</QuoteText>
      <QuoteAuthor>- {quote.author}</QuoteAuthor>
    </CardContainer>
  );
};

export { QuoteCard };
