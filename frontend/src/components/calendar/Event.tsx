export const Event = ({ event }) => {
  return (
    <div>
      <strong>{event.title}</strong>
      <p>{event.description}</p>
    </div>
  );
};
