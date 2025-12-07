export const Comment = ({ comment }) => {
  return (
    <div>
      <p><strong>{comment.author}</strong>: {comment.text}</p>
    </div>
  );
};
