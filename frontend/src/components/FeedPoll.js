import React, { useState, useEffect } from 'react';
import { getFeedPollsForYou } from '../services/poll.service';

const FeedPoll = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    getFeedPollsForYou().then((response) => {
      setPolls(response.data);
    });
  }, []);

  return (
    <div>
      {polls.map((poll) => (
        <div key={poll.id}>
          <h3>{poll.question}</h3>
          <ul>
            {poll.options.map((option) => (
              <li key={option.id}>
                {option.text} - {option.votes} votes
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default FeedPoll;
