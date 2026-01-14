import React from 'react';
import styled from 'styled-components';

const TableContainer = styled.div`
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
`;

const Title = styled.h4`
    margin-bottom: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 8px;
  border-bottom: 1px solid #ddd;
`;

const Td = styled.td`
  padding: 8px;
  border-bottom: 1px solid #ddd;
`;

const QualTable = ({ data, title }) => {
  return (
    <TableContainer>
      <Title>{title}</Title>
      <Table>
        <thead>
          <tr>
            {data.headers.map((header, index) => (
              <Th key={index}>{header}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <Td key={cellIndex}>{cell}</Td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export { QualTable };
