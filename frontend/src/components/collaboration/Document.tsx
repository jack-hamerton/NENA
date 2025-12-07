export const Document = ({ document }) => {
  return (
    <div>
      <h3>{document.title}</h3>
      <p>{document.content}</p>
    </div>
  );
};
